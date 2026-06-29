import { defaultLocale, type Locale } from "./i18n-config";

type TranslationRecord = {
  locale: string;
  [key: string]: unknown;
};

const isStringValue = (value: unknown): value is string =>
  typeof value === "string";

const findTranslation = (
  translations: TranslationRecord[] | undefined | null,
  locale: Locale,
) => translations?.find((translation) => translation.locale === locale) ?? null;

export const localizedTranslationField = (
  translations: TranslationRecord[] | undefined | null,
  locale: Locale,
  field: string,
  fallback: string,
): string => {
  const current = findTranslation(translations, locale)?.[field];
  if (isStringValue(current)) return current;

  const defaultValue = findTranslation(translations, defaultLocale)?.[field];
  if (isStringValue(defaultValue)) return defaultValue;

  return fallback;
};

export const localizedNullableTranslationField = (
  translations: TranslationRecord[] | undefined | null,
  locale: Locale,
  field: string,
  fallback: string | null | undefined,
): string | null => {
  const value = localizedTranslationField(
    translations,
    locale,
    field,
    fallback ?? "",
  );

  return value || null;
};

export const localizedTranslationArray = (
  translations: TranslationRecord[] | undefined | null,
  locale: Locale,
  field: string,
  fallback: string[],
): string[] => {
  const current = findTranslation(translations, locale)?.[field];
  if (Array.isArray(current)) return current.filter(isStringValue);

  const defaultValue = findTranslation(translations, defaultLocale)?.[field];
  if (Array.isArray(defaultValue)) return defaultValue.filter(isStringValue);

  return fallback;
};
