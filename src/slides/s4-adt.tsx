import React from "react";
import { interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Chip, Lead, M, Slide } from "../deck/ui";

/* 17 · Алгебраїчні типи даних */
const TrafficLightViz: React.FC<{ x: number; y: number; step: number }> = ({ x, y, step }) => {
  const { s, t } = useSteps();
  const tt = t(step, 0);
  const on = (from: number, to?: number) =>
    interpolate(tt, [from, from + 6, ...(to ? [to, to + 6] : [])], [0, 1, ...(to ? [1, 0] : [])], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const lights = [
    { c: "#ff5a5a", v: on(24, 44) },
    { c: "#ffc94d", v: on(46, 66) },
    { c: "#4be08a", v: on(68) },
  ];
  const p = s(step, 0, POP);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 150,
        height: 420,
        borderRadius: 34,
        background: "#0f121a",
        border: `4px solid ${C.line}`,
        opacity: Math.min(1, p),
        transform: `scale(${p})`,
      }}
    >
      {lights.map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 25,
            top: 26 + i * 128,
            width: 100,
            height: 100,
            borderRadius: 50,
            background: l.c,
            opacity: mix(0.15, 1, l.v),
            boxShadow: `0 0 ${60 * l.v}px ${l.c}`,
          }}
        />
      ))}
    </div>
  );
};

const S17: React.FC = () => (
  <Slide title="Алгебраїчні типи даних">
    <Lead>ADT задає допустимі форми значення через один або кілька конструкторів даних.</Lead>
    <Code
      x={120}
      y={420}
      size={56}
      step={1}
      stagger={6}
      code={`
        data TrafficLight
            = [[1@24~20|Red]]
            | [[1@46~20|Yellow]]
            | [[1@68|Green]]
      `}
    />
    <TrafficLightViz x={880} y={380} step={1} />
    <At x={1150} y={440} w={700} step={2} size={40}>
      <A>Red</A>, <A>Yellow</A> і <A>Green</A> — конструктори значень, а не рядки чи довільні мітки.
    </At>
    <At x={1150} y={680} w={700} step={2} delay={16} size={30} weight={600} color={C.dim}>
      Значення типу <M c={C.lav}>TrafficLight</M> — рівно одне з трьох. Друкарська помилка <M c={C.red}>Gren</M> не скомпілюється.
    </At>
  </Slide>
);

/* 18 · Конструктори з параметрами */
const DrawShape: React.FC<{ kind: "circle" | "rect"; x: number; y: number; step: number; delay?: number; label: string }> = ({
  kind,
  x,
  y,
  step,
  delay = 0,
  label,
}) => {
  const { lin, s } = useSteps();
  const d = lin(step, delay + 8, 30);
  const L = kind === "circle" ? 2 * Math.PI * 90 : 2 * (270 + 180);
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <div style={{ opacity: s(step, delay) }}>
        <Chip size={30} color={C.lav}>
          {label}
        </Chip>
      </div>
      <svg width={320} height={240} style={{ marginTop: 20, overflow: "visible" }}>
        {kind === "circle" ? (
          <>
            <circle cx={120} cy={110} r={90} fill={`rgba(134,224,168,${0.12 * d})`} stroke={C.mint} strokeWidth={5} strokeDasharray={L} strokeDashoffset={L * (1 - d)} />
            <line x1={120} y1={110} x2={120 + 90 * d} y2={110} stroke={C.amber} strokeWidth={4} opacity={d} />
            <text x={140} y={100} fill={C.amber} fontFamily={F.mono} fontSize={26} opacity={d}>
              r
            </text>
          </>
        ) : (
          <>
            <rect x={10} y={20} width={270} height={180} rx={6} fill={`rgba(134,224,168,${0.12 * d})`} stroke={C.mint} strokeWidth={5} strokeDasharray={L} strokeDashoffset={L * (1 - d)} />
            <text x={130} y={232} fill={C.amber} fontFamily={F.mono} fontSize={26} opacity={d}>
              w
            </text>
            <text x={292} y={118} fill={C.amber} fontFamily={F.mono} fontSize={26} opacity={d}>
              h
            </text>
          </>
        )}
      </svg>
    </div>
  );
};

const S18: React.FC = () => (
  <Slide title="Конструктори з параметрами">
    <Lead>Конструктор може не лише позначати варіант, а й зберігати дані.</Lead>
    <Code
      x={140}
      y={360}
      size={50}
      step={1}
      code={`
        data Shape
            = Circle [[2@10|Double]]
            | Rectangle [[2@24|Double Double]]
      `}
    />
    <Code
      x={140}
      y={700}
      size={50}
      step={2}
      stagger={14}
      code={`
        Circle    :: Double -> Shape
        Rectangle :: Double -> Double -> Shape
      `}
    />
    <DrawShape kind="circle" x={1250} y={330} step={3} label="Circle 2.0" />
    <DrawShape kind="rect" x={1520} y={330} step={3} delay={18} label="Rectangle 3.0 2.0" />
    <At x={1250} y={680} w={620} step={3} delay={46} size={30} weight={600} color={C.dim}>
      Конструктор — це функція, що будує значення типу <M c={C.lav}>Shape</M>.
    </At>
  </Slide>
);

/* 19 · Типи-суми і типи-добутки */
const SumViz: React.FC<{ x: number; y: number; step: number }> = ({ x, y, step }) => {
  const { s, t } = useSteps();
  const opts = ['Success "anna"', "InvalidPassword", "UserNotFound"];
  const tt = t(step, 30);
  const sel = tt < 0 ? -1 : tt < 14 ? 2 : tt < 28 ? 1 : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {opts.map((o, i) => {
        const p = s(step, 10 + i * 5, POP);
        const on = sel === i;
        return (
          <div
            key={o}
            style={{
              marginBottom: 14,
              opacity: Math.min(1, p) * (sel === -1 || on ? 1 : 0.4),
              transform: `scale(${p}) translateX(${on ? 16 : 0}px)`,
              transformOrigin: "left center",
            }}
          >
            <Chip size={30} color={on ? C.text : C.lav} border={on ? C.accentHi : C.line} bg={on ? "rgba(141,118,220,0.3)" : C.panel}>
              {o}
            </Chip>
          </div>
        );
      })}
      <div style={{ opacity: s(step, 60), fontFamily: F.mono, fontSize: 28, color: C.dim, marginTop: 18 }}>|String| + 1 + 1 варіантів</div>
    </div>
  );
};

const ProductViz: React.FC<{ x: number; y: number; step: number }> = ({ x, y, step }) => {
  const { s } = useSteps();
  const p = s(step, 14, POP);
  const both = s(step, 34);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: Math.min(1, p), transform: `scale(${p})`, transformOrigin: "left top" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 18px",
          borderRadius: 18,
          border: `3px solid ${C.accent}`,
          background: "rgba(141,118,220,0.08)",
        }}
      >
        <span style={{ fontFamily: F.mono, fontSize: 30, fontWeight: 700, color: C.lav }}>Point</span>
        {["2.5", "4.0"].map((v) => (
          <Chip key={v} size={30} color={C.orange} border={both > 0.5 ? C.accentHi : C.line} bg={both > 0.5 ? "rgba(141,118,220,0.3)" : C.panel}>
            {v}
          </Chip>
        ))}
      </div>
      <div style={{ opacity: s(step, 50), fontFamily: F.mono, fontSize: 28, color: C.dim, marginTop: 30 }}>|Double| × |Double| комбінацій</div>
    </div>
  );
};

const S19: React.FC = () => (
  <Slide title="Типи-суми і типи-добутки">
    <Lead>Алгебраїчність походить від поєднання альтернатив і комбінацій.</Lead>
    <At x={110} y={320} step={1} size={40} dir="left">
      <A>Тип-сума:</A> задає один із варіантів
    </At>
    <Code
      x={110}
      y={420}
      size={42}
      step={1}
      delay={6}
      code={`
        data LoginResult
         = Success String
         | InvalidPassword
         | UserNotFound
      `}
    />
    <SumViz x={110} y={700} step={1} />
    <At x={1000} y={320} step={2} size={40} dir="right">
      <A>Тип-добуток:</A> компоненти одночасно
    </At>
    <Code x={1000} y={420} size={42} step={2} delay={6} code={`data Point = Point Double Double`} />
    <ProductViz x={1000} y={560} step={2} />
  </Slide>
);

/* 20 · Записи */
const S20: React.FC = () => (
  <Slide title="Записи">
    <Lead>
      <span style={{ fontFamily: F.mono }}>Record syntax</span> — зручний синтаксис ADT з іменованими полями.
    </Lead>
    <Code
      x={130}
      y={330}
      size={48}
      step={1}
      code={`
        data Person = Person
          { [[3@0~40|name]] :: String
          , [[3@40|age]]  :: Int
          }
      `}
    />
    <Code x={560} y={660} size={48} step={2} code={`anna = Person { name = "Anna", age = 20 }`} />
    <Code
      x={560}
      y={800}
      size={48}
      code={`
        @3+10 [[3@0~40|name]] :: Person -> String
        @3+46 [[3@40|age]]  :: Person -> Int
      `}
    />
    <At x={1240} y={400} w={600} step={3} delay={80} size={30} weight={600} color={C.dim}>
      Кожне поле автоматично стає функцією-селектором: <M>name anna</M> ⟶ <M c={C.amber}>"Anna"</M>
    </At>
  </Slide>
);

/* 23 · Параметризовані типи */
const MaybeViz: React.FC<{ x: number; y: number; step: number }> = ({ x, y, step }) => {
  const { s } = useSteps();
  const boxes = [
    { label: "Nothing", inner: "" },
    { label: "Just", inner: "42" },
  ];
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 30 }}>
      {boxes.map((b, i) => {
        const p = s(step, 40 + i * 10, POP);
        return (
          <div
            key={b.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              borderRadius: 14,
              border: `3px ${b.inner ? "solid" : "dashed"} ${b.inner ? C.mint : C.faint}`,
              opacity: Math.min(1, p),
              transform: `scale(${p})`,
              fontFamily: F.mono,
              fontSize: 30,
              fontWeight: 700,
              color: C.lav,
              minHeight: 60,
            }}
          >
            {b.label}
            {b.inner && <Chip size={28} color={C.orange}>{b.inner}</Chip>}
          </div>
        );
      })}
    </div>
  );
};

const EitherViz: React.FC<{ x: number; y: number; step: number }> = ({ x, y, step }) => {
  const { s } = useSteps();
  const p = s(step, 40, POP);
  const right = s(step, 56);
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 30, opacity: Math.min(1, p) }}>
      {["Left a", "Right 120"].map((l, i) => (
        <Chip
          key={l}
          size={30}
          color={i === 1 ? C.text : C.lav}
          border={i === 1 && right > 0.5 ? C.mint : C.faint}
          bg={i === 1 && right > 0.5 ? "rgba(134,224,168,0.18)" : C.panel}
          style={{ opacity: i === 0 ? mix(1, 0.4, right) : 1 }}
        >
          {l}
        </Chip>
      ))}
    </div>
  );
};

const S23: React.FC = () => (
  <Slide title="Параметризовані типи">
    <Lead>Тип може сам приймати тип як параметр. Конкретний тип утворюється підстановкою.</Lead>
    <Code
      x={150}
      y={380}
      size={46}
      step={1}
      code={`
        data Maybe [[1@24|a]]
            = Nothing
            | Just [[1@24|a]]

        answer1 = Just 42
      `}
    />
    <MaybeViz x={150} y={800} step={1} />
    <At x={150} y={900} step={1} delay={60} size={28} weight={600} color={C.dim}>
      <M>answer1 :: Maybe </M>
      <M c={C.lav}>Int</M> — підставили <M>a = Int</M>
    </At>
    <Code
      x={1000}
      y={380}
      size={46}
      step={2}
      code={`
        data Either [[2@24|a b]]
            = Left [[2@24|a]]
            | Right [[2@24|b]]

        result = Right 120
      `}
    />
    <EitherViz x={1000} y={800} step={2} />
    <At x={1000} y={900} step={2} delay={66} size={28} weight={600} color={C.dim}>
      успіх або помилка — в одному типі
    </At>
  </Slide>
);

export const s4Slides: SlideDef[] = [
  { id: "adt", title: "Алгебраїчні типи", steps: [40, 90, 50], C: S17 },
  { id: "constructors", title: "Конструктори з параметрами", steps: [40, 45, 55, 80], C: S18 },
  { id: "sum-product", title: "Суми і добутки", steps: [40, 80, 70], C: S19 },
  { id: "records", title: "Записи", steps: [40, 45, 45, 100], C: S20 },
];

export const paramTypesSlide: SlideDef = { id: "param-types", title: "Параметризовані типи", steps: [40, 90, 90], C: S23 };
