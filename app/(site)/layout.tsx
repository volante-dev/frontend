import { headers } from "next/headers";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import PreviewSync from "@/components/layout/PreviewSync/PreviewSync";
import { getTranslations, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const SiteLayout = async ({ children }: { children: React.ReactNode }) => {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") ?? defaultLocale) as Locale;
  const translations = await getTranslations(locale);

  return (
    <>
      <PreviewSync />
      <Header />
      <main style={{ paddingTop: "var(--header-height)" }}>{children}</main>
      <Footer translations={translations} locale={locale} />
    </>
  );
};

export default SiteLayout;
