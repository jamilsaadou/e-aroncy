import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/database';
import { requireAuth, createAuthErrorResponse } from '../../../../lib/auth';
import { Role } from '@prisma/client';
import { z } from 'zod';

const ModuleUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  duration: z.number().min(1).optional(),
  type: z.enum(['VIDEO', 'TEXT', 'QUIZ', 'EXERCISE']).optional(),
  content: z.string().optional(),
  order: z.number().min(0).optional(),
  sectionId: z.string().optional().nullable(),
  section: z.string().optional().nullable()
});

// GET /api/modules/[id] - Récupérer un module
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        quiz: { include: { questions: true } },
        resources: true,
        formation: {
          select: { id: true, instructorId: true }
        }
      }
    });

    if (!module) {
      return NextResponse.json({ error: 'Module non trouvé' }, { status: 404 });
    }

    return NextResponse.json(module);
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du module' }, { status: 500 });
  }
}

// PUT /api/modules/[id] - Mettre à jour un module
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (auth.error || !auth.user) {
      return createAuthErrorResponse(auth.error || 'Non autorisé', 403);
    }

    const { id } = await params;
    const body = await request.json();
    const data = ModuleUpdateSchema.parse(body);

    // Vérifier module + permissions
    const module = await prisma.module.findUnique({
      where: { id },
      include: { formation: true }
    });
    if (!module) {
      return NextResponse.json({ error: 'Module non trouvé' }, { status: 404 });
    }
    if ((auth.user.role as Role) !== Role.ADMIN && module.formation.instructorId !== auth.user.id) {
      return createAuthErrorResponse('Non autorisé', 403);
    }

    // Gérer la section si fournie
    let sectionId: string | undefined = undefined;
    if (data.sectionId !== undefined) {
      sectionId = data.sectionId || undefined;
    } else if (data.section && data.section.trim()) {
      const sec = await prisma.section.upsert({
        where: { formationId_title: { formationId: module.formationId, title: data.section.trim() } },
        update: {},
        create: { formationId: module.formationId, title: data.section.trim(), order: 0 }
      });
      sectionId = sec.id;
    }

    const { section, sectionId: _, ...rest } = data as any;
    const updated = await prisma.module.update({
      where: { id },
      data: { ...rest, sectionId, updatedAt: new Date() },
      include: { quiz: true, resources: true }
    });

    return NextResponse.json({ message: 'Module mis à jour', module: updated });
  } catch (error) {
    console.error('Error updating module:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du module' }, { status: 500 });
  }
}

// DELETE /api/modules/[id] - Supprimer un module
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (auth.error || !auth.user) {
      return createAuthErrorResponse(auth.error || 'Non autorisé', 403);
    }

    const { id } = await params;
    const module = await prisma.module.findUnique({
      where: { id },
      include: { formation: true }
    });
    if (!module) {
      return NextResponse.json({ error: 'Module non trouvé' }, { status: 404 });
    }
    if ((auth.user.role as Role) !== Role.ADMIN && module.formation.instructorId !== auth.user.id) {
      return createAuthErrorResponse('Non autorisé', 403);
    }

    await prisma.module.delete({ where: { id } });
    return NextResponse.json({ message: 'Module supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression du module' }, { status: 500 });
  }
}

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
