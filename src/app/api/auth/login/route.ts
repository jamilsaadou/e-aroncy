import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/database';
import { 
  generateToken, 
  createAuthSuccessResponse, 
  createAuthErrorResponse,
  getClientIP,
  getUserAgent,
  logUserActivity,
  AuthUser
} from '../../../../lib/auth';
import bcrypt from 'bcryptjs';
import { createAndSendOTP } from '../../../../lib/otp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, totpCode, rememberMe } = body;

    // Validation des données
    if (!email || !password) {
      return createAuthErrorResponse('Email et mot de passe requis', 400);
    }

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      await logUserActivity('unknown', 'login_failed', request, false, 
        { email, reason: 'user_not_found' }, 'Utilisateur non trouvé');
      return createAuthErrorResponse('Identifiants invalides', 401);
    }

    // Vérifier si le compte est verrouillé
    const isLocked = user.lockUntil && user.lockUntil > new Date();
    if (isLocked) {
      await logUserActivity(user.id, 'login_failed', request, false, 
        { reason: 'account_locked' }, 'Compte verrouillé');
      return createAuthErrorResponse('Compte temporairement verrouillé. Réessayez plus tard.', 423);
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Incrémenter les tentatives de connexion
      const updates: any = {
        failedLoginAttempts: user.failedLoginAttempts + 1
      };
      
      // Verrouiller après 5 tentatives pour 2 heures
      if (user.failedLoginAttempts + 1 >= 5) {
        updates.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2h
      }
      
      await prisma.user.update({
        where: { id: user.id },
        data: updates
      });

      await logUserActivity(user.id, 'login_failed', request, false, 
        { reason: 'invalid_password' }, 'Mot de passe invalide');
      return createAuthErrorResponse('Identifiants invalides', 401);
    }

    // Vérifier le statut du compte
    if (user.status !== 'ACTIVE') {
      await logUserActivity(user.id, 'login_failed', request, false, 
        { reason: 'account_inactive', status: user.status }, 'Compte inactif');
      
      let message = 'Compte inactif';
      if (user.status === 'PENDING') {
        message = 'Compte en attente de validation. Vérifiez votre email.';
      } else if (user.status === 'SUSPENDED') {
        message = 'Compte suspendu. Contactez l\'administrateur.';
      }
      
      return createAuthErrorResponse(message, 403);
    }

    // Étape OTP par email: envoyer un code et demander vérification
    await createAndSendOTP({ userId: user.id, email: user.email, type: 'LOGIN' });

    await logUserActivity(user.id, 'login_otp_sent', request, true, {
      delivery: 'email'
    });

    return NextResponse.json({
      success: true,
      requiresEmailOTP: true,
      message: 'Un code de vérification a été envoyé à votre email.'
    });

  } catch (error) {
    console.error('Login error:', error);
    return createAuthErrorResponse('Erreur serveur', 500);
  }
}

// Méthode OPTIONS pour CORS
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
