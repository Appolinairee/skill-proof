import React from 'react';

interface SkillsStatsProps {
  stats: {
    total: number;
    proven: number;
    declared: number;
    overstated: number;
    avgConfidence: number;
    provenPercentage: number;
  };
}

export function SkillsStats({ stats }: SkillsStatsProps) {
  const statItems = [
    {
      label: 'Total',
      value: stats.total,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
    },
    {
      label: '🟢 Prouvées',
      value: stats.proven,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
    },
    {
      label: '🟡 Déclarées',
      value: stats.declared,
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
    },
    {
      label: '🔴 Surestimées',
      value: stats.overstated,
      color: 'text-red-700',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Statistiques</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statItems.map((item) => (
          <div
            key={item.label}
            className={`${item.bgColor} rounded-lg p-4 text-center`}
          >
            <div className={`text-3xl font-bold ${item.color}`}>
              {item.value}
            </div>
            <div className="text-sm text-gray-600 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Confiance moyenne</span>
          <span className="text-lg font-bold text-gray-900">{stats.avgConfidence}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 bg-linear-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${stats.avgConfidence}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-600">Taux de preuve</span>
          <span className="text-lg font-bold text-green-600">{stats.provenPercentage}%</span>
        </div>
      </div>
    </div>
  );
}
