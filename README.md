# Prompt Workflow Studio

A full-stack web app for prompt engineering: write prompts, run them against AI models, optimize wording, track versions, score outputs, and chain steps into reusable workflows.

Built as a portfolio project to demonstrate modern React, API design, PostgreSQL, and a provider-based AI integration layer.

## Features (current & planned)

**Available now (foundation)**

- PostgreSQL data model for prompts, versions, runs, evaluations, and workflows
- Mock AI provider (swap to OpenAI or Gemini via environment variables)
- Health check API and seed data for local development
- Docker Compose setup for local Postgres

**Coming next**

- Dashboard with stats and recent activity
- Prompt playground with category templates (resume, interview, email, coding, and more)
- Side-by-side prompt optimizer
- Version history and comparison
- Output evaluation (clarity, structure, accuracy, usefulness, hallucination risk)
- Multi-model comparison (GPT, Gemini, Claude)
- Prompt library with search and favorites
- Workflow builder (e.g. job description → interview prep → follow-up email)

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

_Add screenshots after Phase 1 UI is complete._

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

## License

MIT — see [LICENSE](LICENSE) (add before public release if desired).

## Author

**Your Name** — replace with your name and links (GitHub, LinkedIn) before publishing.
