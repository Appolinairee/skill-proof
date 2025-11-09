import React from 'react';
import { SkillBadge, BadgeType } from './SkillBadge';
import { ConfidenceBar } from './ConfidenceBar';

export interface Skill {
  name: string;
  category: 'language' | 'framework' | 'tool' | 'soft-skill' | 'other';
  confidence: number;
  sources: string[];
  evidence?: string[];
  badge?: BadgeType;
}

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const categoryIcons = {
    language: '💻',
    framework: '🔧',
    tool: '🛠️',
    'soft-skill': '🤝',
    other: '📦',
  };

  const categoryLabels = {
    language: 'Langage',
    framework: 'Framework',
    tool: 'Outil',
    'soft-skill': 'Soft Skill',
    other: 'Autre',
  };

  // Determine badge based on confidence if not provided
  const getBadgeType = (): BadgeType => {
    if (skill.badge) return skill.badge;
    
    const hasGithub = skill.sources.includes('github');
    if (skill.confidence >= 70 && hasGithub) return 'proven';
    if (skill.confidence >= 40) return 'declared';
    return 'overstated';
  };

  const badgeType = getBadgeType();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{categoryIcons[skill.category]}</span>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{skill.name}</h3>
            <p className="text-xs text-gray-500">{categoryLabels[skill.category]}</p>
          </div>
        </div>
        <SkillBadge type={badgeType} />
      </div>

      {/* Confidence Bar */}
      <div className="mb-3">
        <ConfidenceBar confidence={skill.confidence} />
      </div>

      {/* Sources */}
      <div className="mb-3">
        <p className="text-xs text-gray-600 mb-1">Sources:</p>
        <div className="flex flex-wrap gap-1">
          {skill.sources.map((source) => (
            <span
              key={source}
              className="inline-block px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded border border-blue-200"
            >
              {source}
            </span>
          ))}
        </div>
      </div>

      {/* Evidence */}
      {skill.evidence && skill.evidence.length > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs font-medium text-gray-700 mb-1">Preuves:</p>
          <ul className="space-y-1">
            {skill.evidence.slice(0, 3).map((ev, idx) => (
              <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                <span className="text-blue-500 mt-0.5">•</span>
                <span className="flex-1">{ev}</span>
              </li>
            ))}
          </ul>
          {skill.evidence.length > 3 && (
            <p className="text-xs text-gray-500 mt-1">
              +{skill.evidence.length - 3} autre(s) preuve(s)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
