import { fetchLinkedInProfile } from './url-fetcher';

export async function parseLinkedInFromUrl(url: string): Promise<any> {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔗 LINKEDIN URL EXTRACTION');
  
  try {
    // 1. Fetch HTML from LinkedIn
    const html = await fetchLinkedInProfile(url);
    
    // 2. Extract visible text from HTML (simple version)
    const text = extractTextFromHtml(html);
    
    console.log(`📄 Extracted text: ${text.substring(0, 300)}...`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return {
      url,
      rawHtml: html,
      extractedText: text,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ LinkedIn URL parsing failed:', error);
    throw error;
  }
}

function extractTextFromHtml(html: string): string {
  // Remove scripts and styles
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ')
    .trim();
  
  return text;
}
