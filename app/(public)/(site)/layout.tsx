import Footer from "@/components/layout/Footer/Footer";
import { getTranslations } from "@/lib/i18n";

const SiteLayout = async ({ children }: { children: React.ReactNode }) => {
  const [translationsFr, translationsEn] = await Promise.all([
    getTranslations("fr"),
    getTranslations("en"),
  ]);

  return (
    <>
      <main style={{ paddingTop: "var(--header-height)" }}>{children}</main>
      <Footer
        translationsByLocale={{ fr: translationsFr, en: translationsEn }}
      />
    </>
  );
};

export default SiteLayout;
