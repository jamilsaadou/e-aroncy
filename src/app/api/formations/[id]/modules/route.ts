import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/database';
import { requireRole, createAuthErrorResponse } from '../../../../../lib/auth';
import { z } from 'zod';
import { UserRole } from '@prisma/client';

// Schema de validation pour les modules
const ModuleSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  duration: z.number().min(1), // en minutes
  type: z.enum(['VIDEO', 'TEXT', 'QUIZ', 'EXERCISE']),
  content: z.string(),
  order: z.number().default(0)
});

// GET /api/formations/[id]/modules - Lister les modules d'une formation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const modules = await prisma.module.findMany({
      where: { formationId: id },
      include: {
        quiz: {
          include: { questions: true }
        },
        resources: true
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(modules);

  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des modules' },
      { status: 500 }
    );
  }
}

// POST /api/formations/[id]/modules - Ajouter un module à une formation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification et les droits admin/instructor
    const authResult = await requireRole([UserRole.ADMIN, UserRole.INSTRUCTOR])(request);
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non autorisé', 403);
    }

    const { id } = params;
    const body = await request.json();

    // Valider les données
    const moduleData = ModuleSchema.parse(body);

    // Vérifier que la formation existe et appartient à l'utilisateur
    const formation = await prisma.formation.findFirst({
      where: { 
        id,
        instructorId: authResult.user.id 
      }
    });

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation non trouvée ou non autorisée' },
        { status: 404 }
      );
    }

    // Créer le module
    const newModule = await prisma.module.create({
      data: {
        ...moduleData,
        formationId: id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Module ajouté avec succès',
      module: newModule
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating module:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du module' },
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
