import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/database';
import { 
  requireAuth, 
  requireRole,
  createAuthErrorResponse,
  logUserActivity
} from '../../../../../lib/auth';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  console.log('🚀 === DEBUG AUTHENTIFICATION ===');
  
  // 1. Debug headers reçus
  console.log('📋 Headers reçus:');
  request.headers.forEach((value, key) => {
    if (key.toLowerCase().includes('auth') || key.toLowerCase().includes('token')) {
      console.log(`   ${key}: ${value.substring(0, 50)}...`);
    }
  });
  
  // 2. Debug Authorization header spécifiquement  
  const authHeader = request.headers.get('authorization');
  const tokenHeader = request.headers.get('x-auth-token');
  const cookieHeader = request.headers.get('cookie');
  
  console.log('🔑 Authorization header:', authHeader ? `"${authHeader.substring(0, 30)}..."` : 'NULL');
  console.log('🔑 X-Auth-Token header:', tokenHeader ? `"${tokenHeader.substring(0, 30)}..."` : 'NULL');
  console.log('🍪 Cookie header:', cookieHeader ? `"${cookieHeader}"` : 'NULL');

  try {
    // 3. Test authentification avec debug
    console.log('🔐 Appel requireAuth...');
    const auth = await requireAuth(request);
    
    console.log('✅ Résultat auth:', {
      success: auth.error === null,
      error: auth.error,
      user: auth.user ? { email: auth.user.email, role: auth.user.role } : 'NULL'
    });

    if (auth.error || !auth.user) {
      console.log('❌ Authentification échouée:', auth.error);
      return NextResponse.json({
        success: false,
        error: auth.error || 'Non authentifié',
        debug: {
          hasAuthHeader: !!authHeader,
          hasTokenHeader: !!tokenHeader,
          hasCookie: !!cookieHeader
        }
      }, { status: 401 });
    }

    // 4. Si on arrive ici, l'auth est OK
    const { id: articleId } = await context.params;
    console.log('📄 Article ID:', articleId);

    if (!articleId) {
      return NextResponse.json({
        error: 'ID d\'article requis'
      }, { status: 400 });
    }

    // Vérifier que l'article existe
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId }
    });

    if (!existingArticle) {
      return NextResponse.json({
        error: 'Article non trouvé'
      }, { status: 404 });
    }

    // Vérifier que l'utilisateur peut publier cet article
    if (existingArticle.authorId !== auth.user.id && auth.user.role !== 'ADMIN') {
      return NextResponse.json({
        error: 'Non autorisé à publier cet article'
      }, { status: 403 });
    }

    // Mettre à jour l'article pour le publier
    const now = new Date();
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        status: 'PUBLISHED',
        publishedAt: now,
        updatedAt: now
      }
    });

    // Logger l'activité
    await logUserActivity(
      auth.user.id,
      'article_published',
      request,
      true,
      {
        articleId,
        articleTitle: existingArticle.title,
        publishedAt: now.toISOString()
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Article publié avec succès',
      debug: {
        user: auth.user?.email,
        articleId,
        timestamp: new Date().toISOString()
      },
      data: {
        article: updatedArticle
      }
    });

  } catch (error) {
    console.error('Erreur publication article:', error);
    return NextResponse.json({
      error: 'Erreur serveur lors de la publication de l\'article'
    }, { status: 500 });
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
