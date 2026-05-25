import type { PromptCategory } from "@prisma/client";

export const PROMPT_CATEGORIES: { value: PromptCategory; label: string }[] = [
  { value: "RESUME", label: "Resume" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "EMAIL", label: "Email" },
  { value: "CODING", label: "Coding" },
  { value: "LEARNING", label: "Learning" },
  { value: "MARKETING", label: "Marketing" },
  { value: "GENERAL", label: "General" },
];
