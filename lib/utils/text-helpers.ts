export function extractError(error: unknown): string {
  return error instanceof Error ? error.message : 'Erreur inconnue';
}

export function isEmptyString(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

export function splitIntoLines(text: string): string[] {
  return text.split('\n').map(line => line.trim()).filter(Boolean);
}

export function joinLines(lines: string[]): string {
  return lines.join('\n');
}
