import React from "react";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Chip, Lead, M, Slide } from "../deck/ui";

/* Function as a machine: [in] → (name) → [out] */
export const FnDiagram: React.FC<{ x: number; y: number; inT: string; name: string; outT: string; step: number; delay?: number }> = ({
  x,
  y,
  inT,
  name,
  outT,
  step,
  delay = 0,
}) => {
  const { s } = useSteps();
  const pIn = s(step, delay, POP);
  const pFn = s(step, delay + 10, POP);
  const pOut = s(step, delay + 26, POP);
  const box = (label: string, p: number, left: number, w: number, fn = false) => (
    <div
      style={{
        position: "absolute",
        left,
        top: y,
        width: w,
        height: 76,
        borderRadius: fn ? 38 : 12,
        border: `3px solid ${fn ? C.accent : C.lav}`,
        background: fn ? "rgba(141,118,220,0.2)" : C.panel,
        color: fn ? C.text : C.lav,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: F.mono,
        fontWeight: 700,
        fontSize: 32,
        opacity: Math.min(1, p),
        transform: `scale(${p})`,
      }}
    >
      {label}
    </div>
  );
  const wIn = 150;
  const wFn = 250;
  const gap = 80;
  return (
    <>
      {box(inT, pIn, x, wIn)}
      <Arrow x1={x + wIn + 10} y1={y + 38} x2={x + wIn + gap - 10} y2={y + 38} step={step} delay={delay + 6} dur={10} color={C.dim} />
      {box(name, pFn, x + wIn + gap, wFn, true)}
      <Arrow x1={x + wIn + gap + wFn + 10} y1={y + 38} x2={x + wIn + 2 * gap + wFn - 10} y2={y + 38} step={step} delay={delay + 20} dur={10} color={C.dim} />
      {box(outT, pOut, x + wIn + 2 * gap + wFn, wIn)}
    </>
  );
};

/* 7 · Сигнатура як контракт */
const S07: React.FC = () => (
  <Slide title="Сигнатура як контракт">
    <Lead>Тип функції показує форму перетворення ще до читання реалізації.</Lead>
    <Code
      x={150}
      y={400}
      size={48}
      step={1}
      code={`
        square :: Int -> Int
        @2 square x = x * x
      `}
    />
    <FnDiagram x={150} y={600} inT="Int" name="square" outT="Int" step={1} delay={14} />
    <At x={150} y={710} step={2} delay={10} size={28} weight={600} color={C.dim}>
      реалізація — лише одна з можливих всередині контракту
    </At>
    <Code
      x={1010}
      y={400}
      size={48}
      step={3}
      code={`
        isPositive :: Int -> Bool
        isPositive x = x > 0
      `}
    />
    <FnDiagram x={1010} y={600} inT="Int" name="isPositive" outT="Bool" step={3} delay={14} />
  </Slide>
);

/* 8 · Базові типи Haskell */
const BASIC: { t: string; d: string; ex: string }[] = [
  { t: "Int", d: "цілі обмеженого діапазону", ex: "42" },
  { t: "Integer", d: "цілі довільної точності", ex: "10 ^ 50" },
  { t: "Float, Double", d: "числа з плаваючою крапкою", ex: "3.14" },
  { t: "Bool", d: "True або False", ex: "True" },
  { t: "Char", d: "символ Unicode", ex: "'λ'" },
  { t: "String", d: "історично є [Char]", ex: `"hi" == ['h','i']` },
];

const S08: React.FC = () => (
  <Slide title="Базові типи Haskell">
    <Lead>Найуживаніші базові типи представляють числа, логічні значення та символи.</Lead>
    {BASIC.map((b, i) => (
      <React.Fragment key={b.t}>
        <At x={240} y={335 + i * 110} step={i + 1} size={46} dir="left">
          <A>{b.t}</A> — {b.d}
        </At>
        <At x={1420} y={328 + i * 110} step={i + 1} delay={10} dir="right" pop>
          <Chip size={36}>{b.ex}</Chip>
        </At>
      </React.Fragment>
    ))}
  </Slide>
);

/* 9 · Літерал і контекст типу */
const S09: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Літерал і контекст типу">
      <Lead>Зовнішній запис значення не завжди однозначно задає конкретний тип.</Lead>
      <Code
        x={200}
        y={420}
        size={50}
        step={1}
        code={`
          @1+22 count :: [[1@34|Int]]
          @1+0 count = 12
          @1+0
          @1+50 veryLarge :: [[1@62|Integer]]
          @1+28 veryLarge = 10 ^ 50
        `}
      />
      <Code
        x={1030}
        y={420}
        size={50}
        step={2}
        code={`
          @2+22 ratio :: [[2@34|Double]]
          @2+0 ratio = 0.625
          @2+0
          @2+50 ready :: [[2@62|Bool]]
          @2+28 ready = True
        `}
      />
      <div
        style={{
          position: "absolute",
          left: 200,
          top: 860,
          opacity: s(2, 80),
          fontSize: 32,
          fontWeight: 600,
          color: C.dim,
        }}
      >
        Той самий літерал <M>12</M> міг би бути <M c={C.lav}>Integer</M>, <M c={C.lav}>Double</M>… — тип фіксує контекст.
      </div>
    </Slide>
  );
};

/* 10 · Імена типів і змінні типу */
const S10: React.FC = () => (
  <Slide title="Імена типів і змінні типу">
    <Lead>Регістр першої літери в Haskell має синтаксичне значення.</Lead>
    <At x={110} y={470} step={1} size={42} dir="left">
      <A>Int, Bool, Char</A> — імена типів
    </At>
    <At x={110} y={600} step={1} delay={10} size={42} dir="left">
      <A>True, False</A> — конструктори значень
    </At>
    <Code
      x={1060}
      y={420}
      size={42}
      step={2}
      code={`
        identity :: [[2@20|a]] -> [[2@20|a]]
        identity [[2@40|x]] = [[2@40|x]]

        @2+20 a — змінна типу
        @2+40 x — змінна значення
      `}
    />
    <At x={110} y={820} step={2} delay={60} size={30} weight={600} color={C.dim}>
      <span style={{ color: C.lav }}>Велика літера</span> → тип або конструктор · <span style={{ color: C.mint }}>мала літера</span> → змінна
    </At>
  </Slide>
);

/* 11 · Тип функції і каррування */
const S11: React.FC = () => {
  const { s } = useSteps();
  const nest = s(2, 40);
  return (
    <Slide title="Тип функції і каррування">
      <Lead>
        Оператор <M c={C.accentHi}>-&gt;</M> будує функційний тип і асоціюється вправо.
      </Lead>
      <Code
        x={200}
        y={340}
        size={50}
        code={`
          @1 add :: Int -> Int -> Int
          @1
          @2 -- означає
          @2 add :: Int -> [[+2@16|(]][[2@34|Int -> Int]][[+2@16|)]]
          @2
          @3 addFive :: [[-3@40|Int -> ]]Int -> Int
          @3+14 addFive = add [[3@24|5]]
        `}
      />
      {/* nested-box view of Int -> (Int -> Int) */}
      <div style={{ position: "absolute", left: 1270, top: 420, opacity: nest }}>
        <div
          style={{
            border: `3px solid ${C.accent}`,
            borderRadius: 18,
            padding: "22px 26px",
            fontFamily: F.mono,
            fontSize: 30,
            fontWeight: 700,
            color: C.lav,
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "rgba(141,118,220,0.08)",
          }}
        >
          Int →
          <div
            style={{
              border: `3px solid ${C.mint}`,
              borderRadius: 14,
              padding: "14px 18px",
              transform: `scale(${mix(0.6, 1, s(2, 50, POP))})`,
            }}
          >
            Int → Int
          </div>
        </div>
        <div style={{ marginTop: 14, fontSize: 24, color: C.dim, fontWeight: 600 }}>
          функція, що повертає функцію
        </div>
      </div>
      <At x={200} y={880} step={3} delay={60} size={30} weight={600} color={C.dim}>
        <M>add 5</M> «з'їдає» перший <M c={C.lav}>Int</M> і повертає функцію <M c={C.lav}>Int -&gt; Int</M> — часткове застосування
      </At>
    </Slide>
  );
};

export const s2Slides: SlideDef[] = [
  { id: "signature", title: "Сигнатура як контракт", steps: [40, 60, 40, 60], C: S07 },
  { id: "basic-types", title: "Базові типи", steps: [40, 30, 30, 30, 30, 30, 30], C: S08 },
  { id: "literals", title: "Літерал і контекст", steps: [40, 80, 100], C: S09 },
  { id: "names", title: "Імена типів", steps: [40, 45, 80], C: S10 },
  { id: "currying", title: "Каррування", steps: [40, 40, 80, 90], C: S11 },
];
