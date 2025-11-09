import React from 'react';

interface ConfidenceBarProps {
  confidence: number; // 0-100
  showLabel?: boolean;
}

export function ConfidenceBar({ confidence, showLabel = true }: ConfidenceBarProps) {
  // Clamp between 0-100
  const value = Math.max(0, Math.min(100, confidence));
  
  // Color based on confidence level
  const getColor = () => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    if (value >= 70) return 'text-green-700';
    if (value >= 40) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className={`text-sm font-medium ${getTextColor()}`}>
            Confiance: {value}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
