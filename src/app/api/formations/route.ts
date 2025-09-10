import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/database';
import { requireRole, createAuthErrorResponse } from '../../../lib/auth';
import { z } from 'zod';
import { Role } from '@prisma/client';

// Schema de validation pour les formations
const FormationSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  shortDescription: z.string().min(5).max(300),
  category: z.enum(['CYBERSECURITE', 'SENSIBILISATION', 'TECHNIQUE', 'MANAGEMENT']),
  level: z.enum(['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE']),
  instructor: z.string().min(2),
  duration: z.string(),
  price: z.number().optional(),
  maxEnrollments: z.number().optional(),
  language: z.string().default('fr'),
  tags: z.array(z.string()),
  prerequisites: z.array(z.string()),
  objectives: z.array(z.string()),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  certificateEnabled: z.boolean().default(true),
  allowDiscussions: z.boolean().default(true)
});

// GET /api/formations - Lister les formations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (category) where.category = category;
    if (level) where.level = level;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [formations, total] = await Promise.all([
      prisma.formation.findMany({
        where,
        skip,
        take: limit,
        include: {
          instructorUser: {
            select: { firstName: true, lastName: true, email: true }
          },
          modules: {
            select: { id: true, title: true, duration: true }
          },
          _count: {
            select: { enrollments: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.formation.count({ where })
    ]);

    return NextResponse.json({
      formations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching formations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des formations' },
      { status: 500 }
    );
  }
}

// POST /api/formations - Créer une formation
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification et les droits admin/instructor
    const authResult = await requireRole([Role.ADMIN, Role.INSTRUCTOR])(request);
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non autorisé', 403);
    }

    const body = await request.json();

    // Valider les données
    const formationData = FormationSchema.parse(body);

    // Créer la formation
    const formation = await prisma.formation.create({
      data: {
        ...formationData,
        price: formationData.price || 0,
        instructorId: authResult.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'Formation créée avec succès',
      formation
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating formation:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la formation' },
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
