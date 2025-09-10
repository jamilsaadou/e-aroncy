import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, generate2FASecret, logUserActivity } from '../../../../lib/auth';
import { prisma } from '../../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json({ error: authResult.error || 'Non authentifié' }, { status: 401 });
    }

    const userId = authResult.user.id;
    
    // Générer un secret unique pour 2FA
    const { secret, qrCode, manualEntryKey } = generate2FASecret(authResult.user.email);
    
    // Sauvegarder le secret temporairement (pas encore activé)
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorTempSecret: secret }
    });

    // Logger l'action
    await logUserActivity(userId, '2fa_setup_initiated', request, true);
    
    // Générer le QR code
    const qrCodeDataUrl = await qrCode;
    
    return NextResponse.json({
      success: true,
      secret,
      qrCode: qrCodeDataUrl,
      manualEntryKey,
      message: 'Configuration 2FA initiée. Scannez le QR code avec votre application d\'authentification.'
    });

  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json({ error: 'Erreur lors de la configuration 2FA' }, { status: 500 });
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
