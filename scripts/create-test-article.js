const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function createTestArticle() {
  try {
    console.log('🔗 Test de création d\'article...');
    
    // Étape 1: Se connecter avec les identifiants admin
    console.log('📧 Connexion avec le super admin...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@e-aroncy.org',
        password: 'Admin123!@#'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Erreur de connexion: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    console.log('✅ Connexion réussie:', loginData.user.firstName, loginData.user.lastName);

    // Récupérer le cookie d'authentification
    const cookies = loginResponse.headers.get('set-cookie');
    const authCookie = cookies ? cookies.split(';')[0] : '';

    // Étape 2: Créer un article de test
    console.log('📝 Création d\'un article de test...');
    const articleData = {
      title: 'Guide de Cybersécurité pour les ONG Africaines',
      subtitle: 'Protégez vos données et celles de vos bénéficiaires',
      excerpt: 'Un guide complet pour aider les organisations non gouvernementales africaines à sécuriser leurs systèmes d\'information et protéger les données sensibles.',
      category: 'guides-pratiques',
      tags: ['cybersécurité', 'ONG', 'protection-données', 'guide'],
      status: 'PUBLISHED',
      featured: true,
      allowComments: true,
      blocks: [
        {
          type: 'paragraph',
          content: 'La cybersécurité est devenue un enjeu majeur pour les organisations non gouvernementales en Afrique.'
        },
        {
          type: 'heading',
          level: 2,
          content: 'Pourquoi la cybersécurité est-elle importante pour les ONG ?'
        },
        {
          type: 'paragraph',
          content: 'Les ONG manipulent des données sensibles concernant leurs bénéficiaires, leurs donateurs et leurs opérations. Une faille de sécurité peut avoir des conséquences dramatiques.'
        },
        {
          type: 'list',
          items: [
            'Protection des données personnelles des bénéficiaires',
            'Sécurisation des informations financières',
            'Préservation de la confidentialité des opérations',
            'Maintien de la confiance des partenaires'
          ]
        }
      ],
      seoTitle: 'Guide Cybersécurité ONG Afrique - Protection des Données',
      seoDescription: 'Guide complet de cybersécurité pour les ONG africaines. Apprenez à protéger vos données et celles de vos bénéficiaires avec des conseils pratiques et des outils adaptés.'
    };

    const articleResponse = await fetch('http://localhost:3000/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookie
      },
      body: JSON.stringify(articleData)
    });

    if (!articleResponse.ok) {
      const errorData = await articleResponse.text();
      throw new Error(`Erreur création article: ${articleResponse.status} - ${errorData}`);
    }

    const articleResult = await articleResponse.json();
    console.log('');
    console.log('🎉 ARTICLE CRÉÉ AVEC SUCCÈS !');
    console.log('');
    console.log('📋 DÉTAILS DE L\'ARTICLE :');
    console.log('================================');
    console.log(`📰 Titre     : ${articleResult.article.title}`);
    console.log(`📝 Extrait   : ${articleResult.article.excerpt.substring(0, 100)}...`);
    console.log(`🏷️  Catégorie : ${articleResult.article.category}`);
    console.log(`🏷️  Tags      : ${articleResult.article.tags.join(', ')}`);
    console.log(`📊 Statut    : ${articleResult.article.status}`);
    console.log(`⭐ Featured  : ${articleResult.article.featured ? 'Oui' : 'Non'}`);
    console.log(`👤 Auteur    : ${articleResult.article.author}`);
    console.log(`🆔 ID        : ${articleResult.article.id}`);
    console.log(`📅 Créé le   : ${new Date(articleResult.article.createdAt).toLocaleString('fr-FR')}`);
    console.log('================================');
    console.log('');
    console.log('✅ L\'article a été sauvegardé en base de données PostgreSQL avec Prisma !');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'article:', error.message);
  }
}

// Exécuter le script
createTestArticle();
