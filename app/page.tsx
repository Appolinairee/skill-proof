'use client';

import { FormEvent, useState } from 'react';
import { useExtractionForm } from '@/hooks/useExtractionForm';
import { ExtractionInput } from '@/components/extraction/ExtractionInput';
import { ExtractionApiClient } from '@/lib/api/extraction-client';
import { ExtractionResponse } from '@/lib/api/extraction-client';
import { SkillCard, Skill } from '@/components/results/SkillCard';
import { GitHubReposList } from '@/components/results/GitHubReposList';
import { ProfileSummary } from '@/components/results/ProfileSummary';
import { SkillsStats } from '@/components/results/SkillsStats';

export default function HomePage() {
  const form = useExtractionForm();
  const [response, setResponse] = useState<ExtractionResponse | null>(null);
  const apiClient = new ExtractionApiClient();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.state.isValid) return;

    form.setSubmitting(true);

    try {
      const result = await apiClient.extract(form.state.data);
      setResponse(result);
    } finally {
      form.setSubmitting(false);
    }
  };

  const handleInputChange = (value: string) => {
    // Détection intelligente du type d'input
    
    // GitHub URL ou username
    if (value.includes('github.com') || value.includes('github.io')) {
      form.setGithubUrl(value);
      form.setName('');
      form.setLinkedinText('');
    } 
    // LinkedIn URL
    else if (value.includes('linkedin.com') || value.includes('linkedin.')) {
      form.setLinkedinText(value);
      form.setName('');
      form.setGithubUrl('');
    } 
    // Username GitHub simple (pas d'espace, court, alphanum avec tirets)
    else if (value.length > 0 && !value.includes(' ') && value.length < 40 && /^[a-zA-Z0-9_-]+$/.test(value)) {
      form.setGithubUrl(value);
      form.setName('');
      form.setLinkedinText('');
    } 
    // Nom complet (contient espace ou caractères spéciaux)
    else {
      form.setName(value);
      form.setGithubUrl('');
      form.setLinkedinText('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-8">
          <Header />

          <form onSubmit={handleSubmit} className="space-y-6">
            <ExtractionInput
              value={form.state.data.name || form.state.data.githubUrl || form.state.data.linkedinText}
              onChange={handleInputChange}
              onFileSelect={form.setCvFile}
              selectedFile={form.state.data.cvFile}
              disabled={form.state.isSubmitting}
              canSubmit={form.state.isValid}
            />

            {form.state.errors.general && (
              <ErrorMessage message={form.state.errors.general} />
            )}
          </form>

          {form.state.isSubmitting && <LoadingState />}
          {response && <ResultsPreview response={response} />}
        </div>
      </main>
    </div>
  );
}

function Header() {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-4xl font-semibold text-gray-900">
        Analysez votre profil professionnel
      </h1>
      <p className="text-gray-600">
        Entrez votre nom, uploadez votre CV, ou partagez votre profil GitHub/LinkedIn
      </p>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-sm text-red-800">{message}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      <p className="text-gray-600">Analyse en cours...</p>
    </div>
  );
}

function ResultsPreview({ response }: { response: ExtractionResponse }) {
  if (!response.success) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-semibold text-red-900 mb-2">Erreur</h3>
        <p className="text-red-700">{response.error}</p>
        {response.details && (
          <p className="text-sm text-red-600 mt-2">{response.details}</p>
        )}
      </div>
    );
  }

  const { sources, analysis } = response.data || {};
  const webProfile = (response.data as any)?.webProfile;
  const stats = (response.data as any)?.stats;
  const skills: Skill[] = analysis?.skills || [];
  const summary = analysis?.summary || 'Aucune analyse disponible';
  const name = sources?.name || 'Profil';

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      <ProfileSummary 
        name={name}
        summary={summary}
        totalSkills={skills.length}
      />

      {/* Statistics */}
      {stats && skills.length > 0 && (
        <SkillsStats stats={stats} />
      )}

      {/* Skills Grid */}
      {skills.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Compétences détectées ({skills.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill, idx) => (
              <SkillCard key={`${skill.name}-${idx}`} skill={skill} />
            ))}
          </div>
        </div>
      )}

      {/* No skills message */}
      {skills.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-lg">
            Aucune compétence détectée. Essayez d'ajouter un profil GitHub ou un CV.
          </p>
        </div>
      )}

      {/* GitHub Repos */}
      {sources?.github?.repos && sources.github.repos.length > 0 && (
        <GitHubReposList 
          repos={sources.github.repos}
          username={sources.github.username}
          totalStars={sources.github.totalStars}
        />
      )}

      {/* Web Profile Results (optional display) */}
      {webProfile && webProfile.searchResults?.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">🌐 Présence Web</h2>
          <p className="text-sm text-gray-600 mb-4">
            {webProfile.searchResults.length} résultat(s) trouvé(s) en ligne
          </p>
          {webProfile.socialLinks && Object.keys(webProfile.socialLinks).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(webProfile.socialLinks).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 text-sm"
                >
                  {platform}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Debug toggle (optional) */}
      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <summary className="cursor-pointer text-sm font-medium text-gray-700">
          🔍 Voir les données brutes (debug)
        </summary>
        <pre className="text-xs text-gray-600 overflow-auto max-h-96 mt-3 p-3 bg-white rounded border border-gray-200">
          {JSON.stringify(response.data, null, 2)}
        </pre>
      </details>
    </div>
  );
}
