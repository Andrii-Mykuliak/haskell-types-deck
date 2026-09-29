import React from "react";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Chip, Lead, Slide } from "../deck/ui";

const Cell: React.FC<{ x: number; y: number; label: string; p: number; w?: number; color?: string; border?: string; dim?: number }> = ({
  x,
  y,
  label,
  p,
  w = 100,
  color = C.mint,
  border = C.line,
  dim = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: 84,
      borderRadius: 14,
      background: C.panel,
      border: `3px solid ${border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: F.mono,
      fontWeight: 700,
      fontSize: 38,
      color,
      opacity: Math.min(1, p) * dim,
      transform: `translateX(${(1 - p) * -70}px)`,
      fontVariantLigatures: "none",
    }}
  >
    {label}
  </div>
);

/* 12 · Списки */
const ConsChain: React.FC<{ x: number; y: number; step: number }> = ({ x, y, step }) => {
  const { s } = useSteps();
  const labels = ["1", "2", "3", "[]"];
  const gap = 150;
  // Built from the end: [] first, then 3 :, 2 :, 1 :
  return (
    <>
      {labels.map((l, i) => {
        const order = labels.length - 1 - i;
        const p = s(step, 6 + order * 16, POP);
        return (
          <React.Fragment key={l}>
            <Cell x={x + i * gap} y={y} label={l} p={p} border={l === "[]" ? C.faint : C.mint} color={l === "[]" ? C.dim : C.mint} />
            {i < labels.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  left: x + i * gap + 100,
                  top: y + 18,
                  width: 50,
                  textAlign: "center",
                  fontFamily: F.mono,
                  fontSize: 38,
                  fontWeight: 700,
                  color: C.op,
                  opacity: s(step, 6 + order * 16 + 4),
                }}
              >
                :
              </div>
            )}
          </React.Fragment>
        );
      })}
      <At x={x} y={y + 110} step={step} delay={70} size={26} weight={600} color={C.dim}>
        список будується з кінця: <span style={{ fontFamily: F.mono, color: C.mint }}>x : xs</span> додає голову до хвоста
      </At>
    </>
  );
};

const S12: React.FC = () => (
  <Slide title="Списки">
    <Lead size={44}>
      <A>Список</A> — однорідна послідовність значень одного типу; тип списку елементів <span style={{ fontFamily: F.mono }}>a</span> записується{" "}
      <span style={{ fontFamily: F.mono, color: C.lav }}>[a]</span>.
    </Lead>
    <Code
      x={130}
      y={430}
      size={40}
      step={1}
      code={`
        numbers :: [Int]
        numbers = [1, 2, 3, 4]

        empty :: [Int]
        empty = []
      `}
    />
    <Code
      x={960}
      y={430}
      size={40}
      step={2}
      code={`
        numbers2 :: [Int]
        numbers2 = 1 : 2 : 3 : []
      `}
    />
    <ConsChain x={960} y={620} step={2} />
    <Code x={960} y={880} size={40} step={3} code={`1 : [2, 3]  -- [1,2,3]`} />
  </Slide>
);

/* 13 · Основні операції зі списками */
const OPS: { code: string; d: string; r: string }[] = [
  { code: "[1,2] ++ [3,4]", d: "конкатенація", r: "[1,2,3,4]" },
  { code: "length [10,20,30]", d: "довжина", r: "3" },
  { code: "null []", d: "перевірка на порожність", r: "True" },
  { code: "take 2 [10,20,30]", d: "перші n елементів", r: "[10,20]" },
  { code: "drop 2 [10,20,30]", d: "пропустити n елементів", r: "[30]" },
  { code: "head [10,20,30]", d: "голова списку", r: "10" },
  { code: "tail [10,20,30]", d: "хвіст списку", r: "[20,30]" },
];

const S13: React.FC = () => (
  <Slide title="Основні операції зі списками">
    <Lead>Операції будують нові значення, не змінюючи початковий список.</Lead>
    {OPS.map((o, i) => (
      <React.Fragment key={o.code}>
        <Code x={150} y={318 + i * 94} size={40} step={i + 1} code={o.code} />
        <At x={740} y={326 + i * 94} step={i + 1} delay={6} size={34} weight={600} color={C.dim}>
          {o.d}
        </At>
        <At x={1340} y={314 + i * 94} step={i + 1} delay={14} dir="left" pop>
          <span style={{ fontFamily: F.mono, fontSize: 36, color: C.faint, marginRight: 18 }}>⟹</span>
          <Chip size={36}>{o.r}</Chip>
        </At>
      </React.Fragment>
    ))}
  </Slide>
);

/* 14 · Декларативна побудова списків */
const Typed: React.FC<{ text: string; step: number; delay: number; x: number; y: number; perChar?: number }> = ({ text, step, delay, x, y, perChar = 1.5 }) => {
  const { t } = useSteps();
  const n = Math.max(0, Math.min(text.length, Math.floor(t(step, delay) / perChar)));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily: F.mono,
        fontWeight: 600,
        fontSize: 44,
        color: C.amber,
        whiteSpace: "pre",
        fontVariantLigatures: "none",
      }}
    >
      {n > 0 ? "⟶  " : ""}
      {text.slice(0, n)}
    </div>
  );
};

const Squares: React.FC<{ x: number; y: number; step: number }> = ({ x, y, step }) => {
  const { s } = useSteps();
  return (
    <>
      {[1, 2, 3, 4, 5].map((v, i) => {
        const appear = s(step, 14 + i * 4, POP);
        const sq = s(step, 40 + i * 6);
        return (
          <div
            key={v}
            style={{
              position: "absolute",
              left: x + i * 116,
              top: y,
              width: 96,
              height: 76,
              borderRadius: 12,
              background: C.panel,
              border: `3px solid ${sq > 0.5 ? C.amber : C.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 36,
              color: sq > 0.5 ? C.amber : C.mint,
              opacity: appear,
              transform: `scale(${appear * (1 + 0.15 * Math.sin(sq * Math.PI))})`,
            }}
          >
            {sq > 0.5 ? v * v : v}
          </div>
        );
      })}
    </>
  );
};

const Evens: React.FC<{ x: number; y: number; step: number }> = ({ x, y, step }) => {
  const { s } = useSteps();
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => i + 1).map((v, i) => {
        const appear = s(step, 14 + i * 3, POP);
        const odd = v % 2 === 1;
        const drop = odd ? s(step, 50 + i * 2) : 0;
        const ok = !odd ? s(step, 50 + i * 2) : 0;
        return (
          <div
            key={v}
            style={{
              position: "absolute",
              left: x + i * 76,
              top: y + drop * 60,
              width: 64,
              height: 70,
              borderRadius: 10,
              background: C.panel,
              border: `3px solid ${ok > 0.5 ? C.amber : odd && drop > 0.3 ? C.red : C.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: F.mono,
              fontWeight: 700,
              fontSize: 30,
              color: ok > 0.5 ? C.amber : C.mint,
              opacity: appear * (1 - 0.8 * drop),
              transform: `scale(${appear})`,
            }}
          >
            {v}
          </div>
        );
      })}
    </>
  );
};

const S14: React.FC = () => (
  <Slide title="Декларативна побудова списків">
    <Lead>Діапазони й генератори списків описують потрібну послідовність через правила її побудови.</Lead>
    <Code
      x={200}
      y={350}
      size={44}
      step={1}
      stagger={12}
      code={`
        [1..5]
        [2,4..10]
        ['a'..'e']
      `}
    />
    <Typed x={620} y={350} text="[1,2,3,4,5]" step={1} delay={16} />
    <Typed x={620} y={414} text="[2,4,6,8,10]" step={1} delay={30} />
    <Typed x={620} y={478} text={`"abcde"`} step={1} delay={44} />
    <Code x={200} y={640} size={44} step={2} code={`[x*x | x <- [1..5]]`} />
    <Squares x={1100} y={632} step={2} />
    <Code x={200} y={830} size={44} step={3} code={`[x | x <- [1..10], even x]`} />
    <Evens x={1100} y={822} step={3} />
  </Slide>
);

/* 15 · Кортежі */
const TupleViz: React.FC<{ x: number; y: number; vals: string[]; types: string[]; step: number; delay?: number; hl?: number[]; dimIdx?: number[] }> = ({
  x,
  y,
  vals,
  types,
  step,
  delay = 0,
  hl = [],
  dimIdx = [],
}) => {
  const { s } = useSteps();
  const frame = s(step, delay);
  let cx = 24;
  const widths = vals.map((v) => Math.max(v.length, types[vals.indexOf(v)]?.length ?? 0) * 24 + 60);
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: widths.reduce((a, b) => a + b + 16, 32),
          height: 128,
          borderRadius: 22,
          border: `3px dashed ${C.faint}`,
          opacity: frame,
        }}
      />
      {vals.map((v, i) => {
        const p = s(step, delay + 8 + i * 7, POP);
        const left = cx;
        cx += widths[i] + 16;
        const h = hl[i] ?? 0;
        const d = dimIdx.includes(i) ? 0.3 : 1;
        return (
          <div key={i} style={{ position: "absolute", left, top: 20, width: widths[i], opacity: Math.min(1, p) * d, transform: `translateY(${-h * 26}px) scale(${p})` }}>
            <div
              style={{
                height: 76,
                borderRadius: 12,
                background: h > 0.5 ? "rgba(141,118,220,0.25)" : C.panel,
                border: `3px solid ${h > 0.5 ? C.accentHi : C.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: F.mono,
                fontWeight: 700,
                fontSize: 34,
                color: v.startsWith('"') ? C.amber : /^[A-Z]/.test(v) ? C.lav : C.orange,
                boxShadow: h > 0.5 ? `0 0 30px rgba(169,148,255,${0.4 * h})` : undefined,
              }}
            >
              {v}
            </div>
            <div style={{ textAlign: "center", marginTop: 44, fontFamily: F.mono, fontSize: 26, fontWeight: 600, color: C.lav }}>{types[i]}</div>
          </div>
        );
      })}
    </div>
  );
};

const S15: React.FC = () => (
  <Slide title="Кортежі">
    <Lead>Кортеж має фіксовану довжину, а його компоненти можуть мати різні типи.</Lead>
    <Code
      x={130}
      y={400}
      size={46}
      step={1}
      code={`
        point :: (Double, Double)
        point = (2.5, 4.0)
      `}
    />
    <TupleViz x={1100} y={380} vals={["2.5", "4.0"]} types={["Double", "Double"]} step={1} delay={14} />
    <Code
      x={130}
      y={700}
      size={46}
      step={2}
      code={`
        student :: (String, Int, Bool)
        student = ("Anna", 20, True)
      `}
    />
    <TupleViz x={1100} y={680} vals={['"Anna"', "20", "True"]} types={["String", "Int", "Bool"]} step={2} delay={14} />
  </Slide>
);

/* 16 · Доступ до компонентів пари */
const S16: React.FC = () => {
  const { s } = useSteps();
  const h0 = s(2, 30) * (1 - s(3, 0));
  const h1 = s(3, 10);
  return (
    <Slide title="Доступ до компонентів пари">
      <Lead>
        Для пар стандартна бібліотека надає <span style={{ fontFamily: F.mono, color: C.mint }}>fst</span> і{" "}
        <span style={{ fontFamily: F.mono, color: C.mint }}>snd</span>; їхні типи є поліморфними.
      </Lead>
      <Code
        x={150}
        y={380}
        size={48}
        code={`
          @1 fst :: ([[2@30|a]], b) -> [[2@30|a]]
          @1 snd :: (a, [[3@10|b]]) -> [[3@10|b]]
          @1
          @2 nameAndAge = ("Anna", 20)
          @2+26 fst nameAndAge  -- "Anna"
          @3 snd nameAndAge  -- 20
        `}
      />
      <TupleViz x={1200} y={560} vals={['"Anna"', "20"]} types={["a", "b"]} step={2} delay={4} hl={[h0, h1]} />
    </Slide>
  );
};

export const s3Slides: SlideDef[] = [
  { id: "lists", title: "Списки", steps: [45, 40, 110, 45], C: S12 },
  { id: "list-ops", title: "Операції зі списками", steps: [40, 35, 35, 35, 35, 35, 35, 35], C: S13 },
  { id: "ranges", title: "Декларативна побудова", steps: [40, 70, 80, 90], C: S14 },
  { id: "tuples", title: "Кортежі", steps: [40, 55, 60], C: S15 },
  { id: "fst-snd", title: "fst і snd", steps: [40, 40, 60, 50], C: S16 },
];

