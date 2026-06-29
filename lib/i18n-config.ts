/**
 * Configuration de base i18n — importée par i18n.ts ET i18n-routes.ts
 * pour éviter les imports circulaires.
 */
export type BuiltInLocale = "fr" | "en";
export type Locale = string;

export const defaultLocale = "fr";
export const builtInLocales: BuiltInLocale[] = ["fr", "en"];
export const locales: Locale[] = builtInLocales;

export const isLocale = (value: string | undefined): value is Locale =>
  locales.includes(value as Locale);

export const resolveLocale = (value: string | undefined): Locale =>
  isLocale(value) ? value : defaultLocale;
