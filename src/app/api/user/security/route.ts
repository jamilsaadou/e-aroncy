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

    // Récupérer les informations de sécurité de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: {
        twoFactorEnabled: true,
        failedLoginAttempts: true,
        lockUntil: true,
        updatedAt: true,
        lastLogin: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const securitySettings = {
      twoFactorEnabled: user.twoFactorEnabled,
      failedLoginAttempts: user.failedLoginAttempts,
      isLocked: user.lockUntil ? user.lockUntil > new Date() : false,
      lastPasswordChange: user.updatedAt.toISOString(),
      lastLogin: user.lastLogin?.toISOString() || null
    };

    return NextResponse.json(securitySettings);

  } catch (error) {
    console.error('Erreur récupération paramètres sécurité:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
