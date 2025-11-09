export function extractGithubUsername(url: string): string | null {
  const patterns = [
    /github\.com\/([^\/\?]+)/i,
    /^([a-zA-Z0-9-]+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}
