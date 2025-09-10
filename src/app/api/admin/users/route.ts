import { NextRequest, NextResponse } from 'next/server';
import { requireRole, createAuthErrorResponse } from '../../../../lib/auth';
import prisma from '../../../../lib/database';

// GET - Récupérer la liste des utilisateurs
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireRole(['ADMIN'])(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Accès refusé', 403);
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const country = searchParams.get('country') || '';
    const orgType = searchParams.get('orgType') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Construire les filtres
    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { organization: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Note: Les champs country et orgType ne sont pas dans le schéma actuel
    // Ils peuvent être ajoutés plus tard si nécessaire

    if (status) {
      where.status = status.toUpperCase();
    }

    // Récupérer les utilisateurs avec pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          organization: true,
          role: true,
          status: true,
          lastLogin: true,
          lastActivity: true,
          emailVerified: true,
          twoFactorEnabled: true,
          createdAt: true,
          failedLoginAttempts: true,
          lockUntil: true,
          _count: {
            select: {
              sessions: { where: { isActive: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    // Statistiques globales
    const stats = await prisma.user.groupBy({
      by: ['status', 'role'],
      _count: { id: true }
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats
    });

  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    return createAuthErrorResponse('Erreur serveur', 500);
  }
}

// POST - Créer un nouvel utilisateur
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireRole(['ADMIN'])(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Accès refusé', 403);
    }

    const body = await request.json();
    const {
      email,
      firstName,
      lastName,
      organization,
      orgType,
      country,
      position,
      role = 'STUDENT',
      password,
      sendWelcomeEmail = true
    } = body;

    // Validation des données
    if (!email || !firstName || !lastName || !organization || !password) {
      return createAuthErrorResponse('Données manquantes', 400);
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return createAuthErrorResponse('Un utilisateur avec cet email existe déjà', 409);
    }

    // Hacher le mot de passe
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        organization,
        role: role.toUpperCase(),
        status: 'ACTIVE',
        emailVerified: false
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        organization: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    // Logger la création avec les champs requis
    const { getClientIP, getUserAgent } = require('../../../../lib/auth');
    
    await prisma.userActivity.create({
      data: {
        userId: authResult.user.id,
        action: 'user_created',
        details: JSON.stringify({
          createdUserId: newUser.id,
          createdUserEmail: newUser.email,
          role: newUser.role
        }),
        ipAddress: getClientIP(request),
        userAgent: getUserAgent(request),
        success: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur créé avec succès',
      user: newUser
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    return createAuthErrorResponse('Erreur lors de la création', 500);
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
