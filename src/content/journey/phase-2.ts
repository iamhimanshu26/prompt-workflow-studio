import type { JourneyPhaseContent } from "./types";

export const phase2: JourneyPhaseContent = {
  phase: 2,
  status: "complete",
  title: { en: "Phase 2 — Prompt Playground", ja: "フェーズ2 — プロンプト・プレイグラウンド" },
  subtitle: {
    en: "Write prompts, run AI (mock or OpenAI), save history, and explore the build journey.",
    ja: "プロンプト作成、AI実行（モック/OpenAI）、履歴保存、構築ジャーニーの公開。",
  },
  deliverables: [
    {
      label: { en: "Playground UI", ja: "プレイグラウンドUI" },
      detail: { en: "Category, run, response, save", ja: "カテゴリ、実行、応答、保存" },
    },
    {
      label: { en: "OpenAI adapter", ja: "OpenAIアダプター" },
      detail: { en: "AI_PROVIDER=openai + OPENAI_API_KEY", ja: "環境変数で本番AI" },
    },
    {
      label: { en: "Build Journey", ja: "構築ジャーニー" },
      detail: { en: "Interactive phase docs with diagrams", ja: "図解付きインタラクティブドキュメント" },
    },
  ],
  steps: [
    {
      title: { en: "Write prompt", ja: "プロンプト入力" },
      body: {
        en: "Choose a category and enter your prompt text.",
        ja: "カテゴリを選び、プロンプトを入力します。",
      },
    },
    {
      title: { en: "Run AI", ja: "AI実行" },
      body: {
        en: "POST /api/prompts/run stores a PromptRun with tokens and latency.",
        ja: "/api/prompts/run で PromptRun を保存します。",
      },
    },
    {
      title: { en: "Save & copy", ja: "保存とコピー" },
      body: {
        en: "Auto-title from first line; copy response to clipboard.",
        ja: "先頭行から自動タイトル、応答をコピー。",
      },
    },
  ],
  architectureMermaid: `sequenceDiagram
    participant U as User
    participant PG as Playground
    participant API as /api/prompts/run
    participant AI as AI Provider
    participant DB as PostgreSQL
    U->>PG: Run prompt
    PG->>API: POST
    API->>AI: complete()
    AI-->>API: response
    API->>DB: PromptRun
    API-->>PG: JSON
    PG-->>U: Show response`,
  tryLinks: [
    { label: { en: "Open Playground", ja: "プレイグラウンド" }, href: "/playground" },
    { label: { en: "Dashboard", ja: "ダッシュボード" }, href: "/dashboard" },
  ],
};
