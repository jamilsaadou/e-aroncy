import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    // Construire les filtres - seulement les articles publiés
    const where: any = {
      status: 'PUBLISHED',
      publishedAt: {
        lte: new Date() // Seulement les articles dont la date de publication est passée
      }
    };
    
    if (category) where.category = category;
    if (featured) where.featured = featured === 'true';
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ];
    }

    // Récupérer les articles depuis la base de données
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: [
          { featured: 'desc' }, // Articles à la une en premier
          { publishedAt: 'desc' } // Puis par date de publication
        ],
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
          publishDate: true,
          publishTime: true,
          featured: true,
          featuredImage: true,
          seoTitle: true,
          seoDescription: true,
          views: true,
          likes: true,
          publishedAt: true,
          createdAt: true,
          // Ne pas exposer les blocs de contenu complets dans la liste
          blocks: false
        }
      }),
      prisma.article.count({ where })
    ]);

    // Formater les articles pour l'affichage
    const formattedArticles = articles.map(article => ({
      ...article,
      // Calculer le temps de lecture estimé basé sur l'excerpt
      readTime: `${Math.max(1, Math.ceil(article.excerpt.length / 200))} min`,
      // Formater la date de publication
      publishDate: article.publishedAt ? 
        new Intl.DateTimeFormat('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(new Date(article.publishedAt)) : 
        article.publishDate,
      // Mapper les catégories vers des couleurs
      color: getCategoryColor(article.category),
      // Ajouter un rôle d'auteur par défaut
      authorRole: getAuthorRole(article.category)
    }));

    return NextResponse.json({
      success: true,
      articles: formattedArticles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération articles publics:', error);
    return NextResponse.json({
      error: 'Erreur serveur lors de la récupération des articles'
    }, { status: 500 });
  }
}

// Fonction utilitaire pour mapper les catégories vers des couleurs
function getCategoryColor(category: string): string {
  const colorMap: { [key: string]: string } = {
    'analyse': 'red',
    'actualites': 'blue',
    'guides-pratiques': 'orange',
    'formation': 'blue',
    'boite-outils': 'green',
    'juridique': 'purple',
    'innovation': 'green',
    'cas-etude': 'indigo'
  };
  return colorMap[category] || 'blue';
}

// Fonction utilitaire pour obtenir un rôle d'auteur basé sur la catégorie
function getAuthorRole(category: string): string {
  const roleMap: { [key: string]: string } = {
    'analyse': 'Expert en cybersécurité',
    'actualites': 'Journaliste spécialisé',
    'guides-pratiques': 'Consultant en sécurité',
    'formation': 'Formateur certifié',
    'boite-outils': 'Expert technique',
    'juridique': 'Juriste spécialisé',
    'innovation': 'Chercheur en cybersécurité',
    'cas-etude': 'RSSI'
  };
  return roleMap[category] || 'Expert en cybersécurité';
}

// Méthode OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
