import React from "react";
import { interpolate } from "remotion";
import { C, F } from "../deck/theme";
import { mix, POP, SlideDef, useSteps } from "../deck/steps";
import { At, HaskellLogo, Slide } from "../deck/ui";
import { AuthorBlock } from "../deck/Author";
import { epigraphSlide } from "./epigraph";

const TitleSlide: React.FC = () => {
  const { s, t } = useSteps();
  const line1 = "Система типів";
  const line2 = "Haskell";
  const letters = (str: string, base: number) =>
    str.split("").map((ch, i) => {
      const p = s(0, base + i * 1.6);
      return (
        <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 60}px)`, whiteSpace: "pre" }}>
          {ch}
        </span>
      );
    });
  const glow = interpolate(t(0, 40), [0, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Slide>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 14,
          width: 760,
          height: 540,
          background: "#141821",
          opacity: s(0, 0),
        }}
      />
      <div style={{ position: "absolute", right: 60, top: 70, filter: `drop-shadow(0 0 ${40 * glow}px rgba(143,78,139,0.35))` }}>
        <HaskellLogo size={680} p1={s(0, 4, POP)} p2={s(0, 12, POP)} p3={s(0, 22, POP)} />
      </div>
      <At x={116} y={200} step={0} delay={8} size={60} weight={800} color={C.pink}>
        Лекція 4
      </At>
      <div style={{ position: "absolute", left: 110, top: 360, fontFamily: F.head, fontWeight: 800, fontSize: 140, lineHeight: 1.12, color: C.text }}>
        <div>{letters(line1, 14)}</div>
        <div>{letters(line2, 34)}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 730,
          height: 6,
          width: mix(0, 520, s(0, 50)),
          background: `linear-gradient(90deg, ${C.accent}, ${C.pink})`,
          borderRadius: 3,
        }}
      />
      <At x={116} y={770} step={0} delay={56} size={36} weight={400} color={C.dim} font={F.mono} style={{ fontVariantLigatures: "none" }}>
        {"typeOf :: Expression -> Type"}
      </At>
      <AuthorBlock />
    </Slide>
  );
};

const AGENDA = [
  "Система типів і типізація",
  "Базові та функційні типи",
  "Списки й кортежі",
  "Алгебраїчні та параметризовані типи",
  "Поліморфізм",
  "Зіставлення зі зразком і guards",
  "Виведення типів і теорема Гіндлі–Мілнера",
];

const Agenda: React.FC<{ active?: number }> = ({ active }) => {
  const { s } = useSteps();
  const full = active === undefined;
  return (
    <Slide title="План">
      {!full && (
        <div
          style={{
            position: "absolute",
            left: 84,
            top: 205 + active! * 112 - 14,
            width: mix(0, 1740, s(0, 6)),
            height: 92,
            borderRadius: 14,
            background: "rgba(141,118,220,0.13)",
            border: `2px solid rgba(141,118,220,${0.5 * s(0, 6)})`,
          }}
        />
      )}
      {AGENDA.map((item, i) => {
        const p = full ? s(0, 8 + i * 5, POP) : 1;
        const on = full ? 1 : i === active ? s(0, 10) : 0;
        const dim = full ? 1 : i === active ? 1 : 0.35;
        const y = 205 + i * 112;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 104,
              top: y,
              display: "flex",
              alignItems: "center",
              gap: 36,
              opacity: p * dim,
              transform: `translateX(${(1 - p) * -40 + on * 24}px)`,
            }}
          >
            <div
              style={{
                width: 76,
                height: 64,
                borderRadius: 8,
                background: i % 2 ? "#5e5086" : C.pink,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: F.body,
                fontWeight: 800,
                fontSize: 40,
                color: C.text,
                boxShadow: on ? `0 0 ${30 * on}px rgba(178,95,168,${0.6 * on})` : undefined,
                transform: `scale(${1 + 0.12 * on})`,
              }}
            >
              {i + 1}
            </div>
            <div style={{ fontFamily: F.body, fontSize: 54, fontWeight: on ? 700 : 400, color: C.text }}>{item}</div>
          </div>
        );
      })}
    </Slide>
  );
};

export const introSlides: SlideDef[] = [
  { id: "title", title: "Титул", steps: [110], C: TitleSlide },
  epigraphSlide,
  { id: "agenda", title: "План", steps: [60], C: () => <Agenda /> },
];

export const agendaSlide = (active: number): SlideDef => ({
  id: `agenda-${active + 1}`,
  title: `План · ${active + 1}`,
  steps: [40],
  C: () => <Agenda active={active} />,
});
