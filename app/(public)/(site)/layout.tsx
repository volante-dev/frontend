import Footer from "@/components/layout/Footer/Footer";

const SiteLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main style={{ paddingTop: "var(--header-height)" }}>{children}</main>
      <Footer />
    </>
  );
};

export default SiteLayout;
