export type Lang = "en" | "ja";

export const MESSAGES: Record<Lang, Record<string, string>> = {
  en: {
    phase0Heading: "Phase 0 — Foundation",
    appTitle: "Prompt Workflow Studio",
    appSubtitle:
      "AI prompt engineering platform: create, test, improve, compare, save, and evaluate prompts. UI and features arrive in Phases 1–8.",
    buildRoadmapTitle: "Build roadmap",
    checkApiHealth: "Check API health →",
    readmeSetupLocal: "README setup (local)",
    runLine:
      "Run: docker compose up -d → cp .env.example .env → npm install → npm run db:push → npm run db:seed → npm run dev",

    apiHealthTitle: "API Health",
    backToHome: "Back to home",
    rawJsonLabel: "Raw JSON:",
    databaseConnectionFailed: "Database connection failed",
    dbHintVercel:
      "On Vercel, set DATABASE_URL to your Neon connection string, then redeploy.",

    toggleEn: "English",
    toggleJa: "日本語",

    phase0Label: "Scaffold + DB + mock AI",
    phase1Label: "Dashboard + auth + navigation",
    phase2Label: "Prompt Playground",
    phase3Label: "Prompt Optimizer",
    phase4Label: "Versioning + compare",
    phase5Label: "Evaluation",
    phase6Label: "Multi-model comparison",
    phase7Label: "Prompt library",
    phase8Label: "Workflow builder",
    phase9Label: "GitHub + Vercel deploy",

    navHealth: "API Health",
    navDashboard: "Dashboard",
    navPlayground: "Playground",
    navOptimizer: "Optimizer",
    navLibrary: "Library",
    navWorkflows: "Workflows",

    dashboardBrand: "Dashboard",
    dashboardHint: "Welcome back — demo account",

    dashboardTitle: "Dashboard",
    dashboardLoading: "Loading…",
    dashboardError: "Failed to load dashboard",

    promptsCountLabel: "Saved prompts",
    runsCountLabel: "Prompt runs",
    avgScoreLabel: "Average score",
    categoriesTitle: "Categories",

    recentRunsTitle: "Recent runs",
    recentRunsEmpty: "No runs yet",

    tableCreatedAt: "Created",
    tableCategory: "Category",
    tableModel: "Model",
    tablePrompt: "Prompt",
    tableScore: "Score (/100)",

    comingSoon: "Coming soon. This page will be fully implemented in the next phases.",
  },
  ja: {
    phase0Heading: "フェーズ0 — 基盤",
    appTitle: "Prompt Workflow Studio",
    appSubtitle:
      "AIプロンプトエンジニアリング・プラットフォーム。プロンプトを作成し、テストし、改善し、比較し、保存し、評価します。UIと機能はフェーズ1〜8で順次追加されます。",
    buildRoadmapTitle: "開発ロードマップ",
    checkApiHealth: "APIヘルスを確認 →",
    readmeSetupLocal: "ローカル設定（README）",
    runLine:
      "実行: docker compose up -d → cp .env.example .env → npm install → npm run db:push → npm run db:seed → npm run dev",

    apiHealthTitle: "APIヘルス",
    backToHome: "ホームに戻る",
    rawJsonLabel: "生のJSON:",
    databaseConnectionFailed: "データベース接続に失敗しました",
    dbHintVercel:
      "Vercelでは DATABASE_URL をNeonの接続文字列に設定し、再デプロイしてください。",

    toggleEn: "English",
    toggleJa: "日本語",

    phase0Label: "土台構築 + DB + モックAI",
    phase1Label: "ダッシュボード + 認証 + ナビゲーション",
    phase2Label: "プロンプト・プレイグラウンド",
    phase3Label: "プロンプト最適化",
    phase4Label: "バージョニング + 比較",
    phase5Label: "評価",
    phase6Label: "複数モデル比較",
    phase7Label: "プロンプトライブラリ",
    phase8Label: "ワークフロー作成",
    phase9Label: "GitHub + Vercelデプロイ",

    navHealth: "APIヘルス",
    navDashboard: "ダッシュボード",
    navPlayground: "プレイグラウンド",
    navOptimizer: "最適化",
    navLibrary: "ライブラリ",
    navWorkflows: "ワークフロー",

    dashboardBrand: "ダッシュボード",
    dashboardHint: "おかえり — デモアカウント",

    dashboardTitle: "ダッシュボード",
    dashboardLoading: "読み込み中…",
    dashboardError: "ダッシュボードの取得に失敗しました",

    promptsCountLabel: "保存済みプロンプト",
    runsCountLabel: "実行ログ",
    avgScoreLabel: "平均スコア",
    categoriesTitle: "カテゴリ",

    recentRunsTitle: "最近の実行",
    recentRunsEmpty: "まだ実行データがありません",

    tableCreatedAt: "日時",
    tableCategory: "カテゴリ",
    tableModel: "モデル",
    tablePrompt: "プロンプト",
    tableScore: "スコア（/100）",

    comingSoon: "準備中です。次のフェーズで実装します。",
  },
};

