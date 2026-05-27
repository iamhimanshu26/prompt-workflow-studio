import { getAiProvider } from "@/lib/ai";

const IDEA_REFINE_SYSTEM = `You help product builders refine rough feature ideas into clear, actionable notes.
Return markdown with these sections only:
## Title
(one short line)
## Problem
(1-2 sentences)
## Proposed solution
(2-4 bullets)
## Explore later
(optional bullets for open questions)
Keep it concise. If the input is vague, infer reasonable assumptions and label them.`;

function mockRefinedIdea(rough: string): string {
  const snippet = rough.trim().slice(0, 120) || "New idea";
  return [
    "## Title",
    snippet.split("\n")[0].slice(0, 80),
    "",
    "## Problem",
    "Rough notes captured — needs clearer scope and success criteria.",
    "",
    "## Proposed solution",
    `- Start from: "${snippet}${rough.length > 120 ? "…" : ""}"`,
    "- Break into a small MVP and a follow-up phase",
    "- Add acceptance criteria before implementation",
    "",
    "## Explore later",
    "- Priority vs. current roadmap phases",
    "- UI placement and data model impact",
    "",
    "_Refined with mock AI — set AI_PROVIDER=openai for richer refinement._",
  ].join("\n");
}

export async function refineIdea(rough: string): Promise<string> {
  const trimmed = rough.trim();
  const ai = getAiProvider();

  if (ai.name === "mock") {
    return mockRefinedIdea(trimmed);
  }

  const result = await ai.complete({
    prompt: trimmed,
    category: "GENERAL",
    systemHint: IDEA_REFINE_SYSTEM,
  });

  return result.text;
}
