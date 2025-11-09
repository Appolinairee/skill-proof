import React from 'react';

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  topics?: string[];
}

interface GitHubReposListProps {
  repos: GitHubRepo[];
  username: string;
  totalStars: number;
}

export function GitHubReposList({ repos, username, totalStars }: GitHubReposListProps) {
  if (!repos || repos.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🐙</span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Repositories GitHub</h2>
            <p className="text-sm text-gray-600">
              @{username} • {repos.length} repo(s) • {totalStars.toLocaleString()} ⭐
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {repos.slice(0, 10).map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                  {repo.name}
                </h3>
                {repo.description && (
                  <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                )}
                
                <div className="flex items-center gap-3 mt-2">
                  {repo.language && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {repo.language}
                    </span>
                  )}
                  {repo.stars > 0 && (
                    <span className="text-xs text-gray-600 flex items-center gap-1">
                      ⭐ {repo.stars}
                    </span>
                  )}
                </div>

                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {repo.topics.slice(0, 5).map((topic) => (
                      <span
                        key={topic}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>

      {repos.length > 10 && (
        <p className="text-sm text-gray-500 mt-4 text-center">
          +{repos.length - 10} autre(s) repository(ies)
        </p>
      )}
    </div>
  );
}
