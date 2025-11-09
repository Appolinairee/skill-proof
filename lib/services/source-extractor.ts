import { ExtractedSources } from '../extractors/types';
import { parseCv } from '../extractors/cv-parser';
import { fetchGitHubData } from '../extractors/github-fetcher';
import { parseLinkedIn } from '../extractors/linkedin-parser';
import { ExtractionInput } from './extraction-validator';

export class SourceExtractor {
  async extract(input: ExtractionInput): Promise<ExtractedSources> {
    const sources: ExtractedSources = { name: input.name };

    const tasks = this.buildExtractionTasks(input, sources);
    await Promise.all(tasks);

    return sources;
  }

  private buildExtractionTasks(
    input: ExtractionInput, 
    sources: ExtractedSources
  ): Promise<void>[] {
    const tasks: Promise<void>[] = [];

    if (input.cvFile) {
      tasks.push(this.extractCv(input.cvFile, sources));
    }

    if (input.githubUrl) {
      tasks.push(this.extractGithub(input.githubUrl, sources));
    }

    if (input.linkedinText) {
      tasks.push(this.extractLinkedIn(input.linkedinText, sources));
    }

    return tasks;
  }

  private async extractCv(file: File, sources: ExtractedSources): Promise<void> {
    try {
      sources.cv = await parseCv(file);
    } catch (error) {
      throw new Error(`Erreur CV: ${this.getErrorMessage(error)}`);
    }
  }

  private async extractGithub(url: string, sources: ExtractedSources): Promise<void> {
    try {
      sources.github = await fetchGitHubData(url);
    } catch (error) {
      throw new Error(`Erreur GitHub: ${this.getErrorMessage(error)}`);
    }
  }

  private async extractLinkedIn(text: string, sources: ExtractedSources): Promise<void> {
    sources.linkedin = parseLinkedIn(text);
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Erreur inconnue';
  }
}
