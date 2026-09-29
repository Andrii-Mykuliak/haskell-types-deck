import React from "react";
import { interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, At, Chip, Lead, M, Mark, Slide } from "../deck/ui";

/**
 * A value chip that visits rows one by one (keyframes) — used to show which equation matches.
 * `rows` are y positions; `times` the frame offsets at which it arrives at each row.
 */
const Visitor: React.FC<{ x: number; rows: number[]; times: number[]; step: number; label: string; failUntil: number }> = ({
  x,
  rows,
  times,
  step,
  label,
  failUntil,
}) => {
  const { t, s } = useSteps();
  const tt = t(step, 0);
  const y = interpolate(tt, times, rows, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p = s(step, 0, POP);
  const matched = tt >= times[failUntil];
  return (
    <div style={{ position: "absolute", left: x, top: y - 6, opacity: Math.min(1, p), transform: `scale(${p})` }}>
      <Chip size={36} color={matched ? C.bg : C.lav} bg={matched ? C.mint : C.panel} border={matched ? C.mint : C.accent}>
        {label}
      </Chip>
    </div>
  );
};

/* 24 · Зіставлення зі зразком */
const S24: React.FC = () => {
  const lh = 62;
  const y0 = 400;
  return (
    <Slide title="Зіставлення зі зразком">
      <Lead size={34} y={180}>
        <A>Зіставлення зі зразком (pattern matching)</A> — механізм аналізу структури значення, за якого фактичне значення порівнюється зі
        зразком, а його складові можуть одночасно зв'язуватися з іменами.
      </Lead>
      <Code
        x={110}
        y={y0}
        size={42}
        lh={lh}
        step={1}
        code={`
          describeLight :: TrafficLight -> String
          describeLight [[.2@30|Red]]    = "stop"
          describeLight [[2@56|Yellow]] = "wait"
          describeLight [[.2@80|Green]]  = "go"
        `}
      />
      <Visitor x={1200} rows={[y0 + lh, y0 + lh, y0 + 2 * lh]} times={[0, 26, 44]} step={2} label="Yellow" failUntil={2} />
      <Mark ok={false} step={2} delay={18} x={1400} y={y0 + lh + 2} size={48} />
      <Mark ok step={2} delay={50} x={1400} y={y0 + 2 * lh + 2} size={48} />
      <At x={1480} y={y0 + 2 * lh} step={2} delay={60} dir="left" pop>
        <Chip size={32} color={C.amber} border={C.amber}>
          "wait"
        </Chip>
      </At>
      <Code
        x={500}
        y={700}
        size={42}
        lh={lh}
        step={3}
        code={`
          area :: Shape -> Double
          area ([[4@0|Circle r]])      = pi * [[4@30|r]] * [[4@30|r]]
          area (Rectangle w h) = w * h
        `}
      />
      <At x={500} y={900} step={4} delay={14} size={30} weight={600} color={C.dim}>
        <M>area (Circle 2.0)</M> ⟶ зразок <M>Circle r</M> зв'язує <M c={C.amber}>r = 2.0</M> ⟶ <M c={C.orange}>12.566…</M>
      </At>
    </Slide>
  );
};

/* 25 · Кортежі та списки в патернах */
const S25: React.FC = () => (
  <Slide title="Кортежі та списки в патернах">
    <Lead>
      Зразок повторює структурну форму даних;
      <br />
      <M c={C.kw}>_</M> відповідає значенню, яке не потрібно іменувати.
    </Lead>
    <Code
      x={120}
      y={420}
      size={50}
      step={1}
      stagger={12}
      code={`
        first  (x, [[.1@30|_]]) = x
        second ([[.1@40|_]], y) = y
      `}
    />
    <At x={1100} y={420} step={1} delay={30} size={34} weight={600} color={C.dim}>
      <M>first (1, 2)</M> ⟶ <M c={C.orange}>1</M>
    </At>
    <At x={1100} y={492} step={1} delay={40} size={34} weight={600} color={C.dim}>
      <M>second (1, 2)</M> ⟶ <M c={C.orange}>2</M>
    </At>
    <Code
      x={120}
      y={700}
      size={50}
      step={2}
      stagger={12}
      code={`
        describeList [[2@26|[]]]    = "empty"
        describeList [[2@40|(_:_)]] = "non-empty"
      `}
    />
    <At x={1300} y={700} step={2} delay={26} size={30} weight={600} color={C.dim}>
      порожній список
    </At>
    <At x={1300} y={772} step={2} delay={40} size={30} weight={600} color={C.dim}>
      голова <M>:</M> хвіст — будь-які
    </At>
  </Slide>
);

/* 26 · Порожній і непорожній список */
const SplitList: React.FC<{ x: number; y: number; step: number }> = ({ x, y, step }) => {
  const { s } = useSteps();
  const split = s(step, 40);
  const vals = ["1", "2", "3"];
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {vals.map((v, i) => {
        const p = s(step, 14 + i * 5, POP);
        const off = i === 0 ? -split * 60 : split * 20;
        return (
          <div key={v} style={{ position: "absolute", left: i * 96 + off, top: 0, opacity: Math.min(1, p), transform: `scale(${p})` }}>
            <Chip size={36} color={C.orange} border={i === 0 && split > 0.5 ? C.accentHi : C.line}>
              {v}
            </Chip>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: -60, top: 90, width: 90, textAlign: "center", opacity: split, fontFamily: F.mono, fontSize: 32, fontWeight: 700, color: C.accentHi }}>
        x
      </div>
      <div
        style={{
          position: "absolute",
          left: 106,
          top: -12,
          width: 196,
          height: 96,
          borderRadius: 16,
          border: `3px dashed ${C.mint}`,
          opacity: split,
        }}
      />
      <div style={{ position: "absolute", left: 106, top: 90, width: 196, textAlign: "center", opacity: split, fontFamily: F.mono, fontSize: 32, fontWeight: 700, color: C.mint }}>
        xs
      </div>
    </div>
  );
};

const S26: React.FC = () => (
  <Slide title="Порожній і непорожній список">
    <Lead>Зіставлення зі зразком дозволяє явно опрацювати обидві структурні форми списку.</Lead>
    <Code
      x={110}
      y={400}
      size={50}
      step={1}
      stagger={10}
      code={`
        firstAndRest []     = Nothing
        firstAndRest [[1@40|(x:xs)]] = Just (x, xs)
      `}
    />
    <SplitList x={1400} y={420} step={1} />
    <Code
      x={110}
      y={720}
      size={50}
      step={2}
      stagger={10}
      code={`
        headOr defaultValue [] = defaultValue
        headOr _ (x:_)         = x
      `}
    />
    <At x={110} y={900} step={2} delay={30} size={30} weight={600} color={C.dim}>
      <M>headOr 0 []</M> ⟶ <M c={C.orange}>0</M>      <M>headOr 0 [7,8]</M> ⟶ <M c={C.orange}>7</M>
    </At>
  </Slide>
);

/* 27 · Порядок і повнота зразків */
const S27: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide title="Порядок і повнота зразків">
      <Lead>Рівняння перевіряються зверху вниз. Неохоплений випадок робить функцію частковою.</Lead>
      <Code
        x={110}
        y={380}
        size={46}
        step={1}
        stagger={10}
        code={`
          classify [[1@20~22|0]] = "zero"
          classify [[1@42|_]] = "non-zero"
        `}
      />
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 390,
          width: 6,
          height: 110 * s(1, 16),
          borderRadius: 3,
          background: `linear-gradient(${C.accentHi}, transparent)`,
        }}
      />
      <Code
        x={110}
        y={620}
        size={46}
        step={2}
        stagger={10}
        code={`
          unsafeHead :: [a] -> a
          unsafeHead (x:_) = x
        `}
      />
      <Code x={1010} y={380} size={46} step={3} code={`unsafeHead [[3@30|[]]]`} />
      <Code
        x={1010}
        y={480}
        size={46}
        step={3}
        code={`
          @3+34 [[!3@34|Error => Non-exhaustive]]
          @3+34 [[!3@34|patterns in function]]
          @3+34 [[!3@34|unsafeHead]]
        `}
      />
      <At x={110} y={880} step={4} size={48} weight={800} color={C.mint} font={F.mono}>
        Випадок [] не охоплено.
      </At>
    </Slide>
  );
};

/* 28 · Вартові вирази */
const S28: React.FC = () => {
  const lh = 64;
  const y0 = 470;
  return (
    <Slide title="Вартові вирази">
      <Lead size={34} y={170}>
        <A>Вартові вирази (guards)</A> — синтаксична конструкція Haskell, яка дозволяє вибрати праву частину рівняння функції залежно від
        виконання однієї з кількох логічних умов.
      </Lead>
      <At x={96} y={330} step={0} delay={20} size={34} color={C.accentHi}>
        Перша істинна умова перемагає.
      </At>
      <Code
        x={130}
        y={y0}
        size={44}
        lh={lh}
        step={1}
        code={`
          absoluteDescription x
            | [[.2@24|x < 0]]     = "negative"
            | [[.2@44|x == 0]]    = "zero"
            | [[2@64|otherwise]] = "positive"
        `}
      />
      <At x={1150} y={y0 - 6} step={2} dir="left" pop>
        <Chip size={36} color={C.lav} border={C.accent}>
          x = 5
        </Chip>
      </At>
      <Mark ok={false} step={2} delay={20} x={1060} y={y0 + lh + 4} size={50} />
      <Mark ok={false} step={2} delay={40} x={1060} y={y0 + 2 * lh + 4} size={50} />
      <Mark ok step={2} delay={60} x={1060} y={y0 + 3 * lh + 4} size={50} />
      <At x={1150} y={y0 + 3 * lh - 2} step={2} delay={70} dir="left" pop>
        <Chip size={32} color={C.amber} border={C.amber}>
          "positive"
        </Chip>
      </At>
      <At x={250} y={790} step={3} size={40} dir="left">
        <A>Pattern matching:</A> «яку структуру має значення?»
      </At>
      <At x={250} y={880} step={4} size={40} dir="left">
        <A>Guards:</A> «які властивості має отримане значення?»
      </At>
    </Slide>
  );
};

/* 29 · Pattern matching + guards */
const S29: React.FC = () => {
  const lh = 62;
  const y0 = 330;
  return (
    <Slide title="Pattern matching + guards">
      <Lead>Структурний вибір і перевірка властивостей природно поєднуються в одному означенні.</Lead>
      <Code
        x={330}
        y={y0}
        size={44}
        lh={lh}
        step={1}
        code={`
          describeNumber [[.2@16|Nothing]] = "no value"
          describeNumber [[2@36|(Just x)]]
            | [[.2@60|x < 0]]     = "negative"
            | [[2@82|x == 0]]    = "zero"
            | [[.2@96|otherwise]] = "positive"
        `}
      />
      <At x={1450} y={y0 - 6} step={2} dir="left" pop>
        <Chip size={36} color={C.lav} border={C.accent}>
          Just 0
        </Chip>
      </At>
      <Mark ok={false} step={2} delay={16} x={250} y={y0 + 4} size={50} />
      <Mark ok step={2} delay={36} x={250} y={y0 + lh + 4} size={50} />
      <At x={1450} y={y0 + lh + 4} step={2} delay={44} size={30} weight={600} color={C.amber} font={F.mono}>
        x = 0
      </At>
      <Mark ok={false} step={2} delay={60} x={250} y={y0 + 2 * lh + 4} size={50} />
      <Mark ok step={2} delay={82} x={250} y={y0 + 3 * lh + 4} size={50} />
      <At x={1450} y={y0 + 3 * lh - 2} step={2} delay={90} dir="left" pop>
        <Chip size={32} color={C.amber} border={C.amber}>
          "zero"
        </Chip>
      </At>
      <At x={180} y={740} step={3} size={40}>
        <span style={{ color: C.accentHi }}>①</span> Спочатку зіставляється форма <M>Nothing</M> / <M>Just x</M>.
      </At>
      <At x={180} y={820} step={3} delay={14} size={40}>
        <span style={{ color: C.accentHi }}>②</span> Потім для <M>Just x</M> послідовно перевіряються умови.
      </At>
    </Slide>
  );
};

export const s6Slides: SlideDef[] = [
  { id: "pattern-matching", title: "Зіставлення зі зразком", steps: [50, 45, 90, 45, 60], C: S24 },
  { id: "patterns-tuples-lists", title: "Кортежі та списки в патернах", steps: [45, 70, 70], C: S25 },
  { id: "empty-nonempty", title: "Порожній і непорожній", steps: [40, 80, 60], C: S26 },
  { id: "order-completeness", title: "Порядок і повнота", steps: [40, 70, 45, 70, 40], C: S27 },
  { id: "guards", title: "Вартові вирази", steps: [50, 45, 100, 40, 40], C: S28 },
  { id: "pm-guards", title: "Pattern matching + guards", steps: [40, 45, 120, 50], C: S29 },
];
