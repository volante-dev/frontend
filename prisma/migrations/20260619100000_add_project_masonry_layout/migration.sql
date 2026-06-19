CREATE TYPE "ProjectPortfolioSize" AS ENUM ('NORMAL', 'HERO');

ALTER TABLE "Project"
ADD COLUMN "portfolioSize" "ProjectPortfolioSize" NOT NULL DEFAULT 'NORMAL',
ADD COLUMN "portfolioOrder" INTEGER NOT NULL DEFAULT 0;

UPDATE "Project"
SET "portfolioOrder" = "order";
