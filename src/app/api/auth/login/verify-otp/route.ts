import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/database';
import { generateToken, createAuthErrorResponse, createAuthSuccessResponse, logUserActivity, AuthUser } from '../../../../../lib/auth';
import { verifyOTP } from '../../../../../lib/otp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, rememberMe } = body;

    if (!email || !code) {
      return createAuthErrorResponse('Email et code requis', 400);
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return createAuthErrorResponse('Utilisateur introuvable', 404);
    }

    if (user.status !== 'ACTIVE') {
      return createAuthErrorResponse('Compte inactif', 403);
    }

    const check = await verifyOTP({ userId: user.id, code: String(code), type: 'LOGIN' });
    if (!check.valid) {
      await logUserActivity(user.id, 'login_otp_failed', request, false, { reason: check.error });
      return createAuthErrorResponse(check.error || 'Code invalide', 401);
    }

    // Reset des tentatives et mise à jour de l'activité
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockUntil: null,
        lastLogin: new Date(),
        lastActivity: new Date()
      }
    });

    const sessionId = `${user.id}_${Date.now()}`;
    const token = generateToken(user, sessionId);

    await logUserActivity(user.id, 'login', request, true, { rememberMe, sessionId, emailOTP: true });

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      organization: user.organization,
      twoFactorEnabled: user.twoFactorEnabled
    };

    return createAuthSuccessResponse(authUser, token, 'Connexion vérifiée');
  } catch (error) {
    console.error('Verify login OTP error:', error);
    return createAuthErrorResponse('Erreur serveur', 500);
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

