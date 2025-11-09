import { LinkedInData } from './types';
import { LinkedInJsonParser } from './linkedin/json-parser';
import { LinkedInTextParser } from './linkedin/text-parser';

export function parseLinkedIn(input: string): LinkedInData {
  const data: LinkedInData = { rawText: input };

  const parsedSections = isJsonInput(input) 
    ? parseAsJson(input) 
    : parseAsText(input);

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
