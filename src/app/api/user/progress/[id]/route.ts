import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/database';

async function buildProgressForFormation(userId: string, formationId: string) {
  const formation = await prisma.formation.findUnique({
    where: { id: formationId },
    include: { modules: { orderBy: { order: 'asc' } } }
  });
  if (!formation) return null;

  const moduleProgress = await Promise.all(formation.modules.map(async (m) => {
    const ip = await prisma.itemProgress.findUnique({ where: { userId_moduleId: { userId, moduleId: m.id } } });
    if (ip) {
      const completed = ip.status === 'COMPLETED' || ip.status === 'PASSED';
      return { moduleId: m.id, title: m.title, completed, score: ip.score ?? undefined, completedAt: ip.completedAt ?? undefined } as any;
    }
    if (m.type === 'QUIZ') {
      const quiz = await prisma.quiz.findUnique({ where: { moduleId: m.id } });
      let passed = false;
      if (quiz) {
        const s = await prisma.quizSession.findFirst({ where: { userId, quizId: quiz.id, passed: true } });
        passed = !!s;
      }
      return { moduleId: m.id, title: m.title, completed: passed } as any;
    } else {
      const activity = await prisma.userActivity.findFirst({ where: { userId, action: 'module_completed', details: { contains: m.id } } });
      return { moduleId: m.id, title: m.title, completed: !!activity } as any;
    }
  }));

  const completedModules = moduleProgress.filter(mp => mp.completed).length;
  const totalModules = formation.modules.length || 1;
  const progressPercentage = (completedModules / totalModules) * 100;

  return {
    id: `${userId}-${formationId}`,
    formationId,
    completedModules,
    progressPercentage,
    timeSpent: 0,
    startedAt: new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    formation: {
      id: formation.id,
      title: formation.title,
      description: formation.description,
      level: formation.level,
      category: formation.category,
      modules: formation.modules.map(m => ({ id: m.id, title: m.title, duration: m.duration }))
    },
    moduleProgress
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error || 'Non authentifié' }, { status: 401 });
    }

    const { id: formationId } = await params;
    const progress = await buildProgressForFormation(auth.user.id, formationId);
    if (!progress) return NextResponse.json({ error: 'Formation non trouvée' }, { status: 404 });
    return NextResponse.json(progress);
  } catch (error) {
    console.error('User progress by id error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}
