-- CreateEnum
CREATE TYPE "public"."ProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'PASSED', 'FAILED', 'LOCKED');

-- CreateEnum
CREATE TYPE "public"."AttemptType" AS ENUM ('QUIZ', 'SCORM', 'XAPI');

-- CreateEnum
CREATE TYPE "public"."AttemptStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'PASSED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."RequirementType" AS ENUM ('COMPLETED', 'PASSED', 'MIN_SCORE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."ModuleType" ADD VALUE 'SCORM';
ALTER TYPE "public"."ModuleType" ADD VALUE 'XAPI';

-- AlterTable
ALTER TABLE "public"."enrollments" ADD COLUMN     "progress" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."item_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "formationId" TEXT NOT NULL,
    "sectionId" TEXT,
    "moduleId" TEXT,
    "status" "public"."ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "score" DOUBLE PRECISION,
    "passed" BOOLEAN,
    "timeSpentSec" INTEGER NOT NULL DEFAULT 0,
    "lastEventAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "quizSessionId" TEXT,
    "type" "public"."AttemptType" NOT NULL,
    "score" DOUBLE PRECISION,
    "maxScore" DOUBLE PRECISION,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "status" "public"."AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."prerequisites" (
    "id" TEXT NOT NULL,
    "formationId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "requiresModuleId" TEXT NOT NULL,
    "requirement" "public"."RequirementType" NOT NULL,
    "minScore" DOUBLE PRECISION,

    CONSTRAINT "prerequisites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."release_policies" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "releaseAt" TIMESTAMP(3),
    "delayMinutes" INTEGER,

    CONSTRAINT "release_policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_progress_userId_moduleId_key" ON "public"."item_progress"("userId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "release_policies_moduleId_key" ON "public"."release_policies"("moduleId");

-- AddForeignKey
ALTER TABLE "public"."item_progress" ADD CONSTRAINT "item_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item_progress" ADD CONSTRAINT "item_progress_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "public"."formations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item_progress" ADD CONSTRAINT "item_progress_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item_progress" ADD CONSTRAINT "item_progress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attempts" ADD CONSTRAINT "attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attempts" ADD CONSTRAINT "attempts_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."attempts" ADD CONSTRAINT "attempts_quizSessionId_fkey" FOREIGN KEY ("quizSessionId") REFERENCES "public"."quiz_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prerequisites" ADD CONSTRAINT "prerequisites_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "public"."formations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prerequisites" ADD CONSTRAINT "prerequisites_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."prerequisites" ADD CONSTRAINT "prerequisites_requiresModuleId_fkey" FOREIGN KEY ("requiresModuleId") REFERENCES "public"."modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."release_policies" ADD CONSTRAINT "release_policies_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "public"."modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
