-- AlterTable
ALTER TABLE "public"."modules" ADD COLUMN     "sectionId" TEXT;

-- CreateTable
CREATE TABLE "public"."sections" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "formationId" TEXT NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sections_formationId_title_key" ON "public"."sections"("formationId", "title");

-- AddForeignKey
ALTER TABLE "public"."modules" ADD CONSTRAINT "modules_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sections" ADD CONSTRAINT "sections_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "public"."formations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
