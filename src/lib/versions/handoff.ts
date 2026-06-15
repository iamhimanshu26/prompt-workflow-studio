import { PromptCategory } from "@prisma/client";

export function buildPlaygroundUrl(body: string, category?: PromptCategory, title?: string) {
  const params = new URLSearchParams();
  params.set("prompt", body);
  if (category) params.set("category", category);
  if (title?.trim()) params.set("title", title.trim());
  return `/playground?${params.toString()}`;
}

export function buildOptimizerUrl(body: string, category?: PromptCategory, title?: string) {
  const params = new URLSearchParams();
  params.set("prompt", body);
  if (category) params.set("category", category);
  if (title?.trim()) params.set("title", title.trim());
  return `/optimizer?${params.toString()}`;
}
