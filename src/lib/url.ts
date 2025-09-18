export function getAppUrl(req?: Request): string {
  const envUrl =
    process.env.APP_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    '';

  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }

  if (req?.url) {
    try {
      const origin = new URL(req.url).origin;
      if (origin) return origin;
    } catch {
      // ignore
    }
  }

  if (process.env.VERCEL_URL) {
    // Vercel provides host without protocol
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}

