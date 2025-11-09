/**
 * Web Search Service - Recherche d'informations en ligne sur une personne
 * Utilise Google Custom Search API ou alternatives
 */

export interface SearchResult {
    title: string;
    link: string;
    snippet: string;
    source: 'google' | 'bing' | 'duckduckgo' | 'serpapi' | 'searxng';
}

export interface PersonWebProfile {
    name: string;
    searchResults: SearchResult[];
    socialLinks: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        website?: string;
        blog?: string;
    };
    mentions: string[]; // Articles, interviews, etc.
    enrichedData: {
        keywords: string[];
        companies: string[];
        technologies: string[];
        achievements: string[];
    };
}

export class WebSearchService {
    private serpApiKey?: string;
    private bingApiKey?: string;
    private googleApiKey?: string;
    private googleSearchEngineId?: string;
    private braveApiKey?: string;

    constructor() {
        // Priorité: SerpAPI > Bing > Brave > Google Custom Search > SearXNG
        this.serpApiKey = process.env.SERPAPI_KEY;
        this.bingApiKey = process.env.BING_SEARCH_API_KEY;
        this.braveApiKey = process.env.BRAVE_SEARCH_API_KEY;
        this.googleApiKey = process.env.GOOGLE_SEARCH_API_KEY;
        this.googleSearchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
    }

    /**
     * Recherche complète sur une personne
     */
    async searchPerson(name: string, githubUsername?: string): Promise<PersonWebProfile> {
        console.log('━━━━━━━━━━ WEB SEARCH ━━━━━━━━━━');
        console.log('🔍 Recherche pour:', name);
        console.log('GitHub username:', githubUsername || 'none');

        // PHASE 1: Recherche TRÈS large - juste le nom
        console.log('📍 Recherche large tous domaines...');
        const initialResults = await this.executeSearch(name); // Juste le nom, sans filtre

        let allResults: SearchResult[] = [...initialResults];

        // PHASE 2: Si on a des résultats, une seule recherche affinée avec réseaux sociaux
        if (initialResults.length > 0) {
            console.log('📍 Recherche réseaux sociaux...');
            const socialResults = await this.executeSearch(`"${name}" linkedin OR github OR twitter OR portfolio`);
            allResults.push(...socialResults);
        }

        // Remove duplicates
        const uniqueResults = this.deduplicateResults(allResults);

        console.log(`✅ ${uniqueResults.length} résultat(s) unique(s) trouvé(s)`);

        // If we have results, scrape top pages for deeper analysis
        const scrapedContent = await this.scrapeTopResults(uniqueResults.slice(0, 3));

        return {
            name,
            searchResults: uniqueResults,
            socialLinks: this.extractSocialLinks(uniqueResults),
            mentions: this.extractMentions(uniqueResults),
            enrichedData: this.extractEnrichedData(uniqueResults, scrapedContent),
        };
    }

    /**
     * Détecte le contexte depuis les premiers résultats
     */
    private detectContext(results: SearchResult[]): string[] {
        const allText = results.map(r => `${r.title} ${r.snippet}`.toLowerCase()).join(' ');
        const contexts: string[] = [];

        if (allText.includes('developer') || allText.includes('engineer') || allText.includes('programmer')) {
            contexts.push('tech');
        }
        if (allText.includes('student') || allText.includes('university') || allText.includes('école')) {
            contexts.push('student');
        }
        if (allText.includes('researcher') || allText.includes('research') || allText.includes('phd')) {
            contexts.push('researcher');
        }
        if (allText.includes('linkedin') || allText.includes('github') || allText.includes('portfolio')) {
            contexts.push('professional');
        }

        return contexts.length > 0 ? contexts : ['general'];
    }

    /**
     * Construit des requêtes affinées basées sur le contexte
     */
    private buildRefinedQueries(name: string, context: string[], githubUsername?: string): string[] {
        const queries: string[] = [];

        if (context.includes('tech') || context.includes('professional')) {
            queries.push(`"${name}" github OR portfolio OR projects`);
            queries.push(`"${name}" linkedin`);
        }

        if (context.includes('student')) {
            queries.push(`"${name}" projects OR internship`);
        }

        if (githubUsername) {
            queries.push(`"${githubUsername}" site:github.com`);
        }

        return queries.slice(0, 2); // Max 2 requêtes affinées
    }

    /**
     * Déduplique les résultats par URL
     */
    private deduplicateResults(results: SearchResult[]): SearchResult[] {
        const seen = new Set<string>();
        return results.filter(r => {
            if (seen.has(r.link)) return false;
            seen.add(r.link);
            return true;
        });
    }

    /**
     * Construit les requêtes de recherche optimisées (DEPRECATED - kept for backward compatibility)
     */
    private buildSearchQueries(name: string, githubUsername?: string): string[] {
        const queries: string[] = [];

        // Recherche générale
        queries.push(`"${name}" developer OR engineer OR programmer`);

        // Avec GitHub
        if (githubUsername) {
            queries.push(`"${name}" "${githubUsername}" github`);
            queries.push(`${githubUsername} site:github.com`);
        } else {
            // Sans GitHub, recherche plus large
            queries.push(`"${name}" portfolio OR projects OR open source`);
            queries.push(`"${name}" tech OR technology OR software`);
        }

        // Réseaux sociaux
        queries.push(`"${name}" site:linkedin.com`);

        // Conférences et talks
        queries.push(`"${name}" conference OR talk OR speaker OR presentation`);

        console.log('🔎 Requêtes:', queries.length);
        return queries.slice(0, 4); // Limite à 4 recherches pour le MVP
    }

    /**
     * Execute une recherche (priorité: SerpAPI > Bing > Google > SearXNG > DuckDuckGo)
     */
    private async executeSearch(query: string): Promise<SearchResult[]> {
        console.log('🔎 Query:', query);

        // Priorité 1: SerpAPI (meilleurs résultats)
        if (this.serpApiKey) {
            console.log('🔍 Using SerpAPI...');
            return this.searchWithSerpAPI(query);
        }

        // Priorité 2: Bing (1000 free/month)
        if (this.bingApiKey) {
            console.log('🔍 Using Bing Search API...');
            return this.searchWithBing(query);
        }

        // Priorité 3: Google Custom Search (100 free/day)
        if (this.googleApiKey && this.googleSearchEngineId) {
            console.log('🔍 Using Google Custom Search...');
            return this.searchWithGoogle(query);
        }

        // Priorité 4: SearXNG (gratuit, open-source, sans clé)
        console.log('🔍 Using SearXNG (free, no API key needed)...');
        const searxngResults = await this.searchWithSearXNG(query);
        if (searxngResults.length > 0) {
            return searxngResults;
        }

        // Fallback: DuckDuckGo (souvent bloqué)
        console.warn('⚠️ SearXNG failed, falling back to DuckDuckGo...');
        console.warn('💡 Pour de meilleurs résultats, configurez une API:');
        console.warn('   Option 1 (Recommandé): SerpAPI - 100 recherches/mois gratuit');
        console.warn('   → https://serpapi.com/ → Ajouter SERPAPI_KEY dans .env');
        console.warn('   ');
        console.warn('   Option 2: Bing Search - 1000 recherches/mois gratuit');
        console.warn('   → https://portal.azure.com/ → Ajouter BING_SEARCH_API_KEY dans .env');

        return this.searchWithDuckDuckGo(query);
    }

    /**
     * SerpAPI - Meilleurs résultats (scrape Google directement)
     */
    private async searchWithSerpAPI(query: string): Promise<SearchResult[]> {
        try {
            const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${this.serpApiKey}&num=10`;

            const response = await fetch(url);
            const data = await response.json();

            if (!data.organic_results) {
                console.warn('⚠️ SerpAPI: No organic results');
                return [];
            }

            const results = data.organic_results.slice(0, 10).map((item: any) => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet || '',
                source: 'serpapi' as const,
            }));

            console.log(`✅ SerpAPI found ${results.length} results`);
            return results;
        } catch (error) {
            console.warn('⚠️ SerpAPI failed:', error);
            return [];
        }
    }

    /**
     * Bing Search API - 1000 requêtes/mois gratuites
     */
    private async searchWithBing(query: string): Promise<SearchResult[]> {
        try {
            const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=10`;

            const response = await fetch(url, {
                headers: {
                    'Ocp-Apim-Subscription-Key': this.bingApiKey!,
                },
            });

            const data = await response.json();

            if (!data.webPages?.value) {
                console.warn('⚠️ Bing: No web pages found');
                return [];
            }

            const results = data.webPages.value.map((item: any) => ({
                title: item.name,
                link: item.url,
                snippet: item.snippet || '',
                source: 'bing' as const,
            }));

            console.log(`✅ Bing found ${results.length} results`);
            return results;
        } catch (error) {
            console.warn('⚠️ Bing Search failed:', error);
            return [];
        }
    }

    /**
     * Google Custom Search API
     */
    private async searchWithGoogle(query: string): Promise<SearchResult[]> {
        try {
            const url = `https://www.googleapis.com/customsearch/v1?key=${this.googleApiKey}&cx=${this.googleSearchEngineId}&q=${encodeURIComponent(query)}&num=10`;

            const response = await fetch(url);
            const data = await response.json();

            if (!data.items) {
                console.warn('⚠️ Google: No items found');
                return [];
            }

            const results = data.items.map((item: any) => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet,
                source: 'google' as const,
            }));

            console.log(`✅ Google found ${results.length} results`);
            return results;
        } catch (error) {
            console.warn('⚠️ Google Search failed:', error);
            return [];
        }
    }

    /**
     * SearXNG - Moteur open-source GRATUIT sans API key
     * Utilise une instance publique
     */
    private async searchWithSearXNG(query: string): Promise<SearchResult[]> {
        try {
            // Instances publiques SearXNG (choisir une stable)
            const instances = [
                'https://search.sapti.me',
                'https://searx.be',
                'https://searx.ninja',
                'https://search.bus-hit.me',
            ];

            // Essayer la première instance disponible
            for (const instance of instances) {
                try {
                    const url = `${instance}/search?q=${encodeURIComponent(query)}&format=json&language=en&pageno=1`;

                    const response = await fetch(url, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
                        },
                        signal: AbortSignal.timeout(5000), // 5s timeout
                    });

                    if (!response.ok) continue;

                    const data = await response.json();

                    if (!data.results || data.results.length === 0) continue;

                    const results = data.results
                        .filter((item: any) => item.url && item.title)
                        .slice(0, 10)
                        .map((item: any) => ({
                            title: item.title,
                            link: item.url,
                            snippet: item.content || '',
                            source: 'searxng' as const,
                        }));

                    console.log(`✅ SearXNG (${instance}) found ${results.length} results`);
                    return results;
                } catch (error) {
                    // Try next instance
                    continue;
                }
            }

            console.warn('⚠️ All SearXNG instances failed');
            return [];
        } catch (error) {
            console.warn('⚠️ SearXNG Search failed:', error);
            return [];
        }
    }

    /**
     * DuckDuckGo HTML Search (scraping simple)
     */
    private async searchWithDuckDuckGo(query: string): Promise<SearchResult[]> {
        try {
            const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

            console.log('🦆 DuckDuckGo search:', query);

            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
                },
            });

            if (!response.ok) {
                console.warn('⚠️ DuckDuckGo returned:', response.status);
                return [];
            }

            const html = await response.text();

            // Simple parsing (for MVP, just extract first few results)
            const results: SearchResult[] = [];
            const regex = /class="result__title"[^>]*>.*?href="([^"]+)"[^>]*>(.*?)<\/a>/g;
            let match;

            while ((match = regex.exec(html)) !== null && results.length < 5) {
                results.push({
                    title: this.cleanHtml(match[2]),
                    link: this.cleanDuckDuckGoUrl(match[1]),
                    snippet: '',
                    source: 'duckduckgo',
                });
            }

            console.log(`✅ DuckDuckGo found ${results.length} results`);
            return results;
        } catch (error) {
            console.warn('⚠️ DuckDuckGo Search failed:', error);
            return [];
        }
    }

    /**
     * Scrape top search results for deeper content analysis
     */
    private async scrapeTopResults(results: SearchResult[]): Promise<string> {
        console.log('📄 Scraping top', results.length, 'pages for deeper analysis...');

        let scrapedText = '';

        for (const result of results) {
            try {
                // Skip social media pages (already extracted links)
                if (result.link.includes('linkedin.com') ||
                    result.link.includes('twitter.com') ||
                    result.link.includes('x.com') ||
                    result.link.includes('facebook.com')) {
                    continue;
                }

                const response = await fetch(result.link, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
                    },
                    signal: AbortSignal.timeout(5000), // 5s timeout
                });

                if (response.ok) {
                    const html = await response.text();
                    const textContent = this.extractTextFromHtml(html);
                    scrapedText += `\n\n=== ${result.title} ===\n${textContent.slice(0, 2000)}`;
                    console.log('✅ Scraped:', result.link);
                }
            } catch (error) {
                console.warn('⚠️ Failed to scrape:', result.link, error instanceof Error ? error.message : '');
            }
        }

        return scrapedText;
    }

    /**
     * Extract clean text from HTML
     */
    private extractTextFromHtml(html: string): string {
        // Remove scripts, styles, and meta tags
        let text = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<meta[^>]*>/gi, '')
            .replace(/<[^>]+>/g, ' ') // Remove all HTML tags
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();

        return text.slice(0, 5000); // Limit to 5000 chars per page
    }

    /**
     * Extrait les liens sociaux des résultats
     */
    private extractSocialLinks(results: SearchResult[]): PersonWebProfile['socialLinks'] {
        const links: PersonWebProfile['socialLinks'] = {};

        for (const result of results) {
            if (result.link.includes('linkedin.com/in/') && !links.linkedin) {
                links.linkedin = result.link;
            }
            if (result.link.includes('github.com/') && !links.github) {
                links.github = result.link;
            }
            if ((result.link.includes('twitter.com/') || result.link.includes('x.com/')) && !links.twitter) {
                links.twitter = result.link;
            }
        }

        return links;
    }

    /**
     * Extrait les mentions (articles, interviews)
     */
    private extractMentions(results: SearchResult[]): string[] {
        return results
            .filter(r =>
                r.snippet.toLowerCase().includes('interview') ||
                r.snippet.toLowerCase().includes('article') ||
                r.snippet.toLowerCase().includes('conference') ||
                r.snippet.toLowerCase().includes('speaker')
            )
            .map(r => `${r.title} - ${r.link}`)
            .slice(0, 5);
    }

    /**
     * Extrait données enrichies (keywords, technologies, etc.)
     */
    private extractEnrichedData(results: SearchResult[], scrapedContent?: string): PersonWebProfile['enrichedData'] {
        const allText = (results.map(r => `${r.title} ${r.snippet}`).join(' ') + ' ' + (scrapedContent || '')).toLowerCase();

        // TOUS DOMAINES - Compétences tech
        const techKeywords = [
            'javascript', 'typescript', 'python', 'java', 'c++', 'rust', 'go', 'php', 'ruby', 'swift', 'kotlin',
            'react', 'vue', 'angular', 'node', 'django', 'flask', 'spring', 'laravel', 'rails',
            'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'jenkins', 'gitlab', 'github actions',
            'machine learning', 'ai', 'artificial intelligence', 'deep learning', 'tensorflow', 'pytorch',
            'sql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
            'nextjs', 'next.js', 'nuxt', 'svelte', 'tailwind',
        ];

        // Compétences créatives
        const creativeKeywords = [
            'photoshop', 'illustrator', 'figma', 'sketch', 'adobe', 'design', 'ui/ux', 'graphic design',
            'video editing', 'after effects', 'premiere', 'final cut', 'blender', '3d modeling',
            'animation', 'photography', 'videography',
        ];

        // Compétences business/management
        const businessKeywords = [
            'project management', 'agile', 'scrum', 'kanban', 'leadership', 'management',
            'marketing', 'seo', 'content creation', 'copywriting', 'sales', 'negotiation',
            'finance', 'accounting', 'budgeting', 'analytics', 'data analysis',
            'excel', 'powerpoint', 'business intelligence',
        ];

        // Compétences académiques/recherche
        const academicKeywords = [
            'research', 'publications', 'academic writing', 'teaching', 'curriculum',
            'statistics', 'matlab', 'r programming', 'spss', 'latex',
        ];

        // Langues
        const languageKeywords = [
            'english', 'french', 'spanish', 'german', 'chinese', 'arabic', 'japanese',
            'bilingual', 'multilingual', 'translation', 'interpretation',
        ];

        // Combiner toutes les compétences
        const allKeywords = [
            ...techKeywords,
            ...creativeKeywords,
            ...businessKeywords,
            ...academicKeywords,
            ...languageKeywords,
        ];

        const technologies = allKeywords.filter(skill => allText.includes(skill));

        // Extract companies mentioned (tous domaines)
        const companyPatterns = [
            /(?:worked? at|employed at|engineer at|developer at|designer at|consultant at|manager at|director at|at)\s+([A-Z][a-zA-Z\s&]+?)(?:\s|,|\.)/gi,
        ];

        const companies: string[] = [];
        for (const pattern of companyPatterns) {
            let match;
            while ((match = pattern.exec(allText)) !== null && companies.length < 5) {
                const company = match[1].trim();
                if (company.length > 2 && company.length < 30) {
                    companies.push(company);
                }
            }
        }

        return {
            keywords: [],
            companies: [...new Set(companies)], // Remove duplicates
            technologies: [...new Set(technologies)], // Remove duplicates
            achievements: [],
        };
    }

    private cleanHtml(html: string): string {
        return html.replace(/<[^>]*>/g, '').trim();
    }

    private cleanDuckDuckGoUrl(url: string): string {
        // DuckDuckGo wraps URLs, extract real URL
        const match = url.match(/uddg=([^&]+)/);
        if (match) {
            return decodeURIComponent(match[1]);
        }
        return url;
    }
}
