import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ProjectGrid from "@/components/sections/ProjectGrid/ProjectGrid";
import { colors } from "@/app/theme/tokens";
import type { Project } from "@/components/sections/ProjectGrid/ProjectGrid";

export const metadata = {
  title: "Portfolio — Studio Volante",
};

const getProjects = async (): Promise<Project[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/projects`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json() as Promise<Project[]>;
  } catch {
    return [];
  }
};

const PortfolioPage = async () => {
  const projects = await getProjects();

  return (
    <>
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 4 },
          borderBottom: `1px solid ${colors.blueGray}`,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <Typography variant="subtitle2" sx={{ mb: 3, color: colors.green }}>
            Nos réalisations
          </Typography>
          <Typography variant="h1" sx={{ maxWidth: 700 }}>
            Des projets construits avec exigence.
          </Typography>
        </Box>
      </Box>

      <ProjectGrid projects={projects} />
    </>
  );
};

export default PortfolioPage;
