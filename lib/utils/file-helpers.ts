import { SUPPORTED_MIME_TYPES } from '../extractors/constants';

export function isSupportedFileType(mimeType: string): boolean {
  return Object.values(SUPPORTED_MIME_TYPES).includes(mimeType as any);
}

export function getFileTypeError(mimeType: string): string {
  return `Type de fichier non supporté: ${mimeType}`;
}

export async function fileToBuffer(file: File): Promise<Buffer> {
  return Buffer.from(await file.arrayBuffer());
}
