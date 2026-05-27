import type { JourneyPhaseContent } from "./types";

export const phase0: JourneyPhaseContent = {
  phase: 0,
  status: "complete",
  title: { en: "Phase 0 — Foundation", ja: "フェーズ0 — 基盤" },
  subtitle: {
    en: "Scaffold the app, database, mock AI, GitHub, Neon, and Vercel.",
    ja: "アプリ、DB、モックAI、GitHub、Neon、Vercelの基盤を構築。",
  },
  deliverables: [
    {
      label: { en: "Next.js + Prisma", ja: "Next.js + Prisma" },
      detail: { en: "App shell and 7-table schema", ja: "アプリ土台と7テーブルスキーマ" },
    },
    {
      label: { en: "Mock AI layer", ja: "モックAI層" },
      detail: { en: "Provider interface for later OpenAI/Gemini", ja: "後続のOpenAI/Gemini用インターフェース" },
    },
    {
      label: { en: "Deploy pipeline", ja: "デプロイ" },
      detail: { en: "GitHub → Vercel + Neon Postgres", ja: "GitHub → Vercel + Neon Postgres" },
    },
  ],
  steps: [
    {
      title: { en: "Define stack", ja: "スタック定義" },
      body: {
        en: "Next.js, PostgreSQL, Prisma, mock auth, phased roadmap.",
        ja: "Next.js、PostgreSQL、Prisma、モック認証、段階的ロードマップ。",
      },
    },
    {
      title: { en: "Local database", ja: "ローカルDB" },
      body: {
        en: "Docker Compose for Postgres; prisma db push and seed.",
        ja: "Docker ComposeでPostgres、prisma db pushとseed。",
      },
    },
    {
      title: { en: "Cloud database", ja: "クラウドDB" },
      body: {
        en: "Neon project + connection string for production.",
        ja: "Neonプロジェクトと本番用接続文字列。",
      },
    },
    {
      title: { en: "Ship to Vercel", ja: "Vercelへデプロイ" },
      body: {
        en: "Import GitHub repo, set DATABASE_URL, verify /health.",
        ja: "GitHub連携、DATABASE_URL設定、/health確認。",
      },
    },
  ],
  architectureMermaid: `flowchart TB
    Browser[Browser] --> Next[Next.js on Vercel]
    Next --> API[API Routes]
    Next --> Neon[(Neon PostgreSQL)]
    Dev[Local dev] --> Docker[(Docker Postgres)]`,
  flowMermaid: `flowchart LR
    A[Scaffold] --> B[Docker DB]
    B --> C[Seed data]
    C --> D[GitHub]
    D --> E[Neon]
    E --> F[Vercel live]`,
  tryLinks: [
    { label: { en: "API Health", ja: "APIヘルス" }, href: "/health" },
    { label: { en: "Home", ja: "ホーム" }, href: "/" },
  ],
};
