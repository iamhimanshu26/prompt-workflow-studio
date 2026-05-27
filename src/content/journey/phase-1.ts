import type { JourneyPhaseContent } from "./types";

export const phase1: JourneyPhaseContent = {
  phase: 1,
  status: "complete",
  title: { en: "Phase 1 — Dashboard & navigation", ja: "フェーズ1 — ダッシュボードとナビ" },
  subtitle: {
    en: "App shell, demo session, dashboard metrics, and route stubs.",
    ja: "アプリシェル、デモセッション、ダッシュボード指標、ルートの骨組み。",
  },
  deliverables: [
    {
      label: { en: "Header + footer", ja: "ヘッダー + フッター" },
      detail: { en: "Global layout on every page", ja: "全ページ共通レイアウト" },
    },
    {
      label: { en: "Dashboard API", ja: "ダッシュボードAPI" },
      detail: { en: "Counts, categories, recent runs from DB", ja: "DBから件数・カテゴリ・最近の実行" },
    },
    {
      label: { en: "EN / 日本語", ja: "EN / 日本語" },
      detail: { en: "Language toggle with persistence", ja: "言語切替と保存" },
    },
  ],
  steps: [
    {
      title: { en: "App shell", ja: "アプリシェル" },
      body: {
        en: "Navigation to Dashboard, Playground, and future modules.",
        ja: "ダッシュボード、プレイグラウンド等へのナビゲーション。",
      },
    },
    {
      title: { en: "Mock auth", ja: "モック認証" },
      body: {
        en: "Demo user ties all API queries to seeded data.",
        ja: "デモユーザーでAPIとシードデータを紐付け。",
      },
    },
    {
      title: { en: "Dashboard UI", ja: "ダッシュボードUI" },
      body: {
        en: "Stats cards + recent runs table powered by /api/dashboard.",
        ja: "/api/dashboardで統計カードと最近の実行テーブル。",
      },
    },
  ],
  architectureMermaid: `flowchart TB
    UI[Dashboard UI] --> API[/api/dashboard]
    API --> Prisma[Prisma]
    Prisma --> DB[(PostgreSQL)]`,
  tryLinks: [
    { label: { en: "Open Dashboard", ja: "ダッシュボードを開く" }, href: "/dashboard" },
    { label: { en: "API Health", ja: "APIヘルス" }, href: "/health" },
  ],
};
