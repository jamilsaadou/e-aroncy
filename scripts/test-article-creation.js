const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testArticleCreation() {
  try {
    console.log('🧪 Test de création d\'article...');

    // Récupérer un utilisateur admin
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!admin) {
      console.log('❌ Aucun administrateur trouvé');
      return;
    }

    console.log(`✅ Admin trouvé: ${admin.firstName} ${admin.lastName}`);

    // Créer un article de test
    const testArticle = {
      title: 'Guide de Cybersécurité pour les ONG',
      subtitle: 'Protégez vos données et celles de vos bénéficiaires',
      excerpt: 'Un guide complet pour aider les ONG à sécuriser leurs systèmes d\'information et protéger les données sensibles.',
      category: 'guides-pratiques',
      tags: ['cybersécurité', 'ONG', 'protection-données', 'guide'],
      author: `${admin.firstName} ${admin.lastName}`,
      authorId: admin.id,
      publishDate: new Date().toISOString().split('T')[0],
      publishTime: '10:00',
      status: 'DRAFT',
      featured: true,
      allowComments: true,
      blocks: [
        {
          id: '1',
          type: 'heading',
          content: {
            text: 'Introduction à la cybersécurité pour les ONG',
            level: 'h2'
          }
        },
        {
          id: '2',
          type: 'paragraph',
          content: {
            text: 'Les organisations non gouvernementales (ONG) manipulent souvent des données sensibles concernant leurs bénéficiaires, leurs donateurs et leurs opérations. Il est crucial de mettre en place des mesures de sécurité appropriées.'
          }
        },
        {
          id: '3',
          type: 'quote',
          content: {
            quote: 'La sécurité n\'est pas un produit, mais un processus.',
            author: 'Bruce Schneier'
          }
        },
        {
          id: '4',
          type: 'heading',
          content: {
            text: 'Mesures de base à implémenter',
            level: 'h3'
          }
        },
        {
          id: '5',
          type: 'paragraph',
          content: {
            text: 'Voici les mesures essentielles que toute ONG devrait mettre en place pour protéger ses données et systèmes.'
          }
        }
      ],
      seoTitle: 'Guide Cybersécurité ONG - Protection des Données',
      seoDescription: 'Guide complet de cybersécurité pour les ONG : protégez vos données, sécurisez vos systèmes et formez vos équipes.',
      views: 0,
      likes: 0
    };

    const createdArticle = await prisma.article.create({
      data: testArticle
    });

    console.log('✅ Article créé avec succès !');
    console.log(`📄 ID: ${createdArticle.id}`);
    console.log(`📝 Titre: ${createdArticle.title}`);
    console.log(`📂 Catégorie: ${createdArticle.category}`);
    console.log(`🏷️ Tags: ${createdArticle.tags.join(', ')}`);
    console.log(`👤 Auteur: ${createdArticle.author}`);
    console.log(`📊 Statut: ${createdArticle.status}`);
    console.log(`⭐ À la une: ${createdArticle.featured ? 'Oui' : 'Non'}`);
    console.log(`💬 Commentaires: ${createdArticle.allowComments ? 'Autorisés' : 'Désactivés'}`);
    console.log(`🧱 Blocs de contenu: ${createdArticle.blocks.length}`);

    // Vérifier que l'article est bien dans la base
    const articleCount = await prisma.article.count();
    console.log(`📊 Total d'articles dans la base: ${articleCount}`);

    // Tester la récupération
    const retrievedArticle = await prisma.article.findUnique({
      where: { id: createdArticle.id },
      include: {
        authorUser: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (retrievedArticle) {
      console.log('✅ Article récupéré avec succès !');
      console.log(`👤 Auteur complet: ${retrievedArticle.authorUser.firstName} ${retrievedArticle.authorUser.lastName} (${retrievedArticle.authorUser.role})`);
    }

    console.log('\n🎉 Test de création d\'article réussi !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testArticleCreation();
