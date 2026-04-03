import { headers } from "next/headers";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import { getTranslations, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const SiteLayout = async ({ children }: { children: React.ReactNode }) => {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") ?? defaultLocale) as Locale;
  const translations = await getTranslations(locale);

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer translations={translations} locale={locale} />
    </>
  );
};

export default SiteLayout;
