import { LinkedInData } from './types';
import { LinkedInJsonParser } from './linkedin/json-parser';
import { LinkedInTextParser } from './linkedin/text-parser';
import { parseLinkedInFromUrl } from './linkedin/url-parser';

export async function parseLinkedIn(input: string): Promise<LinkedInData> {
  const data: LinkedInData = { rawText: input };

  // Check if it's a LinkedIn URL
  if (input.includes('linkedin.com/in/')) {
    try {
      const urlData = await parseLinkedInFromUrl(input);
      data.rawText = urlData.extractedText;
      data.url = urlData.url;
    } catch (error) {
      console.warn('⚠️ LinkedIn URL fetch failed, using input as-is:', error);
    }
  }

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
