import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n-config";

const LocaleLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return children;
};

export default LocaleLayout;
