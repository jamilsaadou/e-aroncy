import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔐 Vérification token...');
    
    const auth = await requireAuth(request);
    
    if (!auth.user || auth.error) {
      return NextResponse.json({
        valid: false,
        error: auth.error
      }, { status: 401 });
    }

    return NextResponse.json({
      valid: true,
      user: {
        id: auth.user.id,
        email: auth.user.email,
        role: auth.user.role,
        firstName: auth.user.firstName,
        lastName: auth.user.lastName
      }
    });
    
  } catch (error) {
    console.error('💥 Erreur vérification token:', error);
    return NextResponse.json({
      valid: false,
      error: 'Erreur serveur'
    }, { status: 500 });
  }
}

// Méthode OPTIONS pour CORS
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
