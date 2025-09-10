import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import prisma from './database';
import { User, Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'e-aroncy-jwt-secret-key';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 heures

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  organization: string;
  twoFactorEnabled: boolean;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  sessionId?: string;
  iat?: number;
  exp?: number;
}

// Générer un token JWT
export function generateToken(user: User, sessionId?: string): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    sessionId
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'e-aroncy',
    audience: 'e-aroncy-users'
  });
}

// Vérifier un token JWT
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'e-aroncy',
      audience: 'e-aroncy-users'
    }) as JWTPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Extraire le token de la requête
export function extractToken(request: NextRequest): string | null {
  // Vérifier l'en-tête Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    let token = authHeader;
    
    // Nettoyer le token Bearer prefix
    if (token.startsWith('Bearer ')) {
      token = token.substring(7);
    }
    
    // Nettoyer les espaces et caractères de contrôle
    token = token.trim().replace(/[\r\n]/g, '');
    
    // Vérifier que c'est un JWT valide (3 parties séparées par des points)
    if (token && token.split('.').length === 3) {
      return token;
    }
  }

  // Vérifier les cookies
  const tokenCookie = request.cookies.get('auth-token');
  if (tokenCookie) {
    let token = tokenCookie.value.trim().replace(/[\r\n]/g, '');
    if (token && token.split('.').length === 3) {
      return token;
    }
  }

  // Vérifier localStorage via header personnalisé (pour les requêtes client-side)
  const customToken = request.headers.get('x-auth-token');
  if (customToken) {
    let token = customToken.trim().replace(/[\r\n]/g, '');
    if (token && token.split('.').length === 3) {
      return token;
    }
  }

  return null;
}

// Obtenir l'adresse IP du client
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// Obtenir le User-Agent
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}

// Logger une activité utilisateur
export async function logUserActivity(
  userId: string,
  action: string,
  request: NextRequest,
  success: boolean = true,
  details?: any,
  errorMessage?: string
): Promise<void> {
  try {
    // Pour les cas où l'utilisateur n'existe pas (comme les tentatives de connexion échouées),
    // on vérifie d'abord si l'utilisateur existe
    if (userId !== 'unknown') {
      const userExists = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true }
      });
      
      if (!userExists) {
        // Si l'utilisateur n'existe pas, on log avec userId = null
        await prisma.userActivity.create({
          data: {
            action,
            details: JSON.stringify({ ...details, originalUserId: userId }),
            ipAddress: getClientIP(request),
            userAgent: getUserAgent(request),
            success,
            errorMessage: errorMessage || undefined,
            timestamp: new Date()
          }
        });
        return;
      }
    }

    // Si userId est 'unknown' ou l'utilisateur existe, on procède normalement
    const activityData: any = {
      action,
      details: details ? JSON.stringify(details) : null,
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
      success,
      errorMessage: errorMessage || undefined,
      timestamp: new Date()
    };

    if (userId !== 'unknown') {
      activityData.userId = userId;
    }

    await prisma.userActivity.create({
      data: activityData
    });
  } catch (error) {
    console.error('Failed to log user activity:', error);
  }
}

// Vérifier si le compte est verrouillé
export function isAccountLocked(user: User): boolean {
  return !!(user.lockUntil && user.lockUntil > new Date());
}

// Incrémenter les tentatives de connexion
export async function incrementLoginAttempts(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  // Si on a un verrou et qu'il a expiré, on reset
  if (user.lockUntil && user.lockUntil < new Date()) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 1,
        lockUntil: null
      }
    });
    return;
  }

  const newAttempts = user.failedLoginAttempts + 1;
  const updateData: any = { failedLoginAttempts: newAttempts };

  // Verrouiller après 5 tentatives pour 2 heures
  if (newAttempts >= 5 && !isAccountLocked(user)) {
    updateData.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2h
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData
  });
}

// Reset des tentatives de connexion
export async function resetLoginAttempts(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: {
      failedLoginAttempts: 0,
      lockUntil: null
    }
  });
}

// Hacher un mot de passe
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Comparer un mot de passe
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Middleware d'authentification pour les API routes
export async function requireAuth(request: NextRequest): Promise<{
  user: AuthUser | null;
  error: string | null;
}> {
  try {
    const token = extractToken(request);
    if (!token) {
      return { user: null, error: 'Token manquant' };
    }

    const payload = verifyToken(token);
    if (!payload) {
      return { user: null, error: 'Token invalide' };
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) {
      return { user: null, error: 'Utilisateur non trouvé' };
    }

    if (user.status !== 'ACTIVE') {
      return { user: null, error: 'Compte inactif' };
    }

    if (isAccountLocked(user)) {
      return { user: null, error: 'Compte verrouillé' };
    }

    // Vérifier timeout d'inactivité (2 heures)
    const lastActivity = new Date(user.lastActivity);
    const now = new Date();
    const inactiveTime = (now.getTime() - lastActivity.getTime()) / 1000 / 60; // minutes

    if (inactiveTime > 120) { // 2h d'inactivité
      await logUserActivity(user.id, 'session_expired', request);
      return { user: null, error: 'Session expirée par inactivité' };
    }

    // Mettre à jour la dernière activité
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActivity: new Date() }
    });

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      organization: user.organization,
      twoFactorEnabled: user.twoFactorEnabled
    };

    return { user: authUser, error: null };

  } catch (error) {
    console.error('Auth middleware error:', error);
    return { user: null, error: 'Erreur d\'authentification' };
  }
}

// Middleware pour vérifier les rôles
export function requireRole(allowedRoles: Role[]) {
  return async (request: NextRequest): Promise<{
    user: AuthUser | null;
    error: string | null;
  }> => {
    const authResult = await requireAuth(request);
    
    if (authResult.error || !authResult.user) {
      return authResult;
    }

    if (!allowedRoles.includes(authResult.user.role as Role)) {
      return { user: null, error: 'Permissions insuffisantes' };
    }

    return authResult;
  };
}

// Créer une réponse d'erreur d'authentification
export function createAuthErrorResponse(error: string, status: number = 401): NextResponse {
  return NextResponse.json(
    { 
      error, 
      authenticated: false,
      timestamp: new Date().toISOString()
    },
    { status }
  );
}

// Créer une réponse de succès avec token
export function createAuthSuccessResponse(
  user: AuthUser, 
  token: string, 
  message: string = 'Authentification réussie'
): NextResponse {
  const response = NextResponse.json({
    success: true,
    message,
    user,
    token, // ✅ Ajouter le token dans la réponse JSON
    authenticated: true,
    sessionExpiry: new Date(Date.now() + SESSION_TIMEOUT).toISOString()
  });

  // Définir le cookie du token
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TIMEOUT / 1000,
    path: '/'
  });

  return response;
}

// Nettoyer les cookies d'authentification
export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete('auth-token');
  response.cookies.delete('session-id');
  return response;
}

// Valider la force du mot de passe
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
  }

  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Générer un token de réinitialisation
export function generateResetToken(): string {
  return jwt.sign(
    { type: 'password_reset', timestamp: Date.now() },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Vérifier un token de réinitialisation
export function verifyResetToken(token: string): boolean {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return payload.type === 'password_reset';
  } catch (error) {
    return false;
  }
}

// ===============================
// 2FA UTILITIES
// ===============================

// Générer un secret 2FA
export function generate2FASecret(email: string): {
  secret: string;
  qrCode: Promise<string>;
  manualEntryKey: string;
} {
  const secret = speakeasy.generateSecret({
    name: `E-ARONCY (${email})`,
    issuer: 'E-ARONCY Platform'
  });

  return {
    secret: secret.ascii!,
    qrCode: QRCode.toDataURL(secret.otpauth_url!),
    manualEntryKey: secret.base32!
  };
}

// Vérifier un code TOTP
export function verify2FAToken(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'ascii',
    token,
    window: 2
  });
}

// Vérifier si 2FA est requis pour la connexion
export function requires2FA(user: User, totpCode?: string): boolean {
  return user.twoFactorEnabled && !totpCode;
}
