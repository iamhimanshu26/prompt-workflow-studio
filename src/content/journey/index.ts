import type { JourneyPhaseContent, JourneyPhaseMeta } from "./types";
import { phase0 } from "./phase-0";
import { phase1 } from "./phase-1";
import { phase2 } from "./phase-2";
import { phase3 } from "./phase-3";

const PLANNED_META: JourneyPhaseMeta[] = [4, 5, 6, 7, 8, 9].map((n) => ({
  phase: n,
  status: "planned" as const,
  title: {
    en: `Phase ${n}`,
    ja: `フェーズ ${n}`,
  },
  summary: {
    en: "Planned — documentation will appear when this phase ships.",
    ja: "予定 — 実装後にドキュメントを追加します。",
  },
}));

const COMPLETE: JourneyPhaseContent[] = [phase0, phase1, phase2, phase3];

export function getPhaseContent(phase: number): JourneyPhaseContent | null {
  return COMPLETE.find((p) => p.phase === phase) ?? null;
}

export function getAllPhaseMeta(): JourneyPhaseMeta[] {
  const done: JourneyPhaseMeta[] = COMPLETE.map((p) => ({
    phase: p.phase,
    status: p.status,
    title: p.title,
    summary: p.subtitle,
  }));
  return [...done, ...PLANNED_META];
}

export const JOURNEY_PHASE_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
