import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth, logUserActivity, comparePassword, hashPassword, validatePasswordStrength } from '../../../../lib/auth';

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

    const { currentPassword, newPassword } = await request.json();

    // Validation des données
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Le mot de passe actuel et le nouveau mot de passe sont obligatoires' },
        { status: 400 }
      );
    }

    // Valider la force du nouveau mot de passe
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur avec le mot de passe
    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      // Logger la tentative de changement avec mauvais mot de passe
      await logUserActivity(
        authResult.user.id,
        'PASSWORD_CHANGE_FAILED',
        request,
        false,
        { reason: 'Invalid current password' }
      );

      return NextResponse.json(
        { error: 'Le mot de passe actuel est incorrect' },
        { status: 400 }
      );
    }

    // Vérifier que le nouveau mot de passe est différent de l'ancien
    const isSamePassword = await comparePassword(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit être différent de l\'ancien' },
        { status: 400 }
      );
    }

    // Hacher le nouveau mot de passe
    const hashedNewPassword = await hashPassword(newPassword);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: authResult.user.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
        // Réinitialiser les tentatives de connexion échouées
        failedLoginAttempts: 0,
        lockUntil: null
      }
    });

    // Logger l'activité
    await logUserActivity(
      authResult.user.id,
      'PASSWORD_CHANGED',
      request,
      true,
      { timestamp: new Date().toISOString() }
    );

    return NextResponse.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });

  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    
    // Logger l'erreur
    await logUserActivity(
      'unknown',
      'PASSWORD_CHANGE_ERROR',
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
