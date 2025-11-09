import { GoogleGenerativeAI } from '@google/generative-ai';

export interface Skill {
    name: string;
    category: 'language' | 'framework' | 'tool' | 'soft-skill' | 'other';
    confidence: number;
    sources: ('cv' | 'github' | 'linkedin')[];
    evidence?: string[];
}

export interface GeminiAnalysisResult {
    skills: Skill[];
    summary: string;
}

export async function analyzeWithGemini(
    cvText?: string,
    githubData?: any,
    linkedinData?: any,
    webProfile?: any
): Promise<GeminiAnalysisResult> {
    // 🔍 LOG 1: Données brutes reçues
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📥 DONNÉES BRUTES REÇUES:');
    console.log('CV Text:', cvText ? `${cvText.substring(0, 200)}...` : 'none');
    console.log('GitHub Data:', JSON.stringify(githubData, null, 2));
    console.log('LinkedIn Data:', linkedinData ? JSON.stringify(linkedinData, null, 2) : 'none');
    console.log('Web Profile:', webProfile ? `${webProfile.searchResults?.length || 0} résultats` : 'none');
    console.log('LinkedIn Screenshots:', linkedinData?.screenshots ? `${linkedinData.screenshots.length} image(s)` : 'none');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 🚨 VALIDATION: Au moins une source doit être présente
    const hasCV = cvText && cvText.length > 50;
    const hasGitHub = githubData && githubData.repos?.length > 0;
    const hasLinkedIn = linkedinData && Object.keys(linkedinData.parsedSections || {}).length > 0;
    const hasWebResults = webProfile && webProfile.searchResults?.length > 0;

    // Si aucune source exploitable, essayer quand même avec le nom si présent
    if (!hasCV && !hasGitHub && !hasLinkedIn && !hasWebResults) {
        console.warn('⚠️ AUCUNE DONNÉE STRUCTURÉE - Tentative analyse avec nom uniquement');
        
        // Si on a au moins un nom ou des données web minimales, on laisse Gemini essayer
        const hasMinimalData = webProfile?.name || cvText || linkedinData;
        
        if (!hasMinimalData) {
            return {
                skills: [],
                summary: "Aucune donnée trouvée pour analyser ce profil. La recherche web n'a pas retourné de résultats exploitables.",
            };
        }

        // Si on a juste un nom sans résultats web, retourner un message explicatif
        if (webProfile?.name && (!webProfile.searchResults || webProfile.searchResults.length === 0)) {
            return {
                skills: [],
                summary: `Recherche effectuée pour "${webProfile.name}" mais aucun résultat pertinent trouvé. Pour une analyse complète, veuillez fournir:\n- Un profil GitHub\n- Un CV (PDF/DOCX)\n- Ou un profil LinkedIn\n\nNote: La recherche web nécessite une clé API Google Custom Search pour fonctionner pleinement.`,
            };
        }
    }

    console.log('✅ Sources disponibles:', {
        cv: hasCV,
        github: hasGitHub,
        linkedin: hasLinkedIn,
        web: hasWebResults,
        webProfile: !!webProfile,
    });

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_CLOUD_API_KEY;

    // Fallback mode if no API key
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        console.warn('⚠️ GOOGLE_API_KEY non configurée, utilisation du mode fallback');
        const fallbackResult = generateFallbackAnalysis(githubData);
        console.log('📤 RÉSULTAT FALLBACK:', JSON.stringify(fallbackResult, null, 2));
        return fallbackResult;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // If we have LinkedIn screenshots, use Vision API
    if (linkedinData?.screenshots && linkedinData.screenshots.length > 0) {
        return analyzeWithScreenshots(model, cvText, githubData, linkedinData, webProfile);
    }

    const prompt = buildAnalysisPrompt(cvText, githubData, linkedinData, webProfile);
    
    // 🔍 LOG 2: Prompt envoyé à Gemini
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📤 PROMPT ENVOYÉ À GEMINI:');
    console.log(prompt.substring(0, 500) + '...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 🔍 LOG 3: Réponse brute de Gemini
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 RÉPONSE BRUTE DE GEMINI:');
        console.log(text);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Parse JSON response from Gemini
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Gemini n\'a pas retourné de JSON valide');
        }

        const parsed = JSON.parse(jsonMatch[0]);
        
        // 🔍 LOG 4: Résultat final parsé
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ RÉSULTAT FINAL PARSÉ:');
        console.log(JSON.stringify(parsed, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        return {
            skills: parsed.skills || [],
            summary: parsed.summary || 'Aucune analyse disponible',
        };
    } catch (error) {
        console.error('❌ Gemini analysis error:', error);
        throw new Error(`Erreur Gemini: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
}

function generateFallbackAnalysis(githubData?: any): GeminiAnalysisResult {
    const skills: Skill[] = [];

    // Extract languages from GitHub
    if (githubData?.topLanguages) {
        Object.entries(githubData.topLanguages)
            .sort(([, a]: any, [, b]: any) => b - a)
            .slice(0, 10)
            .forEach(([lang, bytes]: any) => {
                skills.push({
                    name: lang,
                    category: getCategoryForLanguage(lang),
                    confidence: Math.min(95, 60 + Math.floor((bytes / 10000))),
                    sources: ['github'],
                    evidence: [`${githubData.repos?.filter((r: any) => r.language === lang).length || 0} repositories`],
                });
            });
    }

    return {
        skills,
        summary: `Développeur avec ${skills.length} compétences détectées. ${githubData?.totalStars || 0} étoiles GitHub sur ${githubData?.repos?.length || 0} repositories publics.`,
    };
}

function getCategoryForLanguage(lang: string): Skill['category'] {
    const frameworks = ['React', 'Vue', 'Angular', 'Next.js', 'Svelte', 'Django', 'Flask', 'Express'];
    const tools = ['Docker', 'Kubernetes', 'Git', 'Webpack', 'Babel', 'ESLint'];

    if (frameworks.some(f => lang.toLowerCase().includes(f.toLowerCase()))) return 'framework';
    if (tools.some(t => lang.toLowerCase().includes(t.toLowerCase()))) return 'tool';
    return 'language';
}

async function analyzeWithScreenshots(
    model: any,
    cvText?: string,
    githubData?: any,
    linkedinData?: any,
    webProfile?: any
): Promise<GeminiAnalysisResult> {
    console.log('━━━━━━━━━━ GEMINI VISION MODE ━━━━━━━━━━');
    console.log('📸 Analyse de', linkedinData.screenshots.length, 'screenshot(s) LinkedIn');

    const imageParts = linkedinData.screenshots.map((buffer: Buffer) => ({
        inlineData: {
            data: buffer.toString('base64'),
            mimeType: 'image/png',
        },
    }));

    let textContext = '';
    if (cvText) textContext += `\n## CV:\n${cvText.slice(0, 2000)}`;
    if (githubData) {
        textContext += `\n## GitHub:\nUsername: ${githubData.username}\nStars: ${githubData.totalStars}\nLanguages: ${JSON.stringify(githubData.topLanguages)}`;
    }
    if (webProfile && webProfile.searchResults?.length > 0) {
        textContext += `\n## Web:\n${webProfile.searchResults.slice(0, 3).map((r: any) => r.title).join(', ')}`;
    }

    const prompt = `Analyse ce profil LinkedIn (screenshots) et les données complémentaires.

${textContext}

Les images montrent le profil LinkedIn complet. Extrais:
- Compétences techniques (langages, frameworks, outils)
- Expériences professionnelles
- Formation
- Certifications

Retourne UNIQUEMENT un JSON valide avec cette structure:
{
  "skills": [
    {
      "name": "nom de la compétence",
      "category": "language|framework|tool|soft-skill|other",
      "confidence": 0-100,
      "sources": ["linkedin"],
      "evidence": ["visible dans le profil"]
    }
  ],
  "summary": "Résumé du profil professionnel"
}`;

    try {
        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();

        console.log('📥 Réponse Gemini Vision:', text.substring(0, 500));

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Gemini Vision n\'a pas retourné de JSON valide');
        }

        const parsed = JSON.parse(jsonMatch[0]);
        
        console.log('✅ Analyse Vision terminée:', parsed.skills?.length || 0, 'compétences détectées');

        return {
            skills: parsed.skills || [],
            summary: parsed.summary || 'Aucune analyse disponible',
        };
    } catch (error) {
        console.error('❌ Erreur Gemini Vision:', error);
        throw error;
    }
}

function buildAnalysisPrompt(cvText?: string, githubData?: any, linkedinData?: any, webProfile?: any): string {
    const sources = [];
    let hasData = false;

    if (cvText) {
        sources.push(`## CV:\n${cvText.slice(0, 3000)}`);
        hasData = true;
    }

    if (githubData) {
        sources.push(`## GitHub Profile:
Username: ${githubData.username}
Total Stars: ${githubData.totalStars}
Top Languages: ${JSON.stringify(githubData.topLanguages, null, 2)}
Repositories (${githubData.repos?.length || 0}):
${githubData.repos?.slice(0, 5).map((r: any) => `- ${r.name}: ${r.description || 'No description'} (${r.language}, ${r.stars} stars)`).join('\n')}`);
        hasData = true;
    }

    if (linkedinData) {
        sources.push(`## LinkedIn:\n${JSON.stringify(linkedinData, null, 2).slice(0, 2000)}`);
        hasData = true;
    }

    if (webProfile) {
        const webData = [`## Web Search Results pour: ${webProfile.name}`];
        
        if (webProfile.searchResults?.length > 0) {
            webData.push(`Résultats de recherche (${webProfile.searchResults.length}):`);
            webData.push(webProfile.searchResults.slice(0, 5).map((r: any) => 
                `- ${r.title}\n  ${r.snippet}\n  URL: ${r.link}`
            ).join('\n\n'));
            hasData = true;
        }

        if (webProfile.socialLinks && Object.keys(webProfile.socialLinks).length > 0) {
            webData.push(`\nSocial Links: ${JSON.stringify(webProfile.socialLinks, null, 2)}`);
        }

        if (webProfile.enrichedData?.technologies?.length > 0) {
            webData.push(`\nTechnologies trouvées: ${webProfile.enrichedData.technologies.join(', ')}`);
        }

        if (webProfile.enrichedData?.companies?.length > 0) {
            webData.push(`\nEntreprises mentionnées: ${webProfile.enrichedData.companies.join(', ')}`);
        }

        if (webProfile.mentions?.length > 0) {
            webData.push(`\nMentions: ${webProfile.mentions.slice(0, 3).join(' | ')}`);
        }

        sources.push(webData.join('\n'));
    }

    // Si vraiment aucune donnée, indiquer que seul le nom est disponible
    if (!hasData && webProfile?.name) {
        sources.push(`## Nom de la personne: ${webProfile.name}\nAucune autre donnée disponible.`);
    }

    return `Tu es un expert RH généraliste. Analyse les données suivantes et extrais TOUTES les compétences professionnelles, quel que soit le domaine.

${sources.join('\n\n')}

⚠️ RÈGLES STRICTES - PAS D'INVENTION :
- N'extrais QUE les compétences explicitement mentionnées dans les données fournies
- Accepte TOUS les domaines : tech, design, business, langues, soft skills, créativité, recherche, etc.
- Si une compétence n'est pas clairement visible, NE L'AJOUTE PAS
- Ne fais AUCUNE supposition ou déduction
- Chaque compétence DOIT avoir une preuve précise tirée des données
- Si les données sont vides ou insuffisantes, retourne un tableau vide de skills

Catégories acceptées :
- "language" : langages de programmation ET langues étrangères
- "framework" : frameworks techniques
- "tool" : outils logiciels (Adobe, Office, etc.)
- "soft-skill" : communication, leadership, travail d'équipe, etc.
- "other" : toute autre compétence (design, marketing, finance, etc.)

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "skills": [
    {
      "name": "nom EXACT de la compétence vue dans les données",
      "category": "language|framework|tool|soft-skill|other",
      "confidence": 0-100,
      "sources": ["cv", "github", "linkedin", "web"],
      "evidence": ["citation EXACTE ou fait précis des données fournies"]
    }
  ],
  "summary": "Résumé factuel basé UNIQUEMENT sur les données fournies"
}

IMPORTANT: Si aucune compétence n'est trouvée, retourne {"skills": [], "summary": "Aucune compétence détectée dans les données disponibles."}`;
}

export async function analyzeCVWithGeminiVision(cvImages: Buffer[]): Promise<string> {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_CLOUD_API_KEY;

    if (!apiKey) {
        throw new Error('GOOGLE_API_KEY non configurée');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Vision support

    const imageParts = cvImages.map((buffer) => ({
        inlineData: {
            data: buffer.toString('base64'),
            mimeType: 'image/png',
        },
    }));

    const prompt = `Analyse ce CV et extrait toutes les informations importantes:
  - Compétences techniques (langages, frameworks, outils)
  - Expériences professionnelles
  - Formation
  - Projets
  
  Retourne les données structurées en JSON.`;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;

    return response.text();
}
