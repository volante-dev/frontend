"use client";

interface Props {
  filterId: string;
  displacementUrl: string;
  specularUrl: string;
  width: number;
  height: number;
  scale: number;
}

// Filter chain replicated from the kube.io liquid glass demo (searchbox/music player)
const BLUR = 2.5;
const SPECULAR_OPACITY = 0.2;
const SPECULAR_SATURATION = 4;

const LiquidGlassFilter = ({
  filterId,
  displacementUrl,
  specularUrl,
  width,
  height,
  scale,
}: Props) => (
  <svg colorInterpolationFilters="sRGB" style={{ display: "none" }} aria-hidden focusable="false">
    <defs>
      <filter id={filterId}>
        <feGaussianBlur in="SourceGraphic" stdDeviation={BLUR} result="blurred_source" />
        <feImage
          href={displacementUrl}
          x="0"
          y="0"
          width={width}
          height={height}
          result="displacement_map"
        />
        <feDisplacementMap
          in="blurred_source"
          in2="displacement_map"
          scale={scale}
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />
        <feColorMatrix
          in="displaced"
          type="saturate"
          values={`${SPECULAR_SATURATION}`}
          result="displaced_saturated"
        />
        <feImage
          href={specularUrl}
          x="0"
          y="0"
          width={width}
          height={height}
          result="specular_layer"
        />
        <feComposite
          in="displaced_saturated"
          in2="specular_layer"
          operator="in"
          result="specular_saturated"
        />
        <feComponentTransfer in="specular_layer" result="specular_faded">
          <feFuncA type="linear" slope={SPECULAR_OPACITY} />
        </feComponentTransfer>
        <feBlend
          in="specular_saturated"
          in2="displaced"
          mode="normal"
          result="withSaturation"
        />
        <feBlend in="specular_faded" in2="withSaturation" mode="normal" />
      </filter>
    </defs>
  </svg>
);

export default LiquidGlassFilter;
