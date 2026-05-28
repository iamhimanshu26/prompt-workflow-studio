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
    navJourney: "Our build",
    navDashboard: "Dashboard",
    navPlayground: "Playground",
    navOptimizer: "Optimizer",
    navLibrary: "Library",
    navWorkflows: "Workflows",
    navAnyIdea: "Any Idea!",

    anyIdeaTitle: "Any Idea!",
    anyIdeaSubtitle:
      "Stuck on a feature? Suddenly remember something for another tab? Jot it down here — with or without details. AI will help optimize it so you can explore it later.",
    anyIdeaLabel: "Your idea (rough notes are fine)",
    anyIdeaPlaceholder: "e.g. Add a quiz mode for verbs… or just: quiz for verbs",
    anyIdeaRefine: "Refine with AI",
    anyIdeaRefining: "Refining…",
    anyIdeaSaveRaw: "Save without refining",
    anyIdeaSaving: "Saving…",
    anyIdeaEmpty: "Write an idea first",
    anyIdeaSaveSuccess: "Idea saved",
    anyIdeaSaveError: "Could not save idea",
    anyIdeaRefineSuccess: "Idea refined and saved",
    anyIdeaRefineError: "Could not refine idea",
    anyIdeaRefinedPreview: "Latest refinement",
    anyIdeaSavedTitle: "Saved ideas",
    anyIdeaSavedEmpty: "No ideas yet — capture your first one above.",
    anyIdeaStorageHint:
      "Ideas are saved in your PostgreSQL database (Idea table) and listed below after each save.",
    anyIdeaLoadError: "Could not load saved ideas",
    anyIdeaBadgeRefined: "Refined",
    anyIdeaBadgeRaw: "Rough",

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

    dashboardJourneyTitle: "How we built this app",
    dashboardJourneyBody:
      "Phase-by-phase story with architecture diagrams, presenter tour, and links to try each feature live.",
    dashboardJourneyCta: "Open Build Journey →",

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

    optimizerTitle: "Prompt Optimizer",
    optimizerSubtitle:
      "Turn rough notes into clear, structured prompts — compare side-by-side, then save as a new version.",
    optimizerRoughLabel: "Rough prompt",
    optimizerImprovedLabel: "Optimized prompt",
    optimizerRoughPlaceholder: "e.g. summarize my japanese pdf into english bullets",
    optimizerRun: "Optimize prompt",
    optimizerRunning: "Optimizing…",
    optimizerEmptyRough: "Enter a rough prompt first",
    optimizerRunSuccess: "Prompt optimized",
    optimizerRunError: "Failed to optimize",
    optimizerNoResult: "Run optimize to see the improved prompt here.",
    optimizerSaveVersion: "Save as new version",
    optimizerSaveNew: "Save as new prompt",
    optimizerSaving: "Saving…",
    optimizerSaveNeedsOptimize: "Optimize first, then save",
    optimizerSaveError: "Failed to save",
    optimizerSaveVersionSuccess: "Saved as version {n}",
    optimizerSaveNewSuccess: "Saved as new prompt",
    optimizerAttachPrompt: "Attach to saved prompt",
    optimizerNewPrompt: "— New prompt —",
    optimizerLoadedPrompt: "Loaded saved prompt",
    optimizerTryPlayground: "Try in Playground",
    optimizerSavedInDbTitle: "Saved in database (Neon)",
    optimizerSavedInDbHint:
      "After you click Save, rows appear in PostgreSQL tables Prompt and PromptVersion.",
    optimizerSavedInDbEmpty: "Nothing saved yet — optimize and click Save as new prompt.",
    optimizerVersionsLabel: "Versions",
    optimizerNeonTablesHint:
      "In Neon SQL Editor: SELECT * FROM \"Prompt\" ORDER BY \"updatedAt\" DESC; and SELECT * FROM \"PromptVersion\" ORDER BY \"createdAt\" DESC;",

    aiMockBannerTitle: "Demo AI mode",
    aiMockBannerBody:
      "Responses are placeholders, not real GPT output. On Vercel set AI_PROVIDER=openai and OPENAI_API_KEY, then redeploy.",

    playgroundLoadedFromOptimizer: "Loaded optimized prompt from Optimizer",
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
    navJourney: "構築記録",
    navDashboard: "ダッシュボード",
    navPlayground: "プレイグラウンド",
    navOptimizer: "最適化",
    navLibrary: "ライブラリ",
    navWorkflows: "ワークフロー",
    navAnyIdea: "Any Idea!",

    anyIdeaTitle: "Any Idea!",
    anyIdeaSubtitle:
      "機能で詰まった？別タブ用のメモを思い出した？ここに書き留めてください。詳細がなくてもOK。AIが整理して、あとで検討しやすくします。",
    anyIdeaLabel: "アイデア（ラフなメモでOK）",
    anyIdeaPlaceholder: "例: 動詞クイズモードを追加… または: 動詞クイズ",
    anyIdeaRefine: "AIで整理",
    anyIdeaRefining: "整理中…",
    anyIdeaSaveRaw: "整理せずに保存",
    anyIdeaSaving: "保存中…",
    anyIdeaEmpty: "先にアイデアを書いてください",
    anyIdeaSaveSuccess: "保存しました",
    anyIdeaSaveError: "保存に失敗しました",
    anyIdeaRefineSuccess: "整理して保存しました",
    anyIdeaRefineError: "整理に失敗しました",
    anyIdeaRefinedPreview: "直近の整理結果",
    anyIdeaSavedTitle: "保存したアイデア",
    anyIdeaSavedEmpty: "まだありません — 上で最初のアイデアを書き留めましょう。",
    anyIdeaStorageHint:
      "アイデアはPostgreSQL（Ideaテーブル）に保存され、保存後に下の一覧に表示されます。",
    anyIdeaLoadError: "保存済みアイデアの読み込みに失敗しました",
    anyIdeaBadgeRefined: "整理済み",
    anyIdeaBadgeRaw: "ラフ",

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

    dashboardJourneyTitle: "このアプリの構築記録",
    dashboardJourneyBody:
      "フェーズごとの説明、アーキテクチャ図、プレゼン用ツアー、各機能のライブ体験リンクがあります。",
    dashboardJourneyCta: "構築ジャーニーを開く →",

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

    optimizerTitle: "プロンプト最適化",
    optimizerSubtitle:
      "ラフなメモを明確なプロンプトに。左右比較してから、新バージョンとして保存できます。",
    optimizerRoughLabel: "ラフなプロンプト",
    optimizerImprovedLabel: "最適化後",
    optimizerRoughPlaceholder: "例: 日本語PDFを英語の箇条書きに要約",
    optimizerRun: "プロンプトを最適化",
    optimizerRunning: "最適化中…",
    optimizerEmptyRough: "先にラフ案を入力してください",
    optimizerRunSuccess: "最適化が完了しました",
    optimizerRunError: "最適化に失敗しました",
    optimizerNoResult: "最適化を実行すると、改善案がここに表示されます。",
    optimizerSaveVersion: "新バージョンとして保存",
    optimizerSaveNew: "新規プロンプトとして保存",
    optimizerSaving: "保存中…",
    optimizerSaveNeedsOptimize: "先に最適化してから保存してください",
    optimizerSaveError: "保存に失敗しました",
    optimizerSaveVersionSuccess: "バージョン {n} として保存しました",
    optimizerSaveNewSuccess: "新規プロンプトとして保存しました",
    optimizerAttachPrompt: "保存済みプロンプトに紐付け",
    optimizerNewPrompt: "— 新規 —",
    optimizerLoadedPrompt: "保存済みプロンプトを読み込みました",
    optimizerTryPlayground: "プレイグラウンドで試す",
    optimizerSavedInDbTitle: "データベースに保存済み（Neon）",
    optimizerSavedInDbHint:
      "「保存」を押すと PostgreSQL の Prompt / PromptVersion テーブルに行が追加されます。",
    optimizerSavedInDbEmpty: "まだありません — 最適化して「新規プロンプトとして保存」を押してください。",
    optimizerVersionsLabel: "バージョン",
    optimizerNeonTablesHint:
      "Neon SQL: SELECT * FROM \"Prompt\" ORDER BY \"updatedAt\" DESC; および \"PromptVersion\"",

    aiMockBannerTitle: "デモAIモード",
    aiMockBannerBody:
      "応答はプレースホルダーです。Vercel で AI_PROVIDER=openai と OPENAI_API_KEY を設定して再デプロイしてください。",

    playgroundLoadedFromOptimizer: "最適化プロンプトを読み込みました",
  },
};

