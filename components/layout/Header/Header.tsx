"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@/components/ui/Button/Button";
import Link from "next/link";
import { colors } from "@/app/theme/tokens";
import {
  getSiteRouteLabel,
  getLocalizedRouteHref,
  type SiteRoute,
} from "@/lib/site-route-config";
import { useLiquidGlass } from "@/components/ui/LiquidGlass/useLiquidGlass";
import LiquidGlassFilter from "@/components/ui/LiquidGlass/LiquidGlassFilter";
import { useI18n } from "@/components/providers/I18nProvider/I18nProvider";
import { useHeaderActivePill } from "./useHeaderActivePill";

const headerTint = "205, 205, 205";

const pillBase = {
  backgroundColor: `rgba(${headerTint}, 0.65)`,
  border: `1px solid rgba(${headerTint}, 0.8)`,
  boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
  overflow: "hidden",
  color: colors.mutedBlack,
  pointerEvents: "auto",
} as const;

type HeaderProps = {
  items: SiteRoute[];
};

const Header = ({ items }: HeaderProps) => {
  const { locale, localeCodes, pathname, localizedHref, alternateHref } = useI18n();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [langOpenPath, setLangOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const langOpen = langOpenPath === pathname;
  const langDesktopRef = useRef<HTMLDivElement>(null);
  const langMobileRef = useRef<HTMLDivElement>(null);
  const alternateLocales = localeCodes.filter((item) => item !== locale);
  const homeHref = localizedHref("home");
  const navItems = useMemo(
    () =>
      items.map((item) => ({
        key: item.id,
        label: getSiteRouteLabel(item, locale),
        href: getLocalizedRouteHref(items, locale, item.id),
      })),
    [items, locale],
  );
  const {
    setContainerNode: setDesktopPillContainer,
    registerItem: registerDesktopPillItem,
    pill: desktopPillState,
  } = useHeaderActivePill({
    pathname,
    items: navItems,
  });
  const {
    setContainerNode: setMobilePillContainer,
    registerItem: registerMobilePillItem,
    pill: mobilePillState,
  } = useHeaderActivePill({
    pathname,
    items: navItems,
    enabled: open,
  });

  useEffect(() => {
    if (!langOpen) return;
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!langDesktopRef.current?.contains(t) && !langMobileRef.current?.contains(t)) {
        setLangOpenPath(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [langOpen]);

  // Track desktop pill dimensions for the liquid glass displacement map
  const pillRef = useRef<HTMLDivElement>(null);
  const [pillSize, setPillSize] = useState({ width: 0, height: 56 });

  useEffect(() => {
    if (!pillRef.current) return;
    const ro = new ResizeObserver((entries) => {
      // backdrop-filter covers the border box — contentRect would miss the px padding
      const box = entries[0].borderBoxSize?.[0];
      const rect = entries[0].target.getBoundingClientRect();
      const width = box ? box.inlineSize : rect.width;
      const height = box ? box.blockSize : rect.height;
      setPillSize({ width: Math.round(width), height: Math.round(height) });
    });
    ro.observe(pillRef.current);
    return () => ro.disconnect();
  }, []);

  const { filterId, displacementUrl, specularUrl, isSupported, scale } = useLiquidGlass({
    width: pillSize.width,
    height: pillSize.height,
    radius: 29,
  });

  const glassActive = isSupported && displacementUrl && specularUrl;

  const closeMenusForLanguageNavigation = () => {
    setLangOpenPath(null);
    setOpenPath(null);
  };

  // Liquid glass needs a near-transparent background so refraction stays visible;
  // the specular ring in the filter replaces the 1px border
  const desktopGlassSx = glassActive
    ? {
        backdropFilter: `url(#${filterId})`,
        WebkitBackdropFilter: `url(#${filterId})`,
        backgroundColor: `rgba(${headerTint}, 0.35)`,
        border: "none",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.16)",
        transform: "translateZ(0)",
      }
    : {
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      };

  const logo = (text: string) => (
    <Typography
      variant="h6"
      component={Link}
      href={homeHref}
      data-link-variant="plain"
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

  const activePill = (pill: typeof desktopPillState) =>
    pill.mounted ? (
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          width: pill.width,
          height: pill.height,
          borderRadius: "999px",
          backgroundColor: `rgba(${headerTint}, 0.15)`,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: `1px solid rgba(${headerTint}, 0.28)`,
          opacity: pill.visible ? 1 : 0,
          pointerEvents: "none",
          transform: `translate3d(${pill.x}px, ${pill.y + pill.offsetY}px, 0)`,
          transition:
            "opacity 220ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1), width 320ms cubic-bezier(0.22, 1, 0.36, 1), height 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          zIndex: 0,
        }}
      />
    ) : null;

  const makeLangSwitcher = (ref: React.RefObject<HTMLDivElement | null>) => (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
        overflow: "hidden",
        maxWidth: langOpen ? `${52 + alternateLocales.length * 44}px` : "52px",
        transition: langOpen
          ? "max-width 380ms cubic-bezier(0.34, 1.56, 0.64, 1)"
          : "max-width 200ms ease-in",
      }}
    >
      <Button
        variant="text"
        onClick={() => setLangOpenPath(langOpen ? null : pathname)}
        sx={{
          color: colors.mutedBlackLight,
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
          minWidth: 0,
          width: 32,
          height: 32,
          p: 0,
          flexShrink: 0,
          borderRadius: "50%",
        }}
      >
        {locale.toUpperCase()}
      </Button>
      {alternateLocales.map((targetLocale) => (
        <Box
          key={targetLocale}
          component={Link}
          href={alternateHref(targetLocale)}
          prefetch={false}
          onClick={closeMenusForLanguageNavigation}
          data-link-variant="plain"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.mutedBlack,
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textDecoration: "none",
            minWidth: "auto",
            px: 1,
            flexShrink: 0,
            borderRadius: "999px",
            opacity: langOpen ? 1 : 0,
            transform: langOpen ? "scale(1)" : "scale(0.6)",
            transformOrigin: "right center",
            transition: langOpen
              ? "opacity 260ms 60ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 260ms 60ms cubic-bezier(0.34, 1.56, 0.64, 1)"
              : "opacity 100ms linear, transform 100ms linear",
            pointerEvents: langOpen ? "auto" : "none",
          }}
        >
          {targetLocale.toUpperCase()}
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      component="header"
      data-testid="site-header"
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
      {glassActive && (
        <LiquidGlassFilter
          filterId={filterId}
          displacementUrl={displacementUrl}
          specularUrl={specularUrl}
          width={pillSize.width}
          height={pillSize.height}
          scale={scale}
        />
      )}
      <Box
        ref={pillRef}
        sx={{
          ...pillBase,
          ...desktopGlassSx,
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

        <Box
          ref={setDesktopPillContainer}
          component="nav"
          sx={{
            position: "relative",
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            isolation: "isolate",
          }}
        >
          {activePill(desktopPillState)}
          {navItems.map(({ key, label, href }) => (
            <Box
              key={key}
              ref={registerDesktopPillItem(key)}
              sx={{ position: "relative", zIndex: 1, display: "inline-flex" }}
            >
              <Button
                variant="text"
                component={Link}
                href={href}
                sx={{
                  color: colors.mutedBlack,
                  fontWeight: 600,
                  borderRadius: "999px",
                }}
              >
                {label}
              </Button>
            </Box>
          ))}

          <Box sx={{ ml: 1 }}>{makeLangSwitcher(langDesktopRef)}</Box>
        </Box>
      </Box>

      {/* ── Mobile pill (expandable) — blur/frost fallback ── */}
      <Box
        sx={{
          ...pillBase,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          display: { xs: "block", md: "none" },
          borderRadius: open ? "24px" : "29px",
          transition: "border-radius 0.35s ease",
        }}
      >
        {/* Top row — always visible */}
        <Box sx={{ display: "flex", alignItems: "center", height: 56, px: 2 }}>
          {logo("Vlnt.")}
          {makeLangSwitcher(langMobileRef)}
          <IconButton
            onClick={() => setOpenPath(open ? null : pathname)}
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
            <Box
              ref={setMobilePillContainer}
              component="nav"
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                isolation: "isolate",
              }}
            >
              {activePill(mobilePillState)}
              {navItems.map(({ key, label, href }) => (
                <Box
                  key={key}
                  ref={registerMobilePillItem(key)}
                  sx={{ position: "relative", zIndex: 1, display: "block" }}
                >
                  <Button
                    fullWidth
                    variant="text"
                    component={Link}
                    href={href}
                    onClick={() => setOpenPath(null)}
                    sx={{
                      justifyContent: "flex-start",
                      color: colors.mutedBlack,
                      fontWeight: 600,
                      borderRadius: "999px",
                    }}
                  >
                    {label}
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default Header;
