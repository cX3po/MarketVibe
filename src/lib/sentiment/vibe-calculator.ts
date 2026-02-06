// Main vibe score calculator - combines all sentiment indicators

import { IndicatorResults, OHLCV } from '@/types';
import { VibeScore, SentimentLabel } from '@/types/sentiment';
import { calculateMomentumScore } from './momentum-score';
import { calculateTrendStrength } from './trend-strength';
import { calculateVolumeMomentum } from './volume-momentum';

/**
 * Determine sentiment label based on vibe score
 */
function getSentimentLabel(score: number): SentimentLabel {
  if (score >= 75) return 'Strong Bullish';
  if (score >= 60) return 'Bullish';
  if (score >= 40) return 'Neutral';
  if (score >= 25) return 'Bearish';
  return 'Strong Bearish';
}

/**
 * Calculate confidence level based on indicator agreement
 * High confidence = all indicators pointing same direction
 * Low confidence = mixed signals
 */
function calculateConfidence(
  momentumCombined: number,
  trendStrength: number,
  volumeScore: number
): number {
  // Normalize all to 0-100 scale for comparison
  const momentumNorm = (momentumCombined + 100) / 2; // -100..+100 -> 0..100
  const trendNorm = trendStrength; // Already 0-100
  const volumeNorm = (volumeScore + 100) / 2; // -100..+100 -> 0..100

  // Calculate standard deviation (lower = more agreement = higher confidence)
  const mean = (momentumNorm + trendNorm + volumeNorm) / 3;
  const variance =
    ((momentumNorm - mean) ** 2 +
      (trendNorm - mean) ** 2 +
      (volumeNorm - mean) ** 2) /
    3;
  const stdDev = Math.sqrt(variance);

  // Convert standard deviation to confidence (0-100)
  // Low std dev = high confidence
  // Max std dev ~50, so we normalize
  const confidence = Math.max(0, 100 - stdDev * 2);

  return Math.round(confidence);
}

/**
 * Calculate comprehensive vibe score from all indicators
 *
 * Weighted formula:
 * - 35% Momentum (RSI + MACD)
 * - 30% Trend Strength (MA position + BB position)
 * - 20% Volume Momentum
 * - 15% Additional factor (price action, volatility)
 *
 * Returns: VibeScore with overall 0-100 score and breakdown
 */
export function calculateVibeScore(
  indicators: IndicatorResults,
  historicalData: OHLCV[],
  currentPrice: number
): VibeScore {
  // Get latest values
  const latestRSI = indicators.rsi?.[indicators.rsi.length - 1];
  const latestMACD = indicators.macd?.[indicators.macd.length - 1];

  // Calculate component scores
  const momentumScore = calculateMomentumScore(latestRSI, latestMACD);
  const trendStrength = calculateTrendStrength(
    currentPrice,
    indicators.sma,
    indicators.bb
  );
  const volumeMomentum = calculateVolumeMomentum(historicalData);

  // Calculate recent price action (last 24 hours)
  let priceActionScore = 0;
  if (historicalData.length >= 2) {
    const recentData = historicalData.slice(-24); // Last 24 periods
    const oldestPrice = recentData[0].close;
    const newestPrice = recentData[recentData.length - 1].close;

    if (oldestPrice > 0) {
      const priceChange = ((newestPrice - oldestPrice) / oldestPrice) * 100;
      // Normalize to -100 to +100 range (±10% = ±100)
      priceActionScore = Math.max(-100, Math.min(100, priceChange * 10));
    }
  }

  // Weighted combination
  // Normalize momentum and volume from -100..+100 to 0..100 for calculation
  const momentumNormalized = (momentumScore.combined + 100) / 2;
  const volumeNormalized = (volumeMomentum.score + 100) / 2;
  const priceActionNormalized = (priceActionScore + 100) / 2;

  const overall =
    momentumNormalized * 0.35 +
    trendStrength.combined * 0.3 +
    volumeNormalized * 0.2 +
    priceActionNormalized * 0.15;

  // Calculate confidence
  const confidence = calculateConfidence(
    momentumScore.combined,
    trendStrength.combined,
    volumeMomentum.score
  );

  // Get sentiment label
  const label = getSentimentLabel(overall);

  return {
    overall: Math.round(overall),
    momentum: Math.round(momentumScore.combined),
    trendStrength: Math.round(trendStrength.combined),
    volumeSignal: Math.round(volumeMomentum.score),
    confidence,
    label,
    timestamp: Date.now(),
  };
}
