import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";

/* Final slide: particles swirl in and assemble the Haskell logo, then the thank-you. */

type Poly = { pts: [number, number][]; color: string };

const LOGO: Poly[] = [
  { color: "#6d5a9c", pts: [[0, 12], [4, 6], [0, 0], [3, 0], [7, 6], [3, 12]] },
  { color: "#8f78d6", pts: [[4, 12], [8, 6], [4, 0], [7, 0], [15, 12], [12, 12], [9.5, 8.25], [7, 12]] },
  { color: "#c060b6", pts: [[13.66, 8.5], [12.33, 6.5], [17, 6.5], [17, 8.5]] },
  { color: "#c060b6", pts: [[11.66, 5.5], [10.33, 3.5], [17, 3.5], [17, 5.5]] },
];

const inside = (x: number, y: number, pts: [number, number][]) => {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

const rnd = (n: number) => {
  const x = Math.sin(n * 91.345 + 47.853) * 43758.5453;
  return x - Math.floor(x);
};

const SCALE = 36; // px per logo unit → 612 × 432
const LX = 960 - (17 * SCALE) / 2;
const LY = 150;

type Particle = { tx: number; ty: number; sx: number; sy: number; color: string; r: number; delay: number; spin: number };

const PARTICLES: Particle[] = (() => {
  const out: Particle[] = [];
  let k = 0;
  const step = 0.28;
  for (let y = step / 2; y < 12; y += step) {
    for (let x = step / 2; x < 17; x += step) {
      const poly = LOGO.find((p) => inside(x, y, p.pts));
      if (!poly) continue;
      k++;
      const jx = (rnd(k * 3) - 0.5) * step * 0.6;
      const jy = (rnd(k * 5) - 0.5) * step * 0.6;
      const ang = rnd(k * 7) * Math.PI * 2;
      const dist = 900 + rnd(k * 11) * 700;
      out.push({
        tx: LX + (x + jx) * SCALE,
        ty: LY + (y + jy) * SCALE,
        sx: 960 + Math.cos(ang) * dist,
        sy: 540 + Math.sin(ang) * dist * 0.7,
        color: poly.color,
        r: 3.2 + rnd(k * 13) * 2.6,
        delay: rnd(k * 17) * 34,
        spin: (rnd(k * 19) - 0.5) * 2.4,
      });
    }
  }
  return out;
})();

const LOGO_CX = LX + 8.5 * SCALE;
const LOGO_CY = LY + 6 * SCALE;
const LOCK = 62; // frame the logo is fully assembled

const Outro: React.FC = () => {
  const { t, s } = useSteps();
  const f = t(0, 0);

  // Solid logo fades in as the particles settle, so the edges end up crisp.
  const solid = interpolate(f, [LOCK - 8, LOCK + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dots = 1 - interpolate(f, [LOCK + 4, LOCK + 26], [0, 0.85], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring = interpolate(f, [LOCK, LOCK + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(f, [LOCK - 2, LOCK + 4, LOCK + 26], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const title = "Дякую за увагу!";
  const sweep = interpolate(f, [128, 175], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const credit = s(0, 118);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 38%, #221c3a 0%, ${C.bg} 60%)`, overflow: "hidden" }}>
      {/* slow drifting star field */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 90 }, (_, i) => {
          const x = rnd(i * 23) * 1920;
          const y = (rnd(i * 29) * 1080 - f * (0.2 + rnd(i * 31) * 0.5) + 1080) % 1080;
          const tw = 0.25 + 0.35 * Math.abs(Math.sin(f / 14 + i));
          return <circle key={i} cx={x} cy={y} r={1 + rnd(i * 37) * 1.4} fill="#c4b5fd" opacity={tw * s(0, 0)} />;
        })}
      </svg>

      {/* shockwave */}
      <div
        style={{
          position: "absolute",
          left: LOGO_CX - 700 * ring,
          top: LOGO_CY - 700 * ring,
          width: 1400 * ring,
          height: 1400 * ring,
          borderRadius: "50%",
          border: `${4 + 10 * (1 - ring)}px solid rgba(169,148,255,${0.55 * (1 - ring)})`,
          boxShadow: `0 0 60px rgba(169,148,255,${0.4 * (1 - ring)})`,
        }}
      />

      {/* solid logo with glow */}
      <svg
        width={17 * SCALE}
        height={12 * SCALE}
        viewBox="0 0 17 12"
        style={{
          position: "absolute",
          left: LX,
          top: LY,
          opacity: solid,
          filter: `drop-shadow(0 0 ${30 + 50 * flash}px rgba(192,96,182,${0.35 + 0.5 * flash}))`,
        }}
      >
        {LOGO.map((p, i) => (
          <polygon key={i} points={p.pts.map((q) => q.join(",")).join(" ")} fill={p.color} />
        ))}
      </svg>

      {/* particles */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: dots }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#glow)">
          {PARTICLES.map((p, i) => {
            const pr = Math.min(1, Math.max(0, (f - p.delay) / (LOCK - p.delay)));
            const e = 1 - Math.pow(1 - pr, 3);
            // spiral in: rotate the start offset around the target as it closes in
            const a = (1 - e) * p.spin * Math.PI;
            const dx = (p.sx - p.tx) * (1 - e);
            const dy = (p.sy - p.ty) * (1 - e);
            const x = p.tx + dx * Math.cos(a) - dy * Math.sin(a);
            const y = p.ty + dx * Math.sin(a) + dy * Math.cos(a);
            return <circle key={i} cx={x} cy={y} r={p.r * (1 + (1 - e) * 0.8)} fill={p.color} opacity={pr > 0 ? 0.35 + 0.65 * e : 0} />;
          })}
        </g>
      </svg>

      {/* white flash on lock */}
      <AbsoluteFill style={{ background: "#ffffff", opacity: flash * 0.08, pointerEvents: "none" }} />

      {/* title */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 640,
          textAlign: "center",
          fontFamily: F.head,
          fontWeight: 800,
          fontSize: 124,
          color: C.text,
          letterSpacing: 1,
        }}
      >
        {title.split("").map((ch, i) => {
          const p = s(0, 78 + i * 2.2, POP);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                opacity: Math.min(1, p),
                transform: `translateY(${(1 - p) * 70}px) scale(${0.6 + 0.4 * p})`,
                textShadow: `0 0 ${24 * p}px rgba(169,148,255,0.35)`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>

      {/* credit with light sweep */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1920,
          top: 830,
          textAlign: "center",
          opacity: credit,
          transform: `translateY(${(1 - credit) * 20}px)`,
        }}
      >
        <span
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 38,
            letterSpacing: 2,
            backgroundImage: `linear-gradient(100deg, ${C.dim} 0%, ${C.dim} ${sweep - 12}%, #ffffff ${sweep}%, ${C.dim} ${sweep + 12}%, ${C.dim} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          made with Claude Opus 5.5
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 960 - 160 * credit,
          top: 900,
          width: 320 * credit,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.accentHi}, transparent)`,
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
};

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [180], C: Outro };
