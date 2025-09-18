import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../../../../lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Vérifier la session
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Non autorisé' },
        { status: 401 }
      );
    }

    const userId = authResult.user.id;

    // Récupérer les statistiques utilisateur
    const [
      enrollments,
      completedEnrollments,
      certificates,
      userProgress
    ] = await Promise.all([
      // Total des inscriptions
      prisma.enrollment.count({
        where: { userId }
      }),

      // Formations terminées
      prisma.enrollment.count({
        where: { 
          userId,
          status: 'COMPLETED'
        }
      }),

      // Certificats obtenus
      prisma.certificate.count({
        where: { 
          userId,
          isValid: true
        }
      }),

      // Temps total passé (somme de tous les progrès)
      prisma.userProgress.aggregate({
        where: { userId },
        _sum: {
          timeSpent: true
        }
      })
    ]);

    const stats = {
      totalEnrollments: enrollments,
      completedFormations: completedEnrollments,
      certificatesEarned: certificates,
      totalTimeSpent: userProgress._sum.timeSpent || 0
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Erreur récupération statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
