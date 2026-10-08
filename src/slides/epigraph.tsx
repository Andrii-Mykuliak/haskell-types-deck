import React from "react";
import { Easing } from "remotion";
import { C, F } from "../deck/theme";
import { clamp01, mix, POP, SlideDef, useSteps } from "../deck/steps";
import { At, Slide } from "../deck/ui";

/* Epigraph: a type checker is a gate before running; well-typed expressions pass and run, an ill-typed one never runs. */

type Row = { expr: string; type?: string; result?: string };
const ROWS: Row[] = [
  { expr: 'length "abc"', type: ":: Int", result: "3" },
  { expr: 'words "go wrong"', type: ":: [String]", result: '["go","wrong"]' },
  { expr: '"abc" + 1' },
];

const ROW_Y = (i: number) => 340 + i * 120;
const SRC_X = 110;
const GATE_X = 900;
const RUN_X = 1290;
const START = (i: number) => 30 + i * 48;
const TRAVEL = 30;
const CHECK = 14;
const PASS = 22;
const CHAR = 18;
const chipW = (t: string) => t.length * CHAR + 40;
const ease = Easing.inOut(Easing.cubic);

const ChipBox: React.FC<{ x: number; y: number; text: string; color: string; bg?: string; opacity?: number; shake?: number }> = ({
  x,
  y,
  text,
  color,
  bg = C.panel,
  opacity = 1,
  shake = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: x + shake,
      top: y,
      height: 60,
      padding: "0 20px",
      borderRadius: 14,
      border: `3px solid ${color}`,
      background: bg,
      color,
      display: "flex",
      alignItems: "center",
      fontFamily: F.mono,
      fontWeight: 700,
      fontSize: 30,
      whiteSpace: "pre",
      fontVariantLigatures: "none",
      boxSizing: "border-box",
      opacity,
    }}
  >
    {text}
  </div>
);

const Lane: React.FC<{ row: Row; i: number }> = ({ row, i }) => {
  const { s, t } = useSteps();
  const y = ROW_Y(i);
  const f = t(0, START(i));
  const ok = row.type !== undefined;
  const w = chipW(row.expr);
  const travel = ease(clamp01(f / TRAVEL));
  const atGate = f >= TRAVEL;
  const checked = f >= TRAVEL + CHECK;
  const x = mix(SRC_X, GATE_X - w - 14, travel);
  const appear = clamp01(s(0, START(i) - 6, POP));
  const pass = ok ? ease(clamp01((f - TRAVEL - CHECK) / PASS)) : 0;
  const fail = !ok && atGate ? clamp01((f - TRAVEL) / 10) : 0;
  const shakeT = Math.max(0, f - TRAVEL);
  const shake = !ok && atGate ? Math.sin(shakeT * 1.5) * 10 * Math.max(0, 1 - shakeT / 20) : 0;
  const chipColor = !ok && atGate ? C.red : atGate ? C.mint : C.lav;
  return (
    <>
      <ChipBox x={SRC_X} y={y} text={row.expr} color={C.faint} bg="transparent" opacity={0.45 * appear * clamp01(f / 8)} />
      <ChipBox x={x} y={y} text={row.expr} color={chipColor} opacity={appear * (1 - 0.6 * pass)} shake={shake} />
      {ok && atGate && (
        <div
          style={{
            position: "absolute",
            left: GATE_X + 30,
            top: y + 12,
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 30,
            color: C.mint,
            whiteSpace: "pre",
            opacity: clamp01((f - TRAVEL) / 8),
          }}
        >
          {row.type}
        </div>
      )}
      {ok && checked && (
        <ChipBox
          x={mix(RUN_X - 20, RUN_X + 30, pass)}
          y={y}
          text={row.result!}
          color={C.mint}
          bg="rgba(134,224,168,0.14)"
          opacity={clamp01(pass * 1.5)}
        />
      )}
      {!ok && atGate && (
        <div style={{ position: "absolute", left: RUN_X + 30, top: y - 4, opacity: fail }}>
          <div style={{ fontFamily: F.body, fontWeight: 700, fontSize: 30, color: C.red }}>✗ не компілюється</div>
          <div style={{ marginTop: 4, fontFamily: F.mono, fontWeight: 600, fontSize: 22, color: C.dim, whiteSpace: "pre" }}>
            No instance for (Num String)
          </div>
        </div>
      )}
    </>
  );
};

const EpigraphSlide: React.FC = () => {
  const { s } = useSteps();
  const words = (str: string, base: number, color?: string) =>
    str.split(" ").map((w, i) => {
      const p = s(0, base + i * 5, POP);
      return (
        <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 40}px)`, color }}>
          {w + " "}
        </span>
      );
    });
  const frame = clamp01(s(0, 14));
  const label = (x: number, text: string, color: string, align: "left" | "center" = "left") => (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? x - 200 : x,
        width: align === "center" ? 400 : undefined,
        textAlign: align,
        top: 268,
        fontFamily: F.body,
        fontWeight: 800,
        fontSize: 26,
        color,
        opacity: frame,
      }}
    >
      {text}
    </div>
  );
  return (
    <Slide>
      <div style={{ position: "absolute", left: 110, top: 110, width: 1720, fontFamily: F.head, fontWeight: 800, fontSize: 64, lineHeight: 1.2, color: C.text }}>
        {words("Well-typed programs cannot", 6)}
        {words("“go wrong”.", 26, C.accentHi)}
      </div>
      {label(SRC_X, "програма", C.lav)}
      {label(GATE_X + 8, "перевірка типів", C.amber, "center")}
      {label(RUN_X + 30, "виконання", C.mint)}
      <div
        style={{
          position: "absolute",
          left: GATE_X,
          top: 310,
          width: 16,
          height: 360 * frame,
          borderRadius: 8,
          background: `linear-gradient(180deg, ${C.amber}, ${C.pink})`,
          boxShadow: "0 0 24px rgba(242,193,125,0.45)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: RUN_X,
          top: 310,
          width: 560,
          height: 360,
          borderRadius: 20,
          border: `3px dashed ${C.line}`,
          opacity: frame,
          boxSizing: "border-box",
        }}
      />
      {ROWS.map((r, i) => (
        <Lane key={i} row={r} i={i} />
      ))}
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 740,
          height: 6,
          width: mix(0, 420, s(1, 0)),
          background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
          borderRadius: 3,
        }}
      />
      <At x={110} y={770} w={1700} step={1} delay={6} size={44} weight={600} color={C.text}>
        Добре типізовані програми не можуть працювати неправильно.
      </At>
      <At x={110} y={850} step={1} delay={24} size={34} weight={400} color={C.dim} font={F.mono}>
        Robin Milner
      </At>
      <At x={110} y={900} w={1600} step={1} delay={36} size={30} weight={400} color={C.dim}>
        «A Theory of Type Polymorphism in Programming», 1978
      </At>
    </Slide>
  );
};

export const epigraphSlide: SlideDef = { id: "quote", title: "Епіграф", steps: [START(2) + TRAVEL + 60, 120], C: EpigraphSlide };
