import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/database';
import { createAuthErrorResponse, logUserActivity, verifyEmailVerificationToken } from '../../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return createAuthErrorResponse('Token d\'activation manquant', 400);
    }

    const payload = verifyEmailVerificationToken(token);
    if (!payload) {
      return createAuthErrorResponse('Token invalide ou expiré', 400);
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return createAuthErrorResponse('Utilisateur introuvable', 404);
    }

    // Idempotent: si déjà activé, renvoyer succès
    if (user.emailVerified && user.status === 'ACTIVE') {
      await logUserActivity(user.id, 'register_activation_link_reused', request, true);
      return NextResponse.json({ success: true, message: 'Compte déjà activé.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { status: 'ACTIVE', emailVerified: true }
    });

    await logUserActivity(user.id, 'register_activated_link', request, true);

    // Optionnel: rediriger vers la page de connexion avec indicateur
    const redirect = url.searchParams.get('redirect');
    if (redirect === 'login') {
      const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${appUrl}/login?activated=1`);
    }

    return NextResponse.json({ success: true, message: 'Compte activé avec succès.' });
  } catch (error) {
    console.error('Activation error:', error);
    return createAuthErrorResponse('Erreur serveur', 500);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

