# Deployment guide

This project runs on **Vercel** for the Next.js app and a **hosted PostgreSQL** database for production. Local Docker Postgres is not available on Vercel.

## 1. Push to GitHub

Create a new repository on GitHub (empty, no README if you already have one locally).

```bash
cd ~/Projects/prompt-workflow-studio
git init
git add .
git commit -m "Initial commit: Prompt Workflow Studio foundation"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/prompt-workflow-studio.git
git push -u origin main
```

Use a clear repo name and add topics on GitHub: `nextjs`, `typescript`, `prisma`, `postgresql`, `ai`, `prompt-engineering`.

## 2. Production database (Neon)

1. Sign up at [neon.tech](https://neon.tech).
2. Create a project and database.
3. Copy the **connection string** (pooled URL recommended for serverless).
4. In the Neon SQL editor or a local client, you do not need to run migrations manually if you use Prisma from your machine:

```bash
DATABASE_URL="your-neon-connection-string" npx prisma db push
DATABASE_URL="your-neon-connection-string" npx prisma db seed
```

## 3. Deploy on Vercel

1. Sign up at [vercel.com](https://vercel.com) and import your GitHub repository.
2. Framework preset: **Next.js** (auto-detected).
3. Root directory: project root (where `package.json` lives).
4. Add environment variables:

| Name | Value |
|------|--------|
| `DATABASE_URL` | Neon connection string |
| `AI_PROVIDER` | `mock` until API keys are set |
| `AUTH_MODE` | `mock` until NextAuth is configured |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

5. Deploy. Vercel runs `npm run build`, which runs `prisma db push` (syncs schema to Neon) then `next build`. Prisma client is generated via `postinstall`.

## 4. After deploy

- Visit your Vercel URL and `/health` to confirm `database: ok`.
- Add a custom domain in Vercel if desired.
- Pin the repository on your GitHub profile for visibility.

## 5. Optional: real AI keys

Add to Vercel environment variables when adapters are implemented:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- Set `AI_PROVIDER=openai` or `gemini`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails on Prisma | Ensure `DATABASE_URL` is set in Vercel |
| `database: error` on production | Use Neon URL, run `prisma db push` against Neon |
| Empty app | Check build logs; verify `NEXT_PUBLIC_APP_URL` matches Vercel URL |
| Any Idea! buttons do nothing | Run `npm run db:push` against Neon, or redeploy so build runs `prisma db push` |
