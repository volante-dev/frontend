"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import { colors, typography } from "@/app/theme/tokens";
import { useI18n } from "@/components/providers/I18nProvider/I18nProvider";
import RichText from "@/components/ui/RichText/RichText";

type ServicePortfolioExample = {
  id: string;
  title: string;
  slug: string;
  imageUrl: string;
  coverMediaType: "IMAGE" | "VIDEO" | null;
  coverPosterUrl: string | null;
};

export interface Service {
  id: string;
  title: string;
  description: string;
  descriptionHtml?: string | null;
  icon?: string | null;
  order: number;
  active: boolean;
  portfolioExamples?: ServicePortfolioExample[];
}

interface ServicesListProps {
  services: Service[];
}

const revealTransition =
  "opacity 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 640ms cubic-bezier(0.16, 1, 0.3, 1)";

const revealSx = (isRevealed: boolean) => ({
  opacity: isRevealed ? 1 : 0,
  visibility: isRevealed ? "visible" : "hidden",
  transform: isRevealed ? "translate3d(0, 0, 0)" : "translate3d(30px, 0, 0)",
  transition: revealTransition,
  willChange: isRevealed ? "auto" : "opacity, transform",
  "@media (prefers-reduced-motion: reduce)": {
    opacity: 1,
    visibility: "visible",
    transform: "none",
    transition: "none",
    willChange: "auto",
  },
});

const useViewportReveal = (delay = 0) => {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const revealRef = useCallback((element: HTMLDivElement | null) => {
    setNode(element);
  }, []);

  useEffect(() => {
    if (!node || isRevealed) return;

    const reveal = (revealDelay = delay) => {
      timeoutRef.current = window.setTimeout(() => setIsRevealed(true), revealDelay);
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      reveal(0);
      return () => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        reveal();
        observer.unobserve(entry.target);
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.01,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, isRevealed, node]);

  return [revealRef, isRevealed] as const;
};

interface ServiceListItemProps {
  service: Service;
  index: number;
  isOpen: boolean;
  exampleLabel: string;
  portfolioHref: string;
  exampleImage: (example: ServicePortfolioExample) => string;
  onToggle: (id: string) => void;
}

const ServiceListItem = ({
  service,
  index,
  isOpen,
  exampleLabel,
  portfolioHref,
  exampleImage,
  onToggle,
}: ServiceListItemProps) => {
  const [itemRevealRef, isItemRevealed] = useViewportReveal(140 + Math.min(index, 6) * 70);
  const panelId = `service-panel-${service.id}`;
  const serviceNumber = String(index + 1).padStart(2, "0");

  return (
    <Box ref={itemRevealRef} sx={revealSx(isItemRevealed)}>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.18)" }} />
      <Box
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => onToggle(service.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle(service.id);
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
            transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s ease",
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
          {service.portfolioExamples && service.portfolioExamples.length > 0 && (
            <Box sx={{ pb: { xs: 4, md: 5 } }}>
              <Typography variant="subtitle2" sx={{ mb: 2, color: colors.blueGrayDark }}>
                {exampleLabel}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(3, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 145px))",
                  },
                  gap: { xs: 1.25, md: 2 },
                }}
              >
                {service.portfolioExamples.map((example) => (
                  <Box
                    key={example.id}
                    component={Link}
                    href={`${portfolioHref}/${example.slug}`}
                    data-link-variant="plain"
                    sx={{
                      position: "relative",
                      display: "block",
                      overflow: "hidden",
                      aspectRatio: "0.78",
                      borderRadius: 1,
                      bgcolor: "rgba(255, 255, 255, 0.08)",
                      textDecoration: "none",
                      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.16)",
                      "& img": {
                        transition: "transform 360ms cubic-bezier(0.22, 1, 0.36, 1)",
                      },
                      "&:hover img": {
                        transform: "scale(1.035)",
                      },
                      "&:focus-visible": {
                        outline: `2px solid ${colors.blueGrayDark}`,
                        outlineOffset: 3,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={exampleImage(example)}
                      alt={example.title}
                      loading="lazy"
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const ServicesList = ({ services }: ServicesListProps) => {
  const { localizedHref, t } = useI18n();
  const [openId, setOpenId] = useState<string | null>(null);
  const [headingRevealRef, isHeadingRevealed] = useViewportReveal(80);
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));
  const portfolioHref = localizedHref("portfolio");
  const exampleLabel = t("services.examples.heading", "Exemples de réalisations");

  const exampleImage = (example: ServicePortfolioExample) =>
    example.coverMediaType === "VIDEO"
      ? example.coverPosterUrl ?? example.imageUrl
      : example.imageUrl;

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
        <Box
          ref={headingRevealRef}
          sx={{
            position: { md: "sticky" },
            top: { md: 112 },
            ...revealSx(isHeadingRevealed),
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2, color: colors.blueGrayDark }}>
            {t("services.eyebrow", "Ce que nous faisons")}
          </Typography>
          <Typography variant="h2" sx={{ color: colors.white }}>
            {t("services.heading", "Nos services")}
          </Typography>
        </Box>

        {/* Right — accordion */}
        <Box>
          {services.map((service, index) => (
            <ServiceListItem
              key={service.id}
              service={service}
              index={index}
              isOpen={openId === service.id}
              exampleLabel={exampleLabel}
              portfolioHref={portfolioHref}
              exampleImage={exampleImage}
              onToggle={toggle}
            />
          ))}
          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.18)" }} />
        </Box>
      </Box>
    </Box>
  );
};

export default ServicesList;
