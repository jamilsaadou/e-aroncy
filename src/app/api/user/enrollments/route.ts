import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../lib/database';
import { requireAuth } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error || 'Non autorisé' }, { status: 401 });
    }

    const userId = auth.user.id;
    const enrollments = await prisma.enrollment.findMany({
      where: { userId, status: 'ACTIVE' },
      orderBy: { enrolledAt: 'desc' },
      take: 5,
      select: {
        id: true,
        progress: true,
        formation: { select: { id: true, title: true } },
      },
    });

    const items = enrollments.map(e => ({
      id: e.id,
      formationId: e.formation.id,
      title: e.formation.title,
      progress: Math.round(e.progress),
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Erreur récupération inscriptions utilisateur:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

