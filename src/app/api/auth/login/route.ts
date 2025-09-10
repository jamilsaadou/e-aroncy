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
import speakeasy from 'speakeasy';
import bcrypt from 'bcryptjs';

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

    // Vérifier 2FA si activé
    if (user.twoFactorEnabled) {
      if (!totpCode) {
        return NextResponse.json({ 
          requires2FA: true,
          message: 'Code d\'authentification à deux facteurs requis'
        });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret!,
        encoding: 'ascii',
        token: totpCode,
        window: 2 // Permet une tolérance de ±2 intervalles (60s)
      });

      if (!verified) {
        // Incrémenter les tentatives de connexion
        await prisma.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: user.failedLoginAttempts + 1 }
        });

        await logUserActivity(user.id, '2fa_failed', request, false, 
          { totpCode: 'hidden' }, 'Code 2FA invalide');
        return createAuthErrorResponse('Code d\'authentification invalide', 401);
      }

      await logUserActivity(user.id, '2fa_verified', request, true);
    }

    // Connexion réussie - Reset des tentatives
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockUntil: null,
        lastLogin: new Date(),
        lastActivity: new Date()
      }
    });

    // Générer le token JWT
    const sessionId = `${user.id}_${Date.now()}`;
    const token = generateToken(user, sessionId);

    // Logger la connexion réussie
    await logUserActivity(user.id, 'login', request, true, {
      rememberMe,
      twoFactorUsed: user.twoFactorEnabled,
      sessionId
    });

    // Créer l'objet utilisateur pour la réponse
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      organization: user.organization,
      twoFactorEnabled: user.twoFactorEnabled
    };

    return createAuthSuccessResponse(authUser, token, 'Connexion réussie');

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
