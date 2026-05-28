# Phase 3 — Prompt Optimizer

**Status:** Complete

## Delivered

- `/optimizer` — side-by-side rough vs optimized UI
- `POST /api/prompts/optimize` — AI improve via `optimize()` on mock/OpenAI
- `POST /api/prompts/optimize/save` — new `PromptVersion` or new `Prompt`
- `GET /api/prompts` — list saved prompts for attach dropdown
- `/journey/3` — Build Journey page

## Try live

- `/optimizer`
- `/journey/3`
- `/health` → `phase: 3`

## Flow

1. Enter rough prompt (or attach saved prompt).
2. **Optimize prompt** → right column shows improved text + improvement tags.
3. **Save as new version** (if attached) or **Save as new prompt**.
4. **Try in Playground** to run the optimized text.
