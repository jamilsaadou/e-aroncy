import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/database';
import { requireAuth, createAuthErrorResponse } from '../../../lib/auth';
import { z } from 'zod';

const GuardSchema = z.object({
  moduleId: z.string().min(1)
});

type GuardReason =
  | { code: 'not_enrolled'; message: string }
  | { code: 'locked_by_prereq'; unmet: Array<{ moduleId: string; title: string; requirement: string; minScore?: number }>; message: string }
  | { code: 'locked_by_drip'; availableAt: string; message: string };

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth.error || !auth.user) {
    return createAuthErrorResponse(auth.error || 'Non autorisé', 401);
  }

  try {
    const body = await request.json();
    const { moduleId } = GuardSchema.parse(body);

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { formation: true }
    });
    if (!module) return NextResponse.json({ error: 'Module non trouvé' }, { status: 404 });

    const formationId = module.formationId;

    // Enroll check
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: auth.user.id, formationId },
      orderBy: { enrolledAt: 'asc' }
    });
    if (!enrollment) {
      const reasons: GuardReason[] = [{ code: 'not_enrolled', message: 'Utilisateur non inscrit à cette formation' }];
      return NextResponse.json({ allowed: false, reasons });
    }

    // Drip (ReleasePolicy)
    const policy = await prisma.releasePolicy.findUnique({ where: { moduleId: module.id } });
    if (policy) {
      let availableAt: Date | null = null;
      if (policy.releaseAt) availableAt = policy.releaseAt;
      if (policy.delayMinutes != null) {
        const delayDate = new Date(enrollment.enrolledAt.getTime() + policy.delayMinutes * 60 * 1000);
        availableAt = availableAt ? new Date(Math.max(availableAt.getTime(), delayDate.getTime())) : delayDate;
      }
      if (availableAt && availableAt > new Date()) {
        const reasons: GuardReason[] = [{ code: 'locked_by_drip', availableAt: availableAt.toISOString(), message: 'Module non encore disponible' }];
        return NextResponse.json({ allowed: false, reasons });
      }
    }

    // Prerequisites
    const prereqs = await prisma.prerequisite.findMany({
      where: { formationId, moduleId },
      include: { required: { select: { id: true, title: true } } }
    });
    if (prereqs.length > 0) {
      const unmet: Array<{ moduleId: string; title: string; requirement: string; minScore?: number }> = [];
      for (const pr of prereqs) {
        const ip = await prisma.itemProgress.findUnique({
          where: { userId_moduleId: { userId: auth.user.id, moduleId: pr.requiresModuleId } }
        });
        const requiredTitle = pr.required.title;
        if (pr.requirement === 'COMPLETED') {
          if (!ip || (ip.status !== 'COMPLETED' && ip.status !== 'PASSED')) {
            unmet.push({ moduleId: pr.requiresModuleId, title: requiredTitle, requirement: pr.requirement });
          }
        } else if (pr.requirement === 'PASSED') {
          if (!ip || ip.status !== 'PASSED') {
            unmet.push({ moduleId: pr.requiresModuleId, title: requiredTitle, requirement: pr.requirement });
          }
        } else if (pr.requirement === 'MIN_SCORE') {
          if (!ip || (ip.score ?? -1) < (pr.minScore ?? 0)) {
            unmet.push({ moduleId: pr.requiresModuleId, title: requiredTitle, requirement: pr.requirement, minScore: pr.minScore ?? 0 });
          }
        }
      }
      if (unmet.length > 0) {
        const reasons: GuardReason[] = [{ code: 'locked_by_prereq', unmet, message: 'Prérequis non satisfaits' }];
        return NextResponse.json({ allowed: false, reasons });
      }
    }

    return NextResponse.json({ allowed: true, reasons: [] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 });
    }
    console.error('guard error', error);
    return NextResponse.json({ error: 'Erreur du guard' }, { status: 500 });
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

