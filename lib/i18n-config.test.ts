import { describe, expect, it } from "vitest";
import { resolveLocale } from "./i18n-config";
import { localTranslations } from "./i18n-messages";
import { getAlternateHref, getLocalizedHref } from "./i18n-routes";

describe("i18n routing", () => {
  it("keeps French unprefixed and English prefixed", () => {
    expect(getLocalizedHref("fr", "portfolio")).toBe("/portfolio");
    expect(getLocalizedHref("en", "portfolio")).toBe("/en/portfolio");
  });

  it("switches between equivalent public URLs", () => {
    expect(getAlternateHref("/portfolio", "en")).toBe("/en/portfolio");
    expect(getAlternateHref("/en/portfolio", "fr")).toBe("/portfolio");
  });

  it("uses French for an absent or invalid route locale", () => {
    expect(resolveLocale(undefined)).toBe("fr");
    expect(resolveLocale("de")).toBe("fr");
  });
});

describe("local translation fallbacks", () => {
  it("contains a real English dictionary", () => {
    expect(localTranslations.en["hero.heading"]).toContain("We bring ideas");
    expect(localTranslations.en["hero.heading"]).not.toBe(
      localTranslations.fr["hero.heading"],
    );
  });

  it("keeps both dictionaries structurally aligned", () => {
    expect(Object.keys(localTranslations.en).sort()).toEqual(
      Object.keys(localTranslations.fr).sort(),
    );
  });
});
