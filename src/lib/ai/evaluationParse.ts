import type { EvaluationResult } from "./types";
import { scoreToRating } from "@/lib/evaluation/rating";

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

export function normalizeEvaluationResult(raw: Partial<EvaluationResult>): EvaluationResult {
  const clarity = clamp(raw.clarity ?? 0);
  const specificity = clamp(raw.specificity ?? raw.accuracy ?? 0);
  const structure = clamp(raw.structure ?? 0);
  const outputControl = clamp(raw.outputControl ?? structure * 0.9);
  const reusability = clamp(raw.reusability ?? raw.usefulness ?? 0);
  const reliability = clamp(raw.reliability ?? raw.accuracy ?? 0);
  const hallucinationRisk = clamp(raw.hallucinationRisk ?? 30);
  const productionReadiness = clamp(
    raw.productionReadiness ??
      (clarity + specificity + structure + outputControl + reusability + reliability +
        (100 - hallucinationRisk)) /
        7,
  );

  const totalScore = clamp(
    raw.totalScore ??
      (clarity +
        specificity +
        structure +
        outputControl +
        reusability +
        reliability +
        (100 - hallucinationRisk) +
        productionReadiness) /
        8,
  );

  return {
    clarity,
    specificity,
    structure,
    outputControl,
    reusability,
    reliability,
    hallucinationRisk,
    productionReadiness,
    accuracy: clamp(raw.accuracy ?? reliability),
    usefulness: clamp(raw.usefulness ?? reusability),
    totalScore,
    rating: raw.rating ?? scoreToRating(totalScore),
    summary: raw.summary?.trim() || "AI-assisted quality evaluation completed.",
    strengths: asStringArray(raw.strengths),
    weaknesses: asStringArray(raw.weaknesses),
    recommendations: asStringArray(raw.recommendations),
    suggestedPrompt: raw.suggestedPrompt?.trim() || undefined,
  };
}

export function parseEvaluationJson(text: string): EvaluationResult | null {
  const trimmed = text.trim();
  const jsonBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? trimmed;
  try {
    const parsed = JSON.parse(jsonBlock) as Record<string, unknown>;
    return normalizeEvaluationResult({
      clarity: Number(parsed.clarity),
      specificity: Number(parsed.specificity),
      structure: Number(parsed.structure),
      outputControl: Number(parsed.outputControl),
      reusability: Number(parsed.reusability),
      reliability: Number(parsed.reliability),
      hallucinationRisk: Number(parsed.hallucinationRisk),
      productionReadiness: Number(parsed.productionReadiness),
      accuracy: Number(parsed.accuracy),
      usefulness: Number(parsed.usefulness),
      totalScore: Number(parsed.totalScore ?? parsed.overallScore),
      rating: typeof parsed.rating === "string" ? parsed.rating : undefined,
      summary: typeof parsed.summary === "string" ? parsed.summary : undefined,
      strengths: asStringArray(parsed.strengths),
      weaknesses: asStringArray(parsed.weaknesses),
      recommendations: asStringArray(parsed.recommendations),
      suggestedPrompt:
        typeof parsed.suggestedPrompt === "string" ? parsed.suggestedPrompt : undefined,
    });
  } catch {
    return null;
  }
}
