"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { colors } from "@/app/theme/tokens";
import VideoToggleButton from "@/components/ui/VideoToggleButton/VideoToggleButton";

interface HeroVideoProps {
  src?: string;
  poster?: string;
}

const inferVideoTypeFromUrl = (value: string) => {
  if (/\.webm(?:[?#].*)?$/i.test(value)) return "video/webm";
  if (/\.mov(?:[?#].*)?$/i.test(value)) return "video/quicktime";

  return "video/mp4";
};

const HeroVideo = ({ src, poster }: HeroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!videoRef.current || !src) return;

    if (playing) {
      void videoRef.current.play().catch(() => setPlaying(false));
    } else {
      videoRef.current.pause();
    }
  }, [playing, src]);

  const handleToggle = () => {
    setPlaying((value) => !value);
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
          key={src}
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src={src} type={inferVideoTypeFromUrl(src)} />
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
