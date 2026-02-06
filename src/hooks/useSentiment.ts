// Hook for calculating sentiment/vibe score from indicators and price data

import { useMemo } from 'react';
import { IndicatorResults, OHLCV } from '@/types';
import { VibeScore } from '@/types/sentiment';
import { calculateVibeScore } from '@/lib/sentiment/vibe-calculator';

export function useSentiment(
  indicators: IndicatorResults,
  historicalData: OHLCV[],
  currentPrice: number | undefined
): VibeScore | null {
  return useMemo(() => {
    // Require minimum data to calculate
    if (!currentPrice || historicalData.length < 20) {
      return null;
    }

    // Require at least some indicators
    if (!indicators.rsi && !indicators.macd && !indicators.sma) {
      return null;
    }

    return calculateVibeScore(indicators, historicalData, currentPrice);
  }, [indicators, historicalData, currentPrice]);
}
