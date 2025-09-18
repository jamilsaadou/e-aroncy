/*
  Create a full example Formation with modules and a quiz.
  Usage: node scripts/create-example-formation.js
*/

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function ensureInstructor() {
  // Try to find an ADMIN or INSTRUCTOR
  let user = await prisma.user.findFirst({
    where: { OR: [{ role: 'ADMIN' }, { role: 'INSTRUCTOR' }] },
    orderBy: { createdAt: 'asc' }
  });
  if (user) return user;

  // As a fallback, create a minimal instructor user
  const bcrypt = require('bcryptjs');
  const password = await bcrypt.hash('example123', 12);
  user = await prisma.user.create({
    data: {
      email: `instructor_${Date.now()}@example.com`,
      password,
      firstName: 'Jane',
      lastName: 'Doe',
      organization: 'E-ARONCY',
      role: 'INSTRUCTOR',
      status: 'ACTIVE',
      emailVerified: true,
      isActive: true,
      lastActivity: new Date()
    }
  });
  return user;
}

async function main() {
  console.log('🚀 Creating example formation…');
  const instructor = await ensureInstructor();
  console.log(`👩‍🏫 Using instructor: ${instructor.email} (${instructor.role})`);

  const title = 'Fondamentaux de la cybersécurité pour ONG';

  // Avoid duplicates
  const existing = await prisma.formation.findFirst({ where: { title } });
  if (existing) {
    console.log('ℹ️ Example formation already exists with id:', existing.id);
    return;
  }

  // Create Formation
  const formation = await prisma.formation.create({
    data: {
      title,
      description: `Cette formation couvre les bases essentielles pour protéger les systèmes et données d'une ONG. Elle est adaptée aux équipes non techniques et met l'accent sur des pratiques concrètes.`,
      shortDescription: 'Les fondamentaux pour protéger votre ONG au quotidien.',
      category: 'SENSIBILISATION',
      level: 'DEBUTANT',
      instructor: `${instructor.firstName} ${instructor.lastName}`,
      instructorId: instructor.id,
      duration: '6', // heures (stockée en string)
      tags: ['sécurité', 'phishing', 'mots de passe'],
      prerequisites: ['Aucun prérequis'],
      objectives: [
        'Comprendre les risques courants',
        'Déployer de bonnes pratiques de base',
        'Réagir face à un incident simple'
      ],
      status: 'PUBLISHED',
      featured: false,
      certificateEnabled: true,
      allowDiscussions: true,
      language: 'fr',
      metaTitle: 'Fondamentaux cybersécurité ONG',
      metaDescription: 'Formation introductive à la cybersécurité pour ONG, accessible et pratique.'
    }
  });

  console.log('✅ Formation created:', formation.id);

  // Create Modules
  const modulesData = [
    {
      title: 'Introduction à la cybersécurité',
      description: 'Panorama des risques et principes clés.',
      duration: 10,
      type: 'TEXT',
      content: `Bienvenue ! Dans ce module, nous expliquons les notions essentielles et le vocabulaire de base (actifs, menaces, vulnérabilités, risques).`
    },
    {
      title: 'Mots de passe et authentification',
      description: 'Bonnes pratiques pour des accès sécurisés.',
      duration: 12,
      type: 'VIDEO',
      content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // exemple
    },
    {
      title: 'Quiz: bonnes pratiques',
      description: 'Validez vos connaissances.',
      duration: 8,
      type: 'QUIZ',
      content: 'Quiz de validation des acquis'
    },
    {
      title: 'Sensibiliser son équipe',
      description: 'Mettre en place une culture sécurité.',
      duration: 10,
      type: 'TEXT',
      content: `Checklist d'actions: affiches, ateliers, messages réguliers, procédures simples.`
    },
    {
      title: 'Conclusion et ressources',
      description: 'Récapitulatif et liens utiles.',
      duration: 8,
      type: 'EXERCISE',
      content: `Exercice: Établir un mini-plan d'action en 3 points pour votre ONG.`
    }
  ];

  const createdModules = [];
  for (let i = 0; i < modulesData.length; i++) {
    const m = modulesData[i];
    const created = await prisma.module.create({
      data: {
        formationId: formation.id,
        title: m.title,
        description: m.description,
        duration: m.duration,
        type: m.type,
        content: m.content,
        order: i
      }
    });
    createdModules.push(created);
  }
  console.log('🧩 Modules created:', createdModules.map(m => `${m.order}:${m.title}`).join(' | '));

  // Create a Quiz for the 3rd module
  const quizModule = createdModules.find(m => m.type === 'QUIZ');
  if (quizModule) {
    const quiz = await prisma.quiz.create({
      data: {
        moduleId: quizModule.id,
        passingScore: 70,
        timeLimit: 15,
        allowRetries: true,
        showCorrectAnswers: true,
        questions: {
          create: [
            {
              question: 'Quel est le composant principal d’un bon mot de passe ?',
              type: 'MULTIPLE_CHOICE',
              options: ['Simplicité', 'Longueur et diversité', 'Nom de l’ONG', 'Date d’anniversaire'],
              correctAnswer: JSON.stringify(1),
              explanation: 'Plus il est long et diversifié, mieux c’est.',
              points: 2,
              order: 0
            },
            {
              question: 'Le phishing est une tentative de tromperie pour voler des infos sensibles.',
              type: 'TRUE_FALSE',
              options: ['Vrai', 'Faux'],
              correctAnswer: JSON.stringify(0),
              points: 1,
              order: 1
            },
            {
              question: 'Citez une mesure simple pour réduire les risques.',
              type: 'OPEN_ENDED',
              options: [],
              correctAnswer: JSON.stringify('activer 2FA'),
              explanation: 'La 2FA est très efficace et facile à déployer.',
              points: 2,
              order: 2
            }
          ]
        }
      }
    });
    console.log('📝 Quiz created for module:', quizModule.title);
  }

  console.log('\n🎉 Example formation created successfully.');
  console.log('➡️  Open in admin: /admin/formations');
  console.log('➡️  Public view (if available): /formations');
}

main()
  .catch((e) => { console.error('❌ Error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

