import { NextRequest, NextResponse } from 'next/server';
import { requireRole, createAuthErrorResponse, getClientIP, getUserAgent } from '../../../../../lib/auth';
import { sendAdminTempPasswordEmail, sendPasswordResetLinkEmail } from '../../../../../lib/mailer';
import { getAppUrl } from '../../../../../lib/url';
import { generatePasswordResetToken } from '../../../../../lib/auth';
import prisma from '../../../../../lib/database';

// GET - Récupérer les détails d'un utilisateur spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireRole(['ADMIN'])(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Accès refusé', 403);
    }

    const userId = params.id;

    // Récupérer l'utilisateur avec toutes ses relations
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sessions: {
          where: { isActive: true },
          orderBy: { lastActivity: 'desc' },
          take: 10
        },
        activities: {
          orderBy: { timestamp: 'desc' },
          take: 20
        }
      }
    });

    if (!user) {
      return createAuthErrorResponse('Utilisateur non trouvé', 404);
    }

    // Calculer des statistiques
    const stats = {
      totalSessions: await prisma.userSession.count({
        where: { userId }
      }),
      activeSessions: user.sessions.length,
      totalActivities: await prisma.userActivity.count({
        where: { userId }
      }),
      accountAge: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)), // jours
      lastActivityDays: user.lastActivity 
        ? Math.floor((Date.now() - new Date(user.lastActivity).getTime()) / (1000 * 60 * 60 * 24))
        : null
    };

    // Logger la consultation
    await prisma.userActivity.create({
      data: {
        userId: authResult.user.id,
        action: 'user_viewed',
        details: JSON.stringify({
          viewedUserId: userId,
          viewedUserEmail: user.email
        }),
        ipAddress: getClientIP(request),
        userAgent: getUserAgent(request),
        success: true
      }
    });

    return NextResponse.json({
      success: true,
      user,
      stats
    });

  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    return createAuthErrorResponse('Erreur serveur', 500);
  }
}

// PUT - Mettre à jour un utilisateur
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireRole(['ADMIN'])(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Accès refusé', 403);
    }

    const userId = params.id;
    const body = await request.json();
    
    const {
      firstName,
      lastName,
      organization,
      role,
      status,
      emailVerified,
      twoFactorEnabled,
      resetPassword
    } = body;

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return createAuthErrorResponse('Utilisateur non trouvé', 404);
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (organization !== undefined) updateData.organization = organization;
    if (role !== undefined) updateData.role = role.toUpperCase();
    if (status !== undefined) updateData.status = status.toUpperCase();
    if (emailVerified !== undefined) updateData.emailVerified = emailVerified;
    if (twoFactorEnabled !== undefined) updateData.twoFactorEnabled = twoFactorEnabled;

    // Reset du mot de passe si demandé
    if (resetPassword) {
      const bcrypt = require('bcryptjs');
      const notify = !!resetPassword.notify;

      if (resetPassword.newPassword) {
        updateData.password = await bcrypt.hash(resetPassword.newPassword, 12);
        updateData.failedLoginAttempts = 0;
        updateData.lockUntil = null;
        // Optionnel: notifier l'utilisateur du nouveau mot de passe
        if (notify) {
          try {
            await sendAdminTempPasswordEmail(existingUser.email, resetPassword.newPassword);
          } catch (e) {
            console.error('Erreur envoi email mot de passe défini par admin:', e);
          }
        }
      } else if (resetPassword.generateLink) {
        // Générer un lien sécurisé de réinitialisation
        const token = generatePasswordResetToken(existingUser.id, existingUser.email);
        const appUrl = getAppUrl(request as unknown as Request);
        const url = new URL('/reset-password', appUrl);
        url.searchParams.set('token', token);
        const link = url.toString();
        try {
          await sendPasswordResetLinkEmail(existingUser.email, link);
        } catch (e) {
          console.error('Erreur envoi email lien de réinitialisation:', e);
        }
      }
    }

    // Débloquer le compte si demandé
    if (body.unlockAccount) {
      updateData.failedLoginAttempts = 0;
      updateData.lockUntil = null;
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        organization: true,
        role: true,
        status: true,
        emailVerified: true,
        twoFactorEnabled: true,
        lastLogin: true,
        lastActivity: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Logger la modification
    await prisma.userActivity.create({
      data: {
        userId: authResult.user.id,
        action: 'user_updated',
        details: JSON.stringify({
          updatedUserId: userId,
          updatedUserEmail: updatedUser.email,
          changes: Object.keys(updateData)
        }),
        ipAddress: getClientIP(request),
        userAgent: getUserAgent(request),
        success: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      user: updatedUser
    });

  } catch (error) {
    console.error('Erreur mise à jour utilisateur:', error);
    return createAuthErrorResponse('Erreur lors de la mise à jour', 500);
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireRole(['ADMIN'])(request);
    
    if (authResult.error || !authResult.user) {
      return createAuthErrorResponse(authResult.error || 'Accès refusé', 403);
    }

    const userId = params.id;

    // Vérifier que l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true }
    });

    if (!existingUser) {
      return createAuthErrorResponse('Utilisateur non trouvé', 404);
    }

    // Empêcher la suppression de son propre compte
    if (userId === authResult.user.id) {
      return createAuthErrorResponse('Vous ne pouvez pas supprimer votre propre compte', 400);
    }

    // Supprimer l'utilisateur (cascade automatique pour les relations)
    await prisma.user.delete({
      where: { id: userId }
    });

    // Logger la suppression
    await prisma.userActivity.create({
      data: {
        userId: authResult.user.id,
        action: 'user_deleted',
        details: JSON.stringify({
          deletedUserId: userId,
          deletedUserEmail: existingUser.email,
          deletedUserRole: existingUser.role
        }),
        ipAddress: getClientIP(request),
        userAgent: getUserAgent(request),
        success: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    return createAuthErrorResponse('Erreur lors de la suppression', 500);
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

// Générateur local d'un mot de passe fort
function generateStrongPassword(length: number = 12): string {
  const lowers = 'abcdefghijklmnopqrstuvwxyz';
  const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{};:,.?';
  const all = lowers + uppers + digits + symbols;

  function pick(str: string) { return str[Math.floor(Math.random() * str.length)]; }

  // Garantir au moins un de chaque
  const must = [pick(lowers), pick(uppers), pick(digits), pick(symbols)];
  const restLen = Math.max(length - must.length, 0);
  const rest = Array.from({ length: restLen }, () => pick(all));
  const chars = [...must, ...rest];
  // Shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}
