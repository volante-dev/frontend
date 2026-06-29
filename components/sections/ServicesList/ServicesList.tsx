"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { colors, typography } from "@/app/theme/tokens";
import { useI18n } from "@/components/providers/I18nProvider/I18nProvider";
import RichText from "@/components/ui/RichText/RichText";

export interface Service {
  id: string;
  title: string;
  titleEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  descriptionHtml?: string | null;
  descriptionHtmlEn?: string | null;
  icon?: string | null;
  order: number;
  active: boolean;
}

interface ServicesListProps {
  services: Service[];
}

const ServicesList = ({ services }: ServicesListProps) => {
  const { t } = useI18n();
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <Box
      component="section"
      data-testid="services-section"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
        backgroundColor: colors.greenDark,
        borderBottom: "1px solid rgba(255, 255, 255, 0.16)",
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
        <Box sx={{ position: { md: "sticky" }, top: { md: 112 } }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: colors.blueGrayDark }}>
            {t("services.eyebrow", "Ce que nous faisons")}
          </Typography>
          <Typography variant="h2" sx={{ color: colors.white }}>
            {t("services.heading", "Nos services")}
          </Typography>
        </Box>

        {/* Right — accordion */}
        <Box>
          {services.map((service, index) => {
            const isOpen = openId === service.id;
            const panelId = `service-panel-${service.id}`;
            const serviceNumber = String(index + 1).padStart(2, "0");
            return (
              <Box key={service.id}>
                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.18)" }} />
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
                      outline: `2px solid ${colors.blueGrayDark}`,
                      outlineOffset: 2,
                      borderRadius: 1,
                    },
                    "& h3": { transition: "color 0.25s ease" },
                    "&:hover h3": { color: colors.blueGrayDark },
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "62px minmax(0, 1fr)", md: "104px minmax(0, 1fr)" },
                      alignItems: "center",
                      columnGap: { xs: 1.5, md: 2 },
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      aria-hidden="true"
                      sx={{
                        fontFamily: typography.fontFamilyDisplay,
                        fontSize: { xs: "3.25rem", md: "4.75rem" },
                        lineHeight: 0.82,
                        color: colors.blueGrayDark,
                      }}
                    >
                      {serviceNumber}
                    </Typography>
                    <Typography variant="h3" component="h3" sx={{ color: colors.white }}>
                      {service.title}
                    </Typography>
                  </Box>
                  <Box
                    aria-hidden="true"
                    sx={{
                      flexShrink: 0,
                      ml: 3,
                      width: { xs: 26, md: 32 },
                      height: { xs: 26, md: 32 },
                      position: "relative",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition:
                        "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s ease",
                      color: isOpen ? colors.blueGrayDark : "rgba(255, 255, 255, 0.72)",
                      "&::before, &::after": {
                        content: '""',
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: { xs: 22, md: 28 },
                        height: "1px",
                        backgroundColor: "currentColor",
                        transform: "translate(-50%, -50%)",
                      },
                      "&::after": {
                        transform: "translate(-50%, -50%) rotate(90deg)",
                      },
                    }}
                  />
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
                    <RichText
                      html={service.description}
                      sx={{
                        pb: { xs: 3, md: 4 },
                        color: colors.white,
                        "& p": { color: colors.white },
                        "& p:last-child": { mb: 0 },
                        "& h3, & h4": { color: colors.white },
                        "& a": {
                          color: colors.white,
                          textDecorationColor: colors.blueGrayDark,
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            );
          })}
          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.18)" }} />
        </Box>
      </Box>
    </Box>
  );
};

export default ServicesList;
