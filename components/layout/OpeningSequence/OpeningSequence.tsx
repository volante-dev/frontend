"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { usePublicExperience } from "@/components/layout/PublicExperience/PublicExperienceProvider";

const SESSION_KEY = "volante-intro-played";

type Phase = "idle" | "circle" | "expanded" | "done";

const OpeningSequence = () => {
  const { introActive, completeIntro } = usePublicExperience();
  // Component is client-only (ssr: false) — sessionStorage and matchMedia are always available here
  const [phase, setPhase] = useState<Phase>(() => {
    if (!introActive || sessionStorage.getItem(SESSION_KEY)) return "done";
    sessionStorage.setItem(SESSION_KEY, "1");
    return "idle";
  });

  const shouldAnimate = useRef(phase === "idle");

  // Keep the node mounted because React owns it and will remove it during navigation.
  useEffect(() => {
    if (phase === "expanded" || phase === "done") {
      document.documentElement.classList.remove("volante-intro-enabled");
    }
    if (phase === "done") {
      completeIntro();
    }
  }, [completeIntro, phase]);

  useEffect(() => {
    if (!shouldAnimate.current) return;
    const t1 = setTimeout(() => setPhase("circle"), 600);
    const t2 = setTimeout(() => setPhase("expanded"), 2800);
    const t3 = setTimeout(() => setPhase("done"), 6200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "done") return null;

  const isCircle = phase === "circle";
  const isExpanded = phase === "expanded";
  const pillVisible = isCircle || isExpanded;

  return (
    <Box
      aria-hidden
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        backgroundColor: "#000000",
        pointerEvents: "none",
        opacity: isExpanded ? 0 : 1,
        transition: isExpanded ? "opacity 2800ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
      }}
    >
      <Box
        sx={{ position: "absolute", top: 0, left: 0, right: 0, p: 2, pointerEvents: "none" }}
      >
        <Box
          sx={{
            height: 56,
            maxWidth: isExpanded ? 1200 : 56,
            mx: "auto",
            borderRadius: "29px",
            backgroundColor: "rgba(247, 248, 249, 0.65)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            overflow: "hidden",
            opacity: pillVisible ? 1 : 0,
            transform: pillVisible ? "translateY(0px)" : "translateY(-80px)",
            transition: isExpanded
              ? "max-width 1800ms cubic-bezier(0.16, 1, 0.3, 1)"
              : isCircle
                ? "opacity 1200ms cubic-bezier(0.16, 1, 0.3, 1), transform 1200ms cubic-bezier(0.16, 1, 0.3, 1)"
                : "none",
          }}
        />
      </Box>
    </Box>
  );
};

export default OpeningSequence;
