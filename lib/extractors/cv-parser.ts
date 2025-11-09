import { CVData } from './types';
import { SUPPORTED_MIME_TYPES, CV_SECTION_PATTERNS } from './constants';
import { fileToBuffer, getFileTypeError } from '../utils/file-helpers';
import { extractError } from '../utils/text-helpers';
import { parsePdfBuffer } from './parsers/pdf-parser';
import { parseDocxBuffer } from './parsers/docx-parser';
import { parseTextBuffer } from './parsers/text-parser';
import { SectionExtractor } from './section-extractor';

export async function parseCv(file: File): Promise<CVData> {
  try {
    const rawText = await extractTextFromFile(file);
    const sections = extractCvSections(rawText);

    return { rawText: rawText.trim(), sections };
  } catch (error) {
    throw new Error(`Erreur lors du parsing du CV: ${extractError(error)}`);
  }
}

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = await fileToBuffer(file);
  
  const parser = getParserForFileType(file.type);
  return parser(buffer);
}

function getParserForFileType(mimeType: string): (buffer: Buffer) => Promise<string> {
  const parsers: Record<string, (buffer: Buffer) => Promise<string>> = {
    [SUPPORTED_MIME_TYPES.PDF]: parsePdfBuffer,
    [SUPPORTED_MIME_TYPES.DOCX]: parseDocxBuffer,
    [SUPPORTED_MIME_TYPES.DOC]: parseDocxBuffer,
    [SUPPORTED_MIME_TYPES.TEXT]: async (buffer) => parseTextBuffer(buffer),
  };

  const parser = parsers[mimeType];
  
  if (!parser) {
    throw new Error(getFileTypeError(mimeType));
  }

  return parser;
}

function extractCvSections(text: string): CVData['sections'] {
  const extractor = new SectionExtractor({
    experience: CV_SECTION_PATTERNS.EXPERIENCE,
    education: CV_SECTION_PATTERNS.EDUCATION,
    skills: CV_SECTION_PATTERNS.SKILLS,
  });

  return extractor.extract(text);
}
