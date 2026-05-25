# Development roadmap

Incremental delivery plan for Prompt Workflow Studio.

## Completed — Foundation

- Next.js application scaffold with TypeScript and Tailwind CSS
- Prisma schema and PostgreSQL via Docker Compose
- Mock AI provider with complete, optimize, and evaluate methods
- Seed data and health check endpoints
- Local development documentation

## In progress — Dashboard & navigation

- Application shell with sidebar and responsive layout
- Session handling for demo and production auth
- Dashboard metrics: prompt count, recent runs, evaluation averages
- Navigation to feature areas

## Planned

### Prompt playground

- Category-based templates
- Run prompt and persist history
- Link runs to saved prompts

### Prompt optimizer

- Improve rough prompts with side-by-side comparison
- Save optimized text as new version

### Versioning

- Named versions with notes
- Diff view between two versions

### Evaluation

- Score outputs on five dimensions plus total score
- Store results per run with short summary

### Multi-model comparison

- Single prompt against GPT, Gemini, and Claude placeholders
- Token and latency display

### Prompt library

- Reusable templates, filters, search, favorites

### Workflows

- Sequential steps: input → prompt → response → evaluation → save
- First template: job description to interview prep to follow-up email

### Production hardening

- NextAuth with GitHub or Google
- GitHub Actions CI
- Hosted Postgres and Vercel production environment
