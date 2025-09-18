import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/database';
import { requireRole, createAuthErrorResponse } from '../../../lib/auth';
import { z } from 'zod';
import { Role } from '@prisma/client';

// Schema de validation pour les formations (robuste aux valeurs vides/chaînes)
const FormationSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  shortDescription: z.preprocess((v) => {
    let s = typeof v === 'string' ? v : String(v ?? '');
    s = s.trim();
    if (s.length > 300) s = s.slice(0, 300);
    return s;
  }, z.string().min(5).max(300)),
  // Tolère la casse et espaces
  category: z.preprocess((v) => typeof v === 'string' ? v.trim().toUpperCase() : v,
    z.enum(['CYBERSECURITE', 'SENSIBILISATION', 'TECHNIQUE', 'MANAGEMENT'])
  ),
  // Tolère vide et casse
  level: z.preprocess((v) => {
      if (typeof v !== 'string') return v;
      const t = v.trim();
      if (!t) return 'DEBUTANT';
      return t.toUpperCase();
    },
    z.enum(['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE']).default('DEBUTANT')
  ),
  instructor: z.string().min(2),
  // Toujours stocké en chaîne en BDD (schéma Prisma)
  duration: z.preprocess((v) => (v == null ? '' : String(v)), z.string().min(1)),
  // Autoriser nombre ou chaîne numérique
  price: z.preprocess((v) => (typeof v === 'string' ? parseFloat(v) : v), z.number().optional()).optional(),
  maxEnrollments: z.preprocess((v) => (typeof v === 'string' ? parseInt(v as string, 10) : v), z.number().optional()).optional(),
  language: z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? 'fr' : v), z.string().default('fr')),
  // Autoriser chaîne séparée par virgules
  tags: z.preprocess((v) => {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  }, z.array(z.string()).default([])),
  prerequisites: z.preprocess((v) => {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  }, z.array(z.string()).default([])),
  objectives: z.preprocess((v) => {
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  }, z.array(z.string()).default([])),
  status: z.preprocess((v) => typeof v === 'string' ? v.trim().toUpperCase() : v,
    z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT')
  ),
  featured: z.preprocess((v) => typeof v === 'string' ? v === 'true' : v, z.boolean().default(false)),
  certificateEnabled: z.preprocess((v) => typeof v === 'string' ? v === 'true' : v, z.boolean().default(true)),
  allowDiscussions: z.preprocess((v) => typeof v === 'string' ? v === 'true' : v, z.boolean().default(true))
})
.extend({
  // Champs additionnels facultatifs
  metaTitle: z.string().max(120).optional(),
  metaDescription: z.string().max(300).optional(),
  featuredImage: z.string().optional(),
  // Sections (optionnel): créées à vide si fournies
  sections: z
    .array(
      z.object({
        title: z.preprocess((v) => (typeof v === 'string' ? v.trim() : v), z.string().min(1)),
        order: z.preprocess((v) => (typeof v === 'string' ? parseInt(v, 10) : v), z.number().int().min(0).optional())
      })
    )
    .optional()
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

    if (category) where.category = category.toUpperCase();
    if (level) where.level = level.toUpperCase();
    if (status) where.status = status.toUpperCase();
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
    
    // Debug: Log des données reçues
    console.log('Données reçues:', JSON.stringify(body, null, 2));
    console.log('Category:', body.category, 'Type:', typeof body.category);
    console.log('Level:', body.level, 'Type:', typeof body.level);

    // Valider les données
    const formationData = FormationSchema.parse(body);
    const { sections: sectionsInput, ...formationCore } = formationData as any;

    // Créer la formation
    const formation = await prisma.formation.create({
      data: {
        ...formationCore,
        price: formationCore.price || 0,
        instructorId: authResult.user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Créer les sections vides si fournies
    if (Array.isArray(sectionsInput) && sectionsInput.length > 0) {
      const toCreate = sectionsInput
        .map((s, idx) => ({
          formationId: formation.id,
          title: s.title,
          order: typeof s.order === 'number' ? s.order : idx,
        }));
      try {
        // createMany pour efficacité; unique (formationId, title) empêche doublons
        await prisma.section.createMany({ data: toCreate, skipDuplicates: true });
      } catch (e) {
        console.warn('Creation des sections: certains éléments n\'ont pas pu être créés', e);
      }
    }

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
