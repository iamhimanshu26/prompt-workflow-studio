import { detectVariables } from "@/lib/playground/composePrompt";
import type {
  ImprovementItem,
  OptimizationGoal,
  OutputStyle,
  QualityIndicators,
  TargetAudience,
} from "./types";

const GOAL_INSTRUCTIONS: Record<OptimizationGoal, string> = {
  clarity: "Make the prompt clearer and unambiguous.",
  structure: "Organize the prompt with clear sections and logical flow.",
  conciseness: "Make the prompt concise without losing intent.",
  detailed: "Expand the prompt with useful detail and constraints.",
  professional: "Use a professional tone and business-ready wording.",
  technical: "Emphasize technical accuracy and precise terminology.",
  json: "Prepare the prompt for structured JSON output.",
  interview: "Optimize for interview and job-search scenarios.",
  marketing: "Optimize for marketing copy and persuasive messaging.",
  coding: "Optimize for code assistance and engineering tasks.",
};

const AUDIENCE_INSTRUCTIONS: Record<TargetAudience, string> = {
  general: "Write for a general user audience.",
  developer: "Write for a software developer audience.",
  recruiter: "Write for a recruiter or hiring audience.",
  sales: "Write for a sales team audience.",
  product: "Write for a product manager audience.",
  stakeholder: "Write for business stakeholders and executives.",
  reviewer: "Write for a technical reviewer audience.",
};

const STYLE_INSTRUCTIONS: Record<OutputStyle, string> = {
  clean: "Format as a clean, production-ready prompt.",
  stepByStep: "Format as a step-by-step prompt with numbered instructions.",
  roleBased: "Format as a role-based prompt with explicit role framing.",
  jsonReady: "Format to request JSON-ready structured output.",
  systemUser: "Format as separate System and User prompt blocks.",
  fewShot: "Format as a few-shot prompt with example input/output blocks.",
};

export function buildOptimizeInstruction(opts: {
  optimizationGoal: OptimizationGoal;
  targetAudience: TargetAudience;
  outputStyle: OutputStyle;
  category?: string;
}): string {
  return [
    GOAL_INSTRUCTIONS[opts.optimizationGoal],
    AUDIENCE_INSTRUCTIONS[opts.targetAudience],
    STYLE_INSTRUCTIONS[opts.outputStyle],
    opts.category ? `Category context: ${opts.category}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function computeIndicators(
  original: string,
  optimized: string,
  opts: {
    optimizationGoal: OptimizationGoal;
    outputStyle: OutputStyle;
  },
): QualityIndicators {
  const origLen = original.length;
  const optLen = optimized.length;
  const hasStructure = /#{1,3}\s|\d+\.|Task:|Role:|Output:|Constraints:/i.test(optimized);
  const hasRole = /you are|role:|act as/i.test(optimized);
  const hasOutput = /output format|respond with|return/i.test(optimized);
  const vars = detectVariables(optimized).length;

  const clarity = Math.min(95, 45 + Math.floor(optLen / 30) + (hasStructure ? 15 : 0));
  const specificity = Math.min(
    95,
    40 + (optLen > origLen ? 20 : 10) + (hasOutput ? 15 : 0) + vars * 3,
  );
  const structure = Math.min(95, 35 + (hasStructure ? 35 : 5) + (opts.outputStyle !== "clean" ? 10 : 0));
  const reusability = Math.min(95, 40 + (hasRole ? 20 : 5) + vars * 4);
  const outputControl = Math.min(
    95,
    35 +
      (hasOutput ? 25 : 0) +
      (opts.optimizationGoal === "json" || opts.outputStyle === "jsonReady" ? 20 : 0),
  );

  return { clarity, specificity, structure, reusability, outputControl };
}

export function deriveImprovements(
  original: string,
  optimized: string,
  opts: {
    optimizationGoal: OptimizationGoal;
    targetAudience: TargetAudience;
    outputStyle: OutputStyle;
  },
  aiTags: string[] = [],
): ImprovementItem[] {
  const items: ImprovementItem[] = [];

  if (optimized.length > original.length * 1.1) {
    items.push({
      label: "Structure added",
      description: "Expanded rough instructions into a more complete prompt structure.",
    });
  }
  if (/you are|role:|act as/i.test(optimized)) {
    items.push({
      label: "Role/context added",
      description: "Added explicit role framing for more consistent model behavior.",
    });
  }
  if (/output format|respond with|return|json/i.test(optimized)) {
    items.push({
      label: "Output format clarified",
      description: "Specified how the model should format its response.",
    });
  }
  if (opts.optimizationGoal === "clarity" || optimized.split("\n").length > original.split("\n").length) {
    items.push({
      label: "Clarity improved",
      description: "Reduced ambiguity and clarified task expectations.",
    });
  }
  if (/constraint|must|do not|avoid|limit/i.test(optimized)) {
    items.push({
      label: "Constraints added",
      description: "Added guardrails to guide model behavior.",
    });
  }
  if (opts.targetAudience !== "general") {
    items.push({
      label: "Tone aligned",
      description: `Aligned wording for a ${opts.targetAudience} audience.`,
    });
  }
  if (detectVariables(optimized).length > detectVariables(original).length) {
    items.push({
      label: "Variable placeholders",
      description: "Introduced reusable {{variable}} placeholders where helpful.",
    });
  }

  for (const tag of aiTags.slice(0, 3)) {
    if (!items.some((i) => i.label.toLowerCase() === tag.toLowerCase())) {
      items.push({ label: tag, description: `Applied during optimization: ${tag}.` });
    }
  }

  if (items.length === 0) {
    items.push({
      label: "Prompt refined",
      description: "Converted rough input into a more production-ready prompt.",
    });
  }

  return items.slice(0, 7);
}

export function comparisonInsights(original: string, optimized: string) {
  const origVars = detectVariables(original);
  const optVars = detectVariables(optimized);
  return {
    lengthDelta: optimized.length - original.length,
    addedStructure: /#{1,3}\s|\d+\.|Task:|Role:/i.test(optimized) && !/#{1,3}\s|\d+\.|Task:|Role:/i.test(original),
    addedConstraints: /constraint|must|do not/i.test(optimized) && !/constraint|must|do not/i.test(original),
    addedOutputInstructions:
      /output format|respond with/i.test(optimized) && !/output format|respond with/i.test(original),
    variables: optVars,
    newVariables: optVars.filter((v) => !origVars.includes(v)),
  };
}
