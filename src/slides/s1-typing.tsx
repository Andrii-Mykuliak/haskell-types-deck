import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { A, At, Chip, Lead, Slide } from "../deck/ui";

/* 3 · Тип як частина формальної моделі */
const Sieve: React.FC = () => {
  const { s, t } = useSteps();
  const items = [
    { code: "square 3", ok: true, x: 1380 },
    { code: '"a" + 1', ok: false, x: 1380 },
    { code: "not True", ok: true, x: 1640 },
    { code: "head 5", ok: false, x: 1640 },
  ];
  const filterY = 560;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 1380,
          top: filterY + 60,
          width: 470,
          height: 10,
          opacity: s(3, 0),
          backgroundImage: `repeating-linear-gradient(90deg, ${C.accent} 0 34px, transparent 34px 52px)`,
          borderRadius: 5,
        }}
      />
      <At x={1380} y={filterY + 82} step={3} size={24} weight={600} color={C.dim}>
        перевірка типів
      </At>
      {items.map((it, i) => {
        const tt = t(3, 10 + i * 9);
        const fall = s(3, 10 + i * 9, { damping: 16, stiffness: 90 });
        const pass = it.ok ? s(3, 34 + i * 9, { damping: 18, stiffness: 80 }) : 0;
        const y = mix(270, filterY, fall) + pass * 190;
        const x = it.x;
        const hit = !it.ok && tt > 22;
        const shake = hit ? Math.sin(tt * 1.4) * 6 * Math.max(0, 1 - (tt - 22) / 16) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: x + shake, top: y, opacity: Math.min(1, fall * 1.5) }}>
            <Chip
              size={30}
              color={hit ? C.red : it.ok && pass > 0.5 ? C.mint : C.text}
              border={hit ? C.red : it.ok && pass > 0.5 ? C.mint : C.line}
            >
              {it.code}
            </Chip>
          </div>
        );
      })}
    </>
  );
};

const S03: React.FC = () => (
  <Slide title="Тип як частина формальної моделі">
    <Lead>Кожен вираз має тип: він описує допустимі значення та правила їх використання.</Lead>
    <At x={140} y={380} w={1160} step={1} size={50} dir="left">
      <A>Тип</A> — формальний опис допустимих значень виразу та способів їх використання.
    </At>
    <At x={140} y={600} w={1160} step={2} size={50} dir="left">
      <A>Система типів</A> — правила приписування й узгодження типів.
    </At>
    <At x={140} y={860} w={1250} step={3} size={34}>
      Типізація відсіює частину некоректних програм ще до обчислення.
    </At>
    <Sieve />
  </Slide>
);

/* 4 · Статична і динамічна типізація */
const Timeline: React.FC<{ x: number; step: number; atCompile: boolean }> = ({ x, step, atCompile }) => {
  const { s } = useSteps();
  const p = s(step, 0);
  const drop = s(step, 25, POP);
  const segW = 330;
  const y = 700;
  const markX = x + (atCompile ? segW / 2 : segW + 30 + segW / 2);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: p }}>
      {["компіляція", "виконання"].map((label, i) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: x + i * (segW + 30),
            top: y,
            width: segW * s(step, i * 8),
            height: 64,
            borderRadius: 12,
            background: C.panel,
            border: `2px solid ${C.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 600,
            color: C.dim,
            overflow: "hidden",
          }}
        >
          {label}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: markX - 130,
          top: mix(560, 600, drop),
          width: 260,
          textAlign: "center",
          opacity: drop,
        }}
      >
        <Chip size={26} color={C.bg} bg={C.mint} border={C.mint}>
          ✓ перевірка типів
        </Chip>
        <div style={{ width: 3, height: 22 * drop, margin: "6px auto 0", background: C.mint }} />
      </div>
    </div>
  );
};

const S04: React.FC = () => (
  <Slide title="Статична і динамічна типізація">
    <Lead>Ці терміни відповідають насамперед на питання: коли перевіряється узгодженість типів?</Lead>
    <At x={110} y={380} step={1} size={44} dir="left">
      <A>Статична</A>
      <div style={{ fontSize: 40, marginTop: 14 }}>• перевірка до виконання</div>
      <div style={{ fontSize: 40, marginTop: 6 }}>• Haskell, C#, Java</div>
    </At>
    <Timeline x={110} step={1} atCompile />
    <At x={1000} y={380} step={2} size={44} dir="right">
      <A>Динамічна</A>
      <div style={{ fontSize: 40, marginTop: 14 }}>• перевірка під час виконання</div>
      <div style={{ fontSize: 40, marginTop: 6 }}>• Python, JavaScript, Ruby</div>
    </At>
    <Timeline x={1000} step={2} atCompile={false} />
    <div style={{ position: "absolute", left: 958, top: 390, width: 2, height: 420, background: C.line, opacity: 0.6 }} />
  </Slide>
);

/* 5 · Сильна і слабка типізація */
const S05: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Сильна і слабка типізація">
      <Lead>Інша вісь описує, наскільки суворо мова розмежовує типи та контролює неявні перетворення.</Lead>
      <At x={110} y={360} w={780} step={1} size={40} dir="left">
        <A>Сильна типізація</A>
        <div style={{ marginTop: 10 }}>несумісні типи не змішуються безконтрольно; перетворення обмежені.</div>
      </At>
      <At x={110} y={600} step={1} delay={18} dir="left">
        <Chip size={34}>{'"1" + 1'}</Chip>
        <span style={{ fontSize: 34, margin: "0 18px", color: C.dim }}>⟶</span>
        <Chip size={30} color={C.red} border={C.red}>
          ✗ помилка типу
        </Chip>
      </At>
      <At x={1000} y={360} w={800} step={2} size={40} dir="right">
        <A>Слабка типізація</A>
        <div style={{ marginTop: 10 }}>допускає неявне змішування або перетворення значень різних типів.</div>
      </At>
      <At x={1000} y={600} step={2} delay={18} dir="right">
        <Chip size={34}>{'"1" + 1'}</Chip>
        <span style={{ fontSize: 34, margin: "0 18px", color: C.dim }}>⟶</span>
        <Chip size={34} color={C.amber} border={C.amber}>
          {'"11"'}
        </Chip>
        <span style={{ fontSize: 24, marginLeft: 16, color: C.faint, fontFamily: F.mono }}>JavaScript</span>
      </At>
      {["Статична ≠ сильна.", "Динамічна ≠ слабка.", "Це різні характеристики системи типів."].map((l, i) => (
        <At key={i} x={560} y={780 + i * 60} step={3} delay={i * 8} size={38}>
          {l.split("≠").map((part, j, arr) => (
            <React.Fragment key={j}>
              {part}
              {j < arr.length - 1 && (
                <span style={{ color: C.pink, display: "inline-block", transform: `scale(${1 + 0.4 * (1 - s(3, i * 8 + 8, POP))})` }}>≠</span>
              )}
            </React.Fragment>
          ))}
        </At>
      ))}
    </Slide>
  );
};

/* 6 · Класифікація мов — hand-drawn marker sketch, like the original slide */
const hand = loadCaveat("normal", { weights: ["500", "700"], subsets: ["latin", "cyrillic"] }).fontFamily;

const CX = 960;
const CY = 560;
const INK_RED = "#d7303a";
const INK_BLUE = "#4585ad";

// Deterministic pseudo-random in [-1, 1]
const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

/** A slightly wobbly polyline between two points, like a marker stroke. */
const wobbly = (x1: number, y1: number, x2: number, y2: number, seed: number, amp = 5, n = 7) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  let d = `M ${x1} ${y1}`;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const off = i === n ? 0 : rnd(seed + i) * amp;
    const px = x1 + dx * t + nx * off;
    const py = y1 + dy * t + ny * off;
    const ct = (i - 0.5) / n;
    const coff = rnd(seed + i + 50) * amp;
    d += ` Q ${x1 + dx * ct + nx * coff} ${y1 + dy * ct + ny * coff} ${px} ${py}`;
  }
  return d;
};

/** Hand-drawn loop around a point (overshoots like a real pen circle). */
const scribbleEllipse = (cx: number, cy: number, rx: number, ry: number, seed: number) => {
  const pts: string[] = [];
  const turns = 1.15;
  const N = 40;
  for (let i = 0; i <= N; i++) {
    const a = -2.4 + (i / N) * Math.PI * 2 * turns;
    const k = 1 + rnd(seed + i) * 0.04 + (i / N) * 0.06;
    pts.push(`${cx + Math.cos(a) * rx * k},${cy + Math.sin(a) * ry * k}`);
  }
  return `M ${pts[0]} L ${pts.slice(1).join(" L ")}`;
};

const Stroke: React.FC<{ d: string; p: number; color?: string; width?: number }> = ({ d, p, color = INK_RED, width = 6 }) => (
  <path
    d={d}
    pathLength={1}
    strokeDasharray="1 1"
    strokeDashoffset={1 - p}
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    opacity={p > 0 ? 1 : 0}
  />
);

const LANGS: { n: string; x: number; y: number; g: number }[] = [
  { n: "Erlang", x: -250, y: -300, g: 1 },
  { n: "Clojure", x: -340, y: -175, g: 1 },
  { n: "Groovy", x: -110, y: -225, g: 1 },
  { n: "Python", x: -250, y: -95, g: 1 },
  { n: "Ruby", x: -95, y: -70, g: 1 },
  { n: "C#", x: 110, y: -300, g: 2 },
  { n: "Scala", x: 330, y: -305, g: 2 },
  { n: "Java", x: 190, y: -215, g: 2 },
  { n: "F#", x: 130, y: -95, g: 2 },
  { n: "Haskell", x: 360, y: -145, g: 2 },
  { n: "Perl", x: -360, y: 110, g: 3 },
  { n: "PHP", x: -140, y: 90, g: 3 },
  { n: "VB", x: -280, y: 200, g: 3 },
  { n: "JavaScript", x: -150, y: 290, g: 3 },
  { n: "C", x: 150, y: 110, g: 3 },
  { n: "C++", x: 300, y: 235, g: 3 },
];

const S06: React.FC = () => {
  const { lin, frame } = useSteps();
  const vAxis = lin(0, 4, 18);
  const hAxis = lin(0, 16, 18);
  const heads = lin(0, 32, 8);
  const circle = lin(4, 4, 22);
  // "Boil": the displacement seed changes every few frames, so lines shimmer while animating.
  const boilSeed = Math.floor(frame / 4) % 4;

  const top = CY - 400;
  const bottom = CY + 400;
  const left = CX - 500;
  const right = CX + 490;
  const head = (x: number, y: number, ang: number, seed: number) => {
    const a1 = ang + Math.PI - 0.5;
    const a2 = ang + Math.PI + 0.5;
    const L = 38;
    return (
      <>
        <Stroke d={wobbly(x, y, x + Math.cos(a1) * L, y + Math.sin(a1) * L, seed, 1.5, 2)} p={heads} />
        <Stroke d={wobbly(x, y, x + Math.cos(a2) * L, y + Math.sin(a2) * L, seed + 9, 1.5, 2)} p={heads} />
      </>
    );
  };

  const labels = [
    { t: "СИЛЬНА", x: CX + 22, y: top - 44, r: -2, d: 36 },
    { t: "СЛАБКА", x: CX + 30, y: bottom - 60, r: -1, d: 40 },
    { t: "ДИНАМІЧНА", x: left - 360, y: CY - 44, r: 2, d: 44 },
    { t: "СТАТИЧНА", x: right + 14, y: CY - 44, r: -2, d: 48 },
  ];

  return (
    <AbsoluteFill style={{ background: "#0b0b0d", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id="marker">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={boilSeed} />
          <feDisplacementMap in="SourceGraphic" scale={3.5} />
        </filter>
      </svg>
      <div style={{ position: "absolute", inset: 0, filter: "url(#marker)" }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <Stroke d={wobbly(CX + 4, bottom, CX - 2, top, 11, 4)} p={vAxis} />
          <Stroke d={wobbly(right, CY + 3, left, CY - 4, 23, 4)} p={hAxis} />
          {head(CX - 2, top, -Math.PI / 2, 31)}
          {head(CX + 4, bottom, Math.PI / 2, 41)}
          {head(left, CY - 4, Math.PI, 51)}
          {head(right, CY + 3, 0, 61)}
          <Stroke d={scribbleEllipse(CX + 360, CY - 145, 150, 58, 71)} p={circle} width={5} />
        </svg>
        {labels.map((l) => (
          <Written key={l.t} x={l.x} y={l.y} step={0} delay={l.d} rot={l.r} color={INK_RED} size={62} weight={700} font={hand} dur={12}>
            {l.t}
          </Written>
        ))}
        {LANGS.map((l, i) => {
          const idx = LANGS.filter((o) => o.g === l.g).indexOf(l);
          return (
            <Written
              key={l.n}
              x={CX + l.x}
              y={CY + l.y}
              center
              step={l.g}
              delay={4 + idx * 7}
              rot={rnd(i + 5) * 7}
              color={INK_BLUE}
              size={l.n === "Haskell" ? 64 : 58}
              weight={500}
              font={hand}
              dur={10}
            >
              {l.n}
            </Written>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Text revealed left → right, as if being written. */
const Written: React.FC<{
  x: number;
  y: number;
  step: number;
  delay: number;
  rot: number;
  color: string;
  size: number;
  weight: number;
  font: string;
  dur: number;
  center?: boolean;
  children: React.ReactNode;
}> = ({ x, y, step, delay, rot, color, size, weight, font, dur, center, children }) => {
  const { lin } = useSteps();
  const p = lin(step, delay, dur);
  return (
    <div
      style={{
        position: "absolute",
        left: center ? x - 200 : x,
        top: center ? y - size * 0.6 : y,
        width: center ? 400 : undefined,
        textAlign: center ? "center" : undefined,
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        color,
        whiteSpace: "nowrap",
        transform: `rotate(${rot}deg)`,
        opacity: p > 0 ? 1 : 0,
      }}
    >
      <span style={{ display: "inline-block", clipPath: `inset(-20% ${(1 - p) * 115 - 15}% -20% -5%)` }}>{children}</span>
    </div>
  );
};

export const s1Slides: SlideDef[] = [
  { id: "type-model", title: "Тип як частина формальної моделі", steps: [40, 35, 35, 80], C: S03 },
  { id: "static-dynamic", title: "Статична і динамічна", steps: [40, 70, 70], C: S04 },
  { id: "strong-weak", title: "Сильна і слабка", steps: [40, 55, 55, 50], C: S05 },
  { id: "quadrant", title: "Класифікація мов", steps: [70, 50, 50, 55, 40], C: S06 },
];

