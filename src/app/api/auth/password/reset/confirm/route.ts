import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../lib/database';
import { createAuthErrorResponse, verifyPasswordResetToken } from '../../../../../../lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword, confirmPassword } = body;

    if (!token || !newPassword || !confirmPassword) {
      return createAuthErrorResponse('Champs manquants', 400);
    }

    if (newPassword !== confirmPassword) {
      return createAuthErrorResponse('Les mots de passe ne correspondent pas', 400);
    }

    if (newPassword.length < 8) {
      return createAuthErrorResponse('Mot de passe trop court', 400);
    }

    const payload = verifyPasswordResetToken(token);
    if (!payload) {
      return createAuthErrorResponse('Lien invalide ou expiré', 400);
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return createAuthErrorResponse('Utilisateur introuvable', 404);
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, failedLoginAttempts: 0, lockUntil: null }
    });

    return NextResponse.json({ success: true, message: 'Mot de passe mis à jour.' });
  } catch (error) {
    console.error('Password reset confirm error:', error);
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
