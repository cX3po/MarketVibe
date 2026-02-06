// Calculate momentum score from RSI and MACD indicators

import { RSIResult, MACDResult } from '@/types';
import { MomentumScore } from '@/types/sentiment';

/**
 * Calculate RSI-based momentum score
 * RSI > 70 = Overbought (strong bullish momentum)
 * RSI < 30 = Oversold (strong bearish momentum)
 * Score: -100 (oversold) to +100 (overbought)
 */
export function calculateRSIMomentum(rsi: RSIResult | undefined): number {
  if (!rsi) return 0;

  // Transform RSI (0-100) to score (-100 to +100)
  // RSI 50 = neutral (0), RSI 100 = +100, RSI 0 = -100
  return (rsi.value - 50) * 2;
}

/**
 * Calculate MACD-based momentum score
 * MACD > Signal = Bullish
 * MACD < Signal = Bearish
 * Score based on histogram strength
 */
export function calculateMACDMomentum(macd: MACDResult | undefined): number {
  if (!macd) return 0;

  const histogram = macd.histogram;

  // Normalize histogram to -100 to +100 range
  // Strong divergence = stronger signal
  // Typically histogram ranges from -5 to +5 for most assets
  const normalized = Math.max(-100, Math.min(100, histogram * 20));

  return normalized;
}

/**
 * Combine RSI and MACD momentum into overall momentum score
 * Weighted: 60% RSI, 40% MACD
 */
export function calculateMomentumScore(
  rsi: RSIResult | undefined,
  macd: MACDResult | undefined
): MomentumScore {
  const rsiScore = calculateRSIMomentum(rsi);
  const macdScore = calculateMACDMomentum(macd);

  // Weighted combination
  const combined = rsiScore * 0.6 + macdScore * 0.4;

  return {
    rsiScore,
    macdScore,
    combined,
  };
}
