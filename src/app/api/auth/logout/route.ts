import { NextRequest, NextResponse } from 'next/server';
import { 
  requireAuth, 
  createAuthErrorResponse,
  clearAuthCookies,
  logUserActivity
} from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non authentifié', 401);
    }

    // Logger la déconnexion
    await logUserActivity(authResult.user.id, 'logout', request, true);

    // Créer la réponse de succès
    const response = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
      authenticated: false
    });

    // Nettoyer les cookies d'authentification
    return clearAuthCookies(response);

  } catch (error) {
    console.error('Logout error:', error);
    return createAuthErrorResponse('Erreur lors de la déconnexion', 500);
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
