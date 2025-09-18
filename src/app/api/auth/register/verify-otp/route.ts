import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/database';
import { createAuthErrorResponse, logUserActivity } from '../../../../../lib/auth';
import { verifyOTP } from '../../../../../lib/otp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return createAuthErrorResponse('Email et code requis', 400);
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return createAuthErrorResponse('Utilisateur introuvable', 404);
    }

    const check = await verifyOTP({ userId: user.id, code: String(code), type: 'REGISTER' });
    if (!check.valid) {
      await logUserActivity(user.id, 'register_otp_failed', request, false, { reason: check.error });
      return createAuthErrorResponse(check.error || 'Code invalide', 401);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { status: 'ACTIVE', emailVerified: true }
    });

    await logUserActivity(user.id, 'register_verified', request, true);

    return NextResponse.json({ success: true, message: 'Compte activé avec succès.' });
  } catch (error) {
    console.error('Verify registration OTP error:', error);
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

