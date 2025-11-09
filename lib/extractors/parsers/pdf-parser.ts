const MAX_PAGES = 5;

export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return `[PDF temporaire - ${buffer.length} bytes]`;
}

export async function convertPdfToImages(buffer: Buffer): Promise<Buffer[]> {
  // TODO: Implémenter conversion PDF → Images
  // Options: API externe, pdfjs-dist avec canvas, ou service séparé
  console.log(`Conversion PDF désactivée temporairement (${buffer.length} bytes)`);
  return [];
}
