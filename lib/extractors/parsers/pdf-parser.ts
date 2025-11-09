import * as pdfParse from 'pdf-parse';

export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  const pdfData = await (pdfParse as any).default(buffer);
  return pdfData.text;
}
