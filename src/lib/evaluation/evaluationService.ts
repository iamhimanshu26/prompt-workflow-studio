import type { Evaluation, EvaluationSourceType } from "@prisma/client";
import type { EvaluationResult } from "@/lib/ai/types";
import { getAiProvider } from "@/lib/ai";
import { prisma } from "@/lib/db";
import type { EvaluationRecord, RunEvaluationInput } from "./types";

function preview(text: string | null | undefined, max = 140): string {
  if (!text?.trim()) return "";
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function legacyScores(row: Evaluation) {
  const specificity = row.specificity > 0 ? row.specificity : row.accuracy;
  const outputControl = row.outputControl > 0 ? row.outputControl : row.structure;
  const reusability = row.reusability > 0 ? row.reusability : row.usefulness;
  const reliability = row.reliability > 0 ? row.reliability : row.accuracy;
  const productionReadiness =
    row.productionReadiness > 0
      ? row.productionReadiness
      : Math.round(
          (row.clarity + row.structure + row.accuracy + row.usefulness + (100 - row.hallucinationRisk)) /
            5,
        );
  return { specificity, outputControl, reusability, reliability, productionReadiness };
}

export function mapEvaluationRow(row: Evaluation): EvaluationRecord {
  const legacy = legacyScores(row);
  const promptText = row.promptText;
  const responseText = row.responseText;

  return {
    id: row.id,
    overallScore: row.totalScore,
    rating: row.rating ?? "Good",
    summary: row.summary ?? "",
    scores: {
      clarity: row.clarity,
      specificity: legacy.specificity,
      structure: row.structure,
      outputControl: legacy.outputControl,
      reusability: legacy.reusability,
      reliability: legacy.reliability,
      hallucinationRisk: row.hallucinationRisk,
      productionReadiness: legacy.productionReadiness,
    },
    strengths: asStringArray(row.strengths),
    weaknesses: asStringArray(row.weaknesses),
    recommendations: asStringArray(row.recommendations),
    suggestedPrompt: row.suggestedPrompt,
    sourceType: row.sourceType,
    evaluationType: row.evaluationType,
    promptPreview: preview(promptText),
    outputPreview: responseText ? preview(responseText) : null,
    promptText,
    responseText,
    expectedOutput: row.expectedOutput,
    successCriteria: row.successCriteria,
    promptId: row.promptId,
    promptRunId: row.promptRunId,
    promptVersionId: row.promptVersionId,
    provider: row.provider,
    latencyMs: row.latencyMs,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listEvaluations(userId: string, take = 20): Promise<EvaluationRecord[]> {
  const rows = await prisma.evaluation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  });
  return rows.map(mapEvaluationRow);
}

export async function getEvaluationById(
  userId: string,
  id: string,
): Promise<EvaluationRecord | null> {
  const row = await prisma.evaluation.findFirst({ where: { id, userId } });
  return row ? mapEvaluationRow(row) : null;
}

function mapSourceType(mode: RunEvaluationInput["mode"]): EvaluationSourceType {
  switch (mode) {
    case "prompt_run":
      return "PROMPT_RUN";
    case "saved_prompt":
      return "SAVED_PROMPT";
    case "prompt_version":
      return "PROMPT_VERSION";
    default:
      return "MANUAL";
  }
}

export async function resolveEvaluationPayload(
  userId: string,
  input: RunEvaluationInput,
): Promise<{
  prompt: string;
  output: string;
  promptRunId?: string;
  promptId?: string;
  promptVersionId?: string;
}> {
  const prompt = input.prompt.trim();
  if (!prompt) throw new Error("Prompt is required");

  if (input.mode === "prompt_run" && input.promptRunId) {
    const run = await prisma.promptRun.findFirst({
      where: { id: input.promptRunId, userId },
    });
    if (!run) throw new Error("Prompt run not found");
    return {
      prompt: run.promptText,
      output: (input.output ?? run.responseText).trim(),
      promptRunId: run.id,
      promptId: run.promptId ?? undefined,
    };
  }

  if (input.mode === "saved_prompt" && input.promptId) {
    const saved = await prisma.prompt.findFirst({ where: { id: input.promptId, userId } });
    if (!saved) throw new Error("Saved prompt not found");
    return {
      prompt: saved.body,
      output: (input.output ?? "").trim(),
      promptId: saved.id,
    };
  }

  if (input.mode === "prompt_version" && input.promptId && input.promptVersionId) {
    const version = await prisma.promptVersion.findFirst({
      where: { id: input.promptVersionId, promptId: input.promptId, prompt: { userId } },
    });
    if (!version) throw new Error("Prompt version not found");
    return {
      prompt: version.body,
      output: (input.output ?? "").trim(),
      promptId: input.promptId,
      promptVersionId: version.id,
    };
  }

  return {
    prompt,
    output: (input.output ?? "").trim(),
    promptRunId: input.promptRunId,
    promptId: input.promptId,
    promptVersionId: input.promptVersionId,
  };
}

export async function saveEvaluationRecord(
  userId: string,
  input: RunEvaluationInput,
  result: EvaluationResult,
  refs: {
    prompt: string;
    output: string;
    promptRunId?: string;
    promptId?: string;
    promptVersionId?: string;
  },
  provider: string,
) {
  const row = await prisma.evaluation.create({
    data: {
      userId,
      promptRunId: refs.promptRunId ?? null,
      promptId: refs.promptId ?? null,
      promptVersionId: refs.promptVersionId ?? null,
      sourceType: input.sourceType ?? mapSourceType(input.mode),
      evaluationType: input.evaluationType,
      promptText: refs.prompt,
      responseText: refs.output || null,
      expectedOutput: input.expectedOutput?.trim() || null,
      successCriteria: input.successCriteria?.trim() || null,
      clarity: result.clarity,
      specificity: result.specificity,
      structure: result.structure,
      outputControl: result.outputControl,
      reusability: result.reusability,
      reliability: result.reliability,
      accuracy: result.accuracy,
      usefulness: result.usefulness,
      hallucinationRisk: result.hallucinationRisk,
      productionReadiness: result.productionReadiness,
      totalScore: result.totalScore,
      rating: result.rating,
      summary: result.summary,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      recommendations: result.recommendations,
      suggestedPrompt: result.suggestedPrompt ?? null,
      provider,
      latencyMs: result.latencyMs ?? null,
    },
  });

  return mapEvaluationRow(row);
}

export async function runEvaluation(userId: string, input: RunEvaluationInput) {
  const refs = await resolveEvaluationPayload(userId, input);
  const evaluationType = input.evaluationType;

  if (
    (evaluationType === "OUTPUT_QUALITY" ||
      evaluationType === "ALIGNMENT" ||
      evaluationType === "RISK_REVIEW") &&
    !refs.output
  ) {
    throw new Error("Model output is required for this evaluation type");
  }

  const ai = getAiProvider();
  const result = await ai.evaluate({
    prompt: refs.prompt,
    response: refs.output || undefined,
    expectedOutput: input.expectedOutput,
    successCriteria: input.successCriteria,
    evaluationType,
  });

  let saved: EvaluationRecord | null = null;
  if (input.save !== false) {
    saved = await saveEvaluationRecord(userId, input, result, refs, ai.name);
  }

  return {
    evaluation: saved ?? {
      id: "",
      overallScore: result.totalScore,
      rating: result.rating,
      summary: result.summary,
      scores: {
        clarity: result.clarity,
        specificity: result.specificity,
        structure: result.structure,
        outputControl: result.outputControl,
        reusability: result.reusability,
        reliability: result.reliability,
        hallucinationRisk: result.hallucinationRisk,
        productionReadiness: result.productionReadiness,
      },
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      recommendations: result.recommendations,
      suggestedPrompt: result.suggestedPrompt ?? null,
      sourceType: input.sourceType ?? mapSourceType(input.mode),
      evaluationType,
      promptPreview: preview(refs.prompt),
      outputPreview: refs.output ? preview(refs.output) : null,
      promptText: refs.prompt,
      responseText: refs.output || null,
      expectedOutput: input.expectedOutput ?? null,
      successCriteria: input.successCriteria ?? null,
      promptId: refs.promptId ?? null,
      promptRunId: refs.promptRunId ?? null,
      promptVersionId: refs.promptVersionId ?? null,
      provider: ai.name,
      latencyMs: result.latencyMs ?? null,
      createdAt: new Date().toISOString(),
    },
    metadata: {
      provider: ai.name,
      model: ai.name,
      latencyMs: result.latencyMs ?? 0,
      evaluationType,
      saved: Boolean(saved),
    },
    result,
  };
}
