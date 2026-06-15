import type { OptimizationGoal, OutputStyle, TargetAudience } from "./types";

export type OptimizerTemplate = {
  id: string;
  labelKey: string;
  roughText?: string;
  goal?: OptimizationGoal;
  audience?: TargetAudience;
  style?: OutputStyle;
};

export const OPTIMIZER_TEMPLATES: OptimizerTemplate[] = [
  {
    id: "vague",
    labelKey: "optTplVague",
    roughText: "help me write something good about my product for customers",
    goal: "clarity",
    style: "clean",
  },
  {
    id: "role",
    labelKey: "optTplRole",
    roughText: "you are an expert assistant. help me with: ",
    goal: "structure",
    style: "roleBased",
  },
  {
    id: "concise",
    labelKey: "optTplConcise",
    goal: "conciseness",
    style: "clean",
  },
  {
    id: "format",
    labelKey: "optTplFormat",
    goal: "json",
    style: "jsonReady",
  },
  {
    id: "eval",
    labelKey: "optTplEval",
    roughText:
      "Evaluate the following output against clarity, accuracy, and usefulness. Provide a score and brief rationale:\n\n{{output}}",
    goal: "technical",
    style: "stepByStep",
  },
  {
    id: "workflow",
    labelKey: "optTplWorkflow",
    roughText:
      "Design an AI workflow prompt that chains these steps: {{step1}} → {{step2}} → {{step3}}",
    goal: "structure",
    style: "stepByStep",
    audience: "product",
  },
];
