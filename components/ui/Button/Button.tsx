"use client";

import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import type { ForwardedRef } from "react";
import { colors, borderRadius } from "@/app/theme/tokens";
import LiquidGlassFilter from "@/components/ui/LiquidGlass/LiquidGlassFilter";
import { useLiquidGlass } from "@/components/ui/LiquidGlass/useLiquidGlass";

export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  /** Affiche un état de chargement */
  loading?: boolean;
  variant?: MuiButtonProps["variant"] | "liquidGlass";
}

const setForwardedRef = (
  ref: ForwardedRef<HTMLButtonElement>,
  node: HTMLButtonElement | null,
) => {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
};

const LiquidGlassButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "variant">
>(
  ({ loading = false, disabled, children, sx, ...props }, forwardedRef) => {
    const elementRef = useRef<HTMLButtonElement | null>(null);
    const [size, setSize] = useState<{
      width: number;
      height: number;
      radius: number;
    }>({ width: 0, height: 0, radius: borderRadius.sm });
    const ref = useCallback(
      (node: HTMLButtonElement | null) => {
        elementRef.current = node;
        setForwardedRef(forwardedRef, node);
      },
      [forwardedRef],
    );

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;
      const measure = () => {
        const rect = element.getBoundingClientRect();
        const radiusValue = getComputedStyle(element).borderTopLeftRadius;
        const radius = radiusValue.includes("%")
          ? (Math.min(rect.width, rect.height) * Number.parseFloat(radiusValue)) / 100
          : Number.parseFloat(radiusValue);
        const next = {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          radius: Number.isFinite(radius) ? radius : borderRadius.sm,
        };
        setSize((current) =>
          current.width === next.width &&
          current.height === next.height &&
          current.radius === next.radius
            ? current
            : next,
        );
      };
      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(element);
      return () => observer.disconnect();
    }, []);

    const { filterId, displacementUrl, specularUrl, isSupported, scale } =
      useLiquidGlass(size);
    const glassActive = isSupported && displacementUrl && specularUrl;

    return (
      <>
        {glassActive && (
          <LiquidGlassFilter
            filterId={filterId}
            displacementUrl={displacementUrl}
            specularUrl={specularUrl}
            width={size.width}
            height={size.height}
            scale={scale}
          />
        )}
        <MuiButton
          ref={ref}
          variant="text"
          disabled={disabled || loading}
          {...props}
          sx={[
            {
              color: colors.mutedBlack,
              overflow: "hidden",
              transform: "translateZ(0)",
              transition: "background-color 220ms ease, box-shadow 220ms ease",
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
                  }),
              "&:hover": {
                color: colors.mutedBlack,
                backgroundColor: glassActive
                  ? "rgba(255, 255, 255, 0.42)"
                  : "rgba(247, 248, 249, 0.85)",
                boxShadow: "0 6px 24px rgba(0, 0, 0, 0.18)",
              },
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          {loading ? "Chargement…" : children}
        </MuiButton>
      </>
    );
  },
);

LiquidGlassButton.displayName = "LiquidGlassButton";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading = false, disabled, children, variant, ...props }, ref) => {
    if (variant === "liquidGlass") {
      return (
        <LiquidGlassButton ref={ref} loading={loading} disabled={disabled} {...props}>
          {children}
        </LiquidGlassButton>
      );
    }

    return (
      <MuiButton ref={ref} disabled={disabled || loading} variant={variant} {...props}>
      {loading ? "Chargement…" : children}
      </MuiButton>
    );
  },
);

Button.displayName = "Button";

export default Button;
