CREATE TABLE "PageHeaderContent" (
  "id" TEXT NOT NULL,
  "eyebrow" TEXT NOT NULL,
  "eyebrowEn" TEXT,
  "title" TEXT NOT NULL,
  "titleEn" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PageHeaderContent_pkey" PRIMARY KEY ("id")
);
