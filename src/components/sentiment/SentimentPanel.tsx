'use client';

// Sentiment panel displaying vibe score and breakdown

import { VibeScore } from '@/types/sentiment';

interface SentimentPanelProps {
  vibeScore: VibeScore | null;
}

export function SentimentPanel({ vibeScore }: SentimentPanelProps) {
  if (!vibeScore) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Vibe</h3>
        <div className="flex items-center justify-center h-40">
          <p className="text-sm text-gray-500">Calculating sentiment...</p>
        </div>
      </div>
    );
  }

  // Determine colors based on score
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-green-500';
    if (score >= 40) return 'text-gray-600';
    if (score >= 25) return 'text-orange-500';
    return 'text-red-600';
  };

  const getLabelColor = (label: string) => {
    if (label.includes('Strong Bullish')) return 'bg-green-600 text-white';
    if (label.includes('Bullish')) return 'bg-green-500 text-white';
    if (label.includes('Neutral')) return 'bg-gray-500 text-white';
    if (label.includes('Bearish')) return 'bg-orange-500 text-white';
    return 'bg-red-600 text-white';
  };

  const getBarColor = (score: number) => {
    if (score >= 60) return 'bg-green-500';
    if (score >= 40) return 'bg-gray-400';
    return 'bg-red-500';
  };

  const getMomentumBarColor = (momentum: number) => {
    if (momentum >= 30) return 'bg-green-500';
    if (momentum >= -30) return 'bg-gray-400';
    return 'bg-red-500';
  };

  const getVolumeBarColor = (volume: number) => {
    if (volume >= 30) return 'bg-green-500';
    if (volume >= -30) return 'bg-gray-400';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Vibe</h3>

      {/* Main Vibe Score */}
      <div className="text-center mb-6">
        {/* Circular Gauge Visual */}
        <div className="relative inline-block">
          {/* Background circle */}
          <svg width="180" height="180" className="transform -rotate-90">
            <circle
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            {/* Colored arc based on score */}
            <circle
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke={
                vibeScore.overall >= 75
                  ? '#10b981'
                  : vibeScore.overall >= 60
                  ? '#22c55e'
                  : vibeScore.overall >= 40
                  ? '#6b7280'
                  : vibeScore.overall >= 25
                  ? '#f59e0b'
                  : '#ef4444'
              }
              strokeWidth="12"
              strokeDasharray={`${(vibeScore.overall / 100) * 439.8} 439.8`}
              strokeLinecap="round"
            />
          </svg>

          {/* Score text in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-5xl font-bold ${getScoreColor(vibeScore.overall)}`}>
              {vibeScore.overall}
            </div>
            <div className="text-xs text-gray-500 mt-1">out of 100</div>
          </div>
        </div>

        {/* Sentiment Label */}
        <div className="mt-4">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getLabelColor(vibeScore.label)}`}>
            {vibeScore.label}
          </span>
        </div>
      </div>

      {/* Component Breakdown */}
      <div className="space-y-4 border-t pt-4">
        <div className="text-sm font-medium text-gray-700 mb-3">Score Breakdown</div>

        {/* Momentum Score */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Momentum</span>
            <span className={`text-sm font-semibold ${vibeScore.momentum >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {vibeScore.momentum > 0 ? '+' : ''}
              {vibeScore.momentum}
            </span>
          </div>
          {/* Bar from -100 to +100 */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 w-px h-full bg-gray-400"></div>
            {/* Momentum bar */}
            {vibeScore.momentum >= 0 ? (
              <div
                className={`absolute left-1/2 top-0 h-full ${getMomentumBarColor(vibeScore.momentum)}`}
                style={{ width: `${(vibeScore.momentum / 100) * 50}%` }}
              />
            ) : (
              <div
                className={`absolute right-1/2 top-0 h-full ${getMomentumBarColor(vibeScore.momentum)}`}
                style={{ width: `${(Math.abs(vibeScore.momentum) / 100) * 50}%` }}
              />
            )}
          </div>
        </div>

        {/* Trend Strength */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Trend Strength</span>
            <span className="text-sm font-semibold text-gray-900">{vibeScore.trendStrength}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getBarColor(vibeScore.trendStrength)}`}
              style={{ width: `${vibeScore.trendStrength}%` }}
            />
          </div>
        </div>

        {/* Volume Signal */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Volume Signal</span>
            <span className={`text-sm font-semibold ${vibeScore.volumeSignal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {vibeScore.volumeSignal > 0 ? '+' : ''}
              {vibeScore.volumeSignal}
            </span>
          </div>
          {/* Bar from -100 to +100 */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 w-px h-full bg-gray-400"></div>
            {/* Volume bar */}
            {vibeScore.volumeSignal >= 0 ? (
              <div
                className={`absolute left-1/2 top-0 h-full ${getVolumeBarColor(vibeScore.volumeSignal)}`}
                style={{ width: `${(vibeScore.volumeSignal / 100) * 50}%` }}
              />
            ) : (
              <div
                className={`absolute right-1/2 top-0 h-full ${getVolumeBarColor(vibeScore.volumeSignal)}`}
                style={{ width: `${(Math.abs(vibeScore.volumeSignal) / 100) * 50}%` }}
              />
            )}
          </div>
        </div>

        {/* Confidence Level */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Confidence</span>
            <span className="text-sm font-semibold text-gray-900">{vibeScore.confidence}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${vibeScore.confidence >= 70 ? 'bg-blue-500' : vibeScore.confidence >= 50 ? 'bg-blue-400' : 'bg-blue-300'}`}
              style={{ width: `${vibeScore.confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 leading-relaxed">
          The Market Vibe combines RSI, MACD, Moving Averages, Bollinger Bands, and Volume analysis
          to provide a comprehensive sentiment score (0-100). Higher scores indicate bullish sentiment,
          lower scores indicate bearish sentiment.
        </p>
      </div>
    </div>
  );
}
