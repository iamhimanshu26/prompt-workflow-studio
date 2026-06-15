# Prompt Workflow Studio

A full-stack web app for prompt engineering: write prompts, run them against AI models, optimize wording, track versions, score outputs, and chain steps into reusable workflows.

Built as a portfolio project to demonstrate modern React, API design, PostgreSQL, and a provider-based AI integration layer.

## Features (current & planned)

**Available now**

- Enterprise AppShell with sidebar navigation and PromptOps visual identity
- PromptOps Command Center dashboard (KPIs, lifecycle pipeline, activity, system health)
- Prompt Playground — run prompts, save results, track execution history
- Prompt Optimizer — side-by-side optimization and version save
- Any Idea — capture and refine product/workflow ideas (PostgreSQL-backed)
- API Health — database, AI provider, and environment diagnostics
- PostgreSQL data model (Prisma) for prompts, versions, runs, evaluations, workflows, and ideas
- Mock AI provider with OpenAI adapter readiness via environment variables
- Docker Compose for local Postgres; Neon PostgreSQL for production

**Preview / partial**

- Prompt Library — enterprise preview page (full CRUD/search planned)
- Workflow Builder — readiness preview (drag-and-drop canvas planned)
- Version history and side-by-side compare (optimizer save exists; full UI planned)
- Output evaluation center (schema ready; UI planned)
- Multi-model comparison (planned)

**Not yet implemented**

- Full authentication and team management
- Billing and role-based access

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4 |
| Backend | Next.js App Router API routes |
| Database | PostgreSQL 16, Prisma ORM |
| AI | Pluggable provider interface (mock + API adapters) |
| Auth | Demo mode locally; NextAuth planned for production |
| DevOps | Docker Compose (local DB), Vercel (hosting), GitHub (source) |

## Screenshots

_Screenshots to be added after final Phase 1 polish._

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm
- Docker Desktop (for local PostgreSQL)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/prompt-workflow-studio.git
cd prompt-workflow-studio
cp .env.example .env
docker compose up -d
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). API health: [http://localhost:3000/health](http://localhost:3000/health).

### Database setup (Neon PostgreSQL)

This project uses an **existing Neon PostgreSQL** database with **Prisma**. Do not replace the database layer.

1. Create or open your Neon project at [neon.tech](https://neon.tech).
2. Copy the **connection string** (pooled URL recommended for Vercel).
3. Paste it into `.env` as `DATABASE_URL` (and into Vercel → Environment Variables for production).
4. Sync schema and generate client:

```bash
npx prisma generate
npx prisma db push
```

5. Optional seed data:

```bash
npm run db:seed
```

6. Start the app:

```bash
npm run dev
```

Important app data (prompts, runs, versions, ideas, workflows) is stored in **PostgreSQL via Prisma**, not in `localStorage`. Only UI language preference uses `localStorage` (`pws_lang`).

### Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AI_PROVIDER` | `mock` (default), `openai`, or `gemini` |
| `OPENAI_API_KEY` | Required when using OpenAI |
| `GEMINI_API_KEY` | Required when using Gemini |
| `AUTH_MODE` | `mock` for local demo |
| `NEXT_PUBLIC_APP_URL` | App URL (e.g. `http://localhost:3000`) |

See `.env.example` for a full list.

## Project structure

```
├── prisma/           # Schema and seed script
├── src/
│   ├── app/          # Pages and API routes
│   └── lib/          # Database client, AI providers, auth helpers
├── docker-compose.yml
└── docs/             # Roadmap and deployment notes
```

## Database model

- **User** — application accounts
- **Prompt** — saved prompts with category and template flags
- **PromptVersion** — named versions with notes
- **PromptRun** — execution log (model, tokens, latency, response)
- **Evaluation** — scored dimensions and total out of 100
- **Workflow** / **WorkflowStep** — multi-step prompt pipelines

## Deployment

Production hosting is intended for **Vercel**. PostgreSQL should use a managed provider (e.g. [Neon](https://neon.tech)) — local Docker Postgres is for development only.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for step-by-step GitHub and Vercel setup.

## Roadmap

Development is split into incremental releases: foundation → dashboard → playground → optimizer → versioning → evaluation → model comparison → library → workflows → production auth and CI.

Details: [docs/ROADMAP.md](docs/ROADMAP.md)

**Phase guides:** [docs/README.md](docs/README.md) — start with [Phase 0 (foundation)](docs/phase-0-foundation.md)

## License

MIT — see [LICENSE](LICENSE) (add before public release if desired).

## Author

**Your Name** — replace with your name and links (GitHub, LinkedIn) before publishing.
