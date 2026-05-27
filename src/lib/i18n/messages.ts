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
    navJourney: "Build Journey",
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

    journeyHubSubtitle:
      "Walk through how each phase was built — timelines, diagrams, and live demos for presentations.",

    playgroundTitle: "Prompt Playground",
    playgroundSubtitle: "Write a prompt, run AI, save results, and track history.",
    playgroundCategory: "Category",
    playgroundPromptLabel: "Your prompt",
    playgroundPromptPlaceholder: "Enter your prompt here…",
    playgroundRun: "Run",
    playgroundRunning: "Running…",
    playgroundSave: "Save prompt",
    playgroundSaving: "Saving…",
    playgroundResponse: "AI response",
    playgroundNoResponse: "Run a prompt to see the response here.",
    playgroundCopy: "Copy",
    playgroundCopySuccess: "Copied to clipboard",
    playgroundCopyError: "Could not copy",
    playgroundRunSuccess: "Prompt ran successfully",
    playgroundRunError: "Failed to run prompt",
    playgroundSaveSuccess: "Prompt saved",
    playgroundSaveError: "Failed to save prompt",
    playgroundEmptyPrompt: "Please enter a prompt first",
    playgroundRecentRuns: "Recent runs",
    playgroundProvider: "Provider",
    playgroundTokens: "Tokens",
    playgroundLatency: "Latency",
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
    navJourney: "構築ジャーニー",
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

    journeyHubSubtitle:
      "各フェーズの構築過程を確認できます。タイムライン、図解、ライブデモでプレゼンに使えます。",

    playgroundTitle: "プロンプト・プレイグラウンド",
    playgroundSubtitle: "プロンプトを書いてAIを実行し、結果を保存・履歴管理します。",
    playgroundCategory: "カテゴリ",
    playgroundPromptLabel: "プロンプト",
    playgroundPromptPlaceholder: "ここにプロンプトを入力…",
    playgroundRun: "実行",
    playgroundRunning: "実行中…",
    playgroundSave: "プロンプトを保存",
    playgroundSaving: "保存中…",
    playgroundResponse: "AIの応答",
    playgroundNoResponse: "実行するとここに応答が表示されます。",
    playgroundCopy: "コピー",
    playgroundCopySuccess: "クリップボードにコピーしました",
    playgroundCopyError: "コピーに失敗しました",
    playgroundRunSuccess: "実行が完了しました",
    playgroundRunError: "実行に失敗しました",
    playgroundSaveSuccess: "保存しました",
    playgroundSaveError: "保存に失敗しました",
    playgroundEmptyPrompt: "先にプロンプトを入力してください",
    playgroundRecentRuns: "最近の実行",
    playgroundProvider: "プロバイダ",
    playgroundTokens: "トークン",
    playgroundLatency: "レイテンシ",
  },
};

