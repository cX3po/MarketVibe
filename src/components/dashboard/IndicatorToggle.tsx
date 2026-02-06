'use client';

// Toggle panel for showing/hiding chart indicators

import { useState } from 'react';

export interface VisibleIndicators {
  sma20: boolean;
  sma50: boolean;
  sma200: boolean;
  ema20: boolean;
  ema50: boolean;
  bb: boolean;
}

interface IndicatorToggleProps {
  visibleIndicators: VisibleIndicators;
  onToggle: (indicators: VisibleIndicators) => void;
}

export function IndicatorToggle({ visibleIndicators, onToggle }: IndicatorToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleIndicator = (key: keyof VisibleIndicators) => {
    onToggle({
      ...visibleIndicators,
      [key]: !visibleIndicators[key],
    });
  };

  const indicators = [
    { key: 'sma20' as const, label: 'SMA 20', color: 'bg-orange-500' },
    { key: 'sma50' as const, label: 'SMA 50', color: 'bg-blue-500' },
    { key: 'sma200' as const, label: 'SMA 200', color: 'bg-purple-600' },
    { key: 'ema20' as const, label: 'EMA 20', color: 'bg-yellow-500' },
    { key: 'ema50' as const, label: 'EMA 50', color: 'bg-cyan-500' },
    { key: 'bb' as const, label: 'Bollinger Bands', color: 'bg-gray-500' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="font-medium text-gray-700">Chart Indicators</span>
          <span className="text-xs text-gray-500">
            ({Object.values(visibleIndicators).filter(Boolean).length} active)
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="pt-3 space-y-2">
            {indicators.map((indicator) => (
              <label
                key={indicator.key}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={visibleIndicators[indicator.key]}
                  onChange={() => toggleIndicator(indicator.key)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className={`w-3 h-3 rounded-full ${indicator.color}`}></div>
                <span className="text-sm font-medium text-gray-700 flex-1">{indicator.label}</span>
                {visibleIndicators[indicator.key] && (
                  <span className="text-xs text-green-600 font-semibold">✓ Active</span>
                )}
              </label>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => onToggle({
                  sma20: true,
                  sma50: true,
                  sma200: false,
                  ema20: false,
                  ema50: false,
                  bb: false,
                })}
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Default
              </button>
              <button
                onClick={() => onToggle({
                  sma20: true,
                  sma50: true,
                  sma200: true,
                  ema20: true,
                  ema50: true,
                  bb: true,
                })}
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                All
              </button>
              <button
                onClick={() => onToggle({
                  sma20: false,
                  sma50: false,
                  sma200: false,
                  ema20: false,
                  ema50: false,
                  bb: false,
                })}
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                None
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
