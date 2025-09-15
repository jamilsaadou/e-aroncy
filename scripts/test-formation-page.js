const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFormationCreation() {
  try {
    console.log('🧪 Test de création de formation...');

    // Vérifier la connexion à la base de données
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');

    // Vérifier qu'il y a au moins un utilisateur avec le rôle INSTRUCTOR ou ADMIN
    const instructors = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'INSTRUCTOR' },
          { role: 'ADMIN' }
        ]
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });

    console.log(`✅ Trouvé ${instructors.length} instructeur(s)/admin(s)`);
    
    if (instructors.length === 0) {
      console.log('❌ Aucun instructeur trouvé. Création d\'un utilisateur test...');
      
      const testUser = await prisma.user.create({
        data: {
          email: 'instructor@test.com',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq5S/kS', // password123
          firstName: 'Test',
          lastName: 'Instructor',
          organization: 'Test Organization',
          role: 'INSTRUCTOR',
          emailVerified: true,
          isActive: true
        }
      });
      
      console.log('✅ Utilisateur test créé:', testUser.email);
    }

    // Test de création d'une formation
    const testFormation = {
      title: 'Formation Test Cybersécurité',
      description: 'Une formation complète sur la cybersécurité pour les organisations.',
      shortDescription: 'Formation cybersécurité de base',
      category: 'CYBERSECURITE',
      level: 'DEBUTANT',
      instructor: 'Test Instructor',
      instructorId: instructors[0]?.id || (await prisma.user.findFirst({ where: { role: 'INSTRUCTOR' } }))?.id,
      duration: '8',
      price: 0,
      language: 'fr',
      tags: ['cybersécurité', 'formation', 'sécurité'],
      prerequisites: ['Connaissances informatiques de base'],
      objectives: ['Comprendre les bases de la cybersécurité', 'Identifier les menaces courantes'],
      status: 'DRAFT',
      featured: false,
      certificateEnabled: true,
      allowDiscussions: true
    };

    const formation = await prisma.formation.create({
      data: testFormation
    });

    console.log('✅ Formation créée avec succès:', formation.id);

    // Test de création d'un module
    const testModule = {
      title: 'Introduction à la cybersécurité',
      description: 'Module d\'introduction aux concepts de base',
      duration: 60,
      type: 'VIDEO',
      content: 'Contenu du module d\'introduction...',
      order: 0,
      formationId: formation.id
    };

    const module = await prisma.module.create({
      data: testModule
    });

    console.log('✅ Module créé avec succès:', module.id);

    // Test de création d'un quiz
    const testQuiz = {
      passingScore: 70,
      timeLimit: 30,
      allowRetries: true,
      showCorrectAnswers: true,
      moduleId: module.id,
      questions: {
        create: [
          {
            question: 'Qu\'est-ce que la cybersécurité ?',
            type: 'MULTIPLE_CHOICE',
            options: [
              'Protection des systèmes informatiques',
              'Création de logiciels',
              'Gestion de bases de données',
              'Développement web'
            ],
            correctAnswer: '0',
            explanation: 'La cybersécurité concerne la protection des systèmes informatiques.',
            points: 1,
            order: 0
          }
        ]
      }
    };

    const quiz = await prisma.quiz.create({
      data: testQuiz,
      include: {
        questions: true
      }
    });

    console.log('✅ Quiz créé avec succès:', quiz.id);

    // Nettoyer les données de test
    await prisma.quiz.delete({ where: { id: quiz.id } });
    await prisma.module.delete({ where: { id: module.id } });
    await prisma.formation.delete({ where: { id: formation.id } });

    console.log('✅ Données de test nettoyées');
    console.log('🎉 Tous les tests sont passés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testFormationCreation();
