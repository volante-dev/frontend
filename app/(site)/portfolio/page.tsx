import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ProjectGrid from "@/components/sections/ProjectGrid/ProjectGrid";
import { colors } from "@/app/theme/tokens";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Portfolio — Studio Volante",
};

const PortfolioPage = async () => {
  const projects = await prisma.project
    .findMany({
      where: { publishedAt: { not: null } },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { publishedAt: "desc" }],
    })
    .catch(() => []);

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
