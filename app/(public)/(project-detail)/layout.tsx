const ProjectDetailLayout = ({ children }: { children: React.ReactNode }) => (
  <main style={{ height: "100svh", overflow: "hidden", overscrollBehavior: "none" }}>
    {children}
  </main>
);

export default ProjectDetailLayout;
