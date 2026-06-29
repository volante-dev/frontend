import { notFound } from "next/navigation";
import { getPublishedLocaleCodes } from "@/lib/site-locales";

const LocaleLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const localeCodes = await getPublishedLocaleCodes();
  if (!localeCodes.includes(locale)) notFound();

  return children;
};

export default LocaleLayout;
