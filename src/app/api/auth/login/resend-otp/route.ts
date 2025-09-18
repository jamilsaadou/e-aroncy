import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/database';
import { createAuthErrorResponse, logUserActivity } from '../../../../../lib/auth';
import { OtpCooldownError, createAndSendOTP } from '../../../../../lib/otp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return createAuthErrorResponse('Email requis', 400);
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return createAuthErrorResponse('Utilisateur introuvable', 404);
    }

    if (user.status !== 'ACTIVE') {
      return createAuthErrorResponse('Compte inactif', 403);
    }

    try {
      await createAndSendOTP({ userId: user.id, email: user.email, type: 'LOGIN', respectCooldown: true });
    } catch (err) {
      if (err instanceof OtpCooldownError) {
        return NextResponse.json({
          success: false,
          error: err.message,
          retryAfter: err.retryAfter
        }, { status: 429 });
      }
      throw err;
    }

    await logUserActivity(user.id, 'login_otp_resent', request, true);
    return NextResponse.json({ success: true, message: 'Nouveau code envoyé par email.' });
  } catch (error) {
    console.error('Resend login OTP error:', error);
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

