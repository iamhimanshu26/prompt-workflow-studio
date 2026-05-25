/**
 * Local demo authentication. Replace with NextAuth before production deploy.
 */
export const DEMO_USER = {
  id: "demo-user-001",
  email: "demo@promptstudio.local",
  name: "Demo User",
} as const;

export function getMockUserId(): string {
  return DEMO_USER.id;
}

export function isMockAuthEnabled(): boolean {
  return (process.env.AUTH_MODE ?? "mock") === "mock";
}
