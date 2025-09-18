import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/database';
import { requireRole, createAuthErrorResponse } from '../../../../../lib/auth';
import { z } from 'zod';
import { Role } from '@prisma/client';

// Schema de validation pour les modules
const ModuleSchema = z.object({
  title: z.preprocess((v) => (typeof v === 'string' ? v.trim() : v), z.string().min(1)),
  description: z.preprocess((v) => (typeof v === 'string' ? v.trim() : v), z.string().min(1)),
  duration: z.preprocess((v) => (typeof v === 'string' ? parseInt(v, 10) : v), z.number().min(1)),
  type: z.preprocess((v) => (typeof v === 'string' ? v.toUpperCase() : v), z.enum(['VIDEO', 'TEXT', 'QUIZ', 'EXERCISE'])),
  content: z.preprocess((v) => (v == null ? '' : v), z.string()),
  order: z.preprocess((v) => (typeof v === 'string' ? parseInt(v, 10) : v), z.number().default(0))
}).extend({
  sectionId: z.preprocess((v) => (v === '' ? undefined : v), z.string().optional().nullable()),
  section: z.preprocess((v) => (typeof v === 'string' ? v.trim() : v), z.string().optional().nullable()), // nom de section (créée si absente)
  prerequisites: z
    .array(z.object({
      requiresModuleId: z.string().min(1),
      requirement: z.enum(['COMPLETED', 'PASSED', 'MIN_SCORE']),
      minScore: z.number().min(0).max(100).optional(),
    }))
    .optional(),
  releasePolicy: z
    .object({
      releaseAt: z.string().datetime().optional(),
      delayMinutes: z.number().int().min(0).optional(),
    })
    .optional(),
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
        resources: true,
        section: true
      },
      orderBy: [
        { section: { order: 'asc' } },
        { order: 'asc' }
      ]
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
    const authResult = await requireRole([Role.ADMIN, Role.INSTRUCTOR])(request);
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Non autorisé', 403);
    }

    const { id } = params;
    const body = await request.json();

    // Valider les données
    const moduleData = ModuleSchema.parse(body);

    // Vérifier que la formation existe et permissions
    const formation = await prisma.formation.findUnique({ where: { id } });
    if (!formation) {
      return NextResponse.json(
        { error: 'Formation non trouvée' },
        { status: 404 }
      );
    }
    if ((authResult.user.role as Role) === Role.INSTRUCTOR && formation.instructorId !== authResult.user.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Section: si sectionId fourni on l'utilise, sinon on upsert par nom
    let sectionId: string | undefined = undefined;
    if (moduleData.sectionId) {
      sectionId = moduleData.sectionId || undefined;
    } else if (moduleData.section && moduleData.section.trim()) {
      const sec = await prisma.section.upsert({
        where: { formationId_title: { formationId: id, title: moduleData.section.trim() } },
        update: {},
        create: { formationId: id, title: moduleData.section.trim(), order: 0 }
      });
      sectionId = sec.id;
    }

    // Créer le module
    const newModule = await prisma.module.create({
      data: {
        title: moduleData.title,
        description: moduleData.description,
        duration: moduleData.duration,
        type: moduleData.type,
        content: moduleData.content,
        order: moduleData.order || 0,
        formationId: id,
        sectionId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Créer les prérequis si fournis
    if (Array.isArray(moduleData.prerequisites) && moduleData.prerequisites.length > 0) {
      await prisma.prerequisite.createMany({
        data: moduleData.prerequisites.map((p) => ({
          formationId: id,
          moduleId: newModule.id,
          requiresModuleId: p.requiresModuleId,
          requirement: p.requirement,
          minScore: p.minScore,
        }))
      });
    }

    // Créer la release policy si fournie
    if (moduleData.releasePolicy) {
      const releaseAt = moduleData.releasePolicy.releaseAt ? new Date(moduleData.releasePolicy.releaseAt) : undefined;
      const delayMinutes = moduleData.releasePolicy.delayMinutes;
      await prisma.releasePolicy.upsert({
        where: { moduleId: newModule.id },
        update: { releaseAt, delayMinutes },
        create: { moduleId: newModule.id, releaseAt, delayMinutes }
      });
    }

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
