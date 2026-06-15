import type { Creativity, ExecutionOptions, OutputFormat, Tone } from "./types";

const VAR_PATTERN = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;

export function detectVariables(text: string): string[] {
  const found = new Set<string>();
  for (const match of text.matchAll(VAR_PATTERN)) {
    if (match[1]) found.add(match[1]);
  }
  return Array.from(found);
}

export function replaceVariables(
  text: string,
  values: Record<string, string>,
): string {
  return text.replace(VAR_PATTERN, (_, name: string) => {
    const key = name.trim();
    return values[key]?.trim() ? values[key].trim() : `{{${key}}}`;
  });
}

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  professional: "Use a professional, polished tone.",
  concise: "Be concise. Avoid unnecessary words.",
  detailed: "Provide a detailed, thorough response.",
  friendly: "Use a warm, friendly tone while staying helpful.",
  technical: "Use precise technical language appropriate for engineers.",
  executive: "Write for an executive audience: clear, strategic, and outcome-focused.",
};

const FORMAT_INSTRUCTIONS: Record<OutputFormat, string> = {
  plain: "Respond in plain text paragraphs.",
  bullets: "Format the response as clear bullet points.",
  json: "Respond with valid JSON only, no markdown fences.",
  markdown: "Format the response using clean Markdown headings and lists.",
  email: "Format the response as a professional email with subject line, greeting, body, and sign-off.",
  technical: "Provide a technical explanation with structured sections and precise terminology.",
};

const LENGTH_INSTRUCTIONS: Record<string, string> = {
  short: "Keep the response brief (roughly 2–4 sentences or a short list).",
  medium: "Use a medium-length response with balanced detail.",
  long: "Provide a comprehensive, longer response with full detail.",
};

const CREATIVITY_INSTRUCTIONS: Record<Creativity, string> = {
  low: "Stay conservative and literal. Minimize speculation.",
  balanced: "Balance creativity with accuracy.",
  high: "Be more creative and exploratory while staying relevant.",
};

export function buildFormatInstruction(format: OutputFormat): string {
  return FORMAT_INSTRUCTIONS[format];
}

export function buildToneInstruction(tone: Tone): string {
  return TONE_INSTRUCTIONS[tone];
}

export function composeExecutionPrompt(
  userPrompt: string,
  opts?: {
    outputFormat?: OutputFormat;
    tone?: Tone;
    executionOptions?: ExecutionOptions;
  },
): string {
  const instructions: string[] = [];

  if (opts?.tone) instructions.push(buildToneInstruction(opts.tone));
  if (opts?.outputFormat) instructions.push(buildFormatInstruction(opts.outputFormat));
  if (opts?.executionOptions?.responseLength) {
    instructions.push(LENGTH_INSTRUCTIONS[opts.executionOptions.responseLength]);
  }
  if (opts?.executionOptions?.creativity) {
    instructions.push(CREATIVITY_INSTRUCTIONS[opts.executionOptions.creativity]);
  }
  if (opts?.executionOptions?.temperature != null) {
    const t = opts.executionOptions.temperature;
    if (t <= 0.3) instructions.push("Prefer deterministic, focused answers.");
    else if (t >= 0.8) instructions.push("Allow more varied phrasing where appropriate.");
  }

  if (instructions.length === 0) return userPrompt.trim();

  return `${userPrompt.trim()}\n\n---\nOutput requirements:\n${instructions.map((i) => `- ${i}`).join("\n")}`;
}
