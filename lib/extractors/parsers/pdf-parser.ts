export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return `[PDF Parser temporaire]\nFichier PDF détecté (${buffer.length} bytes)\nExtraction de texte sera implémentée avec une librairie appropriée.`;
}
