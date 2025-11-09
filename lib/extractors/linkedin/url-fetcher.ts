export async function fetchLinkedInProfile(url: string): Promise<string> {
  console.log('🔍 Fetching LinkedIn profile:', url);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    console.log(`✅ Fetched ${html.length} characters from LinkedIn`);
    
    // Check if we got blocked
    if (html.includes('authwall') || html.includes('checkpoint')) {
      throw new Error('LinkedIn requires login - profile is private or blocked');
    }

    return html;
  } catch (error) {
    console.error('❌ LinkedIn fetch error:', error);
    throw new Error(`Failed to fetch LinkedIn profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
