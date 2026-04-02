/**
 * Configuration de base i18n — importée par i18n.ts ET i18n-routes.ts
 * pour éviter les imports circulaires.
 */
export type Locale = "fr" | "en";

export const defaultLocale: Locale = "fr";
export const locales: Locale[] = ["fr", "en"];
