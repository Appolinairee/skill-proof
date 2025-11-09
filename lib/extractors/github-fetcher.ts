import { GitHubData } from './types';
import { GITHUB_CONFIG } from './constants';
import { extractGithubUsername } from '../utils/github-helpers';
import { extractError } from '../utils/text-helpers';
import { GithubClient } from './github/client';
import { RepoEnricher } from './github/repo-enricher';
import { sortReposByStars, calculateTotalStars, aggregateLanguages } from './github/repo-aggregator';

export async function fetchGitHubData(githubUrl: string): Promise<GitHubData> {
  const username = extractGithubUsername(githubUrl);
  
  if (!username) {
    throw new Error('URL GitHub invalide');
  }

  try {
    return await buildGithubProfile(username);
  } catch (error) {
    const errorMsg = extractError(error);
    
    // Better error message for rate limit
    if (errorMsg.includes('rate limit')) {
      throw new Error(
        'Limite de requêtes GitHub atteinte. Ajoutez un GITHUB_TOKEN dans .env.local : ' +
        'https://github.com/settings/tokens/new (aucune permission requise)'
      );
    }
    
    throw new Error(`Erreur lors du fetch GitHub: ${errorMsg}`);
  }
}

async function buildGithubProfile(username: string): Promise<GitHubData> {
  const client = new GithubClient();
  
  const repos = await client.fetchUserRepos(username, GITHUB_CONFIG.MAX_REPOS);
  
  if (repos.length === 0) {
    throw new Error(`Utilisateur GitHub "${username}" introuvable ou aucun repo public`);
  }

  // Use the actual username from the first repo owner (canonical form)
  const canonicalUsername = repos[0].owner.login;
  const enricher = new RepoEnricher(client, canonicalUsername);

  const topRepos = getTopRepos(repos);
  const enrichedRepos = await enricher.enrichMultiple(topRepos);

  return {
    username: canonicalUsername,
    profileUrl: `https://github.com/${canonicalUsername}`,
    repos: enrichedRepos,
    totalStars: calculateTotalStars(enrichedRepos),
    topLanguages: aggregateLanguages(enrichedRepos),
  };
}

function getTopRepos(repos: any[]): any[] {
  return sortReposByStars(repos).slice(0, GITHUB_CONFIG.TOP_REPOS_COUNT);
}
