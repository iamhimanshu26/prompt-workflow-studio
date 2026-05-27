/** Placeholder from docs — must not be used for OG / share previews in production. */
const PLACEHOLDER_HOST = "your-app.vercel.app";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

/**
 * Canonical site URL for metadata and Open Graph.
 * Ignores placeholder NEXT_PUBLIC_APP_URL; prefers Vercel system URLs when deployed.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv && !fromEnv.includes(PLACEHOLDER_HOST)) {
    return stripTrailingSlash(fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`);
  }

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) {
    return stripTrailingSlash(`https://${production}`);
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return stripTrailingSlash(`https://${vercel}`);
  }

  return "https://prompt-workflow-studio.vercel.app";
}

export const SITE_URL = getSiteUrl();

export const SITE_NAME = "Prompt Workflow Studio";

export const SITE_DESCRIPTION =
  "Create, test, improve, compare, and evaluate AI prompts — with a phase-by-phase build journey.";

export const OG_IMAGE_PATH = "/og-image.jpg";

export function getOgImageUrl(): string {
  return `${SITE_URL}${OG_IMAGE_PATH}`;
}
