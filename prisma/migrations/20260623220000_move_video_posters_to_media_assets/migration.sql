ALTER TABLE "MediaAsset"
ADD COLUMN "posterUrl" TEXT,
ADD COLUMN "posterPathname" TEXT,
ADD COLUMN "posterMimeType" TEXT,
ADD COLUMN "posterSize" INTEGER;

WITH ranked_posters AS (
    SELECT
        v."id" AS "videoAssetId",
        s."posterUrl",
        regexp_replace(s."posterUrl", '^https?://[^/]+/', '') AS "posterPathname",
        CASE
            WHEN lower(s."posterUrl") LIKE '%.png%' THEN 'image/png'
            WHEN lower(s."posterUrl") LIKE '%.webp%' THEN 'image/webp'
            WHEN lower(s."posterUrl") LIKE '%.avif%' THEN 'image/avif'
            ELSE 'image/jpeg'
        END AS "posterMimeType",
        ROW_NUMBER() OVER (
            PARTITION BY v."id"
            ORDER BY s."order" ASC, s."id" ASC
        ) AS rank
    FROM "ProjectSlide" s
    JOIN "MediaAsset" v ON v."id" = s."mediaAssetId"
    WHERE
        s."mediaType" = 'VIDEO'
        AND v."mediaType" = 'VIDEO'
        AND s."posterUrl" IS NOT NULL
        AND btrim(s."posterUrl") <> ''
)
UPDATE "MediaAsset" v
SET
    "posterUrl" = p."posterUrl",
    "posterPathname" = p."posterPathname",
    "posterMimeType" = p."posterMimeType"
FROM ranked_posters p
WHERE v."id" = p."videoAssetId" AND p.rank = 1;

ALTER TABLE "ProjectSlide"
DROP CONSTRAINT IF EXISTS "ProjectSlide_posterAssetId_fkey";

WITH poster_assets AS (
    SELECT DISTINCT s."posterAssetId" AS id
    FROM "ProjectSlide" s
    JOIN "MediaAsset" a ON a."id" = s."posterAssetId"
    WHERE
        s."posterAssetId" IS NOT NULL
        AND s."mediaType" = 'VIDEO'
        AND s."posterUrl" IS NOT NULL
        AND btrim(s."posterUrl") <> ''
        AND a."url" = s."posterUrl"
),
still_used AS (
    SELECT id FROM poster_assets
    WHERE EXISTS (SELECT 1 FROM "Project" p WHERE p."imageAssetId" = poster_assets.id)
       OR EXISTS (SELECT 1 FROM "ProjectSlide" s WHERE s."mediaAssetId" = poster_assets.id)
       OR EXISTS (SELECT 1 FROM "StudioPageContent" c WHERE c."founderOneImageAssetId" = poster_assets.id)
       OR EXISTS (SELECT 1 FROM "StudioPageContent" c WHERE c."founderTwoImageAssetId" = poster_assets.id)
       OR EXISTS (SELECT 1 FROM "Testimonial" t WHERE t."avatarAssetId" = poster_assets.id)
)
DELETE FROM "MediaAsset"
WHERE "id" IN (SELECT id FROM poster_assets EXCEPT SELECT id FROM still_used);

ALTER TABLE "ProjectSlide"
DROP COLUMN "posterAssetId";
