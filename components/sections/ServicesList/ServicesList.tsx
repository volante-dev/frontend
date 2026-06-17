"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { colors } from "@/app/theme/tokens";
import { t } from "@/lib/i18n";
import type { Translations } from "@/lib/i18n";

export interface Service {
  id: string;
  title: string;
  titleEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  icon?: string | null;
  order: number;
  active: boolean;
}

interface ServicesListProps {
  services: Service[];
  translations?: Translations;
}

const ServicesList = ({ services, translations = {} }: ServicesListProps) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <Box
      component="section"
      data-testid="services-section"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
        borderBottom: `1px solid ${colors.blueGray}`,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
          gap: { xs: 6, md: 12 },
          alignItems: "start",
        }}
      >
        {/* Left — heading */}
        <Box sx={{ position: { md: "sticky" }, top: { md: 48 } }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: colors.green }}>
            {t(translations, "services.eyebrow", "Ce que nous faisons")}
          </Typography>
          <Typography variant="h2">
            {t(translations, "services.heading", "Nos services")}
          </Typography>
        </Box>

        {/* Right — accordion */}
        <Box>
          {services.map((service) => {
            const isOpen = openId === service.id;
            const panelId = `service-panel-${service.id}`;
            return (
              <Box key={service.id}>
                <Divider />
                <Box
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(service.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(service.id);
                    }
                  }}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: { xs: 3, md: 4 },
                    cursor: "pointer",
                    userSelect: "none",
                    outline: "none",
                    "&:focus-visible": {
                      outline: `2px solid ${colors.green}`,
                      outlineOffset: 2,
                      borderRadius: 1,
                    },
                    "& h3": { transition: "color 0.25s ease" },
                    "&:hover h3": { color: colors.green },
                  }}
                >
                  <Typography variant="h3" component="h3">
                    {service.title}
                  </Typography>
                  <Box
                    aria-hidden="true"
                    sx={{
                      flexShrink: 0,
                      ml: 3,
                      fontSize: "1.75rem",
                      fontWeight: 300,
                      lineHeight: 1,
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition:
                        "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s ease",
                      color: isOpen ? colors.green : colors.mutedBlackLight,
                    }}
                  >
                    +
                  </Box>
                </Box>
                <Box
                  id={panelId}
                  sx={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <Box sx={{ overflow: "hidden" }}>
                    <Typography variant="body1" sx={{ pb: { xs: 3, md: 4 } }}>
                      {service.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
          <Divider />
        </Box>
      </Box>
    </Box>
  );
};

export default ServicesList;
