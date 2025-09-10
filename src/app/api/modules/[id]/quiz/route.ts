import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/database';
import { requireAuth, createAuthErrorResponse } from '../../../../../lib/auth';
import { z } from 'zod';

// Schema de validation pour les quiz
const QuizSchema = z.object({
  passingScore: z.number().min(0).max(100).default(70),
  timeLimit: z.number().min(1).optional(),
  allowRetries: z.boolean().default(true),
  showCorrectAnswers: z.boolean().default(true),
  questions: z.array(z.object({
    question: z.string().min(5),
    type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'OPEN_ENDED']),
    options: z.array(z.string()),
    correctAnswer: z.string(),
    explanation: z.string().optional(),
    points: z.number().min(1).default(1)
  }))
});

// POST /api/modules/[id]/quiz - Créer un quiz pour un module
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non autorisé', 403);
    }

    // Vérifier les permissions (admin ou instructor)
    if (authResult.user.role !== 'ADMIN' && authResult.user.role !== 'INSTRUCTOR') {
      return createAuthErrorResponse('Permissions insuffisantes', 403);
    }

    const { id: moduleId } = params;
    const body = await request.json();

    // Valider les données
    const quizData = QuizSchema.parse(body);

    // Vérifier que le module existe et appartient à l'utilisateur
    const module = await prisma.module.findFirst({
      where: { 
        id: moduleId,
        formation: {
          instructorId: authResult.user.id
        }
      }
    });

    if (!module) {
      return NextResponse.json(
        { error: 'Module non trouvé ou non autorisé' },
        { status: 404 }
      );
    }

    // Créer le quiz
    const quiz = await prisma.quiz.create({
      data: {
        moduleId,
        passingScore: quizData.passingScore,
        timeLimit: quizData.timeLimit,
        allowRetries: quizData.allowRetries,
        showCorrectAnswers: quizData.showCorrectAnswers,
        questions: {
          create: quizData.questions.map((question, index) => ({
            question: question.question,
            type: question.type,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            points: question.points,
            order: index
          }))
        }
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json({
      message: 'Quiz créé avec succès',
      quiz
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating quiz:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du quiz' },
      { status: 500 }
    );
  }
}

// GET /api/modules/[id]/quiz - Récupérer le quiz d'un module
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: moduleId } = params;

    const quiz = await prisma.quiz.findUnique({
      where: { moduleId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);

  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du quiz' },
      { status: 500 }
    );
  }
}

// PUT /api/modules/[id]/quiz - Mettre à jour un quiz
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non autorisé', 403);
    }

    // Vérifier les permissions
    if (authResult.user.role !== 'ADMIN' && authResult.user.role !== 'INSTRUCTOR') {
      return createAuthErrorResponse('Permissions insuffisantes', 403);
    }

    const { id: moduleId } = params;
    const body = await request.json();

    // Valider les données
    const quizData = QuizSchema.parse(body);

    // Vérifier que le quiz existe et appartient à l'utilisateur
    const existingQuiz = await prisma.quiz.findFirst({
      where: { 
        moduleId,
        module: {
          formation: {
            instructorId: authResult.user.id
          }
        }
      }
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { error: 'Quiz non trouvé ou non autorisé' },
        { status: 404 }
      );
    }

    // Supprimer les anciennes questions et créer les nouvelles
    await prisma.quizQuestion.deleteMany({
      where: { quizId: existingQuiz.id }
    });

    // Mettre à jour le quiz
    const updatedQuiz = await prisma.quiz.update({
      where: { id: existingQuiz.id },
      data: {
        passingScore: quizData.passingScore,
        timeLimit: quizData.timeLimit,
        allowRetries: quizData.allowRetries,
        showCorrectAnswers: quizData.showCorrectAnswers,
        questions: {
          create: quizData.questions.map((question, index) => ({
            question: question.question,
            type: question.type,
            options: question.options,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            points: question.points,
            order: index
          }))
        }
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json({
      message: 'Quiz mis à jour avec succès',
      quiz: updatedQuiz
    });

  } catch (error) {
    console.error('Error updating quiz:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du quiz' },
      { status: 500 }
    );
  }
}

// DELETE /api/modules/[id]/quiz - Supprimer un quiz
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non autorisé', 403);
    }

    // Vérifier les permissions
    if (authResult.user.role !== 'ADMIN' && authResult.user.role !== 'INSTRUCTOR') {
      return createAuthErrorResponse('Permissions insuffisantes', 403);
    }

    const { id: moduleId } = params;

    // Vérifier que le quiz existe et appartient à l'utilisateur
    const quiz = await prisma.quiz.findFirst({
      where: { 
        moduleId,
        module: {
          formation: {
            instructorId: authResult.user.id
          }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz non trouvé ou non autorisé' },
        { status: 404 }
      );
    }

    // Supprimer le quiz (les questions seront supprimées automatiquement grâce à onDelete: Cascade)
    await prisma.quiz.delete({
      where: { id: quiz.id }
    });

    return NextResponse.json({
      message: 'Quiz supprimé avec succès'
    });

  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du quiz' },
      { status: 500 }
    );
  }
}

// OPTIONS pour CORS
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
