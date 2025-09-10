import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, verify2FAToken, logUserActivity } from '../../../../lib/auth';
import { TwoFactorSetupSchema } from '../../../../lib/validation';
import { prisma } from '../../../../lib/database';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json({ error: authResult.error || 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    const userId = authResult.user.id;
    
    // Valider les données
    const { token } = TwoFactorSetupSchema.parse(body);
    
    // Récupérer l'utilisateur avec le secret temporaire
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { twoFactorTempSecret: true, twoFactorEnabled: true }
    });
    
    if (!user?.twoFactorTempSecret) {
      return NextResponse.json({ 
        error: 'Aucune configuration 2FA en cours. Initiez d\'abord la configuration.' 
      }, { status: 400 });
    }
    
    // Vérifier le token TOTP
    const isValid = verify2FAToken(user.twoFactorTempSecret, token);
    
    if (!isValid) {
      await logUserActivity(userId, '2fa_verification_failed', request, false, 
        { reason: 'invalid_token' }, 'Token 2FA invalide');
      return NextResponse.json({ error: 'Code d\'authentification invalide' }, { status: 400 });
    }
    
    // Activer 2FA de manière permanente
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: user.twoFactorTempSecret,
        twoFactorTempSecret: null,
        twoFactorEnabled: true
      }
    });
    
    // Logger le succès
    await logUserActivity(userId, '2fa_enabled', request, true);
    
    return NextResponse.json({ 
      success: true,
      message: 'Authentification à deux facteurs activée avec succès' 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Données invalides', 
        details: error.issues 
      }, { status: 400 });
    }
    
    console.error('2FA verification error:', error);
    return NextResponse.json({ error: 'Erreur lors de la vérification 2FA' }, { status: 500 });
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
