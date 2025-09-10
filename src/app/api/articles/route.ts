import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/database';
import { 
  requireRole,
  createAuthErrorResponse,
  getClientIP,
  getUserAgent
} from '../../../lib/auth';

// Modèle Article (à créer)
interface Article {
  title: string;
  subtitle?: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  authorId: string;
  publishDate: string;
  publishTime: string;
  status: 'draft' | 'scheduled' | 'published';
  featured: boolean;
  allowComments: boolean;
  featuredImage?: string;
  blocks: any[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  views: number;
  likes: number;
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification et les permissions
    const authResult = await requireRole(['ADMIN'])(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non autorisé', 403);
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      excerpt,
      category,
      tags,
      publishDate,
      publishTime,
      status,
      featured,
      allowComments,
      blocks,
      contentBlocks,
      seoTitle,
      seoDescription,
      seoKeywords
    } = body;

    // Validation des champs requis
    const blocksToValidate = contentBlocks || blocks || [];
    if (!title || !excerpt || !category) {
      return NextResponse.json({
        error: 'Champs requis manquants: title, excerpt, category'
      }, { status: 400 });
    }

    // Validation de la catégorie
    const validCategories = ['actualites', 'guides-pratiques', 'boite-outils', 'analyse', 'formation'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({
        error: 'Catégorie invalide'
      }, { status: 400 });
    }

    // Validation du statut
    const validStatuses = ['DRAFT', 'SCHEDULED', 'PUBLISHED'];
    const statusUpper = status?.toUpperCase();
    if (!validStatuses.includes(statusUpper)) {
      return NextResponse.json({
        error: 'Statut invalide'
      }, { status: 400 });
    }

    // Créer l'article
    const now = new Date();
    const article: Partial<Article> = {
      title: title.trim(),
      subtitle: subtitle?.trim(),
      excerpt: excerpt.trim(),
      category,
      tags: Array.isArray(tags) ? tags.map((tag: string) => tag.trim()) : 
            Array.isArray(seoKeywords) ? seoKeywords.map((tag: string) => tag.trim()) : [],
      author: `${authResult.user.firstName} ${authResult.user.lastName}`,
      authorId: authResult.user.id,
      publishDate: publishDate || now.toISOString().split('T')[0],
      publishTime: publishTime || '09:00',
      status: statusUpper || 'DRAFT',
      featured: Boolean(featured),
      allowComments: Boolean(allowComments),
      blocks: contentBlocks || blocks || [],
      seoTitle: seoTitle?.trim(),
      seoDescription: seoDescription?.trim(),
      createdAt: now,
      updatedAt: now,
      views: 0,
      likes: 0
    };

    // Si l'article est publié, définir la date de publication
    if (statusUpper === 'PUBLISHED') {
      article.publishedAt = now;
    } else if (statusUpper === 'SCHEDULED') {
      const scheduledDate = new Date(`${publishDate}T${publishTime}`);
      if (scheduledDate <= now) {
        return NextResponse.json({
          error: 'La date de publication programmée doit être dans le futur'
        }, { status: 400 });
      }
      article.publishedAt = scheduledDate;
    }

    // Sauvegarder en base de données avec Prisma
    const savedArticle = await prisma.article.create({
      data: {
        title: article.title!,
        subtitle: article.subtitle,
        excerpt: article.excerpt!,
        category: article.category!,
        tags: article.tags!,
        author: article.author!,
        authorId: article.authorId!,
        publishDate: article.publishDate!,
        publishTime: article.publishTime!,
        status: article.status! as any,
        featured: article.featured!,
        allowComments: article.allowComments!,
        featuredImage: article.featuredImage,
        blocks: article.blocks!,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        publishedAt: article.publishedAt,
        views: article.views!,
        likes: article.likes!
      }
    });

    // Logger l'activité
    await prisma.userActivity.create({
      data: {
        userId: authResult.user.id,
        action: 'article_created',
        details: JSON.stringify({
          articleId: savedArticle.id,
          articleTitle: title,
          category,
          status: statusUpper,
          featured
        }),
        ipAddress: getClientIP(request),
        userAgent: getUserAgent(request),
        success: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Article créé avec succès',
      data: {
        article: savedArticle
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur création article:', error);
    return NextResponse.json({
      error: 'Erreur serveur lors de la création de l\'article'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = await requireRole(['ADMIN'])(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non authentifié', 403);
    }

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    // Construire les filtres
    const where: any = {};
    
    if (category) where.category = category;
    if (status) where.status = status.toUpperCase();
    if (featured) where.featured = featured === 'true';
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Récupérer les articles depuis la base de données
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          subtitle: true,
          excerpt: true,
          category: true,
          tags: true,
          author: true,
          authorId: true,
          publishDate: true,
          publishTime: true,
          status: true,
          featured: true,
          allowComments: true,
          featuredImage: true,
          seoTitle: true,
          seoDescription: true,
          views: true,
          likes: true,
          createdAt: true,
          updatedAt: true,
          publishedAt: true
        }
      }),
      prisma.article.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération articles:', error);
    return NextResponse.json({
      error: 'Erreur serveur lors de la récupération des articles'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Vérifier l'authentification et les permissions
    const authResult = await requireRole(['ADMIN'])(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non autorisé', 403);
    }

    const body = await request.json();
    const {
      id,
      title,
      subtitle,
      excerpt,
      category,
      tags,
      publishDate,
      publishTime,
      status,
      featured,
      allowComments,
      blocks,
      contentBlocks,
      seoTitle,
      seoDescription,
      seoKeywords
    } = body;

    // Validation de l'ID
    if (!id) {
      return NextResponse.json({
        error: 'ID de l\'article requis pour la mise à jour'
      }, { status: 400 });
    }

    // Vérifier que l'article existe
    const existingArticle = await prisma.article.findUnique({
      where: { id }
    });

    if (!existingArticle) {
      return NextResponse.json({
        error: 'Article non trouvé'
      }, { status: 404 });
    }

    // Vérifier les permissions (seul l'auteur ou un admin peut modifier)
    if (existingArticle.authorId !== authResult.user.id && authResult.user.role !== 'ADMIN') {
      return NextResponse.json({
        error: 'Non autorisé à modifier cet article'
      }, { status: 403 });
    }

    // Validation des champs requis
    const blocksToValidate = contentBlocks || blocks || [];
    if (!title || !excerpt || !category) {
      return NextResponse.json({
        error: 'Champs requis manquants: title, excerpt, category'
      }, { status: 400 });
    }

    // Validation de la catégorie
    const validCategories = ['actualites', 'guides-pratiques', 'boite-outils', 'analyse', 'formation'];
    if (!validCategories.includes(category)) {
      return NextResponse.json({
        error: 'Catégorie invalide'
      }, { status: 400 });
    }

    // Validation du statut
    const validStatuses = ['DRAFT', 'SCHEDULED', 'PUBLISHED'];
    const statusUpper = status?.toUpperCase();
    if (statusUpper && !validStatuses.includes(statusUpper)) {
      return NextResponse.json({
        error: 'Statut invalide'
      }, { status: 400 });
    }

    // Préparer les données de mise à jour
    const now = new Date();
    const updateData: any = {
      title: title.trim(),
      subtitle: subtitle?.trim(),
      excerpt: excerpt.trim(),
      category,
      tags: Array.isArray(tags) ? tags.map((tag: string) => tag.trim()) : 
            Array.isArray(seoKeywords) ? seoKeywords.map((tag: string) => tag.trim()) : 
            existingArticle.tags,
      publishDate: publishDate || existingArticle.publishDate,
      publishTime: publishTime || existingArticle.publishTime,
      featured: featured !== undefined ? Boolean(featured) : existingArticle.featured,
      allowComments: allowComments !== undefined ? Boolean(allowComments) : existingArticle.allowComments,
      blocks: blocksToValidate || existingArticle.blocks,
      seoTitle: seoTitle?.trim(),
      seoDescription: seoDescription?.trim(),
      updatedAt: now
    };

    // Gérer le changement de statut
    if (statusUpper && statusUpper !== existingArticle.status) {
      updateData.status = statusUpper;
      
      if (statusUpper === 'PUBLISHED' && existingArticle.status !== 'PUBLISHED') {
        updateData.publishedAt = now;
      } else if (statusUpper === 'SCHEDULED') {
        const scheduledDate = new Date(`${updateData.publishDate}T${updateData.publishTime}`);
        if (scheduledDate <= now) {
          return NextResponse.json({
            error: 'La date de publication programmée doit être dans le futur'
          }, { status: 400 });
        }
        updateData.publishedAt = scheduledDate;
      }
    }

    // Mettre à jour l'article
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: updateData
    });

    // Logger l'activité
    await prisma.userActivity.create({
      data: {
        userId: authResult.user.id,
        action: 'article_updated',
        details: JSON.stringify({
          articleId: id,
          articleTitle: title,
          category,
          status: statusUpper || existingArticle.status,
          featured: updateData.featured
        }),
        ipAddress: getClientIP(request),
        userAgent: getUserAgent(request),
        success: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Article mis à jour avec succès',
      data: {
        article: updatedArticle
      }
    });

  } catch (error) {
    console.error('Erreur mise à jour article:', error);
    return NextResponse.json({
      error: 'Erreur serveur lors de la mise à jour de l\'article'
    }, { status: 500 });
  }
}

// Méthode OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
