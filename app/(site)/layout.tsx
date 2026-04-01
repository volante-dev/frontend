import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";

const SiteLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
  </>
);

export default SiteLayout;
