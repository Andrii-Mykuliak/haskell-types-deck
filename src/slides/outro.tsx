import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, Freeze, interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { POP, SlideDef, startsOf, StepProvider, stopsOf, useSteps } from "../deck/steps";
import { s7Slides } from "./s7-inference";

const SUMMARY = s7Slides.find((d) => d.id === "summary")!;
const SUMMARY_END = stopsOf(SUMMARY.steps)[SUMMARY.steps.length - 1];

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

type Particle = { tx: number; ty: number; sx: number; sy: number; bx: number; by: number; color: string; r: number; delay: number; spin: number };

/* The slide opens on the summary's last frame; a dissolve sweeps across it left → right. */
const SWEEP_FROM = 8;
const SWEEP_TO = 40;
const sweepPct = (f: number) => interpolate(f, [SWEEP_FROM, SWEEP_TO], [-10, 110], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const sweepFrameAt = (x: number) => SWEEP_FROM + (((x / 1920) * 100 + 10) / 120) * (SWEEP_TO - SWEEP_FROM);

// Where the summary's text sits — particles are born there.
const TEXT_BOXES: [number, number, number, number, number][] = [
  // x, y, w, h, weight
  [130, 195, 340, 90, 0.12],
  [190, 410, 1470, 60, 0.36],
  [190, 478, 900, 60, 0.24],
  [96, 828, 1200, 55, 0.28],
];

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
      let pick = rnd(k * 23);
      const box = TEXT_BOXES.find((b) => (pick -= b[4]) < 0) ?? TEXT_BOXES[1];
      const sx = box[0] + rnd(k * 29) * box[2];
      const sy = box[1] + rnd(k * 31) * box[3];
      const ang = rnd(k * 7) * Math.PI * 2;
      const burst = 60 + rnd(k * 11) * 160;
      out.push({
        tx: LX + (x + jx) * SCALE,
        ty: LY + (y + jy) * SCALE,
        sx,
        sy,
        bx: Math.cos(ang) * burst,
        by: Math.sin(ang) * burst - 60,
        color: poly.color,
        r: 3.2 + rnd(k * 13) * 2.6,
        delay: sweepFrameAt(sx) + rnd(k * 17) * 4,
        spin: (rnd(k * 19) - 0.5) * 1.6,
      });
    }
  }
  return out;
})();

const LOGO_CX = LX + 8.5 * SCALE;
const LOGO_CY = LY + 6 * SCALE;
const LOCK = 92; // frame the logo is fully assembled


const LogoSvg: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <svg width={17 * SCALE} height={12 * SCALE} viewBox="0 0 17 12" style={{ position: "absolute", left: LX, top: LY, ...style }}>
    {LOGO.map((p, i) => (
      <polygon key={i} points={p.pts.map((q) => q.join(",")).join(" ")} fill={p.color} />
    ))}
  </svg>
);

// Pre-rendered soft dot per colour: drawImage of a sprite is far cheaper than blurring shapes every frame.
const sprites = new Map<string, HTMLCanvasElement>();
const sprite = (hex: string) => {
  let c = sprites.get(hex);
  if (c) return c;
  c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const n = parseInt(hex.slice(1), 16);
  const rgb = `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, `rgba(255,255,255,1)`);
  g.addColorStop(0.12, `rgba(${rgb},1)`);
  g.addColorStop(0.3, `rgba(${rgb},0.9)`);
  g.addColorStop(0.45, `rgba(${rgb},0.25)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  sprites.set(hex, c);
  return c;
};

if (typeof document !== "undefined") [...LOGO.map((p) => p.color), "#ffffff"].forEach(sprite);

const STARS = Array.from({ length: 90 }, (_, i) => ({
  x: rnd(i * 23) * 1920,
  y: rnd(i * 29) * 1080,
  v: 0.2 + rnd(i * 31) * 0.5,
  r: 1 + rnd(i * 37) * 1.4,
}));

const FxCanvas: React.FC<{ f: number; dots: number; ring: number; intro: number }> = ({ f, dots, ring, intro }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 1920, 1080);

    ctx.fillStyle = "#c4b5fd";
    STARS.forEach((st, i) => {
      const y = (st.y - f * st.v + 1080) % 1080;
      ctx.globalAlpha = (0.25 + 0.35 * Math.abs(Math.sin(f / 14 + i))) * intro;
      ctx.beginPath();
      ctx.arc(st.x, y, st.r, 0, Math.PI * 2);
      ctx.fill();
    });

    if (ring > 0 && ring < 1) {
      ctx.globalAlpha = 0.6 * (1 - ring);
      ctx.strokeStyle = "#a994ff";
      ctx.lineWidth = 4 + 12 * (1 - ring);
      ctx.beginPath();
      ctx.arc(LOGO_CX, LOGO_CY, 700 * ring, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (dots > 0.01) {
      for (const p of PARTICLES) {
        const pr = Math.min(1, Math.max(0, (f - p.delay) / (LOCK - p.delay)));
        if (f < p.delay) continue;
        // ease in-out: drift away from the text first, then rush into the logo
        const e = pr < 0.5 ? 4 * pr * pr * pr : 1 - Math.pow(-2 * pr + 2, 3) / 2;
        const bulge = Math.sin(Math.PI * Math.min(1, pr * 1.25));
        // spiral in: rotate the start offset around the target as it closes in
        const a = (1 - e) * p.spin * Math.PI;
        const dx = (p.sx - p.tx) * (1 - e);
        const dy = (p.sy - p.ty) * (1 - e);
        const x = p.tx + dx * Math.cos(a) - dy * Math.sin(a) + p.bx * bulge;
        const y = p.ty + dx * Math.sin(a) + dy * Math.cos(a) + p.by * bulge;
        const size = p.r * (1 + bulge * 0.6) * 5;
        // born white like the text, tint into the logo colour on the way
        ctx.globalAlpha = dots * (1 - e);
        ctx.drawImage(sprite("#ffffff"), x - size / 2, y - size / 2, size, size);
        ctx.globalAlpha = dots * e;
        ctx.drawImage(sprite(p.color), x - size / 2, y - size / 2, size, size);
      }
    }
    ctx.globalAlpha = 1;
  }, [f, dots, ring, intro]);
  return <canvas ref={ref} width={1920} height={1080} style={{ position: "absolute", inset: 0 }} />;
};

const Outro: React.FC = () => {
  const { t, s } = useSteps();
  const f = t(0, 0);

  // Solid logo fades in as the particles settle, so the edges end up crisp.
  const solid = interpolate(f, [LOCK - 14, LOCK + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dots = 1 - interpolate(f, [LOCK - 4, LOCK + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring = interpolate(f, [LOCK, LOCK + 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(f, [LOCK - 2, LOCK + 4, LOCK + 26], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const title = "Дякую за увагу!";
  const sweep = interpolate(f, [158, 205], [-30, 130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const credit = s(0, 148);

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 38%, #221c3a 0%, ${C.bg} 60%)`, opacity: s(0, 20) }} />
      {/* the summary slide, frozen on its last frame, dissolving left → right */}
      <AbsoluteFill
        style={{
          maskImage: `linear-gradient(90deg, transparent ${sweepPct(f) - 6}%, black ${sweepPct(f) + 6}%)`,
          WebkitMaskImage: `linear-gradient(90deg, transparent ${sweepPct(f) - 6}%, black ${sweepPct(f) + 6}%)`,
          display: f > SWEEP_TO + 2 ? "none" : undefined,
        }}
      >
        <Freeze frame={SUMMARY_END}>
          <StepProvider value={startsOf(SUMMARY.steps)}>
            <SUMMARY.C />
          </StepProvider>
        </Freeze>
      </AbsoluteFill>
      {/* solid logo; the glow layer has a fixed blur and only its opacity animates */}
      <LogoSvg style={{ opacity: solid, willChange: "opacity" }} />

      {/* stars, shockwave and particles: one canvas, drawn per frame */}
      <FxCanvas f={f} dots={dots} ring={ring} intro={s(0, 30)} />

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
          textShadow: "0 0 24px rgba(169,148,255,0.35)",
        }}
      >
        {title.split("").map((ch, i) => {
          const p = s(0, 108 + i * 2.2, POP);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                opacity: Math.min(1, p),
                transform: `translateY(${(1 - p) * 70}px) scale(${0.6 + 0.4 * p})`,
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

export const outroSlide: SlideDef = { id: "thanks", title: "Дякую за увагу", steps: [212], C: Outro };
