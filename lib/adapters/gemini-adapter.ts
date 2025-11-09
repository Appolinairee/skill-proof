/**
 * Adapter pour Gemini AI
 * Version mock pour le développement
 */

export interface Skill {
  name: string;
  category: 'language' | 'framework' | 'tool' | 'soft-skill' | 'other';
  confidence: number; // 0-100
  sources: ('cv' | 'github' | 'linkedin')[];
  evidence?: string[];
}

export interface GeminiAnalysisResult {
  skills: Skill[];
  summary: string;
}

/**
 * Mock adapter qui retourne des skills exemple
 * TODO: Remplacer par vraie intégration Gemini
 */
export async function analyzeWithGemini(
  cvText?: string,
  githubData?: any,
  linkedinData?: any
): Promise<GeminiAnalysisResult> {
  // Simuler un délai d'API
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock data basé sur les inputs
  const mockSkills: Skill[] = [
    {
      name: 'TypeScript',
      category: 'language',
      confidence: 85,
      sources: ['cv', 'github'],
      evidence: ['Mentionné dans CV', '3 repos TypeScript sur GitHub'],
    },
    {
      name: 'React',
      category: 'framework',
      confidence: 90,
      sources: ['cv', 'github'],
      evidence: ['Projet principal en React', '5 repos avec React'],
    },
    {
      name: 'Node.js',
      category: 'framework',
      confidence: 75,
      sources: ['github'],
      evidence: ['2 repos backend Node.js'],
    },
    {
      name: 'Docker',
      category: 'tool',
      confidence: 60,
      sources: ['cv'],
      evidence: ['Mentionné dans compétences'],
    },
    {
      name: 'Communication',
      category: 'soft-skill',
      confidence: 70,
      sources: ['linkedin'],
      evidence: ['Expérience en équipe'],
    },
  ];

  // Si GitHub data existe, ajouter les langages détectés
  if (githubData?.topLanguages) {
    Object.keys(githubData.topLanguages).slice(0, 3).forEach((lang) => {
      if (!mockSkills.find((s) => s.name === lang)) {
        mockSkills.push({
          name: lang,
          category: 'language',
          confidence: 80,
          sources: ['github'],
          evidence: [`Détecté dans repos GitHub`],
        });
      }
    });
  }

  return {
    skills: mockSkills,
    summary: 'Profil technique solide avec expertise en développement web moderne (React, TypeScript). Expérience backend avec Node.js et familiarité avec les outils DevOps.',
  };
}

/**
 * Version réelle avec Gemini API (à implémenter)
 */
export async function analyzeWithGeminiReal(
  cvText?: string,
  githubData?: any,
  linkedinData?: any
): Promise<GeminiAnalysisResult> {
  // TODO: Implémenter avec @google/generative-ai
  
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_CLOUD_API_KEY non configurée');
  }

  // const { GoogleGenerativeAI } = require('@google/generative-ai');
  // const genAI = new GoogleGenerativeAI(apiKey);
  // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  // const prompt = `Analyse ce profil et extrait les compétences...`;
  // const result = await model.generateContent(prompt);

  throw new Error('Gemini réel non implémenté - utiliser version mock');
}
