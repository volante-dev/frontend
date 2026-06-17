CREATE TYPE "ProjectSlideMediaType" AS ENUM ('IMAGE', 'VIDEO');

CREATE TABLE "ProjectSlide" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "contentHtml" TEXT NOT NULL,
    "contentHtmlEn" TEXT,
    "mediaType" "ProjectSlideMediaType" NOT NULL DEFAULT 'IMAGE',
    "mediaUrl" TEXT NOT NULL,
    "posterUrl" TEXT,
    "alt" TEXT,
    "altEn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectSlide_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProjectSlide_projectId_order_idx" ON "ProjectSlide"("projectId", "order");

ALTER TABLE "ProjectSlide"
ADD CONSTRAINT "ProjectSlide_projectId_fkey"
FOREIGN KEY ("projectId") REFERENCES "Project"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
