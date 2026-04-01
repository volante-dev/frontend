"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { colors } from "@/app/theme/tokens";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
  order: number;
  active: boolean;
}

interface ServicesListProps {
  services: Service[];
}

const ServicesList = ({ services }: ServicesListProps) => (
  <Box
    component="section"
    data-testid="services-section"
    sx={{
      py: { xs: 8, md: 12 },
      px: { xs: 2, md: 4 },
      borderBottom: `1px solid ${colors.blueGray}`,
    }}
  >
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      <Typography variant="subtitle2" sx={{ mb: 2, color: colors.green }}>
        Ce que nous faisons
      </Typography>
      <Typography variant="h2" sx={{ mb: 8, maxWidth: 560 }}>
        Nos services
      </Typography>

      <Box>
        {services.map((service, i) => (
          <Box key={service.id}>
            {i > 0 && <Divider />}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
                gap: { xs: 2, md: 6 },
                py: { xs: 4, md: 5 },
                "&:hover": { "& h3": { color: colors.green } },
                transition: "all 0.2s",
              }}
            >
              <Typography variant="h3" component="h3" sx={{ transition: "color 0.2s" }}>
                {service.title}
              </Typography>
              <Typography variant="body1" sx={{ pt: { md: 0.5 } }}>
                {service.description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export default ServicesList;
