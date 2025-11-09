import { Octokit } from '@octokit/rest';

export class GithubClient {
  private octokit: Octokit;

  constructor(token?: string) {
    this.octokit = new Octokit({ auth: token });
  }

  async fetchUserRepos(username: string, limit: number) {
    const { data } = await this.octokit.repos.listForUser({
      username,
      per_page: limit,
      sort: 'updated',
    });

    return data.filter(repo => !repo.private);
  }

  async fetchRepoLanguages(username: string, repoName: string) {
    try {
      const { data } = await this.octokit.repos.listLanguages({
        owner: username,
        repo: repoName,
      });
      return data;
    } catch {
      return {};
    }
  }

  async fetchRepoReadme(username: string, repoName: string): Promise<string | undefined> {
    try {
      const { data } = await this.octokit.repos.getReadme({
        owner: username,
        repo: repoName,
      });
      return Buffer.from(data.content, 'base64').toString('utf-8');
    } catch {
      return undefined;
    }
  }
}
