// Calculate trend strength from Moving Averages and Bollinger Bands

import { MAResult, BollingerBandsResult, OHLCV } from '@/types';
import { TrendStrengthScore } from '@/types/sentiment';

/**
 * Calculate trend strength based on price position relative to MAs
 * Price above all MAs = Strong uptrend (100)
 * Price below all MAs = Strong downtrend (0)
 * Mixed = Neutral (50)
 */
export function calculateMAPositionScore(
  currentPrice: number,
  sma: Record<number, MAResult[]> | undefined
): number {
  if (!sma) return 50; // Neutral if no MA data

  let score = 50;
  let count = 0;

  // Check price vs SMA 20, 50, 200
  const periods = [20, 50, 200];

  for (const period of periods) {
    const maData = sma[period];
    if (maData && maData.length > 0) {
      const latestMA = maData[maData.length - 1];

      // Price above MA = bullish (add points)
      // Price below MA = bearish (subtract points)
      if (currentPrice > latestMA.value) {
        score += 20;
      } else if (currentPrice < latestMA.value) {
        score -= 20;
      }
      count++;
    }
  }

  // Ensure score stays in 0-100 range
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate position within Bollinger Bands
 * Near upper band = Strong (high score)
 * Near lower band = Weak (low score)
 * Score: 0 (at lower band) to 100 (at upper band)
 */
export function calculateBBPositionScore(
  currentPrice: number,
  bb: BollingerBandsResult[] | undefined
): number {
  if (!bb || bb.length === 0) return 50; // Neutral if no BB data

  const latestBB = bb[bb.length - 1];

  const { upper, middle, lower } = latestBB;
  const range = upper - lower;

  if (range === 0) return 50; // Avoid division by zero

  // Calculate position within bands (0-100)
  const position = ((currentPrice - lower) / range) * 100;

  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, position));
}

/**
 * Combine MA position and BB position into trend strength score
 * Weighted: 60% MA position, 40% BB position
 */
export function calculateTrendStrength(
  currentPrice: number,
  sma: Record<number, MAResult[]> | undefined,
  bb: BollingerBandsResult[] | undefined
): TrendStrengthScore {
  const maPositionScore = calculateMAPositionScore(currentPrice, sma);
  const bbPositionScore = calculateBBPositionScore(currentPrice, bb);

  // Weighted combination
  const combined = maPositionScore * 0.6 + bbPositionScore * 0.4;

  return {
    maPositionScore,
    bbPositionScore,
    combined,
  };
}
