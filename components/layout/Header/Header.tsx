"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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

const Header = () => {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith("/en") ? "en" : "fr";
  const targetLocale: Locale = locale === "en" ? "fr" : "en";
  const alternatePath = getAlternateHref(pathname, targetLocale);
  // Forcer la mise à jour du cookie via ?lang= lors du retour au FR (sans préfixe URL)
  const langSwitcherHref = targetLocale === "fr" ? `${alternatePath}?lang=fr` : alternatePath;
  const homeHref = getLocalizedHref(locale, "home");

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: colors.offWhite,
        borderBottom: `1px solid ${colors.blueGray}`,
        color: colors.mutedBlack,
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto", px: { xs: 2, md: 4 } }}>
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
          STUDIO VOLANTE
        </Typography>

        <Box
          component="nav"
          sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, alignItems: "center" }}
        >
          {navRoutes.map(({ key, label }) => {
            const href = getLocalizedHref(locale, key);
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Button
                key={key}
                variant="text"
                component={Link}
                href={href}
                sx={{
                  color: isActive ? colors.green : colors.mutedBlack,
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {label[locale]}
              </Button>
            );
          })}

          <Button
            variant="contained"
            component={Link}
            href={getLocalizedHref(locale, "contact")}
            sx={{ ml: 2 }}
          >
            Contact
          </Button>

          {/* Sélecteur de langue — hard navigation pour forcer le proxy et les nouvelles traductions */}
          <Button
            variant="text"
            component="a"
            href={langSwitcherHref}
            sx={{
              ml: 1,
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
