import Header from "@/components/layout/Header/Header";
import PreviewSync from "@/components/layout/PreviewSync/PreviewSync";

const ProjectDetailLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <PreviewSync />
    <Header />
    <main>{children}</main>
  </>
);

export default ProjectDetailLayout;
