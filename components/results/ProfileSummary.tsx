import React from 'react';

interface ProfileSummaryProps {
  summary: string;
  name: string;
  totalSkills: number;
}

export function ProfileSummary({ summary, name, totalSkills }: ProfileSummaryProps) {
  return (
    <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{name}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
            <span className="flex items-center gap-1">
              💼 {totalSkills} compétence{totalSkills > 1 ? 's' : ''} détectée{totalSkills > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  );
}
