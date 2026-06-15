const KEY = "pws_quota_exceeded";

export function markQuotaExceeded(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, "1");
  window.dispatchEvent(new Event("pws-quota"));
}

export function clearQuotaExceeded(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
  window.dispatchEvent(new Event("pws-quota"));
}

export function hasQuotaExceeded(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(KEY) === "1";
}

export function subscribeQuotaExceeded(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => onChange();
  window.addEventListener("pws-quota", handler);
  return () => window.removeEventListener("pws-quota", handler);
}
