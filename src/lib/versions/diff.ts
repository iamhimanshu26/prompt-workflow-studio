import { detectVariables } from "@/lib/playground/composePrompt";
import type { DiffLine, DiffSummary } from "./types";

export function computeLineDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const result: DiffLine[] = [];

  const maxLen = Math.max(linesA.length, linesB.length);
  for (let i = 0; i < maxLen; i++) {
    const lineA = linesA[i];
    const lineB = linesB[i];
    if (lineA === lineB) {
      if (lineA !== undefined) result.push({ type: "same", line: lineA });
    } else {
      if (lineA !== undefined) result.push({ type: "remove", line: lineA });
      if (lineB !== undefined) result.push({ type: "add", line: lineB });
    }
  }

  return result;
}

export function computeDiffSummary(a: string, b: string): DiffSummary {
  const diff = computeLineDiff(a, b);
  const varsA = detectVariables(a);
  const varsB = detectVariables(b);

  return {
    lengthDelta: b.length - a.length,
    addedLines: diff.filter((d) => d.type === "add").length,
    removedLines: diff.filter((d) => d.type === "remove").length,
    addedStructure:
      /#{1,3}\s|\d+\.|Task:|Role:/i.test(b) && !/#{1,3}\s|\d+\.|Task:|Role:/i.test(a),
    addedConstraints:
      /constraint|must|do not/i.test(b) && !/constraint|must|do not/i.test(a),
    addedOutputInstructions:
      /output format|respond with/i.test(b) && !/output format|respond with/i.test(a),
    variablesAdded: varsB.filter((v) => !varsA.includes(v)),
    variablesRemoved: varsA.filter((v) => !varsB.includes(v)),
  };
}
