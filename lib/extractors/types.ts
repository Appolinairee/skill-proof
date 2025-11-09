// Types pour les données extraites des différentes sources

export interface CVData {
  rawText: string;
  images?: Buffer[];
  sections?: {
    experience?: string;
    education?: string;
    skills?: string;
  };
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  languages: Record<string, number>; // { "TypeScript": 12345, "JavaScript": 6789 }
  stars: number;
  topics: string[];
  readme?: string;
  url: string;
}

export interface GitHubData {
  username: string;
  profileUrl: string;
  repos: GitHubRepo[];
  totalStars: number;
  topLanguages: Record<string, number>;
}

export interface LinkedInData {
  rawText: string;
  url?: string; // LinkedIn profile URL if fetched
  parsedSections?: {
    experience?: string;
    education?: string;
    skills?: string[];
  };
}

export interface ExtractedSources {
  cv?: CVData;
  github?: GitHubData;
  linkedin?: LinkedInData;
  name: string;
}

export interface ExtractionResult {
  success: boolean;
  data?: ExtractedSources;
  error?: string;
}
