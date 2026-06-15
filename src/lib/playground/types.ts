export type OutputFormat =
  | "plain"
  | "bullets"
  | "json"
  | "markdown"
  | "email"
  | "technical";

export type Tone =
  | "professional"
  | "concise"
  | "detailed"
  | "friendly"
  | "technical"
  | "executive";

export type ResponseLength = "short" | "medium" | "long";
export type Creativity = "low" | "balanced" | "high";

export type ExecutionOptions = {
  temperature?: number;
  responseLength?: ResponseLength;
  creativity?: Creativity;
};

export type RunMetadata = {
  provider: string;
  model: string;
  latencyMs: number;
  category: string;
  outputFormat?: OutputFormat | null;
  tone?: Tone | null;
  createdAt: string;
  promptLength: number;
  tokenInput?: number;
  tokenOutput?: number;
};
