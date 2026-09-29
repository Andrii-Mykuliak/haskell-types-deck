# Лекція 4 — Система типів Haskell (motion deck)

A step-by-step presentation built with Remotion. Each slide is a Remotion composition;
the browser app plays each step's animation and pauses until you click.

## Run

```bash
npm install
npm run dev        # open the printed URL, press f for fullscreen
```

## Controls

| Key | Action |
|---|---|
| → / Space / PgDn / Enter / click | next step (the first press finishes a step that is still animating) |
| ← / PgUp / right-click | previous step (jumps, no reverse animation) |
| number + Enter | go to slide N |
| Home / End | first / last slide |
| r | replay the current step |
| f | fullscreen |
| h | slide / step counter |
| ? | help |

The URL hash (`#12`) holds the current slide, so a reload returns to it.

## Editing

- `src/slides/*.tsx`: one file per lecture section. Each slide is a `SlideDef` with
  `steps: number[]`, the frame length of each step (30 fps). Step 0 plays automatically.
- Inside a slide, `useSteps()` returns `s(step, delay)` (a spring from 0 to 1) and `t(step)` (frames elapsed).
- `<Code>` highlights Haskell. Lines can reveal on their own step with `@n` / `@n+delay`, and inline
  markers exist: `[[n|x]]` highlight, `[[+n|x]]` grow in, `[[-n|x]]` strike, `[[.n|x]]` dim,
  `[[!n|x]]` error; add `@d` for a delay and `~d` to set how long a highlight lasts.
- `npm run studio`: open every slide in Remotion Studio to scrub its frames.
- `npm run shots`: render a PNG of every step to `out/shots` (quick visual check).

## Fixes vs. the original PDF

- `describeLight :: Color -> String` changed to `TrafficLight -> String` (matches the ADT).
- `area :: Shape -> Floating` changed to `Shape -> Double` (`Floating` is a class, not a type).
- Typos: «конкатанація» changed to «конкатенація», «елментів» to «елементів».
