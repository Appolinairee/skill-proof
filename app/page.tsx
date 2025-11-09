'use client';

import { FormEvent, useState } from 'react';
import { useExtractionForm } from '@/hooks/useExtractionForm';
import { ExtractionInput } from '@/components/extraction/ExtractionInput';
import { ExtractionApiClient } from '@/lib/api/extraction-client';
import { ExtractionResponse } from '@/lib/api/extraction-client';

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
    if (value.includes('github.com') || value.match(/^[a-zA-Z0-9-]+$/)) {
      form.setGithubUrl(value);
    } else {
      form.setLinkedinText(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-8">
          <Header />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <NameInput 
              value={form.state.data.name}
              onChange={form.setName}
              error={form.state.errors.name}
              disabled={form.state.isSubmitting}
            />

            <ExtractionInput
              value={form.state.data.githubUrl || form.state.data.linkedinText}
              onChange={handleInputChange}
              onFileSelect={form.setCvFile}
              selectedFile={form.state.data.cvFile}
              disabled={form.state.isSubmitting}
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
        Uploadez votre CV, partagez votre GitHub ou LinkedIn pour une analyse complète
      </p>
    </div>
  );
}

function NameInput({ 
  value, 
  onChange, 
  error, 
  disabled 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  error?: string;
  disabled: boolean;
}) {
  return (
    <div className="max-w-md mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Votre nom complet"
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-white focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
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

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg">
      <h3 className="font-semibold text-gray-900 mb-4">Résultats de l'analyse</h3>
      <pre className="text-sm text-gray-700 overflow-auto max-h-96">
        {JSON.stringify(response.data, null, 2)}
      </pre>
    </div>
  );
}