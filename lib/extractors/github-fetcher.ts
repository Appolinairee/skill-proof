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
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 EXTRACTION GITHUB POUR:', username);
  
  const client = new GithubClient();
  
  const repos = await client.fetchUserRepos(username, GITHUB_CONFIG.MAX_REPOS);
  console.log(`📦 ${repos.length} repos récupérés`);
  
  if (repos.length === 0) {
    throw new Error(`Utilisateur GitHub "${username}" introuvable ou aucun repo public`);
  }

  // Use the actual username from the first repo owner (canonical form)
  const canonicalUsername = repos[0].owner.login;
  console.log(`✓ Username canonique: ${canonicalUsername}`);
  
  const enricher = new RepoEnricher(client, canonicalUsername);

  const topRepos = getTopRepos(repos);
  console.log(`⭐ Top ${topRepos.length} repos sélectionnés`);
  
  const enrichedRepos = await enricher.enrichMultiple(topRepos);

  const githubData: GitHubData = {
    username: canonicalUsername,
    profileUrl: `https://github.com/${canonicalUsername}`,
    repos: enrichedRepos,
    totalStars: calculateTotalStars(enrichedRepos),
    topLanguages: aggregateLanguages(enrichedRepos),
  };

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ DONNÉES GITHUB EXTRAITES:');
  console.log(`   Username: ${githubData.username}`);
  console.log(`   Total Stars: ${githubData.totalStars}`);
  console.log(`   Repos: ${githubData.repos.length}`);
  console.log(`   Top Languages:`, Object.keys(githubData.topLanguages).slice(0, 5));
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  return githubData;
}

function getTopRepos(repos: any[]): any[] {
  return sortReposByStars(repos).slice(0, GITHUB_CONFIG.TOP_REPOS_COUNT);
}
