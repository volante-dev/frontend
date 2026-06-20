import { ImageResponse } from "next/og";

export const alt = "Studio Volante — Studio de communication créative à Paris";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#f7f8f9",
          color: "#202521",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: "0.12em", fontWeight: 700 }}>
          STUDIO VOLANTE
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 600, maxWidth: 900 }}>
            Des idées qui prennent leur envol.
          </div>
          <div style={{ fontSize: 28, color: "#56705e" }}>
            Identité visuelle · Direction artistique · Stratégie de contenu
          </div>
        </div>
      </div>
    ),
    size,
  );
}
