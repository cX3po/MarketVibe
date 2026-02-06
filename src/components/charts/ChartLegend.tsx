'use client';

// Chart legend showing active indicators and their colors

import { VisibleIndicators } from '@/components/dashboard/IndicatorToggle';

interface ChartLegendProps {
  visibleIndicators: VisibleIndicators;
}

export function ChartLegend({ visibleIndicators }: ChartLegendProps) {
  const indicators = [
    { key: 'sma20', label: 'SMA 20', color: 'bg-orange-500', visible: visibleIndicators.sma20 },
    { key: 'sma50', label: 'SMA 50', color: 'bg-blue-500', visible: visibleIndicators.sma50 },
    { key: 'sma200', label: 'SMA 200', color: 'bg-purple-600', visible: visibleIndicators.sma200 },
    { key: 'ema20', label: 'EMA 20', color: 'bg-yellow-500', visible: visibleIndicators.ema20 },
    { key: 'ema50', label: 'EMA 50', color: 'bg-cyan-500', visible: visibleIndicators.ema50 },
    { key: 'bb', label: 'Bollinger Bands', color: 'bg-gray-500', visible: visibleIndicators.bb },
  ];

  const activeIndicators = indicators.filter(i => i.visible);

  if (activeIndicators.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        Active Overlays:
      </span>
      {activeIndicators.map((indicator) => (
        <div
          key={indicator.key}
          className="flex items-center gap-2 px-2 py-1 bg-white rounded-md border border-gray-200"
        >
          <div className={`w-3 h-3 rounded-full ${indicator.color}`}></div>
          <span className="text-xs font-medium text-gray-700">{indicator.label}</span>
        </div>
      ))}
    </div>
  );
}
