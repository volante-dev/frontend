import { headers } from "next/headers";
import Header from "@/components/layout/Header/Header";
import PreviewSync from "@/components/layout/PreviewSync/PreviewSync";
import PageTransitionBoundary from "@/components/layout/PageTransition/PageTransitionBoundary";
import PublicExperienceProvider from "@/components/layout/PublicExperience/PublicExperienceProvider";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const headersList = await headers();
  const initialPathname = headersList.get("x-initial-pathname") ?? "/";
  const normalizedPathname =
    initialPathname.length > 1 && initialPathname.endsWith("/")
      ? initialPathname.slice(0, -1)
      : initialPathname;
  const initialHome =
    normalizedPathname === "/" || normalizedPathname === "/en";

  return (
    <PublicExperienceProvider initialHome={initialHome}>
      <PreviewSync />
      <Header />
      <PageTransitionBoundary>{children}</PageTransitionBoundary>
    </PublicExperienceProvider>
  );
};

export default PublicLayout;
