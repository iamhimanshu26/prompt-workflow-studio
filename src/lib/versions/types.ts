export type VersionSource = "playground" | "optimizer" | "manual" | "restored" | "duplicated" | "unknown";

export type PromptStatus = "active" | "draft" | "optimized";

export type VersionRow = {
  id: string;
  version: number;
  name: string;
  body: string;
  notes: string | null;
  createdAt: string;
  source: VersionSource;
  charCount: number;
};

export type PromptListItem = {
  id: string;
  title: string;
  category: string;
  body: string;
  bodyPreview: string;
  versionCount: number;
  latestVersion: number;
  updatedAt: string;
  createdAt: string;
  status: PromptStatus;
};

export type PromptDetail = {
  id: string;
  title: string;
  category: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  status: PromptStatus;
  versions: VersionRow[];
};

export type DiffLine = {
  type: "same" | "add" | "remove";
  line: string;
};

export type DiffSummary = {
  lengthDelta: number;
  addedLines: number;
  removedLines: number;
  addedStructure: boolean;
  addedConstraints: boolean;
  addedOutputInstructions: boolean;
  variablesAdded: string[];
  variablesRemoved: string[];
};
