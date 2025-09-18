Email OTP (One-Time Password)

Overview
- Login and account activation require a 6-digit code sent by email.
- Codes expire after 10 minutes and allow up to 5 attempts.

Environment
- Configure SMTP in `.env.local`:
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- Optional tuning:
  - `OTP_TTL_MINUTES` (default 10)
  - `OTP_LENGTH` (default 6)
  - `OTP_MAX_ATTEMPTS` (default 5)

Database
- A new Prisma model `EmailOTP` is used.
- Run migrations locally:
  - `npx prisma migrate dev --name add_email_otp`

API Endpoints
- POST `POST /api/auth/login`
  - Request: `{ email, password, rememberMe }`
  - Response: `{ requiresEmailOTP: true }` and code is sent by email.
- POST `POST /api/auth/login/verify-otp`
  - Request: `{ email, code, rememberMe }`
  - Response: success with JWT token and user.
- POST `POST /api/auth/login/resend-otp`
  - Request: `{ email }`
  - Response: success or 429 with `retryAfter` seconds.
- POST `POST /api/auth/register`
  - Response: success and code sent by email.
- POST `POST /api/auth/register/verify-otp`
  - Request: `{ email, code }` to activate account.
- POST `POST /api/auth/register/resend-otp`
  - Request: `{ email }`
  - Response: success or 429 with `retryAfter` seconds.

Notes
- If an account is PENDING, login will return an error prompting email verification.
- Existing TOTP 2FA remains in code but login now uses email OTP by default.

Cooldown
- Env: `OTP_RESEND_COOLDOWN_SECONDS` (default 60)
- Prevents spamming resend; API returns HTTP 429 with `retryAfter`.
