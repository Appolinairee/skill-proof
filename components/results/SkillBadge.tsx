import React from 'react';

export type BadgeType = 'proven' | 'declared' | 'overstated';

interface SkillBadgeProps {
  type: BadgeType;
  size?: 'sm' | 'md';
}

export function SkillBadge({ type, size = 'md' }: SkillBadgeProps) {
  const config = {
    proven: {
      label: 'Prouvé',
      emoji: '🟢',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300',
    },
    declared: {
      label: 'Déclaré',
      emoji: '🟡',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300',
    },
    overstated: {
      label: 'Surestimé',
      emoji: '🔴',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
    },
  };

  const { label, emoji, bgColor, textColor, borderColor } = config[type];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${bgColor} ${textColor} ${borderColor} ${sizeClasses} font-medium`}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  );
}
