import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, createAuthErrorResponse, getClientIP, getUserAgent } from '../../../../lib/auth';
import SessionService from '../../../../lib/sessionService';

// GET - Obtenir les sessions actives de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non authentifié', 401);
    }

    const sessions = await SessionService.getUserActiveSessions(authResult.user.id);
    
    // Marquer la session courante
    const currentToken = request.cookies.get('auth-token')?.value;
    if (currentToken) {
      const currentSessionValidation = await SessionService.validateSession(currentToken);
      if (currentSessionValidation.isValid && currentSessionValidation.session) {
        sessions.forEach(session => {
          if (session.sessionId === currentSessionValidation.session!.sessionId) {
            session.isCurrentSession = true;
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      sessions,
      total: sessions.length
    });

  } catch (error) {
    console.error('Erreur récupération sessions:', error);
    return createAuthErrorResponse('Erreur serveur', 500);
  }
}

// DELETE - Révoquer une session spécifique ou toutes les sessions
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non authentifié', 401);
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const revokeAll = searchParams.get('revokeAll') === 'true';

    if (revokeAll) {
      // Révoquer toutes les sessions sauf la session courante
      const currentToken = request.cookies.get('auth-token')?.value;
      let currentSessionId: string | undefined;
      
      if (currentToken) {
        const currentSessionValidation = await SessionService.validateSession(currentToken);
        if (currentSessionValidation.isValid && currentSessionValidation.session) {
          currentSessionId = currentSessionValidation.session.sessionId;
        }
      }

      const revokedCount = await SessionService.revokeAllUserSessions(
        authResult.user.id,
        currentSessionId,
        authResult.user.id
      );

      return NextResponse.json({
        success: true,
        message: `${revokedCount} session(s) révoquée(s)`,
        revokedCount
      });

    } else if (sessionId) {
      // Révoquer une session spécifique
      const success = await SessionService.revokeSession(
        sessionId,
        authResult.user.id,
        'Révocation manuelle'
      );

      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Session révoquée avec succès'
        });
      } else {
        return createAuthErrorResponse('Session non trouvée ou déjà révoquée', 404);
      }

    } else {
      return createAuthErrorResponse('sessionId ou revokeAll requis', 400);
    }

  } catch (error) {
    console.error('Erreur révocation session:', error);
    return createAuthErrorResponse('Erreur serveur', 500);
  }
}

// POST - Prolonger la session courante
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non authentifié', 401);
    }

    const currentToken = request.cookies.get('auth-token')?.value;
    if (!currentToken) {
      return createAuthErrorResponse('Token de session manquant', 400);
    }

    const currentSessionValidation = await SessionService.validateSession(currentToken);
    if (!currentSessionValidation.isValid || !currentSessionValidation.session) {
      return createAuthErrorResponse('Session invalide', 401);
    }

    const body = await request.json().catch(() => ({}));
    const hours = body.hours || 24; // Par défaut 24h

    const success = await SessionService.extendSession(
      currentSessionValidation.session.sessionId,
      hours
    );

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Session prolongée avec succès',
        newExpiry: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
      });
    } else {
      return createAuthErrorResponse('Erreur lors de la prolongation', 500);
    }

  } catch (error) {
    console.error('Erreur prolongation session:', error);
    return createAuthErrorResponse('Erreur serveur', 500);
  }
}

// OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
