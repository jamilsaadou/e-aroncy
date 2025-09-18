import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/database';
import { createAuthErrorResponse, logUserActivity, generateEmailVerificationToken } from '../../../../../lib/auth';
import { sendActivationLinkEmail } from '../../../../../lib/mailer';

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

    if (user.emailVerified) {
      return NextResponse.json({ success: true, message: 'Compte déjà activé.' });
    }

    const token = generateEmailVerificationToken(user.id, user.email);
    const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const link = `${appUrl}/api/auth/register/activate?token=${encodeURIComponent(token)}&redirect=login`;
    await sendActivationLinkEmail(user.email, link);

    await logUserActivity(user.id, 'register_activation_link_resent', request, true);
    return NextResponse.json({ success: true, message: 'Email d\'activation renvoyé.' });
  } catch (error) {
    console.error('Resend activation email error:', error);
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
