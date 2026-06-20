"use client";

import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import { colors } from "@/app/theme/tokens";
import VideoToggleButton from "@/components/ui/VideoToggleButton/VideoToggleButton";

interface HeroVideoProps {
  src?: string;
  poster?: string;
}

const HeroVideo = ({ src, poster }: HeroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

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
      data-scroll-anchor="hero-video"
      sx={{
        height: "100svh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: colors.mutedBlack,
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
          preload="metadata"
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
        <VideoToggleButton
          playing={playing}
          onToggle={handleToggle}
          sx={{ position: "absolute", bottom: 32, left: 32 }}
        />
      )}
    </Box>
  );
};

export default HeroVideo;
