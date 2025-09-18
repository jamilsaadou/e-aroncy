import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || user || 'no-reply@localhost';
const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;
const requireTLS = String(process.env.SMTP_REQUIRE_TLS || 'true').toLowerCase() === 'true';
const rejectUnauthorized = String(process.env.SMTP_TLS_REJECT_UNAUTHORIZED || 'true').toLowerCase() === 'true';
const timeoutMs = Number(process.env.SMTP_TIMEOUT_MS || 15000);
const debug = String(process.env.SMTP_DEBUG || 'false').toLowerCase() === 'true';
const usePool = String(process.env.SMTP_POOL || 'false').toLowerCase() === 'true';

let transporter: nodemailer.Transporter | null = null;

function buildTransport({ host, port, secure }: { host: string; port: number; secure: boolean }) {
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user: user!, pass: pass! },
    requireTLS: !secure && requireTLS,
    pool: usePool,
    connectionTimeout: timeoutMs,
    greetingTimeout: Math.min(timeoutMs, 10000),
    socketTimeout: Math.max(timeoutMs, 20000),
    tls: { rejectUnauthorized },
    logger: debug,
    debug,
  });
}

function getPrimaryTransporter() {
  if (!transporter) {
    if (!host || !user || !pass) {
      throw new Error('SMTP configuration missing: please set SMTP_HOST, SMTP_USER, SMTP_PASS');
    }
    transporter = buildTransport({ host, port, secure });
  }
  return transporter;
}

async function sendWithFallback(mail: nodemailer.SendMailOptions) {
  const primary = getPrimaryTransporter();
  try {
    return await primary.sendMail(mail);
  } catch (err: any) {
    const code = err?.code || err?.errno || '';
    const transient = ['ETIMEDOUT', 'ESOCKET', 'ECONNECTION', 'ECONNRESET', 'ECONNREFUSED'];
    if (!transient.includes(String(code))) throw err;

    // Fallback: try STARTTLS on 587 if primary was 465 TLS
    const altPort = port === 465 ? 587 : 465;
    const altSecure = altPort === 465;
    const alt = buildTransport({ host: host!, port: altPort, secure: altSecure });
    if (debug) console.warn(`[mailer] Primary transport failed (${code}), trying fallback on port ${altPort} secure=${altSecure}`);
    return await alt.sendMail(mail);
  }
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  const mail = {
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  } as nodemailer.SendMailOptions;
  await sendWithFallback(mail);
}

export async function sendLoginOTPEmail(to: string, code: string) {
  const subject = 'Votre code de connexion (OTP) — E-ARONCY';
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0f172a">
      <h2 style="margin:0 0 8px">Code de vérification</h2>
      <p style="margin:0 0 16px">Utilisez le code ci-dessous pour valider votre connexion.</p>
      <div style="display:inline-block; background:#0ea5e9; color:#fff; padding:12px 16px; border-radius:8px; font-size:22px; letter-spacing:6px; font-weight:700">${code}</div>
      <p style="margin:16px 0 0; font-size:14px; color:#334155">Ce code expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette tentative, ignorez cet email.</p>
    </div>
  `;
  await sendEmail({ to, subject, html, text: `Code de connexion: ${code}` });
}

export async function sendRegistrationOTPEmail(to: string, code: string) {
  const subject = 'Activez votre compte — Code de vérification E-ARONCY';
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0f172a">
      <h2 style="margin:0 0 8px">Bienvenue sur E-ARONCY</h2>
      <p style="margin:0 0 16px">Validez la création de votre compte avec le code ci-dessous :</p>
      <div style="display:inline-block; background:#22c55e; color:#fff; padding:12px 16px; border-radius:8px; font-size:22px; letter-spacing:6px; font-weight:700">${code}</div>
      <p style="margin:16px 0 0; font-size:14px; color:#334155">Ce code expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
    </div>
  `;
  await sendEmail({ to, subject, html, text: `Code d'activation: ${code}` });
}

export async function sendActivationLinkEmail(to: string, link: string) {
  const subject = 'Activez votre compte — E-ARONCY';
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0f172a">
      <h2 style="margin:0 0 8px">Bienvenue sur E-ARONCY</h2>
      <p style="margin:0 0 16px">Pour finaliser la création de votre compte, cliquez sur le bouton ci-dessous :</p>
      <p>
        <a href="${link}" style="display:inline-block; background:#22c55e; color:#fff; padding:12px 18px; border-radius:8px; font-size:16px; font-weight:700; text-decoration:none">Activer mon compte</a>
      </p>
      <p style="margin:16px 0 0; font-size:14px; color:#334155">Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
      <p style="margin:8px 0 0; font-size:12px; color:#0369a1; word-break:break-all">${link}</p>
      <p style="margin:16px 0 0; font-size:12px; color:#64748b">Ce lien expire dans ${Number(process.env.EMAIL_VERIFICATION_TTL_HOURS || 24)} heures.</p>
    </div>
  `;
  await sendEmail({ to, subject, html, text: `Activez votre compte: ${link}` });
}

export async function sendAdminTempPasswordEmail(to: string, tempPassword: string) {
  const subject = 'Votre mot de passe temporaire — E-ARONCY';
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0f172a">
      <h2 style="margin:0 0 8px">Réinitialisation de mot de passe</h2>
      <p style="margin:0 0 16px">Un administrateur a réinitialisé votre mot de passe. Utilisez le mot de passe temporaire ci-dessous pour vous connecter :</p>
      <div style="display:inline-block; background:#0ea5e9; color:#fff; padding:10px 14px; border-radius:8px; font-size:18px; letter-spacing:1px; font-weight:700">${tempPassword}</div>
      <p style="margin:16px 0 0; font-size:14px; color:#334155">Par mesure de sécurité, nous vous recommandons de changer ce mot de passe dès votre prochaine connexion (Profil → Sécurité → Changer le mot de passe).</p>
    </div>
  `;
  await sendEmail({ to, subject, html, text: `Mot de passe temporaire: ${tempPassword}` });
}

export async function sendPasswordResetLinkEmail(to: string, link: string) {
  const subject = 'Réinitialisez votre mot de passe — E-ARONCY';
  const html = `
    <div style=\"font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0f172a\">
      <h2 style=\"margin:0 0 8px\">Réinitialisation de mot de passe</h2>
      <p style=\"margin:0 0 16px\">Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe.</p>
      <p>
        <a href=\"${link}\" style=\"display:inline-block; background:#0ea5e9; color:#fff; padding:12px 18px; border-radius:8px; font-size:16px; font-weight:700; text-decoration:none\">Réinitialiser mon mot de passe</a>
      </p>
      <p style=\"margin:16px 0 0; font-size:14px; color:#334155\">Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
      <p style=\"margin:8px 0 0; font-size:12px; color:#0369a1; word-break:break-all\">${link}</p>
      <p style=\"margin:16px 0 0; font-size:12px; color:#64748b\">Ce lien expire dans ${Number(process.env.PASSWORD_RESET_TTL_HOURS || 1)} heure(s).</p>
    </div>
  `;
  await sendEmail({ to, subject, html, text: `Réinitialisez votre mot de passe: ${link}` });
}
