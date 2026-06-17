"use client";

import IconButton from "@mui/material/IconButton";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import type { SxProps, Theme } from "@mui/material/styles";
import { colors } from "@/app/theme/tokens";
import { useLiquidGlass } from "@/components/ui/LiquidGlass/useLiquidGlass";
import LiquidGlassFilter from "@/components/ui/LiquidGlass/LiquidGlassFilter";

const BTN_SIZE = 44;
const BTN_RADIUS = 22;

interface VideoToggleButtonProps {
  playing: boolean;
  onToggle: () => void;
  sx?: SxProps<Theme>;
}

const VideoToggleButton = ({ playing, onToggle, sx }: VideoToggleButtonProps) => {
  const { filterId, displacementUrl, specularUrl, isSupported, scale } = useLiquidGlass({
    width: BTN_SIZE,
    height: BTN_SIZE,
    radius: BTN_RADIUS,
  });

  const glassActive = isSupported && displacementUrl && specularUrl;

  return (
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
        onClick={onToggle}
        aria-label={playing ? "Mettre en pause" : "Lire la vidéo"}
        sx={[
          {
            width: BTN_SIZE,
            height: BTN_SIZE,
            borderRadius: "50%",
            color: colors.mutedBlack,
            transform: "translateZ(0)",
            ...(glassActive
              ? {
                  backdropFilter: `url(#${filterId})`,
                  WebkitBackdropFilter: `url(#${filterId})`,
                  backgroundColor: "rgba(255, 255, 255, 0.35)",
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
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {playing ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
      </IconButton>
    </>
  );
};

export default VideoToggleButton;
