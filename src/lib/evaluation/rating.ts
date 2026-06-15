export type EvaluationRating =
  | "Excellent"
  | "Strong"
  | "Good"
  | "Needs Improvement"
  | "Risky";

export function scoreToRating(score: number): EvaluationRating {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Strong";
  if (score >= 65) return "Good";
  if (score >= 45) return "Needs Improvement";
  return "Risky";
}

export function ratingLabelKey(rating: string): string {
  const key = rating.replace(/\s+/g, "");
  return `evalRating_${key}`;
}
