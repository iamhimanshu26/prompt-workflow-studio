export type OptimizationGoal =
  | "clarity"
  | "structure"
  | "conciseness"
  | "detailed"
  | "professional"
  | "technical"
  | "json"
  | "interview"
  | "marketing"
  | "coding";

export type TargetAudience =
  | "general"
  | "developer"
  | "recruiter"
  | "sales"
  | "product"
  | "stakeholder"
  | "reviewer";

export type OutputStyle =
  | "clean"
  | "stepByStep"
  | "roleBased"
  | "jsonReady"
  | "systemUser"
  | "fewShot";

export type QualityIndicators = {
  clarity: number;
  specificity: number;
  structure: number;
  reusability: number;
  outputControl: number;
};

export type ImprovementItem = {
  label: string;
  description: string;
};

export type OptimizeMetadata = {
  provider: string;
  model: string;
  optimizationGoal: OptimizationGoal;
  targetAudience: TargetAudience;
  outputStyle: OutputStyle;
  category: string;
  latencyMs: number;
  createdAt: string;
  originalLength: number;
  optimizedLength: number;
};

export type OptimizeApiData = {
  optimizedPrompt: string;
  original: string;
  optimized: string;
  metadata: OptimizeMetadata;
  improvements: ImprovementItem[];
  indicators: QualityIndicators;
  provider: string;
};
