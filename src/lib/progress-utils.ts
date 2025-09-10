import { prisma } from './database';

// Fonction pour mettre à jour le progrès d'un utilisateur
export async function updateUserProgress(userId: string, formationId: string): Promise<void> {
  try {
    // Récupérer tous les modules de la formation
    const modules = await prisma.module.findMany({
      where: { formationId },
      include: { quiz: true }
    });

    let completedModules = 0;

    for (const module of modules) {
      if (module.quiz) {
        // Vérifier si l'utilisateur a réussi le quiz
        const passedSession = await prisma.quizSession.findFirst({
          where: {
            userId,
            quizId: module.quiz.id,
            passed: true
          }
        });
        if (passedSession) completedModules++;
      } else {
        // Pour les modules sans quiz, on considère qu'ils sont terminés
        // (vous pouvez ajouter une logique plus sophistiquée ici)
        completedModules++;
      }
    }

    const progressPercentage = modules.length > 0 ? (completedModules / modules.length) * 100 : 0;

    // Mettre à jour ou créer le progrès
    await prisma.userProgress.upsert({
      where: {
        userId_formationId: {
          userId,
          formationId
        }
      },
      update: {
        completedModules,
        progressPercentage,
        updatedAt: new Date()
      },
      create: {
        userId,
        formationId,
        completedModules,
        progressPercentage,
        startedAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Si la formation est terminée, générer un certificat si nécessaire
    if (progressPercentage === 100) {
      await generateCertificate(userId, formationId);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du progrès:', error);
  }
}

// Fonction pour générer un certificat
export async function generateCertificate(userId: string, formationId: string): Promise<void> {
  try {
    // Vérifier si un certificat n'existe pas déjà
    const existingCertificate = await prisma.certificate.findFirst({
      where: { userId, formationId }
    });

    if (existingCertificate) {
      return;
    }

    // Vérifier que la formation permet les certificats
    const formation = await prisma.formation.findUnique({
      where: { id: formationId },
      select: { certificateEnabled: true }
    });

    if (!formation?.certificateEnabled) {
      return;
    }

    // Générer un numéro de certificat unique
    const certificateNumber = `EACP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    await prisma.certificate.create({
      data: {
        userId,
        formationId,
        certificateNumber,
        issuedAt: new Date(),
        isValid: true
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du certificat:', error);
  }
}
