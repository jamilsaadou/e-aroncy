-- CreateEnum
CREATE TYPE "public"."OtpType" AS ENUM ('LOGIN', 'REGISTER');

-- CreateTable
CREATE TABLE "public"."email_otps" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "type" "public"."OtpType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_otps_userId_type_expiresAt_idx" ON "public"."email_otps"("userId", "type", "expiresAt");

-- AddForeignKey
ALTER TABLE "public"."email_otps" ADD CONSTRAINT "email_otps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
