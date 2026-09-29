import React from "react";
import { interpolate } from "remotion";
import { C, CH, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { At, Lead, M, Slide } from "../deck/ui";

/* Text that swaps through labels over time within a step. */
const Cycle: React.FC<{ items: { at: number; text: string; color?: string }[]; step: number }> = ({ items, step }) => {
  const { t } = useSteps();
  const tt = t(step, 0);
  let cur = 0;
  items.forEach((it, i) => {
    if (tt >= it.at) cur = i;
  });
  const since = tt - items[cur].at;
  const p = interpolate(since, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <span style={{ display: "inline-block", color: items[cur].color ?? C.lav, opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
      {items[cur].text}
    </span>
  );
};

/* 21 · Параметричний поліморфізм */
const S21: React.FC = () => {
  const { s } = useSteps();
  const calls = [
    { at: 0, text: "identity 42", color: C.mint },
    { at: 30, text: "identity True", color: C.mint },
    { at: 60, text: 'identity "hi"', color: C.mint },
    { at: 92, text: "identity x", color: C.mint },
  ];
  const tys = [
    { at: 0, text: "Int" },
    { at: 30, text: "Bool" },
    { at: 60, text: "String" },
    { at: 92, text: "a", color: C.accentHi },
  ];
  const panel = s(2, 0);
  return (
    <Slide title="Параметричний поліморфізм">
      <Lead>Одна реалізація може працювати з різними типами, не залежачи від їхньої внутрішньої природи.</Lead>
      <Code
        x={110}
        y={360}
        size={54}
        step={1}
        code={`
          identity :: a -> a
          identity x = x
        `}
      />
      <div
        style={{
          position: "absolute",
          left: 1020,
          top: 340,
          width: 800,
          padding: "30px 40px",
          borderRadius: 20,
          background: C.panel,
          border: `2px solid ${C.line}`,
          opacity: panel,
          transform: `translateY(${(1 - panel) * 30}px)`,
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 40,
          lineHeight: 1.7,
          fontVariantLigatures: "none",
        }}
      >
        <div>
          <Cycle step={2} items={calls} />
        </div>
        <div style={{ color: C.op }}>
          :: <Cycle step={2} items={tys} /> -&gt; <Cycle step={2} items={tys} />
        </div>
      </div>
      <Code
        x={390}
        y={720}
        size={54}
        step={3}
        code={`
          makePair :: a -> b -> (a,b)
          makePair x y = (x,y)
        `}
      />
    </Slide>
  );
};

/* 22 · Що говорить поліморфний тип */
const S22: React.FC = () => {
  const { s, lin } = useSteps();
  const size = 110;
  const x0 = 150;
  const y0 = 390;
  const cw = CH * size;
  const a1 = x0 + cw * 0.5;
  const a2 = x0 + cw * 5.5;
  const draw = lin(1, 18, 22);
  const L = 420;
  const q = s(3, 14, POP);
  return (
    <Slide title="Що говорить поліморфний тип">
      <Lead>Достатньо загальна сигнатура вже сильно обмежує можливу поведінку функції.</Lead>
      <Code x={x0} y={y0} size={size} step={1} code={`[[1@18|a]] -> [[1@18|a]]`} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path
          d={`M ${a1} ${y0 + 170} Q ${(a1 + a2) / 2} ${y0 + 290} ${a2} ${y0 + 170}`}
          stroke={C.accentHi}
          strokeWidth={5}
          fill="none"
          strokeDasharray={L}
          strokeDashoffset={L * (1 - draw)}
          strokeLinecap="round"
        />
      </svg>
      <At x={x0 + cw * 3 - 60} y={y0 + 250} step={1} delay={36} size={28} weight={600} color={C.accentHi}>
        той самий тип
      </At>
      {[a1, a2].map((ax, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: ax - 32,
            top: y0 - 60,
            width: 64,
            height: 64,
            borderRadius: 32,
            background: C.pink,
            color: C.text,
            fontSize: 40,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: Math.min(1, q),
            transform: `scale(${q})`,
          }}
        >
          ?
        </div>
      ))}
      <At x={1000} y={430} w={840} step={2} size={40}>
        Одна й та сама змінна <M>a</M> означає один і той самий тип у відповідних позиціях.
      </At>
      <At x={150} y={730} w={1400} step={3} size={40}>
        Функція не знає, що таке <M>a</M>.
        <br />
        Без додаткових обмежень вона не може довільно виконувати операції над <M>a</M>.
      </At>
      <At x={150} y={910} w={1600} step={3} delay={40} size={30} weight={600} color={C.dim}>
        Тому <M>a -&gt; a</M> може бути лише <M>identity</M>: жодне <M>x + 1</M> чи <M>not x</M> тут не пройде.
      </At>
    </Slide>
  );
};

export const s5Slides: SlideDef[] = [
  { id: "parametric", title: "Параметричний поліморфізм", steps: [40, 40, 130, 50], C: S21 },
  { id: "poly-meaning", title: "Що говорить поліморфний тип", steps: [40, 60, 45, 80], C: S22 },
];
