ALTER TABLE "Service"
ADD COLUMN "descriptionHtml" TEXT,
ADD COLUMN "descriptionHtmlEn" TEXT;

UPDATE "Service"
SET
    "descriptionHtml" = '<p>' ||
        replace(
            replace(
                replace(
                    replace("description", '&', '&amp;'),
                    '<',
                    '&lt;'
                ),
                '>',
                '&gt;'
            ),
            E'\n',
            '<br>'
        ) ||
        '</p>',
    "descriptionHtmlEn" = CASE
        WHEN "descriptionEn" IS NULL OR btrim("descriptionEn") = '' THEN NULL
        ELSE '<p>' ||
            replace(
                replace(
                    replace(
                        replace("descriptionEn", '&', '&amp;'),
                        '<',
                        '&lt;'
                    ),
                    '>',
                    '&gt;'
                ),
                E'\n',
                '<br>'
            ) ||
            '</p>'
    END;

ALTER TABLE "Service"
ALTER COLUMN "descriptionHtml" SET NOT NULL;

ALTER TABLE "StudioPageContent"
ADD COLUMN "historyTitle" TEXT,
ADD COLUMN "historyTitleEn" TEXT,
ADD COLUMN "historyContentHtml" TEXT,
ADD COLUMN "historyContentHtmlEn" TEXT;

UPDATE "StudioPageContent"
SET
    "historyTitle" = 'Notre histoire',
    "historyTitleEn" = 'Our story',
    "historyContentHtml" = '<p>Studio Volante est né de la conviction que la communication doit être aussi bien pensée qu''elle est belle. Fondé par des créatifs passionnés, le studio accompagne des marques de toutes tailles dans la construction d''une identité forte et cohérente.</p><p>Notre approche est toujours stratégique avant d''être esthétique : comprendre le positionnement, les cibles, les ambitions — puis créer.</p>',
    "historyContentHtmlEn" = '<p>Studio Volante was born from the belief that communication should be as thoughtful as it is beautiful. Founded by passionate creatives, the studio helps brands of every size build strong, consistent identities.</p><p>Our approach is always strategic before it is aesthetic: understand the positioning, audiences and ambitions — then create.</p>'
WHERE "id" = 'studio';

ALTER TABLE "StudioPageContent"
ALTER COLUMN "historyTitle" SET NOT NULL,
ALTER COLUMN "historyContentHtml" SET NOT NULL;
