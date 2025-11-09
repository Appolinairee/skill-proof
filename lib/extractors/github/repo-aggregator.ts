import { GitHubRepo } from '../types';

export function sortReposByStars(repos: any[]): any[] {
  return [...repos].sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
}

export function calculateTotalStars(repos: GitHubRepo[]): number {
  return repos.reduce((sum, repo) => sum + repo.stars, 0);
}

export function aggregateLanguages(repos: GitHubRepo[]): Record<string, number> {
  const languages: Record<string, number> = {};

  for (const repo of repos) {
    for (const [lang, bytes] of Object.entries(repo.languages)) {
      languages[lang] = (languages[lang] || 0) + bytes;
    }
  }

  return languages;
}
