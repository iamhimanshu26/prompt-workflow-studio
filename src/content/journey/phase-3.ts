import type { JourneyPhaseContent } from "./types";

export const phase3: JourneyPhaseContent = {
  phase: 3,
  status: "current",
  title: { en: "Phase 3 — Prompt Optimizer", ja: "フェーズ3 — プロンプト最適化" },
  subtitle: {
    en: "Improve rough prompts side-by-side, then save as a new version or new prompt.",
    ja: "ラフなプロンプトを並べて改善し、新バージョンまたは新規プロンプトとして保存。",
  },
  deliverables: [
    {
      label: { en: "Side-by-side UI", ja: "左右比較UI" },
      detail: { en: "Rough vs optimized columns", ja: "ラフ案と改善案を並列表示" },
    },
    {
      label: { en: "Optimize API", ja: "最適化API" },
      detail: { en: "POST /api/prompts/optimize", ja: "AIでプロンプトを構造化" },
    },
    {
      label: { en: "Version save", ja: "バージョン保存" },
      detail: { en: "POST /api/prompts/optimize/save", ja: "PromptVersion に追記" },
    },
  ],
  steps: [
    {
      title: { en: "Enter rough prompt", ja: "ラフ入力" },
      body: {
        en: "Pick a category and write a quick, messy prompt — or load a saved one.",
        ja: "カテゴリを選び、ざっくり書いたプロンプトを入力（保存済みの読み込みも可）。",
      },
    },
    {
      title: { en: "Optimize", ja: "最適化" },
      body: {
        en: "AI adds role, constraints, and output format. Mock or OpenAI via env.",
        ja: "AIが役割・制約・出力形式を補います（mock / OpenAI）。",
      },
    },
    {
      title: { en: "Save version", ja: "バージョン保存" },
      body: {
        en: "Attach to an existing prompt for v2, v3… or save as a brand-new prompt.",
        ja: "既存プロンプトに v2 以降を追加、または新規プロンプトとして保存。",
      },
    },
  ],
  architectureMermaid: `flowchart LR
    R[Rough prompt] --> API["/api/prompts/optimize"]
    API --> AI[AI Provider]
    AI --> O[Optimized text]
    O --> SAVE["/api/prompts/optimize/save"]
    SAVE --> PV[(PromptVersion)]`,
  tryLinks: [
    { href: "/optimizer", label: { en: "Open Optimizer", ja: "最適化を開く" } },
    { href: "/playground", label: { en: "Playground", ja: "プレイグラウンド" } },
    { href: "/dashboard", label: { en: "Dashboard", ja: "ダッシュボード" } },
  ],
};
