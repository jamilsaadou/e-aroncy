import { NextRequest, NextResponse } from 'next/server';
import { 
  requireAuth, 
  createAuthErrorResponse
} from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    
    if (authResult.error || !authResult.user) {
      // Si le token est invalide, nettoyer les cookies pour éviter la boucle infinie
      const response = NextResponse.json({
        authenticated: false,
        error: authResult.error || 'Non authentifié',
        timestamp: new Date().toISOString()
      }, { status: 401 });

      // Supprimer les cookies d'authentification invalides
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });

      response.cookies.set('session-id', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });

      return response;
    }

    return NextResponse.json({
      authenticated: true,
      user: authResult.user,
      sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Session check error:', error);
    return createAuthErrorResponse('Erreur lors de la vérification de session', 500);
  }
}

// Méthode POST pour prolonger la session
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non authentifié', 401);
    }

    return NextResponse.json({
      success: true,
      message: 'Session prolongée',
      user: authResult.user,
      sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Session extend error:', error);
    return createAuthErrorResponse('Erreur lors de la prolongation de session', 500);
  }
}

// Méthode OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
