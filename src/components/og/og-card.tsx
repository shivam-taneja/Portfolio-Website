import type { OgCardProps } from "@/types/og.types";

const ink = "#e8efec";
const muted = "#8a9792";
const panel = "#141a18";
const line = "rgba(255,255,255,0.08)";

const grid = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="white" stroke-opacity="0.04" stroke-width="1"/></pattern></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`,
)}`;

function accentAlpha(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red},${green},${blue},${alpha})`;
}

export function OgCard({
  path,
  title,
  titleSize,
  description,
  tags,
  accent,
  headshot,
}: OgCardProps) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0a0d0c",
        backgroundImage: "linear-gradient(160deg, #0f1412 0%, #080a09 100%)",
        color: ink,
        fontFamily: "Mono",
      }}
    >
      {/* Satori renders this grid. CSS repeating backgrounds are not available here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={grid}
        width={1200}
        height={630}
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "16px 32px",
          borderBottom: `1px solid ${line}`,
          backgroundColor: "rgba(20,26,24,0.7)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 14,
            height: 14,
            borderRadius: 999,
            backgroundColor: "#f87171",
            marginRight: 12,
          }}
        />
        <div
          style={{
            display: "flex",
            width: 14,
            height: 14,
            borderRadius: 999,
            backgroundColor: "#fbbf24",
            marginRight: 12,
          }}
        />
        <div
          style={{
            display: "flex",
            width: 14,
            height: 14,
            borderRadius: 999,
            backgroundColor: accent,
          }}
        />
        <div
          style={{
            display: "flex",
            marginLeft: 16,
            fontSize: 17,
            color: muted,
          }}
        >
          {path}
        </div>
        <div
          style={{
            display: "flex",
            marginLeft: "auto",
            fontSize: 15,
            letterSpacing: 3,
            color: muted,
          }}
        >
          SHIVAMTANEJA.COM
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          padding: "0 56px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            paddingRight: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 640,
              marginTop: 8,
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2,
              fontFamily: "Sans",
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 20,
              width: 640,
            }}
          >
            <div
              style={{
                display: "flex",
                color: accent,
                marginRight: 8,
                fontSize: 24,
              }}
            >
              {"//"}
            </div>
            <div
              style={{
                display: "flex",
                width: 590,
                fontSize: 24,
                lineHeight: 1.35,
                color: muted,
              }}
            >
              {description}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: 32,
              width: 640,
            }}
          >
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "6px 14px",
                  marginRight: 10,
                  marginBottom: 10,
                  borderRadius: 6,
                  border: `1px solid ${line}`,
                  backgroundColor: panel,
                  fontSize: 16,
                  color: muted,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: 3,
              borderRadius: 26,
              backgroundImage: `linear-gradient(135deg, ${accentAlpha(accent, 0.6)}, ${accentAlpha(accent, 0.05)})`,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 256,
                height: 256,
                borderRadius: 24,
                overflow: "hidden",
              }}
            >
              {/* Satori renders this portrait. next/image does not run here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={headshot}
                width={256}
                height={256}
                alt=""
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 15,
              letterSpacing: 2.5,
              color: muted,
            }}
          >
            @codesbyshivam
          </div>
        </div>
      </div>
    </div>
  );
}
