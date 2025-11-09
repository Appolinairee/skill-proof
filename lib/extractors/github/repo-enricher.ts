import { GitHubRepo } from '../types';
import { GithubClient } from './client';

export class RepoEnricher {
  constructor(private client: GithubClient, private username: string) {}

  async enrichRepo(repo: any): Promise<GitHubRepo> {
    const [languages, readme] = await Promise.all([
      this.client.fetchRepoLanguages(this.username, repo.name),
      this.client.fetchRepoReadme(this.username, repo.name),
    ]);

    return {
      name: repo.name,
      description: repo.description,
      language: repo.language,
      languages,
      stars: repo.stargazers_count || 0,
      topics: repo.topics || [],
      url: repo.html_url,
      readme,
    };
  }

  async enrichMultiple(repos: any[]): Promise<GitHubRepo[]> {
    return Promise.all(repos.map(repo => this.enrichRepo(repo)));
  }
}
