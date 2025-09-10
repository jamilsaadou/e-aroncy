import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, logUserActivity } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json({ error: authResult.error || 'Non authentifié' }, { status: 401 });
    }

    const formationId = params.id;
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
