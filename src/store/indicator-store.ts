// Zustand store for indicator configuration

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IndicatorConfig } from '@/types';

interface IndicatorState {
  indicators: IndicatorConfig[];
  toggleIndicator: (type: IndicatorConfig['type']) => void;
  updateIndicator: (type: IndicatorConfig['type'], config: Partial<IndicatorConfig>) => void;
}

const defaultIndicators: IndicatorConfig[] = [
  { type: 'rsi', period: 14, enabled: true, color: '#9333ea' },
  { type: 'macd', fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, enabled: true, color: '#3b82f6' },
  { type: 'sma', periods: [20, 50, 200], enabled: true, color: '#10b981' },
  { type: 'ema', periods: [12, 26], enabled: false, color: '#f59e0b' },
  { type: 'bb', period: 20, stdDev: 2, enabled: true, color: '#8b5cf6' },
  { type: 'volume', enabled: true, color: '#6366f1' },
];

export const useIndicatorStore = create<IndicatorState>()(
  persist(
    (set) => ({
      indicators: defaultIndicators,
      toggleIndicator: (type) =>
        set((state) => ({
          indicators: state.indicators.map((ind) =>
            ind.type === type ? { ...ind, enabled: !ind.enabled } : ind
          ),
        })),
      updateIndicator: (type, config) =>
        set((state) => ({
          indicators: state.indicators.map((ind) =>
            ind.type === type ? { ...ind, ...config } : ind
          ),
        })),
    }),
    {
      name: 'indicator-storage',
    }
  )
);
