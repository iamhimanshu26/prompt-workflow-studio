import type { AiModelId } from "@prisma/client";

export type ProviderUiState = {
  activeProvider: string;
  usingMock: boolean;
  openaiConfigured: boolean;
};

export const MODEL_OPTIONS: {
  id: AiModelId;
  label: string;
  available: boolean;
  planned?: boolean;
}[] = [
  { id: "GPT", label: "GPT / OpenAI", available: true },
  { id: "GEMINI", label: "Gemini", available: false, planned: true },
  { id: "CLAUDE", label: "Claude", available: false, planned: true },
];
