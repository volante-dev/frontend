ALTER TABLE "Project"
ADD COLUMN "heroPaletteComputed" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "heroColorOverride",
DROP COLUMN "heroColorComputed";
