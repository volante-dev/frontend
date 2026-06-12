"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@/components/ui/Button/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { colors } from "@/app/theme/tokens";
import { getLocalizedHref, getAlternateHref } from "@/lib/i18n";
import type { Locale, RouteKey } from "@/lib/i18n";

const navRoutes: { key: RouteKey; label: Record<Locale, string> }[] = [
  { key: "services", label: { fr: "Services", en: "Services" } },
  { key: "portfolio", label: { fr: "Portfolio", en: "Portfolio" } },
  { key: "studio", label: { fr: "Studio", en: "Studio" } },
];

const pillBase = {
  backgroundColor: "rgba(247, 248, 249, 0.65)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.8)",
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
  overflow: "hidden",
  color: colors.mutedBlack,
  pointerEvents: "auto",
} as const;

const Header = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const locale: Locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
  const targetLocale: Locale = locale === "en" ? "fr" : "en";
  const alternatePath = getAlternateHref(pathname, targetLocale);
  const langSwitcherHref = targetLocale === "fr" ? `${alternatePath}?lang=fr` : alternatePath;
  const homeHref = getLocalizedHref(locale, "home");
  const contactHref = getLocalizedHref(locale, "contact");

  const logo = (text: string) => (
    <Typography
      variant="h6"
      component={Link}
      href={homeHref}
      sx={{
        fontWeight: 700,
        fontSize: "1rem",
        letterSpacing: "0.08em",
        textDecoration: "none",
        color: colors.mutedBlack,
        flexGrow: 1,
      }}
    >
      {text}
    </Typography>
  );

  const langButton = (
    <Button
      variant="text"
      component="a"
      href={langSwitcherHref}
      sx={{
        color: colors.mutedBlackLight,
        fontSize: "0.75rem",
        fontWeight: 500,
        letterSpacing: "0.06em",
        minWidth: "auto",
        px: 1,
      }}
    >
      {locale === "fr" ? "EN" : "FR"}
    </Button>
  );

  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        p: 2,
        pointerEvents: "none",
      }}
    >
      {/* ── Desktop pill ── */}
      <Box
        sx={{
          ...pillBase,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          height: 56,
          px: 4,
          maxWidth: 1200,
          mx: "auto",
          borderRadius: "29px",
        }}
      >
        {logo("STUDIO VOLANTE")}

        <Box component="nav" sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          {navRoutes.map(({ key, label }) => {
            const href = getLocalizedHref(locale, key);
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Button
                key={key}
                variant="text"
                component={Link}
                href={href}
                sx={{ color: isActive ? colors.green : colors.mutedBlack, fontWeight: isActive ? 600 : 400 }}
              >
                {label[locale]}
              </Button>
            );
          })}

          <Button variant="contained" component={Link} href={contactHref} sx={{ ml: 2 }}>
            Contact
          </Button>

          <Box sx={{ ml: 1 }}>{langButton}</Box>
        </Box>
      </Box>

      {/* ── Mobile pill (expandable) ── */}
      <Box
        sx={{
          ...pillBase,
          display: { xs: "block", md: "none" },
          borderRadius: open ? "24px" : "29px",
          transition: "border-radius 0.35s ease",
        }}
      >
        {/* Top row — always visible */}
        <Box sx={{ display: "flex", alignItems: "center", height: 56, px: 2 }}>
          {logo("Vlnt.")}
          {langButton}
          <IconButton
            onClick={() => setOpen((v) => !v)}
            size="small"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            sx={{ ml: 0.5, color: colors.mutedBlack }}
          >
            {open ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </IconButton>
        </Box>

        {/* Expandable nav */}
        <Collapse in={open}>
          <Box sx={{ px: 2, pb: 2 }}>
            <Divider sx={{ mb: 1, borderColor: "rgba(232, 236, 240, 0.5)" }} />
            {navRoutes.map(({ key, label }) => {
              const href = getLocalizedHref(locale, key);
              const isActive = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Button
                  key={key}
                  fullWidth
                  variant="text"
                  component={Link}
                  href={href}
                  onClick={() => setOpen(false)}
                  sx={{
                    justifyContent: "flex-start",
                    color: isActive ? colors.green : colors.mutedBlack,
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {label[locale]}
                </Button>
              );
            })}
            <Button
              fullWidth
              variant="contained"
              component={Link}
              href={contactHref}
              onClick={() => setOpen(false)}
              sx={{ mt: 1 }}
            >
              Contact
            </Button>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default Header;
