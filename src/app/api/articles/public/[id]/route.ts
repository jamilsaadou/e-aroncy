import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Récupérer l'article depuis la base de données
    const article = await prisma.article.findUnique({
      where: {
        id,
        status: 'PUBLISHED',
        publishedAt: {
          lte: new Date() // Seulement si la date de publication est passée
        }
      },
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
        blocks: true, // Contenu complet pour l'affichage individuel
        seoTitle: true,
        seoDescription: true,
        views: true,
        likes: true,
        publishedAt: true,
        createdAt: true,
        allowComments: true
      }
    });

    if (!article) {
      return NextResponse.json({
        error: 'Article non trouvé ou non publié'
      }, { status: 404 });
    }

    // Incrémenter le nombre de vues
    await prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    // Formater l'article pour l'affichage
    const formattedArticle = {
      ...article,
      // Calculer le temps de lecture estimé basé sur le contenu
      readTime: calculateReadTime(article.blocks),
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
      authorRole: getAuthorRole(article.category),
      // Incrémenter les vues pour l'affichage
      views: article.views + 1
    };

    return NextResponse.json({
      success: true,
      article: formattedArticle
    });

  } catch (error) {
    console.error('Erreur récupération article:', error);
    return NextResponse.json({
      error: 'Erreur serveur lors de la récupération de l\'article'
    }, { status: 500 });
  }
}

// Fonction pour calculer le temps de lecture basé sur le contenu
function calculateReadTime(blocks: any): string {
  if (!blocks || !Array.isArray(blocks)) {
    return '5 min';
  }

  let totalWords = 0;
  
  blocks.forEach((block: any) => {
    if (block.type === 'paragraph' && block.data?.text) {
      // Compter les mots dans le texte (en retirant les balises HTML)
      const text = block.data.text.replace(/<[^>]*>/g, '');
      totalWords += text.split(/\s+/).filter((word: string) => word.length > 0).length;
    } else if (block.type === 'header' && block.data?.text) {
      const text = block.data.text.replace(/<[^>]*>/g, '');
      totalWords += text.split(/\s+/).filter((word: string) => word.length > 0).length;
    } else if (block.type === 'list' && block.data?.items) {
      block.data.items.forEach((item: string) => {
        const text = item.replace(/<[^>]*>/g, '');
        totalWords += text.split(/\s+/).filter((word: string) => word.length > 0).length;
      });
    }
  });

  // Estimation : 200 mots par minute de lecture
  const readTimeMinutes = Math.max(1, Math.ceil(totalWords / 200));
  return `${readTimeMinutes} min`;
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
