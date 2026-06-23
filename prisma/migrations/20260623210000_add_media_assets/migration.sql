CREATE TYPE "MediaAssetType" AS ENUM ('IMAGE', 'VIDEO');

CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "mediaType" "MediaAssetType" NOT NULL,
    "mimeType" TEXT,
    "size" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "name" TEXT NOT NULL,
    "alt" TEXT,
    "altEn" TEXT,
    "tags" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MediaAsset_url_key" ON "MediaAsset"("url");
CREATE INDEX "MediaAsset_active_mediaType_createdAt_idx" ON "MediaAsset"("active", "mediaType", "createdAt");

ALTER TABLE "Project"
ADD COLUMN "imageAssetId" TEXT;

ALTER TABLE "ProjectSlide"
ADD COLUMN "mediaAssetId" TEXT,
ADD COLUMN "posterAssetId" TEXT;

ALTER TABLE "StudioPageContent"
ADD COLUMN "founderOneImageAssetId" TEXT,
ADD COLUMN "founderTwoImageAssetId" TEXT;

ALTER TABLE "Testimonial"
ADD COLUMN "avatarAssetId" TEXT;

WITH project_images AS (
    SELECT
        'media-' || md5("imageUrl") AS id,
        "imageUrl" AS url,
        regexp_replace("imageUrl", '^https?://[^/]+/', '') AS pathname,
        'IMAGE'::"MediaAssetType" AS "mediaType",
        CASE
            WHEN lower("imageUrl") LIKE '%.png%' THEN 'image/png'
            WHEN lower("imageUrl") LIKE '%.webp%' THEN 'image/webp'
            WHEN lower("imageUrl") LIKE '%.avif%' THEN 'image/avif'
            ELSE 'image/jpeg'
        END AS "mimeType",
        'Couverture - ' || "title" AS name,
        "title" AS alt,
        "titleEn" AS "altEn",
        ARRAY['projet', 'couverture']::TEXT[] AS tags
    FROM "Project"
    WHERE btrim("imageUrl") <> ''
),
slide_media AS (
    SELECT
        'media-' || md5(s."mediaUrl") AS id,
        s."mediaUrl" AS url,
        regexp_replace(s."mediaUrl", '^https?://[^/]+/', '') AS pathname,
        CASE WHEN s."mediaType" = 'VIDEO' THEN 'VIDEO'::"MediaAssetType" ELSE 'IMAGE'::"MediaAssetType" END AS "mediaType",
        CASE
            WHEN s."mediaType" = 'VIDEO' THEN 'video/mp4'
            WHEN lower(s."mediaUrl") LIKE '%.png%' THEN 'image/png'
            WHEN lower(s."mediaUrl") LIKE '%.webp%' THEN 'image/webp'
            WHEN lower(s."mediaUrl") LIKE '%.avif%' THEN 'image/avif'
            ELSE 'image/jpeg'
        END AS "mimeType",
        'Slide ' || (s."order" + 1)::TEXT || ' - ' || p."title" AS name,
        s."alt" AS alt,
        s."altEn" AS "altEn",
        CASE WHEN s."mediaType" = 'VIDEO'
            THEN ARRAY['projet', 'slide', 'vidéo']::TEXT[]
            ELSE ARRAY['projet', 'slide', 'image']::TEXT[]
        END AS tags
    FROM "ProjectSlide" s
    JOIN "Project" p ON p."id" = s."projectId"
    WHERE btrim(s."mediaUrl") <> ''
),
slide_posters AS (
    SELECT
        'media-' || md5(s."posterUrl") AS id,
        s."posterUrl" AS url,
        regexp_replace(s."posterUrl", '^https?://[^/]+/', '') AS pathname,
        'IMAGE'::"MediaAssetType" AS "mediaType",
        CASE
            WHEN lower(s."posterUrl") LIKE '%.png%' THEN 'image/png'
            WHEN lower(s."posterUrl") LIKE '%.webp%' THEN 'image/webp'
            WHEN lower(s."posterUrl") LIKE '%.avif%' THEN 'image/avif'
            ELSE 'image/jpeg'
        END AS "mimeType",
        'Poster vidéo - ' || p."title" AS name,
        s."alt" AS alt,
        s."altEn" AS "altEn",
        ARRAY['projet', 'poster', 'vidéo']::TEXT[] AS tags
    FROM "ProjectSlide" s
    JOIN "Project" p ON p."id" = s."projectId"
    WHERE s."posterUrl" IS NOT NULL AND btrim(s."posterUrl") <> ''
),
studio_founders AS (
    SELECT
        'media-' || md5("founderOneImageUrl") AS id,
        "founderOneImageUrl" AS url,
        regexp_replace("founderOneImageUrl", '^https?://[^/]+/', '') AS pathname,
        'IMAGE'::"MediaAssetType" AS "mediaType",
        CASE
            WHEN lower("founderOneImageUrl") LIKE '%.png%' THEN 'image/png'
            WHEN lower("founderOneImageUrl") LIKE '%.webp%' THEN 'image/webp'
            WHEN lower("founderOneImageUrl") LIKE '%.avif%' THEN 'image/avif'
            ELSE 'image/jpeg'
        END AS "mimeType",
        'Portrait - ' || "founderOneName" AS name,
        "founderOneImageAlt" AS alt,
        "founderOneImageAltEn" AS "altEn",
        ARRAY['studio', 'fondateur']::TEXT[] AS tags
    FROM "StudioPageContent"
    WHERE btrim("founderOneImageUrl") <> ''
    UNION ALL
    SELECT
        'media-' || md5("founderTwoImageUrl") AS id,
        "founderTwoImageUrl" AS url,
        regexp_replace("founderTwoImageUrl", '^https?://[^/]+/', '') AS pathname,
        'IMAGE'::"MediaAssetType" AS "mediaType",
        CASE
            WHEN lower("founderTwoImageUrl") LIKE '%.png%' THEN 'image/png'
            WHEN lower("founderTwoImageUrl") LIKE '%.webp%' THEN 'image/webp'
            WHEN lower("founderTwoImageUrl") LIKE '%.avif%' THEN 'image/avif'
            ELSE 'image/jpeg'
        END AS "mimeType",
        'Portrait - ' || "founderTwoName" AS name,
        "founderTwoImageAlt" AS alt,
        "founderTwoImageAltEn" AS "altEn",
        ARRAY['studio', 'fondateur']::TEXT[] AS tags
    FROM "StudioPageContent"
    WHERE btrim("founderTwoImageUrl") <> ''
),
testimonial_avatars AS (
    SELECT
        'media-' || md5("avatarUrl") AS id,
        "avatarUrl" AS url,
        regexp_replace("avatarUrl", '^https?://[^/]+/', '') AS pathname,
        'IMAGE'::"MediaAssetType" AS "mediaType",
        CASE
            WHEN lower("avatarUrl") LIKE '%.png%' THEN 'image/png'
            WHEN lower("avatarUrl") LIKE '%.webp%' THEN 'image/webp'
            WHEN lower("avatarUrl") LIKE '%.avif%' THEN 'image/avif'
            ELSE 'image/jpeg'
        END AS "mimeType",
        'Portrait - ' || "author" AS name,
        "author" AS alt,
        NULL AS "altEn",
        ARRAY['témoignage', 'avatar']::TEXT[] AS tags
    FROM "Testimonial"
    WHERE "avatarUrl" IS NOT NULL AND btrim("avatarUrl") <> ''
),
all_assets AS (
    SELECT * FROM project_images
    UNION ALL SELECT * FROM slide_media
    UNION ALL SELECT * FROM slide_posters
    UNION ALL SELECT * FROM studio_founders
    UNION ALL SELECT * FROM testimonial_avatars
)
INSERT INTO "MediaAsset" ("id", "url", "pathname", "mediaType", "mimeType", "name", "alt", "altEn", "tags")
SELECT DISTINCT ON ("url") "id", "url", "pathname", "mediaType", "mimeType", "name", "alt", "altEn", "tags"
FROM all_assets
ORDER BY "url", "name"
ON CONFLICT ("url") DO NOTHING;

UPDATE "Project"
SET "imageAssetId" = 'media-' || md5("imageUrl")
WHERE btrim("imageUrl") <> '';

UPDATE "ProjectSlide"
SET "mediaAssetId" = 'media-' || md5("mediaUrl")
WHERE btrim("mediaUrl") <> '';

UPDATE "ProjectSlide"
SET "posterAssetId" = 'media-' || md5("posterUrl")
WHERE "posterUrl" IS NOT NULL AND btrim("posterUrl") <> '';

UPDATE "StudioPageContent"
SET "founderOneImageAssetId" = 'media-' || md5("founderOneImageUrl")
WHERE btrim("founderOneImageUrl") <> '';

UPDATE "StudioPageContent"
SET "founderTwoImageAssetId" = 'media-' || md5("founderTwoImageUrl")
WHERE btrim("founderTwoImageUrl") <> '';

UPDATE "Testimonial"
SET "avatarAssetId" = 'media-' || md5("avatarUrl")
WHERE "avatarUrl" IS NOT NULL AND btrim("avatarUrl") <> '';

ALTER TABLE "Project"
ADD CONSTRAINT "Project_imageAssetId_fkey"
FOREIGN KEY ("imageAssetId") REFERENCES "MediaAsset"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProjectSlide"
ADD CONSTRAINT "ProjectSlide_mediaAssetId_fkey"
FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProjectSlide"
ADD CONSTRAINT "ProjectSlide_posterAssetId_fkey"
FOREIGN KEY ("posterAssetId") REFERENCES "MediaAsset"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "StudioPageContent"
ADD CONSTRAINT "StudioPageContent_founderOneImageAssetId_fkey"
FOREIGN KEY ("founderOneImageAssetId") REFERENCES "MediaAsset"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "StudioPageContent"
ADD CONSTRAINT "StudioPageContent_founderTwoImageAssetId_fkey"
FOREIGN KEY ("founderTwoImageAssetId") REFERENCES "MediaAsset"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Testimonial"
ADD CONSTRAINT "Testimonial_avatarAssetId_fkey"
FOREIGN KEY ("avatarAssetId") REFERENCES "MediaAsset"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
