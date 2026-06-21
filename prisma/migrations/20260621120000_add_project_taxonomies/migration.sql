-- Replace the legacy bilingual text fields with normalized taxonomy relations.
CREATE TYPE "ProjectTaxonomyType" AS ENUM ('SECTOR', 'LOCATION', 'DELIVERED_SERVICE');

CREATE TABLE "ProjectTaxonomyEntry" (
    "id" TEXT NOT NULL,
    "type" "ProjectTaxonomyType" NOT NULL,
    "label" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "normalizedKey" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectTaxonomyEntry_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Project"
ADD COLUMN "sectorEntryId" TEXT,
ADD COLUMN "locationEntryId" TEXT,
DROP COLUMN "sector",
DROP COLUMN "sectorEn",
DROP COLUMN "projectLocation",
DROP COLUMN "projectLocationEn",
DROP COLUMN "deliveredServices",
DROP COLUMN "deliveredServicesEn";

CREATE TABLE "_ProjectDeliveredServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectDeliveredServices_AB_pkey" PRIMARY KEY ("A", "B")
);

CREATE UNIQUE INDEX "ProjectTaxonomyEntry_type_normalizedKey_key"
ON "ProjectTaxonomyEntry"("type", "normalizedKey");

CREATE INDEX "ProjectTaxonomyEntry_type_active_label_idx"
ON "ProjectTaxonomyEntry"("type", "active", "label");

CREATE INDEX "_ProjectDeliveredServices_B_index"
ON "_ProjectDeliveredServices"("B");

ALTER TABLE "Project"
ADD CONSTRAINT "Project_sectorEntryId_fkey"
FOREIGN KEY ("sectorEntryId") REFERENCES "ProjectTaxonomyEntry"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Project"
ADD CONSTRAINT "Project_locationEntryId_fkey"
FOREIGN KEY ("locationEntryId") REFERENCES "ProjectTaxonomyEntry"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "_ProjectDeliveredServices"
ADD CONSTRAINT "_ProjectDeliveredServices_A_fkey"
FOREIGN KEY ("A") REFERENCES "Project"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_ProjectDeliveredServices"
ADD CONSTRAINT "_ProjectDeliveredServices_B_fkey"
FOREIGN KEY ("B") REFERENCES "ProjectTaxonomyEntry"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "ProjectTaxonomyEntry"
    ("id", "type", "label", "labelEn", "normalizedKey", "active", "createdAt", "updatedAt")
VALUES
    ('taxonomy-sector-art-culture', 'SECTOR', 'Art et culture', 'Art and culture', 'art-et-culture', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('taxonomy-sector-spirits-wines', 'SECTOR', 'Spiritueux et vins', 'Spirits and wines', 'spiritueux-et-vins', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('taxonomy-sector-luxury', 'SECTOR', 'Luxe', 'Luxury', 'luxe', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
