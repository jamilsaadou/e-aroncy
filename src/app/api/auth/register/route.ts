import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/database';
import { 
  createAuthErrorResponse,
  validatePasswordStrength,
  logUserActivity,
  generateEmailVerificationToken
} from '../../../../lib/auth';
import bcrypt from 'bcryptjs';
import { sendActivationLinkEmail } from '../../../../lib/mailer';
import { getAppUrl } from '../../../../lib/url';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      organization,
      orgType,
      country,
      position,
      password,
      confirmPassword,
      newsletter = false
    } = body;

    // Validation des champs requis
    const requiredFields = {
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      password: 'Mot de passe'
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!body[field] || body[field].trim() === '') {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      return createAuthErrorResponse(
        `Champs requis manquants: ${missingFields.join(', ')}`, 
        400
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createAuthErrorResponse('Format d\'email invalide', 400);
    }

    // Validation des mots de passe
    if (password !== confirmPassword) {
      return createAuthErrorResponse('Les mots de passe ne correspondent pas', 400);
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return createAuthErrorResponse(
        `Mot de passe trop faible: ${passwordValidation.errors.join(', ')}`, 
        400
      );
    }

    // Les champs orgType, country, position, phone, newsletter sont optionnels et non stockés

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      await logUserActivity('unknown', 'register_failed', request, false, 
        { email, reason: 'email_already_exists' }, 'Email déjà utilisé');
      return createAuthErrorResponse('Un compte avec cet email existe déjà', 409);
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer le nouvel utilisateur
    const newUser = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        organization: organization ? organization.trim() : null,
        password: hashedPassword,
        status: 'PENDING', // En attente de vérification email
        emailVerified: false,
        role: 'STUDENT'
      }
    });

    // Logger l'inscription
    await logUserActivity(newUser.id, 'register', request, true, {
      organization: organization ? organization.trim() : undefined,
      orgType,
      country,
      newsletter
    });

    // Générer un lien d'activation et l'envoyer par email
    const token = generateEmailVerificationToken(newUser.id, newUser.email);
    const appUrl = getAppUrl(request as unknown as Request);
    const activateUrl = new URL('/api/auth/register/activate', appUrl);
    activateUrl.searchParams.set('token', token);
    activateUrl.searchParams.set('redirect', 'login');
    const link = activateUrl.toString();
    await sendActivationLinkEmail(newUser.email, link);

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès. Un email d\'activation vous a été envoyé.',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        organization: newUser.organization,
        status: newUser.status
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);

    // Gestion des erreurs de contrainte unique Prisma
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'champ';
      return createAuthErrorResponse(`${field} déjà utilisé`, 409);
    }

    return createAuthErrorResponse('Erreur serveur lors de l\'inscription', 500);
  }
}

// Méthode OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
