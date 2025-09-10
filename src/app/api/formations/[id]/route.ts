import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/database';
import { requireAuth, requireRole, createAuthErrorResponse } from '../../../../lib/auth';
import { z } from 'zod';
import { UserRole } from '@prisma/client';

// GET /api/formations/[id] - Récupérer une formation spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const formation = await prisma.formation.findUnique({
      where: { id },
      include: {
        user: {
          select: { 
            firstName: true, 
            lastName: true, 
            email: true,
            organization: true 
          }
        },
        modules: {
          include: {
            quiz: {
              include: { questions: true }
            },
            resources: true
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { enrollments: true }
        }
      }
    });

    if (!formation) {
      return NextResponse.json(
        { error: 'Formation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(formation);

  } catch (error) {
    console.error('Error fetching formation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la formation' },
      { status: 500 }
    );
  }
}

// PUT /api/formations/[id] - Mettre à jour une formation
export async function PUT(
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
    const FormationSchema = z.object({
      title: z.string().min(3).max(200).optional(),
      description: z.string().min(10).optional(),
      shortDescription: z.string().min(5).max(300).optional(),
      category: z.enum(['CYBERSECURITE', 'SENSIBILISATION', 'TECHNIQUE', 'MANAGEMENT']).optional(),
      level: z.enum(['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE']).optional(),
      instructor: z.string().min(2).optional(),
      duration: z.string().optional(),
      price: z.number().optional(),
      maxEnrollments: z.number().optional(),
      language: z.string().optional(),
      tags: z.array(z.string()).optional(),
      prerequisites: z.array(z.string()).optional(),
      objectives: z.array(z.string()).optional(),
      status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
      featured: z.boolean().optional(),
      certificateEnabled: z.boolean().optional(),
      allowDiscussions: z.boolean().optional()
    });

    const formationData = FormationSchema.parse(body);

    // Vérifier que la formation existe et appartient à l'utilisateur
    const existingFormation = await prisma.formation.findFirst({
      where: { 
        id,
        instructorId: authResult.user.id 
      }
    });

    if (!existingFormation) {
      return NextResponse.json(
        { error: 'Formation non trouvée ou non autorisée' },
        { status: 404 }
      );
    }

    // Mettre à jour la formation
    const formation = await prisma.formation.update({
      where: { id },
      data: {
        ...formationData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Formation mise à jour avec succès',
      formation
    });

  } catch (error) {
    console.error('Error updating formation:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la formation' },
      { status: 500 }
    );
  }
}

// DELETE /api/formations/[id] - Supprimer une formation
export async function DELETE(
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

    // Vérifier que la formation existe et appartient à l'utilisateur
    const existingFormation = await prisma.formation.findFirst({
      where: { 
        id,
        instructorId: authResult.user.id 
      }
    });

    if (!existingFormation) {
      return NextResponse.json(
        { error: 'Formation non trouvée ou non autorisée' },
        { status: 404 }
      );
    }

    // Supprimer la formation (les relations seront supprimées en cascade)
    await prisma.formation.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Formation supprimée avec succès'
    });

  } catch (error) {
    console.error('Error deleting formation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la formation' },
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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
