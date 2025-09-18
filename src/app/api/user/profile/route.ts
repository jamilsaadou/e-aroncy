import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth, logUserActivity } from '../../../../lib/auth';
import logger from '../../../../lib/logger';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    // Vérifier la session
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Non autorisé' },
        { status: 401 }
      );
    }

    const { firstName, lastName, email, organization } = await request.json();

    // Validation des données
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Les champs prénom, nom et email sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email !== authResult.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser && existingUser.id !== authResult.user.id) {
        return NextResponse.json(
          { error: 'Cet email est déjà utilisé par un autre compte' },
          { status: 400 }
        );
      }
    }

    // Mettre à jour le profil utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: authResult.user.id },
      data: {
        firstName,
        lastName,
        email,
        organization: organization || null,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        organization: true,
        role: true,
        twoFactorEnabled: true
      }
    });

    // Logger l'activité
    await logUserActivity(
      authResult.user.id,
      'PROFILE_UPDATE',
      request,
      true,
      { updatedFields: { firstName, lastName, email, organization } }
    );

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profil mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    
    // Logger l'erreur
    await logUserActivity(
      'unknown',
      'PROFILE_UPDATE_ERROR',
      request,
      false,
      null,
      error instanceof Error ? error.message : 'Erreur inconnue'
    );

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
