CREATE TABLE "HomePageContent" (
  "id" TEXT NOT NULL,
  "eyebrow" TEXT NOT NULL,
  "eyebrowEn" TEXT,
  "title" TEXT NOT NULL,
  "titleEn" TEXT,
  "subheading" TEXT NOT NULL,
  "subheadingEn" TEXT,
  "primaryCtaLabel" TEXT NOT NULL,
  "primaryCtaLabelEn" TEXT,
  "secondaryCtaLabel" TEXT NOT NULL,
  "secondaryCtaLabelEn" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "HomePageContent_pkey" PRIMARY KEY ("id")
);
