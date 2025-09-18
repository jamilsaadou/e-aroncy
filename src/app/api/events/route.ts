import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/database';
import { requireAuth, createAuthErrorResponse, logUserActivity } from '../../../lib/auth';
import { recalculateProgressFromItems } from '../../../lib/progress-utils';
import { z } from 'zod';

const EventSchema = z.object({
  formationId: z.string().min(1),
  moduleId: z.string().min(1),
  event: z.enum(['START', 'PROGRESS', 'COMPLETE', 'PASSED', 'FAILED']),
  data: z
    .object({
      timeSpentSec: z.number().int().min(0).optional(),
      progress: z.number().min(0).max(100).optional(),
      score: z.number().min(0).max(100).optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.error || !auth.user) {
    return createAuthErrorResponse(auth.error || 'Non autorisé', 401);
  }

  try {
    const body = await request.json();
    const payload = EventSchema.parse(body);

    const module = await prisma.module.findUnique({
      where: { id: payload.moduleId },
      select: { id: true, formationId: true }
    });
    if (!module || module.formationId !== payload.formationId) {
      return NextResponse.json({ error: 'Module invalide' }, { status: 400 });
    }

    // Obtenir ou créer l'ItemProgress
    const now = new Date();
    const existing = await prisma.itemProgress.findUnique({
      where: { userId_moduleId: { userId: auth.user.id, moduleId: payload.moduleId } }
    });

    let status = existing?.status || 'NOT_STARTED';
    let startedAt = existing?.startedAt || null;
    let completedAt = existing?.completedAt || null;
    let passed: boolean | null | undefined = existing?.passed ?? undefined;
    let score = existing?.score ?? undefined;
    let timeSpentSec = existing?.timeSpentSec ?? 0;

    const addTime = Math.min(60 * 10, Math.max(0, payload.data?.timeSpentSec ?? 0)); // cap 10 minutes par event
    timeSpentSec += addTime;

    switch (payload.event) {
      case 'START':
        status = 'IN_PROGRESS';
        startedAt = startedAt || now;
        break;
      case 'PROGRESS':
        if (status === 'NOT_STARTED') status = 'IN_PROGRESS';
        break;
      case 'COMPLETE':
        status = 'COMPLETED';
        completedAt = now;
        break;
      case 'PASSED':
        status = 'PASSED';
        passed = true;
        completedAt = now;
        score = payload.data?.score ?? score;
        break;
      case 'FAILED':
        status = 'FAILED';
        passed = false;
        completedAt = now;
        score = payload.data?.score ?? score;
        break;
    }

    await prisma.itemProgress.upsert({
      where: { userId_moduleId: { userId: auth.user.id, moduleId: payload.moduleId } },
      update: {
        status: status as any,
        score,
        passed,
        timeSpentSec,
        lastEventAt: now,
        startedAt: startedAt || undefined,
        completedAt: completedAt || undefined,
      },
      create: {
        userId: auth.user.id,
        formationId: payload.formationId,
        moduleId: payload.moduleId,
        status: status as any,
        score,
        passed,
        timeSpentSec,
        lastEventAt: now,
        startedAt: startedAt || undefined,
        completedAt: completedAt || undefined,
      },
    });

    // Recalculer le progrès de la formation (bubble up)
    await recalculateProgressFromItems(auth.user.id, payload.formationId);

    await logUserActivity(auth.user.id, 'progress_event', request, true, {
      moduleId: payload.moduleId,
      formationId: payload.formationId,
      event: payload.event,
      timeAdded: addTime,
      score: payload.data?.score,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 });
    }
    console.error('events error', error);
    return NextResponse.json({ error: 'Erreur lors du traitement de l\'événement' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

