"use client";

import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { colors } from "@/app/theme/tokens";
import { useLiquidGlass } from "@/components/ui/LiquidGlass/useLiquidGlass";
import LiquidGlassFilter from "@/components/ui/LiquidGlass/LiquidGlassFilter";

const BTN_SIZE = 44;
const BTN_RADIUS = 22; // full circle

interface HeroVideoProps {
  src?: string;
  poster?: string;
}

const HeroVideo = ({ src, poster }: HeroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  const { filterId, displacementUrl, specularUrl, isSupported, scale } = useLiquidGlass({
    width: BTN_SIZE,
    height: BTN_SIZE,
    radius: BTN_RADIUS,
  });

  const glassActive = isSupported && displacementUrl && specularUrl;

  const handleToggle = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      void videoRef.current.play();
    }
    setPlaying((v) => !v);
  };

  return (
    <Box
      component="section"
      sx={{
        height: "100svh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: colors.mutedBlack,
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        marginTop: "calc(-1 * var(--header-height))",
      }}
    >
      {src && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Scroll hint */}
      <Box
        sx={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          color: colors.white,
          opacity: 0.5,
          animation: "bounce 2s ease-in-out infinite",
          pointerEvents: "none",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </Box>

      {/* Pause/Play button */}
      {src && (
        <>
          {glassActive && (
            <LiquidGlassFilter
              filterId={filterId}
              displacementUrl={displacementUrl}
              specularUrl={specularUrl}
              width={BTN_SIZE}
              height={BTN_SIZE}
              scale={scale}
            />
          )}
          <IconButton
            onClick={handleToggle}
            aria-label={playing ? "Mettre en pause" : "Lire la vidéo"}
            sx={{
              position: "absolute",
              bottom: 32,
              left: 32,
              width: BTN_SIZE,
              height: BTN_SIZE,
              borderRadius: "50%",
              color: colors.mutedBlack,
              transform: "translateZ(0)",
              ...(glassActive
                ? {
                    backdropFilter: `url(#${filterId})`,
                    WebkitBackdropFilter: `url(#${filterId})`,
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    border: "none",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.16)",
                  }
                : {
                    backgroundColor: "rgba(247, 248, 249, 0.65)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
                    "&:hover": { backgroundColor: "rgba(247, 248, 249, 0.85)" },
                  }),
            }}
          >
            {playing ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>
        </>
      )}
    </Box>
  );
};

export default HeroVideo;
