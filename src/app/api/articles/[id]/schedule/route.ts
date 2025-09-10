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
  try {
    // Vérifier l'authentification et les permissions
    const roleCheck = requireRole(['ADMIN', 'MODERATOR']);
    const authResult = await roleCheck(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non autorisé', 401);
    }

    const { id: articleId } = await context.params;
    const body = await request.json();
    const { scheduledFor } = body;

    if (!articleId) {
      return NextResponse.json({
        error: 'ID d\'article requis'
      }, { status: 400 });
    }

    if (!scheduledFor) {
      return NextResponse.json({
        error: 'Date de planification requise'
      }, { status: 400 });
    }

    // Vérifier que la date est dans le futur
    const scheduledDate = new Date(scheduledFor);
    const now = new Date();
    
    if (scheduledDate <= now) {
      return NextResponse.json({
        error: 'La date de planification doit être dans le futur'
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

    // Vérifier que l'utilisateur peut planifier cet article
    if (existingArticle.authorId !== authResult.user.id && authResult.user.role !== 'ADMIN') {
      return NextResponse.json({
        error: 'Non autorisé à planifier cet article'
      }, { status: 403 });
    }

    // Mettre à jour l'article pour le planifier
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        status: 'SCHEDULED',
        publishedAt: scheduledDate,
        updatedAt: now
      }
    });

    // Logger l'activité
    await logUserActivity(
      authResult.user.id,
      'article_scheduled',
      request,
      true,
      {
        articleId,
        articleTitle: existingArticle.title,
        scheduledFor: scheduledDate.toISOString()
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Article planifié avec succès',
      data: {
        article: updatedArticle,
        scheduledFor: scheduledDate.toISOString()
      }
    });

  } catch (error) {
    console.error('Erreur planification article:', error);
    return NextResponse.json({
      error: 'Erreur serveur lors de la planification de l\'article'
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
