import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, logUserActivity } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.user) {
      return NextResponse.json({ error: authResult.error || 'Non authentifié' }, { status: 401 });
    }

    const { id: quizId } = await params;
    const userId = authResult.user.id;

    // Récupérer le quiz avec ses questions et le module associé
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { 
        questions: true,
        module: { 
          include: { formation: true } 
        }
      }
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz non trouvé' }, { status: 404 });
    }

    // Vérifier si l'utilisateur est inscrit à la formation
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        formationId: quiz.module.formationId,
        status: 'ACTIVE'
      }
    });

    if (!enrollment) {
      return NextResponse.json({ 
        error: 'Vous devez être inscrit à cette formation pour accéder au quiz' 
      }, { status: 403 });
    }

    // Vérifier s'il y a déjà une session en cours
    const existingSession = await prisma.quizSession.findFirst({
      where: {
        userId,
        quizId,
        status: 'IN_PROGRESS'
      }
    });

    if (existingSession) {
      // Vérifier si la session n'a pas expiré
      if (quiz.timeLimit) {
        const timeElapsed = (new Date().getTime() - existingSession.startedAt.getTime()) / (1000 * 60);
        if (timeElapsed > quiz.timeLimit) {
          // Marquer la session comme expirée
          await prisma.quizSession.update({
            where: { id: existingSession.id },
            data: { 
              status: 'TIMEOUT',
              completedAt: new Date()
            }
          });
        } else {
          // Retourner la session existante
          const questionsForUser = quiz.questions.map(q => ({
            id: q.id,
            question: q.question,
            type: q.type,
            options: q.options,
            points: q.points
          }));

          return NextResponse.json({
            sessionId: existingSession.id,
            quiz: {
              id: quiz.id,
              passingScore: quiz.passingScore,
              timeLimit: quiz.timeLimit,
              allowRetries: quiz.allowRetries
            },
            questions: questionsForUser,
            startedAt: existingSession.startedAt,
            timeRemaining: quiz.timeLimit ? Math.max(0, quiz.timeLimit - timeElapsed) : null
          });
        }
      }
    }

    // Créer une nouvelle session de quiz
    const quizSession = await prisma.quizSession.create({
      data: {
        userId,
        quizId,
        startedAt: new Date(),
        timeLimit: quiz.timeLimit,
        status: 'IN_PROGRESS'
      }
    });

    // Logger le démarrage du quiz
    await logUserActivity(userId, 'quiz_started', request, true, {
      quizId,
      sessionId: quizSession.id,
      formationId: quiz.module.formationId
    });

    // Retourner les questions (sans les bonnes réponses)
    const questionsForUser = quiz.questions.map(q => ({
      id: q.id,
      question: q.question,
      type: q.type,
      options: q.options,
      points: q.points
    }));

    return NextResponse.json({
      sessionId: quizSession.id,
      quiz: {
        id: quiz.id,
        passingScore: quiz.passingScore,
        timeLimit: quiz.timeLimit,
        allowRetries: quiz.allowRetries
      },
      questions: questionsForUser,
      startedAt: quizSession.startedAt
    });

  } catch (error) {
    console.error('Quiz start error:', error);
    return NextResponse.json({ 
      error: 'Erreur lors du démarrage du quiz' 
    }, { status: 500 });
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
