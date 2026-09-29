import React from "react";
import { C, CH, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { Code } from "../deck/Code";
import { A, Arrow, At, Chip, HaskellLogo, Lead, M, Slide } from "../deck/ui";

/** Small type label that pops in under a code column. */
const Ann: React.FC<{ x: number; y: number; col: number; len: number; size: number; label: string; step: number; delay: number; color?: string }> = ({
  x,
  y,
  col,
  len,
  size,
  label,
  step,
  delay,
  color = C.lav,
}) => {
  const { s } = useSteps();
  const p = s(step, delay, POP);
  const cx = x + (col + len / 2) * CH * size;
  return (
    <div style={{ position: "absolute", left: cx - 200, top: y, width: 400, textAlign: "center", opacity: Math.min(1, p), transform: `translateY(${(1 - p) * -14}px)` }}>
      <div style={{ width: 3, height: 26, background: color, margin: "0 auto 6px", opacity: 0.7 }} />
      <span
        style={{
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: 28,
          color,
          background: C.panel,
          border: `2px solid ${color}`,
          borderRadius: 10,
          padding: "4px 12px",
          whiteSpace: "pre",
          fontVariantLigatures: "none",
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* 30 · Виведення типів */
const S30: React.FC = () => {
  const sz = 46;
  const x1 = 110;
  const y1 = 360;
  const x2 = 1000;
  const y2 = 690;
  // not' x = if x then False else True
  //           0123456789...
  return (
    <Slide title="Виведення типів">
      <Lead>Компілятор не вгадує тип: він формує обмеження зі структури виразу та узгоджує їх.</Lead>
      <Code x={x1} y={y1} size={sz} step={1} code={`not' x = if [[1@14|x]] then [[1@34|False]] else [[1@34|True]]`} />
      <Ann x={x1} y={y1 + 70} col={12} len={1} size={sz} label="x :: Bool" step={1} delay={14} />
      <Ann x={x1} y={y1 + 70} col={19} len={5} size={sz} label="Bool" step={1} delay={34} />
      <Ann x={x1} y={y1 + 70} col={30} len={4} size={sz} label="Bool" step={1} delay={34} />
      <Code x={x1} y={y1 + 200} size={sz} code={`@1+60 not' :: [[1@70|Bool -> Bool]]`} />
      <Code x={x2} y={y2} size={sz} step={2} code={`swap ([[2@14|x]],[[2@24|y]]) = ([[2@40|y]],[[2@40|x]])`} />
      <Ann x={x2} y={y2 + 70} col={6} len={1} size={sz} label="a" step={2} delay={14} />
      <Ann x={x2} y={y2 + 70} col={8} len={1} size={sz} label="b" step={2} delay={24} />
      <Ann x={x2} y={y2 + 70} col={13} len={5} size={sz} label="(b,a)" step={2} delay={40} />
      <Code x={x2} y={y2 + 200} size={sz} code={`@2+62 swap :: [[2@72|(a,b) -> (b,a)]]`} />
    </Slide>
  );
};

/* 31 · Уніфікація */
const S31: React.FC = () => {
  const { s, t } = useSteps();
  const meet = s(1, 16, { damping: 14, stiffness: 120 });
  const merged = s(1, 40, POP);
  const bump = s(2, 10, { damping: 12, stiffness: 140 });
  const tt = t(2, 26);
  const shake = tt > 0 ? Math.sin(tt * 1.5) * 12 * Math.max(0, 1 - tt / 24) : 0;
  const conflict = tt > 0;
  const cy = 360;
  return (
    <Slide title="Уніфікація">
      <Lead>Уніфікація шукає підстановку для змінних типу, за якої типові вирази стають однаковими.</Lead>
      {/* expected */}
      <div style={{ position: "absolute", left: mix(260, 640, meet), top: cy, textAlign: "center", width: 220, opacity: s(1, 0) * mix(1, 0.55, merged) }}>
        <div style={{ fontFamily: F.mono, fontSize: 26, color: C.dim, marginBottom: 12 }}>очікується</div>
        <Chip size={44} color={C.accentHi} border={C.accent}>
          a
        </Chip>
      </div>
      {/* received */}
      <div style={{ position: "absolute", left: mix(1440, 1060, meet), top: cy, textAlign: "center", width: 220, opacity: s(1, 4) * mix(1, 0.55, merged) }}>
        <div style={{ fontFamily: F.mono, fontSize: 26, color: C.dim, marginBottom: 12 }}>отримано</div>
        <Chip size={44} color={C.lav}>
          Int
        </Chip>
      </div>
      {/* substitution */}
      <div
        style={{
          position: "absolute",
          left: 760 + shake,
          top: cy + 200,
          width: 400,
          textAlign: "center",
          opacity: Math.min(1, merged),
          transform: `scale(${merged})`,
        }}
      >
        <Chip size={52} color={conflict ? C.red : C.bg} bg={conflict ? "rgba(239,107,107,0.15)" : C.mint} border={conflict ? C.red : C.mint}>
          a = Int
        </Chip>
      </div>
      <Arrow x1={750} y1={cy + 140} x2={880} y2={cy + 200} step={1} delay={34} dur={10} color={C.faint} width={3} />
      <Arrow x1={1170} y1={cy + 140} x2={1040} y2={cy + 200} step={1} delay={34} dur={10} color={C.faint} width={3} />
      {/* conflicting use */}
      <div style={{ position: "absolute", left: mix(1600, 1180, bump), top: cy + 160, textAlign: "center", width: 260, opacity: s(2, 0) }}>
        <div style={{ fontFamily: F.mono, fontSize: 24, color: C.dim, marginBottom: 12 }}>далі: a має бути</div>
        <Chip size={44} color={conflict ? C.red : C.lav} border={conflict ? C.red : C.line}>
          Bool
        </Chip>
      </div>
      <At x={760} y={cy + 320} w={400} align="center" step={2} delay={30} size={36} color={C.red} font={F.mono}>
        Int ≠ Bool
      </At>
      <At x={96} y={840} w={1700} step={2} delay={40} size={38}>
        Якщо той самий <M>a</M> далі мусить бути <M c={C.lav}>Bool</M>, виникає суперечність — типи не уніфікуються.
      </At>
    </Slide>
  );
};

/* 32 · Головний тип */
const TypeTree: React.FC<{ x: number; y: number; step: number }> = ({ x, y, step }) => {
  const { s } = useSteps();
  const leaves = [
    { t: "Int -> Int", sub: "a = Int" },
    { t: "Bool -> Bool", sub: "a = Bool" },
    { t: "[Char] -> [Char]", sub: "a = [Char]" },
  ];
  const root = s(step, 0, POP);
  return (
    <>
      <div style={{ position: "absolute", left: x + 230, top: y, opacity: Math.min(1, root), transform: `scale(${root})` }}>
        <Chip size={42} color={C.text} bg="rgba(141,118,220,0.3)" border={C.accentHi}>
          a -&gt; a
        </Chip>
      </div>
      {leaves.map((l, i) => {
        const lx = x + i * 280;
        const p = s(step, 20 + i * 10, POP);
        return (
          <React.Fragment key={l.t}>
            <Arrow x1={x + 320} y1={y + 80} x2={lx + 120} y2={y + 180} step={step} delay={14 + i * 10} dur={12} color={C.faint} width={3} />
            <div style={{ position: "absolute", left: lx, top: y + 190, width: 260, textAlign: "center", opacity: Math.min(1, p), transform: `scale(${p})` }}>
              <Chip size={26} color={C.lav}>
                {l.t}
              </Chip>
              <div style={{ fontFamily: F.mono, fontSize: 22, color: C.amber, marginTop: 10 }}>{l.sub}</div>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};

const S32: React.FC = () => (
  <Slide title="Головний тип">
    <Lead size={34} y={170}>
      <A>Головний тип</A> — найбільш загальний тип, з якого конкретніші типи отримуються підстановкою. Теорема Гіндлі–Мілнера стверджує, що
      такий тип завжди існує.
    </Lead>
    <Code
      x={110}
      y={400}
      size={46}
      step={1}
      stagger={10}
      code={`
        identity x = x
        identity :: a -> a

        @2 a = Int  => Int -> Int
      `}
    />
    <TypeTree x={960} y={380} step={2} />
    <Code
      x={110}
      y={740}
      size={46}
      step={3}
      stagger={10}
      code={`
        pair x y = (x,y)
        pair :: a -> b -> (a,b)
      `}
    />
    <At x={1000} y={760} w={820} step={3} delay={24} size={40} color={C.mint}>
      Немає підстав вимагати <M>a = b</M>.
    </At>
  </Slide>
);

/* 33 · Гіндлі–Мілнер на прикладі */
const S33: React.FC = () => {
  const steps = [
    { l: "x :: a", d: "аргумент — довільного типу a" },
    { l: "f :: a -> r", d: "f застосовується до x" },
    { l: "f :: r -> s", d: "f застосовується і до результату f x" },
    { l: "a = r = s  ⇒  f :: a -> a", d: "одна й та сама f — один тип" },
  ];
  return (
    <Slide title="Гіндлі–Мілнер на прикладі">
      <Lead>Тип випливає зі зв'язків між частинами виразу; застосування функції створює обмеження.</Lead>
      <Code x={110} y={340} size={50} step={1} code={`applyTwice f x = [[2@24|f]] ([[2@0|f x]])`} />
      {steps.map((st, i) => (
        <React.Fragment key={i}>
          <At x={170} y={460 + i * 78} step={2} delay={i * 20} size={36} dir="left" font={F.mono} color={C.lav} style={{ fontVariantLigatures: "none" }}>
            {st.l}
          </At>
          <At x={820} y={466 + i * 78} step={2} delay={i * 20 + 6} size={28} weight={600} color={C.dim}>
            {st.d}
          </At>
        </React.Fragment>
      ))}
      <Code x={110} y={800} size={50} code={`@2+90 applyTwice :: [[2@100|(a -> a)]] -> a -> a`} />
      <At x={110} y={920} w={1700} step={3} size={34} color={C.mint} font={F.mono} style={{ fontVariantLigatures: "none" }}>
        Результат першого f x має знову підходити як аргумент тієї самої f.
      </At>
    </Slide>
  );
};

/* 34 · Система типів як декларативний опис */
const S34: React.FC = () => (
  <Slide title="Система типів як декларативний опис">
    <Lead>Типи фіксують властивості й допустимі зв'язки, а конкретні типові підстановки відновлює компілятор.</Lead>
    <At x={190} y={380} step={1} size={42}>
      Ми задаємо:
    </At>
    {["структуру виразів", "сигнатури", "зв'язки між даними"].map((l, i) => (
      <At key={l} x={190} y={450 + i * 62} step={1} delay={8 + i * 7} size={40} dir="left">
        • {l}
      </At>
    ))}
    <Arrow x1={740} y1={560} x2={1000} y2={640} step={2} delay={0} dur={16} color={C.accent} width={5} curve={-40} />
    <At x={1030} y={560} step={2} delay={10} size={42}>
      Система типів виконує
      <br />
      частину технічної роботи:
    </At>
    {["перевіряє узгодженість", "виводить типи", "знаходить суперечності"].map((l, i) => (
      <At key={l} x={1030} y={700 + i * 62} step={2} delay={22 + i * 7} size={40} dir="right" color={C.mint}>
        • {l}
      </At>
    ))}
  </Slide>
);

/* 35 · Підсумок */
const S35: React.FC = () => {
  const { s } = useSteps();
  return (
    <Slide>
      <div style={{ position: "absolute", right: 90, top: 90, opacity: 0.25 * s(0, 10) }}>
        <HaskellLogo size={420} p1={s(0, 4, POP)} p2={s(0, 10, POP)} p3={s(0, 16, POP)} />
      </div>
      <At x={130} y={180} step={0} delay={4} size={80} weight={800} font={F.head}>
        Підсумок
      </At>
      <At x={190} y={400} w={1500} step={0} delay={20} size={56}>
        Типи не лише перевіряють програму — вони описують <A>форму допустимих обчислень</A>.
      </At>
      <At x={96} y={820} step={1} size={48}>
        Самостійно розглянути — <A c={C.mint}>алгоритм Гіндлі–Мілнера</A>
      </At>
    </Slide>
  );
};

export const s7Slides: SlideDef[] = [
  { id: "inference", title: "Виведення типів", steps: [40, 100, 100], C: S30 },
  { id: "unification", title: "Уніфікація", steps: [40, 70, 80], C: S31 },
  { id: "principal-type", title: "Головний тип", steps: [55, 45, 70, 55], C: S32 },
  { id: "hindley-milner", title: "Гіндлі–Мілнер", steps: [40, 40, 130, 50], C: S33 },
  { id: "declarative", title: "Декларативний опис", steps: [45, 50, 70], C: S34 },
  { id: "summary", title: "Підсумок", steps: [70, 45], C: S35 },
];
