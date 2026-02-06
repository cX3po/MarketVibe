// Hook for calculating technical indicators

import { useMemo } from 'react';
import { OHLCV, IndicatorResults } from '@/types';
import { IndicatorCalculator } from '@/lib/indicators/calculator';

export function useIndicators(data: OHLCV[]): IndicatorResults {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return {};
    }

    try {
      return IndicatorCalculator.calculateAll(data);
    } catch (error) {
      console.error('Error calculating indicators:', error);
      return {};
    }
  }, [data]);
}
