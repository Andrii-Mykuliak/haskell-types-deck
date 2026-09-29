import React from "react";
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

/* 6 · Класифікація мов (квадрант) */
const CX = 960;
const CY = 590;
const LANGS: { n: string; x: number; y: number; g: number }[] = [
  { n: "Erlang", x: -250, y: -300, g: 1 },
  { n: "Clojure", x: -330, y: -175, g: 1 },
  { n: "Groovy", x: -110, y: -230, g: 1 },
  { n: "Python", x: -250, y: -95, g: 1 },
  { n: "Ruby", x: -95, y: -70, g: 1 },
  { n: "C#", x: 110, y: -300, g: 2 },
  { n: "Scala", x: 340, y: -300, g: 2 },
  { n: "Java", x: 190, y: -210, g: 2 },
  { n: "F#", x: 130, y: -95, g: 2 },
  { n: "Haskell", x: 360, y: -150, g: 2 },
  { n: "Perl", x: -360, y: 110, g: 3 },
  { n: "PHP", x: -130, y: 95, g: 3 },
  { n: "VB", x: -280, y: 200, g: 3 },
  { n: "JavaScript", x: -160, y: 290, g: 3 },
  { n: "C", x: 150, y: 110, g: 3 },
  { n: "C++", x: 300, y: 240, g: 3 },
];

const S06: React.FC = () => {
  const { s, lin, t } = useSteps();
  const ax = lin(0, 6, 26);
  const quads = [
    { g: 1, x: CX - 470, y: CY - 380 },
    { g: 2, x: CX, y: CY - 380 },
    { g: 3, x: CX - 470, y: CY },
    { g: 3, x: CX, y: CY },
  ];
  const focus = s(4, 0);
  const pulse = 1 + 0.08 * Math.sin(Math.max(0, t(4, 0)) / 5) * Math.min(1, t(4, 0) / 10 > 0 ? 1 : 0);
  const axis = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return (
      <line
        x1={mx - ((x2 - x1) / 2) * ax}
        y1={my - ((y2 - y1) / 2) * ax}
        x2={mx + ((x2 - x1) / 2) * ax}
        y2={my + ((y2 - y1) / 2) * ax}
        stroke={C.red}
        strokeWidth={5}
        strokeLinecap="round"
      />
    );
  };
  const labels = [
    { t: "СИЛЬНА", x: CX, y: CY - 478, a: "center" as const },
    { t: "СЛАБКА", x: CX, y: CY + 408, a: "center" as const },
    { t: "ДИНАМІЧНА", x: CX - 915, y: CY - 26, a: "right" as const },
    { t: "СТАТИЧНА", x: CX + 530, y: CY - 26, a: "left" as const },
  ];
  return (
    <Slide>
      {quads.map((q, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: q.x,
            top: q.y,
            width: 470,
            height: 380,
            background: q.g === 2 ? "rgba(141,118,220,0.10)" : q.g === 1 ? "rgba(36,116,226,0.08)" : "rgba(239,107,107,0.06)",
            opacity: s(q.g, 0) * (1 - 0.5 * focus * (q.g === 2 ? 0 : 1)),
          }}
        />
      ))}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {axis(CX, CY + 380, CX, CY - 390)}
        {axis(CX - 480, CY, CX + 500, CY)}
        {[
          [CX, CY - 400, 0],
          [CX, CY + 390, 180],
          [CX + 510, CY, 90],
          [CX - 490, CY, 270],
        ].map(([x, y, r], i) => (
          <polygon key={i} points="0,-18 14,6 -14,6" fill={C.red} transform={`translate(${x},${y}) rotate(${r})`} opacity={ax > 0.95 ? 1 : 0} />
        ))}
      </svg>
      {labels.map((l, i) => (
        <div
          key={l.t}
          style={{
            position: "absolute",
            left: l.a === "center" ? l.x - 200 : l.x,
            top: l.y,
            width: l.a === "left" ? undefined : 400,
            textAlign: l.a,
            fontFamily: F.head,
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: 3,
            color: C.red,
            opacity: s(0, 22 + i * 4),
          }}
        >
          {l.t}
        </div>
      ))}
      {LANGS.map((l, i) => {
        const idx = LANGS.filter((o) => o.g === l.g).indexOf(l);
        const p = s(l.g, 6 + idx * 5, POP);
        const isH = l.n === "Haskell";
        const dim = isH ? 1 : 1 - 0.65 * focus;
        return (
          <div
            key={l.n}
            style={{
              position: "absolute",
              left: CX + l.x - 150,
              top: CY + l.y - 30,
              width: 300,
              textAlign: "center",
              fontFamily: F.head,
              fontSize: isH ? 50 : 44,
              fontWeight: isH ? 800 : 400,
              color: isH ? mixColor(focus) : "#7fb3d8",
              opacity: Math.min(1, p) * dim,
              transform: `scale(${p * (isH ? mix(1, 1.35, focus) * pulse : 1)})`,
              textShadow: isH ? `0 0 ${40 * focus}px rgba(169,148,255,0.9)` : undefined,
            }}
            data-i={i}
          >
            {l.n}
          </div>
        );
      })}
    </Slide>
  );
};

const mixColor = (p: number) => (p > 0.5 ? C.accentHi : "#7fb3d8");

export const s1Slides: SlideDef[] = [
  { id: "type-model", title: "Тип як частина формальної моделі", steps: [40, 35, 35, 80], C: S03 },
  { id: "static-dynamic", title: "Статична і динамічна", steps: [40, 70, 70], C: S04 },
  { id: "strong-weak", title: "Сильна і слабка", steps: [40, 55, 55, 50], C: S05 },
  { id: "quadrant", title: "Класифікація мов", steps: [55, 45, 45, 50, 45], C: S06 },
];

