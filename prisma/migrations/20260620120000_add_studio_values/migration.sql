CREATE TABLE "StudioValue" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "description" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StudioValue_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "StudioValue_active_order_idx" ON "StudioValue"("active", "order");

INSERT INTO "StudioValue" (
    "id",
    "title",
    "titleEn",
    "description",
    "descriptionEn",
    "order",
    "active"
) VALUES
    (
        'studio-value-exigence',
        'Exigence',
        'Excellence',
        'Chaque projet est traité avec la même rigueur, qu''il s''agisse d''une carte de visite ou d''une campagne nationale.',
        'Every project receives the same attention to detail, from a business card to a national campaign.',
        0,
        true
    ),
    (
        'studio-value-clarte',
        'Clarté',
        'Clarity',
        'Nous simplifions le complexe. Une bonne communication est d''abord une communication compréhensible.',
        'We make complexity simple. Good communication begins with being understood.',
        1,
        true
    ),
    (
        'studio-value-durabilite',
        'Durabilité',
        'Durability',
        'Nous concevons des identités qui vieillissent bien et des messages qui restent pertinents dans le temps.',
        'We design identities that age well and messages that remain relevant over time.',
        2,
        true
    );
