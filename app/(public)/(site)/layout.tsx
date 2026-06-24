import Footer from "@/components/layout/Footer/Footer";
import SiteMain from "@/components/layout/SiteMain/SiteMain";

const SiteLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SiteMain>{children}</SiteMain>
      <Footer />
    </>
  );
};

export default SiteLayout;
