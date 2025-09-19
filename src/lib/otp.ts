import bcrypt from 'bcryptjs';
import prisma from './database';
import { sendLoginOTPEmail, sendRegistrationOTPEmail } from './mailer';

export class OtpCooldownError extends Error {
  public retryAfter: number;
  constructor(message: string, retryAfter: number) {
    super(message);
    this.name = 'OtpCooldownError';
    this.retryAfter = retryAfter;
  }
}

export type OtpType = 'LOGIN' | 'REGISTER';

const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);
const OTP_LENGTH = Number(process.env.OTP_LENGTH || 6);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

function requireEmailOTPDelegate() {
  const delegate = (prisma as any).emailOTP;
  if (!delegate || typeof delegate !== 'object') {
    // Throw a clear error to avoid cryptic TypeErrors on property access
    throw new Error(
      'Prisma client is missing EmailOTP delegate. Ensure prisma generate ran with a schema that defines model EmailOTP and that migrations are deployed.'
    );
  }
}

export function generateOTP(length: number = OTP_LENGTH): string {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * 10)];
  }
  return code;
}

export async function hashOTP(code: string): Promise<string> {
  const rounds = Number(process.env.BCRYPT_ROUNDS || 12);
  const salt = await bcrypt.genSalt(rounds);
  return bcrypt.hash(code, salt);
}

export async function createAndSendOTP(params: {
  userId: string;
  email: string;
  type: OtpType;
  respectCooldown?: boolean; // apply resend cooldown
}): Promise<void> {
  const { userId, email, type, respectCooldown } = params;

  const cooldownSec = Number(process.env.OTP_RESEND_COOLDOWN_SECONDS || 60);

  if (respectCooldown) {
    requireEmailOTPDelegate();
    const last = await prisma.emailOTP.findFirst({
      where: { userId, type },
      orderBy: { createdAt: 'desc' }
    });
    if (last) {
      const nextAllowed = new Date(last.createdAt.getTime() + cooldownSec * 1000);
      const now = new Date();
      if (nextAllowed > now) {
        const retryAfter = Math.ceil((nextAllowed.getTime() - now.getTime()) / 1000);
        throw new OtpCooldownError('Veuillez patienter avant de redemander un code.', retryAfter);
      }
    }
  }

  // Invalidate existing OTPs of same type for this user
  requireEmailOTPDelegate();
  await prisma.emailOTP.deleteMany({ where: { userId, type } }).catch(() => {});

  const code = generateOTP();
  const codeHash = await hashOTP(code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  // Dev-only: log OTP to server console when explicitly enabled
  if (String(process.env.OTP_DEV_LOG_CODE || 'false').toLowerCase() === 'true') {
    console.warn(`[OTP DEBUG] type=${type} email=${email} code=${code} (expires in ${OTP_TTL_MINUTES}m)`);
  }

  requireEmailOTPDelegate();
  await prisma.emailOTP.create({
    data: { userId, codeHash, type, expiresAt }
  });

  const sendPromise = type === 'LOGIN'
    ? sendLoginOTPEmail(email, code)
    : sendRegistrationOTPEmail(email, code);
  // Ne pas bloquer la réponse API si l'envoi tarde/échoue
  sendPromise.catch((e) => {
    console.error('OTP email send failed:', e);
  });
}

export async function verifyOTP(params: {
  userId: string;
  code: string;
  type: OtpType;
}): Promise<{ valid: boolean; error?: string }> {
  const { userId, code, type } = params;
  requireEmailOTPDelegate();
  const record = await prisma.emailOTP.findFirst({
    where: { userId, type },
    orderBy: { createdAt: 'desc' }
  });

  if (!record) {
    return { valid: false, error: 'Aucun code actif. Veuillez redemander un code.' };
  }

  if (record.consumedAt) {
    return { valid: false, error: 'Code déjà utilisé. Veuillez redemander un code.' };
  }

  if (record.expiresAt < new Date()) {
    // cleanup expired
    requireEmailOTPDelegate();
    await prisma.emailOTP.deleteMany({ where: { userId, type } }).catch(() => {});
    return { valid: false, error: 'Code expiré. Veuillez redemander un code.' };
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    requireEmailOTPDelegate();
    await prisma.emailOTP.deleteMany({ where: { userId, type } }).catch(() => {});
    return { valid: false, error: 'Trop de tentatives. Code réinitialisé.' };
  }

  const ok = await bcrypt.compare(code, record.codeHash);
  if (!ok) {
    requireEmailOTPDelegate();
    await prisma.emailOTP.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } }
    }).catch(() => {});
    return { valid: false, error: 'Code invalide.' };
  }

  requireEmailOTPDelegate();
  await prisma.emailOTP.update({
    where: { id: record.id },
    data: { consumedAt: new Date() }
  }).catch(() => {});

  // Remove any other stale codes of same type
  requireEmailOTPDelegate();
  await prisma.emailOTP.deleteMany({ where: { userId, type, consumedAt: null, id: { not: record.id } } }).catch(() => {});

  return { valid: true };
}
