import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/database';
import { requireRole, createAuthErrorResponse } from '../../../../../lib/auth';
import { Role } from '@prisma/client';
import { z } from 'zod';

// GET /api/formations/[id]/sections - Lister les sections de la formation
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const sections = await prisma.section.findMany({
      where: { formationId: id },
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Sections GET error:', error);
    return NextResponse.json({ error: 'Erreur chargement sections' }, { status: 500 });
  }
}

const CreateSection = z.object({ title: z.string().trim().min(1), order: z.number().optional() });

// POST /api/formations/[id]/sections - Créer une section
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireRole([Role.ADMIN, Role.INSTRUCTOR])(request);
    if (auth.error || !auth.user) return createAuthErrorResponse(auth.error || 'Non autorisé', 403);

    const { id } = params;
    const body = await request.json();
    const data = CreateSection.parse(body);

    // Vérifier formation et permissions
    const formation = await prisma.formation.findUnique({ where: { id } });
    if (!formation) return NextResponse.json({ error: 'Formation non trouvée' }, { status: 404 });
    if ((auth.user.role as Role) !== Role.ADMIN && formation.instructorId !== auth.user.id)
      return createAuthErrorResponse('Non autorisé', 403);

    // Déterminer l'ordre suivant
    let order = data.order;
    if (order == null) {
      const last = await prisma.section.findFirst({
        where: { formationId: id },
        orderBy: { order: 'desc' }
      });
      order = last ? (last.order ?? 0) + 1 : 0;
    }

    const created = await prisma.section.create({
      data: { formationId: id, title: data.title.trim(), order }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Sections POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur création section' }, { status: 500 });
  }
}

export async function OPTIONS() { return new NextResponse(null, { status: 200 }); }

