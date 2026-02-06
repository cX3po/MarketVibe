// Calculate volume momentum and relative volume analysis

import { OHLCV } from '@/types';
import { VolumeMomentumScore } from '@/types/sentiment';

/**
 * Calculate simple moving average of volume
 */
function calculateVolumeMA(data: OHLCV[], period: number = 20): number {
  if (data.length < period) return 0;

  const recentVolumes = data.slice(-period).map(d => d.volume);
  const sum = recentVolumes.reduce((acc, vol) => acc + vol, 0);

  return sum / period;
}

/**
 * Calculate volume trend (is volume increasing or decreasing?)
 * Compare recent volume average to longer-term average
 */
function calculateVolumeTrend(data: OHLCV[]): number {
  if (data.length < 40) return 0;

  // Recent 10-period average
  const recentVolumes = data.slice(-10).map(d => d.volume);
  const recentAvg = recentVolumes.reduce((a, b) => a + b, 0) / 10;

  // Longer 40-period average
  const longerVolumes = data.slice(-40).map(d => d.volume);
  const longerAvg = longerVolumes.reduce((a, b) => a + b, 0) / 40;

  if (longerAvg === 0) return 0;

  // Calculate percentage difference
  const trendPercent = ((recentAvg - longerAvg) / longerAvg) * 100;

  // Normalize to -100 to +100 range
  return Math.max(-100, Math.min(100, trendPercent * 2));
}

/**
 * Calculate relative volume (current volume vs average)
 * > 1.5x average = High volume
 * < 0.5x average = Low volume
 */
function calculateRelativeVolume(data: OHLCV[]): number {
  if (data.length < 20) return 1;

  const currentVolume = data[data.length - 1].volume;
  const avgVolume = calculateVolumeMA(data, 20);

  if (avgVolume === 0) return 1;

  return currentVolume / avgVolume;
}

/**
 * Calculate volume momentum score
 * High volume with uptrend = Strong bullish signal
 * High volume with downtrend = Strong bearish signal
 * Low volume = Weak signal (neutral)
 *
 * Score: -100 (strong bearish) to +100 (strong bullish)
 */
export function calculateVolumeMomentum(
  data: OHLCV[]
): VolumeMomentumScore {
  if (data.length < 20) {
    return {
      relativeVolume: 1,
      volumeTrend: 0,
      score: 0,
    };
  }

  const relativeVolume = calculateRelativeVolume(data);
  const volumeTrend = calculateVolumeTrend(data);

  // Score based on volume trend
  // Higher relative volume amplifies the trend signal
  const volumeMultiplier = Math.min(relativeVolume, 2) / 2; // Cap at 2x
  const score = volumeTrend * volumeMultiplier;

  return {
    relativeVolume,
    volumeTrend,
    score: Math.max(-100, Math.min(100, score)),
  };
}
