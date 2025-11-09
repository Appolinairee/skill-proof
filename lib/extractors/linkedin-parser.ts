import { LinkedInData } from './types';
import { LinkedInJsonParser } from './linkedin/json-parser';
import { LinkedInTextParser } from './linkedin/text-parser';
import { captureLinkedInProfile } from './linkedin/screenshot-fetcher';

export async function parseLinkedIn(input: string): Promise<LinkedInData> {
  const data: LinkedInData = { rawText: input };

  // LinkedIn fetching disabled for MVP - too complex (authwall, slow screenshots)
  // User can paste LinkedIn text manually instead
  console.log('ℹ️ LinkedIn parsing désactivé pour MVP - paste texte manuel seulement');

  // Parse text content if provided (fallback)
  const parsedSections = isJsonInput(data.rawText) 
    ? parseAsJson(data.rawText) 
    : parseAsText(data.rawText);

  if (parsedSections) {
    data.parsedSections = parsedSections;
  }

  return data;
}

function isJsonInput(input: string): boolean {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}

function parseAsJson(input: string): LinkedInData['parsedSections'] | null {
  try {
    const jsonData = JSON.parse(input);
    
    if (jsonData.Profile || jsonData.profile) {
      const parser = new LinkedInJsonParser();
      return parser.parse(jsonData);
    }
  } catch {
    return null;
  }
  
  return null;
}

function parseAsText(input: string): LinkedInData['parsedSections'] {
  const parser = new LinkedInTextParser();
  return parser.parse(input);
}
