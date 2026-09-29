import type { SlideDef } from "../deck/steps";
import { agendaSlide, introSlides } from "./intro";
import { s1Slides } from "./s1-typing";
import { s2Slides } from "./s2-basic";
import { s3Slides } from "./s3-lists";
import { paramTypesSlide, s4Slides } from "./s4-adt";
import { s5Slides } from "./s5-poly";
import { s6Slides } from "./s6-patterns";
import { s7Slides } from "./s7-inference";

export const SLIDES: SlideDef[] = [
  ...introSlides,
  ...s1Slides,
  agendaSlide(1),
  ...s2Slides,
  agendaSlide(2),
  ...s3Slides,
  agendaSlide(3),
  ...s4Slides,
  agendaSlide(4),
  ...s5Slides,
  paramTypesSlide,
  agendaSlide(5),
  ...s6Slides,
  agendaSlide(6),
  ...s7Slides,
];
