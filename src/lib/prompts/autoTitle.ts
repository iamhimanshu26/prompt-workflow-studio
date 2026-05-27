export function autoTitleFromPrompt(text: string, maxLen = 60): string {
  const line = (text.trim().split(/\n/)[0] ?? "").trim();
  if (!line) return "Untitled prompt";
  if (line.length <= maxLen) return line;
  return `${line.slice(0, maxLen - 1)}…`;
}
