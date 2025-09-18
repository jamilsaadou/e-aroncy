import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, logUserActivity } from '../../../../../lib/auth';
import { updateUserProgress } from '../../../../../lib/progress-utils';
import { prisma } from '../../../../../lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json({ error: authResult.error || 'Non authentifié' }, { status: 401 });
    }

    const { id: formationId } = await params;
    const userId = authResult.user.id;

    // Vérifier que la formation existe
    const formation = await prisma.formation.findUnique({
      where: { id: formationId },
      include: {
        _count: {
          select: { enrollments: true }
        }
      }
    });

    if (!formation) {
      return NextResponse.json({ error: 'Formation non trouvée' }, { status: 404 });
    }

    if (formation.status !== 'PUBLISHED') {
      return NextResponse.json({ 
        error: 'Cette formation n\'est pas encore disponible' 
      }, { status: 400 });
    }

    // Vérifier la limite d'inscriptions
    if (formation.maxEnrollments && formation._count.enrollments >= formation.maxEnrollments) {
      return NextResponse.json({ 
        error: 'Cette formation a atteint sa limite d\'inscriptions' 
      }, { status: 400 });
    }

    // Vérifier si l'utilisateur n'est pas déjà inscrit
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { userId, formationId }
    });

    if (existingEnrollment) {
      return NextResponse.json({ 
        error: 'Vous êtes déjà inscrit à cette formation' 
      }, { status: 400 });
    }

    // Créer l'inscription
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        formationId,
        enrolledAt: new Date(),
        status: 'ACTIVE'
      }
    });

    // Logger l'inscription
    await logUserActivity(userId, 'formation_enrolled', request, true, {
      formationId,
      formationTitle: formation.title
    });

    // Initialiser le suivi de progression (créera l'entrée avec 0%)
    await updateUserProgress(userId, formationId);

    return NextResponse.json({
      success: true,
      message: 'Inscription réussie',
      enrollment
    }, { status: 201 });

  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de l\'inscription' 
    }, { status: 500 });
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

// GET /api/formations/[id]/enroll - Statut d'inscription et progression de l'utilisateur
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    const { id: formationId } = await params;

    if (authResult.error || !authResult.user) {
      return NextResponse.json({ enrolled: false });
    }
    const userId = authResult.user.id;

    // Vérifier inscription
    const enrollment = await prisma.enrollment.findFirst({ where: { userId, formationId } });
    if (!enrollment) {
      return NextResponse.json({ enrolled: false });
    }

    // Récupérer modules
    const modules = await prisma.module.findMany({
      where: { formationId },
      include: { quiz: true },
      orderBy: { order: 'asc' }
    });

    // Mettre à jour et lire la progression globale
    await updateUserProgress(userId, formationId);
    const progress = await prisma.userProgress.findUnique({
      where: { userId_formationId: { userId, formationId } }
    });

    // Statut par module
    const moduleStatuses = await Promise.all(modules.map(async (m) => {
      if (m.quiz) {
        const passed = await prisma.quizSession.findFirst({ where: { userId, quizId: m.quiz.id, passed: true } });
        return { moduleId: m.id, completed: !!passed };
      } else {
        const activity = await prisma.userActivity.findFirst({ where: { userId, action: 'module_completed', details: { contains: m.id } } });
        return { moduleId: m.id, completed: !!activity };
      }
    }));

    const certificate = await prisma.certificate.findFirst({ where: { userId, formationId } });

    return NextResponse.json({
      enrolled: true,
      progress: progress ? {
        completedModules: progress.completedModules,
        progressPercentage: progress.progressPercentage,
      } : { completedModules: 0, progressPercentage: 0 },
      moduleStatuses,
      certificate: certificate ? {
        certificateNumber: certificate.certificateNumber,
        issuedAt: certificate.issuedAt
      } : null
    });
  } catch (error) {
    console.error('Enrollment status error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du statut' }, { status: 500 });
  }
}
