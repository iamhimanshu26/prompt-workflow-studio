# Phase 0 — Foundation

End-to-end record of everything built and connected in Phase 0: local project, database, AI mock layer, GitHub, Neon, and Vercel.

**Status:** Complete  
**Live checks:** `/` (landing) · `/health` (formatted status) · `/api/health` (JSON)

---

## 1. What Phase 0 delivered

| Deliverable | Purpose |
|-------------|---------|
| Next.js app shell | UI host + API routes |
| Prisma schema (7 models) | Data structure for all future features |
| Mock AI provider | Run app without paid API keys |
| Mock auth (demo user) | Skip login until Phase 1 / production auth |
| Docker Compose Postgres | Local database for development |
| Seed script | Demo prompts, runs, evaluation, workflow |
| Health endpoints | Verify app + DB + AI in one call |
| GitHub repository | Source control + Vercel integration |
| Neon PostgreSQL | Production database (serverless) |
| Vercel deployment | Public URL (no localhost required) |

---

## 2. Big-picture architecture (after Phase 0)

```mermaid
flowchart TB
  subgraph users [Users]
    Browser[Browser]
  end

  subgraph vercel [Vercel - Production]
    Next[Next.js App]
    API["/api/health"]
    Pages["/ and /health"]
  end

  subgraph neon [Neon - Cloud]
    PG[(PostgreSQL)]
  end

  subgraph local [Your Mac - Development]
    Dev[npm run dev]
    Docker[(Docker Postgres)]
  end

  subgraph github [GitHub]
    Repo[prompt-workflow-studio repo]
  end

  Browser -->|HTTPS| Next
  Next --> Pages
  Next --> API
  Next -->|DATABASE_URL| PG
  Dev -->|local .env| Docker
  Repo -->|git push| vercel
  Dev -.->|optional same Neon URL| PG
```

**Takeaway:** One codebase. Two database targets (local Docker vs Neon), chosen by `DATABASE_URL` in environment.

---

## 3. Phase 0 timeline (start → finish)

```mermaid
flowchart LR
  A[Define product & stack] --> B[Scaffold repo]
  B --> C[Install Node + Docker]
  C --> D[Local run + seed]
  D --> E[Git init + GitHub push]
  E --> F[Create Neon project]
  F --> G[Prisma push + seed on Neon]
  G --> H[Vercel import + env vars]
  H --> I[Fix health on production]
  I --> J[Phase 0 complete]
```

| Step | What you did | Outcome |
|------|----------------|---------|
| 1 | Chose **Prompt Workflow Studio** + Next.js/Prisma/Postgres | Clear product scope |
| 2 | Created project at `~/Projects/prompt-workflow-studio` | Folder + source files |
| 3 | Installed **Xcode CLT**, **Node**, **Docker Desktop** | `git`, `npm`, `docker` work |
| 4 | `npm install` → `docker compose up -d` → `db:push` → `db:seed` → `npm run dev` | Localhost works |
| 5 | `git init` → push to **iamhimanshu26/prompt-workflow-studio** | Code on GitHub |
| 6 | Neon project + connection string (Auth **off**) | Cloud Postgres ready |
| 7 | `DATABASE_URL=neon... prisma db push/seed` | Tables + demo data in Neon |
| 8 | Vercel: import repo + `DATABASE_URL` + mock env | Public deploy |
| 9 | Fixed `/health` to not call localhost on Vercel | `"database": "ok"` on live site |

---

## 4. Repository structure (code map)

```text
prompt-workflow-studio/
├── prisma/
│   ├── schema.prisma      # Database models
│   └── seed.ts            # Demo data loader
├── src/
│   ├── app/
│   │   ├── page.tsx       # Phase 0 landing + roadmap
│   │   ├── health/page.tsx# Human-readable health UI
│   │   └── api/health/route.ts  # JSON health API
│   └── lib/
│       ├── db.ts            # Prisma client singleton
│       ├── health.ts        # Shared health logic
│       ├── ai/              # AI provider interface + mock
│       └── auth/mock.ts     # Demo user for development
├── docker-compose.yml       # Local Postgres only
├── .env.example             # Template (no secrets)
└── docs/                    # Phase documentation (this file)
```

```mermaid
flowchart TB
  subgraph app [Next.js App Router]
    Home["/ page.tsx"]
    HealthPage["/health page.tsx"]
    HealthAPI["/api/health route.ts"]
  end

  subgraph lib [Shared libraries]
    HealthLib["lib/health.ts"]
    DB["lib/db.ts → Prisma"]
    AI["lib/ai → MockAiProvider"]
    Auth["lib/auth/mock.ts"]
  end

  Home --> HealthPage
  HealthPage --> HealthLib
  HealthAPI --> HealthLib
  HealthLib --> DB
  HealthLib --> AI
  HealthLib --> Auth
  DB --> Prisma[(PostgreSQL)]
```

---

## 5. Database design (Prisma)

```mermaid
erDiagram
  User ||--o{ Prompt : owns
  User ||--o{ PromptRun : runs
  User ||--o{ Evaluation : scores
  User ||--o{ Workflow : creates
  Prompt ||--o{ PromptVersion : has
  Prompt ||--o{ PromptRun : triggers
  PromptRun ||--o{ Evaluation : evaluated_by
  Workflow ||--o{ WorkflowStep : contains

  User {
    string id PK
    string email UK
    string name
  }
  Prompt {
    string id PK
    string title
    string body
    enum category
    boolean isFavorite
    boolean isTemplate
  }
  PromptVersion {
    string id PK
    int version
    string name
    string body
  }
  PromptRun {
    string id PK
    string promptText
    string responseText
    enum modelId
    int tokenInput
    int tokenOutput
  }
  Evaluation {
    string id PK
    int clarity
    int structure
    int totalScore
  }
  Workflow {
    string id PK
    string name
  }
  WorkflowStep {
    string id PK
    int order
    enum stepType
  }
```

**Seed data (demo):** user `demo@promptstudio.local`, 2 prompts, 2 versions, 2 runs, 1 evaluation, 1 sample workflow (`JD → Interview → Follow-up`).

---

## 6. Local development workflow

```mermaid
sequenceDiagram
  participant You as Developer
  participant Term as Terminal
  participant Docker as Docker Postgres
  participant Next as Next.js dev server
  participant Prisma as Prisma CLI

  You->>Term: cp .env.example .env
  You->>Docker: docker compose up -d
  You->>Term: npm install
  You->>Prisma: npm run db:push
  You->>Prisma: npm run db:seed
  You->>Next: npm run dev
  Next-->>You: http://localhost:3000
  You->>Next: GET /health
  Next->>Docker: SELECT 1 via DATABASE_URL
  Next-->>You: database ok
```

| Command | What it does |
|---------|----------------|
| `docker compose up -d` | Starts Postgres on `localhost:5432` |
| `npm run db:push` | Applies `schema.prisma` to the database |
| `npm run db:seed` | Runs `prisma/seed.ts` (demo rows) |
| `npm run dev` | Starts Next.js on port **3000** (terminal must stay open) |

**Local `DATABASE_URL` (from `.env.example`):**

```env
postgresql://pws:pws_dev@localhost:5432/prompt_workflow_studio?schema=public
```

---

## 7. AI layer (mock provider)

Phase 0 does **not** call OpenAI/Gemini yet. All AI goes through a small interface so real providers can be plugged in later.

```mermaid
flowchart LR
  App[API or future routes] --> Factory["getAiProvider()"]
  Factory -->|AI_PROVIDER=mock| Mock[MockAiProvider]
  Factory -->|future| OpenAI[OpenAI adapter]
  Factory -->|future| Gemini[Gemini adapter]
  Mock --> Complete[complete]
  Mock --> Optimize[optimize]
  Mock --> Evaluate[evaluate]
```

| Method | Phase 0 behavior |
|--------|------------------|
| `complete` | Returns formatted mock text + fake token counts |
| `optimize` | Wraps rough prompt in a structured template |
| `evaluate` | Heuristic scores (clarity, structure, etc.) |

**Env:** `AI_PROVIDER=mock` (default in `.env.example` and Vercel).

---

## 8. Auth (Phase 0)

```mermaid
flowchart LR
  Request[Incoming request] --> Check{AUTH_MODE}
  Check -->|mock| Demo["Demo user\n demo@promptstudio.local"]
  Check -->|future| NextAuth[NextAuth session]
```

No login UI in Phase 0. `src/lib/auth/mock.ts` defines a fixed demo user ID used when seeding and when building features in Phase 1.

---

## 9. Health check flow

Health proves three things: app runs, database reachable, AI provider responds.

```mermaid
flowchart TB
  Start[GET /api/health or /health page] --> H[getHealthStatus in lib/health.ts]
  H --> DB["prisma.$queryRaw SELECT 1"]
  DB -->|success| DOk[database: ok]
  DB -->|fail| DErr[database: error + message]
  H --> AI[mock AI complete sample]
  AI --> JSON[JSON response]
  JSON --> Browser[Browser or /health page]
```

**Production fix (end of Phase 0):** `/health` originally fetched `http://localhost:3000/api/health` on Vercel, which returned HTML → JSON parse error. **Fix:** call `getHealthStatus()` directly (no HTTP loopback).

**Healthy production response:**

```json
{
  "status": "ok",
  "phase": 0,
  "database": "ok",
  "auth": "mock",
  "ai": { "provider": "mock", "sampleLatencyMs": 456 }
}
```

---

## 10. Git & GitHub workflow

```mermaid
flowchart LR
  Local[Mac project folder] -->|git add / commit| Commit[Local git repo]
  Commit -->|git push| GitHub[GitHub remote]
  GitHub -->|webhook| Vercel[Vercel build]
```

| Item | Value |
|------|--------|
| **Remote** | `https://github.com/iamhimanshu26/prompt-workflow-studio` |
| **Branch** | `main` |
| **Auth** | Personal Access Token or `gh auth login` (GitHub no longer accepts account password for git) |

**Note:** If commit shows your name twice on GitHub, it listed both **Author** and **Committer** (same person). Set `git config user.email` to your GitHub email or `...@users.noreply.github.com` for cleaner attribution on future commits.

**Not committed (by design):** `.env`, `node_modules/`, `.next/`

---

## 11. Neon (production database)

```mermaid
flowchart TB
  You[You] --> Console[Neon Console]
  Console --> Project[Project: prompt-workflow-studio]
  Project --> Conn[Connection string]
  Conn --> Mac["Terminal: prisma db push / seed"]
  Conn --> Vercel["Vercel env: DATABASE_URL"]
  Vercel --> App[Deployed Next.js]
  App --> NeonDB[(Neon Postgres)]
  Mac --> NeonDB
```

| Setting | Choice in Phase 0 |
|---------|-------------------|
| Postgres version | 17 |
| Region | AWS US East 1 (or Singapore — either works) |
| **Neon Auth** | **Off** (app uses its own auth later) |
| Connection type | **Pooled** URL recommended for Vercel |

**Important:** Neon URL is **only** the cloud database. It is **not** the same as local Docker URL. Never put `localhost` in Vercel `DATABASE_URL`.

---

## 12. Vercel deployment workflow

```mermaid
sequenceDiagram
  participant GH as GitHub
  participant V as Vercel
  participant N as Neon
  participant U as User browser

  GH->>V: Push to main triggers deploy
  V->>V: npm install + prisma generate + next build
  V->>N: Runtime queries via DATABASE_URL
  V-->>U: HTTPS *.vercel.app
  U->>V: GET /health
  V->>N: Health check query
  V-->>U: database ok
```

### Environment variables on Vercel

| Key | Phase 0 value | Role |
|-----|----------------|------|
| `DATABASE_URL` | Neon `postgresql://...` | Production DB |
| `AI_PROVIDER` | `mock` | AI responses |
| `AUTH_MODE` | `mock` | Auth behavior |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Optional; useful later |

### Deploy checklist

- [x] Import correct repo (`prompt-workflow-studio`, not another project)
- [x] Set `DATABASE_URL` to Neon (not localhost)
- [x] Run `prisma db push` + `seed` against Neon once from Mac
- [x] Push health-page fix; verify `/health` shows `database: ok`

**Wrong Vercel project symptom:** Login page titled “YourApp - An app to CRUD” — that is a different repository/deployment.

---

## 13. Environments compared

| | Local (Mac) | Production (Vercel) |
|---|-------------|---------------------|
| **App URL** | `http://localhost:3000` | `https://*.vercel.app` |
| **Database** | Docker `localhost:5432` | Neon host |
| **DATABASE_URL** | From `.env` (local) | Vercel env (Neon) |
| **Start app** | `npm run dev` (keep terminal open) | Always on after deploy |
| **DB setup** | `docker compose` + `db:push` + `db:seed` | `db:push` + `db:seed` with Neon URL once |

```mermaid
flowchart TB
  subgraph code [Same codebase]
    Repo[GitHub main branch]
  end
  Repo --> Local[Local .env → Docker]
  Repo --> Prod[Vercel env → Neon]
```

---

## 14. Issues encountered in Phase 0 (and fixes)

| Problem | Cause | Fix |
|---------|--------|-----|
| `ERR_CONNECTION_REFUSED` on localhost | `npm run dev` not running | Run `npm run dev`; keep terminal open |
| `npm not found` | Node not installed on new Mac | Install Node LTS from nodejs.org or Homebrew |
| `docker compose` / `-d` error | Docker Desktop not running or no Compose | Install/open Docker Desktop |
| Git push auth failed | GitHub rejects password | Use PAT or `gh auth login` |
| Double name on Git commit | Author + committer both shown | Set `git config user.email` to GitHub email |
| Wrong site on Vercel | Different project URL | Open project tied to `prompt-workflow-studio` repo |
| `/health` JSON parse error on Vercel | Page fetched `localhost` | Use `lib/health.ts` directly (pushed fix) |
| `database: error` on Vercel | Missing/wrong `DATABASE_URL` or schema not pushed | Set Neon URL on Vercel; run `db:push` + `seed` on Neon |

---

## 15. How to verify Phase 0 is complete

Run through this list on **production** (Vercel URL):

1. **Home** `/` — Title “Prompt Workflow Studio”, Phase 0 roadmap visible  
2. **Health UI** `/health` — `"status": "ok"`, `"database": "ok"`  
3. **Health API** `/api/health` — Same JSON in browser  
4. **GitHub** — Repo contains `src/`, `prisma/`, `docs/`, no `.env`  
5. **Neon console** — Tables exist (`User`, `Prompt`, etc.) with seed rows  

---

## 16. What Phase 1 will add (preview)

Phase 0 intentionally has **no** dashboard, playground, or login UI. Phase 1 will:

- App shell (sidebar + layout)  
- Mock session wired to demo user  
- Dashboard API reading real counts from Neon  
- Route stubs for upcoming features  

See [ROADMAP.md](./ROADMAP.md).

---

## 17. Quick reference commands

```bash
# Local dev
cd ~/Projects/prompt-workflow-studio
docker compose up -d
npm run dev

# Sync DB (local)
npm run db:push && npm run db:seed

# Sync DB (Neon) — paste your Neon URL
DATABASE_URL="postgresql://..." npx prisma db push
DATABASE_URL="postgresql://..." npx prisma db seed

# Git
git add .
git commit -m "Your message"
git push origin main
```

---

*Document version: Phase 0 complete · Matches repository state after Vercel health fix*
