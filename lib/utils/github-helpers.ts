export function extractGithubUsername(url: string): string | null {
  if (!url || url.trim().length === 0) return null;

  const cleaned = url.trim();

  // Pattern 1: Full GitHub URL
  const urlMatch = cleaned.match(/github\.com\/([^\/\?\s]+)/i);
  if (urlMatch) return urlMatch[1];

  // Pattern 2: Username with trailing slash or path (torvalds/, torvalds/linux)
  const slashMatch = cleaned.match(/^([a-zA-Z0-9_-]+)\/?/);
  if (slashMatch) return slashMatch[1];

  // Pattern 3: Simple username (torvalds)
  if (/^[a-zA-Z0-9_-]+$/.test(cleaned)) return cleaned;

  return null;
}
