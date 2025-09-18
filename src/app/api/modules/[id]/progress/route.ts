import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createAuthErrorResponse, logUserActivity } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/database';
import { recalculateProgressFromItems } from '../../../../../lib/progress-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (auth.error || !auth.user) {
      return createAuthErrorResponse(auth.error || 'Non authentifié', 401);
    }

    const { id: moduleId } = await params;
    const module = await prisma.module.findUnique({ where: { id: moduleId }, include: { formation: true } });
    if (!module) return NextResponse.json({ error: 'Module introuvable' }, { status: 404 });

    // Vérifier inscription
    const enrollment = await prisma.enrollment.findFirst({ where: { userId: auth.user.id, formationId: module.formationId, status: 'ACTIVE' } });
    if (!enrollment) return NextResponse.json({ error: 'Inscription requise' }, { status: 403 });

    // Marquer comme complété (pour activités non notées)
    await prisma.itemProgress.upsert({
      where: { userId_moduleId: { userId: auth.user.id, moduleId } },
      update: { status: 'COMPLETED', completedAt: new Date(), lastEventAt: new Date() },
      create: { userId: auth.user.id, formationId: module.formationId, moduleId, status: 'COMPLETED', completedAt: new Date(), lastEventAt: new Date() }
    });

    await recalculateProgressFromItems(auth.user.id, module.formationId);
    await logUserActivity(auth.user.id, 'module_mark_completed', request, true, { moduleId, formationId: module.formationId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('module progress error', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
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

