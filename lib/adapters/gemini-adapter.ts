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
    linkedinData?: any
): Promise<GeminiAnalysisResult> {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_CLOUD_API_KEY;

    // Fallback mode if no API key
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        console.warn('⚠️ GOOGLE_API_KEY non configurée, utilisation du mode fallback');
        return generateFallbackAnalysis(githubData);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = buildAnalysisPrompt(cvText, githubData, linkedinData);

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON response from Gemini
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Gemini n\'a pas retourné de JSON valide');
        }

        const parsed = JSON.parse(jsonMatch[0]);
        return {
            skills: parsed.skills || [],
            summary: parsed.summary || 'Aucune analyse disponible',
        };
    } catch (error) {
        console.error('Gemini analysis error:', error);
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

function buildAnalysisPrompt(cvText?: string, githubData?: any, linkedinData?: any): string {
    const sources = [];

    if (cvText) {
        sources.push(`## CV:\n${cvText.slice(0, 3000)}`);
    }

    if (githubData) {
        sources.push(`## GitHub Profile:
Username: ${githubData.username}
Total Stars: ${githubData.totalStars}
Top Languages: ${JSON.stringify(githubData.topLanguages, null, 2)}
Repositories (${githubData.repos?.length || 0}):
${githubData.repos?.slice(0, 5).map((r: any) => `- ${r.name}: ${r.description || 'No description'} (${r.language}, ${r.stars} stars)`).join('\n')}`);
    }

    if (linkedinData) {
        sources.push(`## LinkedIn:\n${JSON.stringify(linkedinData, null, 2).slice(0, 2000)}`);
    }

    return `Tu es un expert RH et recruteur tech. Analyse les données suivantes et extrais les compétences professionnelles.

${sources.join('\n\n')}

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "skills": [
    {
      "name": "nom de la compétence",
      "category": "language|framework|tool|soft-skill|other",
      "confidence": 0-100,
      "sources": ["cv", "github", "linkedin"],
      "evidence": ["preuve 1", "preuve 2"]
    }
  ],
  "summary": "Résumé du profil en 1-2 phrases"
}

Règles:
- Extrais TOUTES les compétences techniques détectées
- Pour GitHub, utilise les langages et technologies des repos
- confidence basé sur la fréquence/importance
- evidence doit être factuel et précis
- NE RETOURNE QUE LE JSON, rien d'autre`;
}

export async function analyzeCVWithGeminiVision(cvImages: Buffer[]): Promise<string> {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_CLOUD_API_KEY;

    if (!apiKey) {
        throw new Error('GOOGLE_API_KEY non configurée');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
