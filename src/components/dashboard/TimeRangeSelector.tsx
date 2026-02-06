'use client';

// Time range selector component

import { useChartStore, TIME_RANGES } from '@/store/chart-store';

export function TimeRangeSelector() {
  const { timeRange, setTimeRange } = useChartStore();

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {TIME_RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => setTimeRange(range)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            timeRange.value === range.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
