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
    throw new Error(`Erreur lors du fetch GitHub: ${extractError(error)}`);
  }
}

async function buildGithubProfile(username: string): Promise<GitHubData> {
  const client = new GithubClient();
  const enricher = new RepoEnricher(client, username);

  const repos = await client.fetchUserRepos(username, GITHUB_CONFIG.MAX_REPOS);
  const topRepos = getTopRepos(repos);
  const enrichedRepos = await enricher.enrichMultiple(topRepos);

  return {
    username,
    profileUrl: `https://github.com/${username}`,
    repos: enrichedRepos,
    totalStars: calculateTotalStars(enrichedRepos),
    topLanguages: aggregateLanguages(enrichedRepos),
  };
}

function getTopRepos(repos: any[]): any[] {
  return sortReposByStars(repos).slice(0, GITHUB_CONFIG.TOP_REPOS_COUNT);
}
