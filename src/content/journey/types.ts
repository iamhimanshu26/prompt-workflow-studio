export type Localized = { en: string; ja: string };

export type JourneyStep = {
  title: Localized;
  body: Localized;
};

export type JourneyTryLink = {
  label: Localized;
  href: string;
};

export type JourneyPhaseContent = {
  phase: number;
  status: "complete" | "current" | "planned";
  title: Localized;
  subtitle: Localized;
  deliverables: { label: Localized; detail: Localized }[];
  steps: JourneyStep[];
  architectureMermaid: string;
  flowMermaid?: string;
  tryLinks: JourneyTryLink[];
};

export type JourneyPhaseMeta = {
  phase: number;
  status: "complete" | "current" | "planned";
  title: Localized;
  summary: Localized;
};
