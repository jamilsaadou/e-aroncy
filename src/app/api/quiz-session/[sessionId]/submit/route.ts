import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, logUserActivity } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/database';
import { recalculateProgressFromItems, updateUserProgress } from '../../../../../lib/progress-utils';

type SubmitBody = {
  answers: Record<string, any>;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error || 'Non authentifié' }, { status: 401 });
    }

    const { sessionId } = await params;
    const body = (await request.json()) as SubmitBody;
    const answers = body?.answers || {};

    // Charger la session + quiz + questions + module
    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        quiz: {
          include: {
            questions: { orderBy: { order: 'asc' } },
            module: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session de quiz introuvable' }, { status: 404 });
    }
    if (session.userId !== auth.user.id) {
      return NextResponse.json({ error: 'Accès non autorisé à cette session' }, { status: 403 });
    }
    if (session.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Cette session est déjà clôturée' }, { status: 400 });
    }

    // Gestion du time-limit
    if (session.timeLimit) {
      const elapsed = (Date.now() - session.startedAt.getTime()) / 1000 / 60; // minutes
      if (elapsed > session.timeLimit) {
        await prisma.quizSession.update({ where: { id: session.id }, data: { status: 'TIMEOUT', completedAt: new Date() } });
        return NextResponse.json({ error: 'Temps écoulé' }, { status: 400 });
      }
    }

    const quiz = session.quiz;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);

    // Nettoyer d’éventuelles anciennes réponses
    await prisma.quizAnswer.deleteMany({ where: { sessionId: session.id } });

    let earnedPoints = 0;
    const results: Array<{
      questionId: string;
      question: string;
      userAnswer: any;
      correctAnswer?: any;
      isCorrect: boolean;
      points: number;
      explanation?: string;
    }> = [];

    for (const q of quiz.questions) {
      const userAnswer = answers[q.id];
      const type = q.type;
      const points = q.points || 1;

      let correctParsed: any = undefined;
      try {
        // correctAnswer stocké en string JSON ou string numérique
        correctParsed = JSON.parse(q.correctAnswer);
      } catch {
        // fallback: nombre ou chaine
        const n = Number(q.correctAnswer);
        correctParsed = isNaN(n) ? q.correctAnswer : n;
      }

      let isCorrect = false;
      if (type === 'MULTIPLE_CHOICE' || type === 'TRUE_FALSE') {
        const uaNum = typeof userAnswer === 'string' ? parseInt(userAnswer) : userAnswer;
        const caNum = typeof correctParsed === 'string' ? parseInt(correctParsed) : correctParsed;
        isCorrect = uaNum === caNum;
      } else if (type === 'OPEN_ENDED') {
        // Évaluation simple: égalité insensible à la casse si une bonne réponse est fournie
        if (typeof correctParsed === 'string' && typeof userAnswer === 'string') {
          isCorrect = userAnswer.trim().toLowerCase() === correctParsed.trim().toLowerCase();
        } else {
          isCorrect = false;
        }
      }

      if (isCorrect) earnedPoints += points;

      results.push({
        questionId: q.id,
        question: q.question,
        userAnswer,
        correctAnswer: quiz.showCorrectAnswers ? correctParsed : undefined,
        isCorrect,
        points,
        explanation: q.explanation || undefined,
      });

      // Persister la réponse
      await prisma.quizAnswer.create({
        data: {
          sessionId: session.id,
          questionId: q.id,
          userId: auth.user.id,
          answer: JSON.stringify(userAnswer),
          isCorrect,
          points: isCorrect ? points : 0,
        },
      });
    }

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = score >= (quiz.passingScore || 70);

    // Clore la session
    const closedSession = await prisma.quizSession.update({
      where: { id: session.id },
      data: {
        completedAt: new Date(),
        status: 'COMPLETED',
        score,
        passed,
      },
    });

    await logUserActivity(auth.user.id, 'quiz_submitted', request, true, {
      sessionId: session.id,
      quizId: quiz.id,
      moduleId: quiz.moduleId,
      passed,
      score,
    });

    // Enregistrer une tentative unifiée
    const previousAttempts = await prisma.attempt.count({ where: { userId: auth.user.id, moduleId: quiz.moduleId } });
    await prisma.attempt.create({
      data: {
        userId: auth.user.id,
        moduleId: quiz.moduleId,
        quizSessionId: closedSession.id,
        type: 'QUIZ',
        score,
        maxScore: 100,
        startedAt: session.startedAt,
        completedAt: new Date(),
        status: passed ? 'PASSED' : 'FAILED',
        attemptNumber: previousAttempts + 1,
      }
    });

    // Mettre à jour l'ItemProgress pour le module
    await prisma.itemProgress.upsert({
      where: { userId_moduleId: { userId: auth.user.id, moduleId: quiz.moduleId } },
      update: {
        status: passed ? 'PASSED' : 'FAILED',
        score,
        passed,
        completedAt: new Date(),
        lastEventAt: new Date(),
      },
      create: {
        userId: auth.user.id,
        formationId: quiz.module.formationId,
        moduleId: quiz.moduleId,
        status: passed ? 'PASSED' : 'FAILED',
        score,
        passed,
        startedAt: session.startedAt,
        completedAt: new Date(),
        lastEventAt: new Date(),
      }
    });

    // Recalculer la progression globale (nouveau moteur)
    await recalculateProgressFromItems(auth.user.id, quiz.module.formationId);

    return NextResponse.json({
      score,
      passed,
      earnedPoints,
      totalPoints,
      results,
      certificate: false, // client peut recharger l’état inscription pour voir si certificat créé
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    return NextResponse.json({ error: 'Erreur lors de la soumission du quiz' }, { status: 500 });
  }
}

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
