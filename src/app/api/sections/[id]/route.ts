import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/database';
import { requireRole, createAuthErrorResponse } from '../../../../lib/auth';
import { Role } from '@prisma/client';
import { z } from 'zod';

const SectionUpdate = z.object({
  title: z.string().min(2).optional(),
  order: z.number().optional()
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireRole([Role.ADMIN, Role.INSTRUCTOR])(request);
    if (auth.error || !auth.user) return createAuthErrorResponse(auth.error || 'Non autorisé', 403);
    const { id } = params;
    const sec = await prisma.section.findUnique({ where: { id }, include: { formation: true } });
    if (!sec) return NextResponse.json({ error: 'Section non trouvée' }, { status: 404 });
    if ((auth.user.role as Role) !== Role.ADMIN && sec.formation.instructorId !== auth.user.id)
      return createAuthErrorResponse('Non autorisé', 403);
    const body = await request.json();
    const data = SectionUpdate.parse(body);
    const updated = await prisma.section.update({ where: { id }, data: { ...data } });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Section PUT error:', error);
    return NextResponse.json({ error: 'Erreur mise à jour section' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireRole([Role.ADMIN, Role.INSTRUCTOR])(request);
    if (auth.error || !auth.user) return createAuthErrorResponse(auth.error || 'Non autorisé', 403);
    const { id } = params;
    const sec = await prisma.section.findUnique({ where: { id }, include: { formation: true } });
    if (!sec) return NextResponse.json({ error: 'Section non trouvée' }, { status: 404 });
    if ((auth.user.role as Role) !== Role.ADMIN && sec.formation.instructorId !== auth.user.id)
      return createAuthErrorResponse('Non autorisé', 403);

    // Détacher les modules de la section avant suppression
    await prisma.module.updateMany({ where: { sectionId: id }, data: { sectionId: null } });
    await prisma.section.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Section DELETE error:', error);
    return NextResponse.json({ error: 'Erreur suppression section' }, { status: 500 });
  }
}

export async function OPTIONS() { return new NextResponse(null, { status: 200 }); }

