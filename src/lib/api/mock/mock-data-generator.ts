// Mock data generator for stocks and forex with realistic price movements

import { OHLCV, PriceData } from '@/types';

/**
 * Generate realistic OHLCV data with random walk and volatility
 */
export class MockDataGenerator {
  private seed: number;

  constructor(symbol: string) {
    // Use symbol to seed random number generator for consistency
    this.seed = this.hashCode(symbol);
  }

  /**
   * Simple hash function to create seed from symbol
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * Seeded random number generator (0-1)
   */
  private seededRandom(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Generate random number within range
   */
  private randomInRange(min: number, max: number): number {
    return min + this.seededRandom() * (max - min);
  }

  /**
   * Generate historical OHLCV data
   */
  generateHistoricalData(
    basePrice: number,
    days: number,
    volatility: number = 0.02
  ): OHLCV[] {
    const data: OHLCV[] = [];
    const now = Date.now();
    let currentPrice = basePrice;

    // Generate data points (hourly for better granularity)
    const dataPoints = Math.max(24, days * 24);

    for (let i = dataPoints; i >= 0; i--) {
      const timestamp = now - i * 60 * 60 * 1000; // Hourly data

      // Random walk with trend
      const trend = this.randomInRange(-volatility * 0.5, volatility * 0.5);
      const change = currentPrice * trend;
      currentPrice = Math.max(currentPrice + change, basePrice * 0.5);

      // Generate OHLC from current price
      const high = currentPrice * (1 + this.randomInRange(0, volatility));
      const low = currentPrice * (1 - this.randomInRange(0, volatility));
      const open = this.randomInRange(low, high);
      const close = this.randomInRange(low, high);

      // Generate volume (higher during price movements)
      const priceChange = Math.abs(close - open);
      const baseVolume = this.randomInRange(1000000, 5000000);
      const volumeMultiplier = 1 + priceChange / open * 10;
      const volume = baseVolume * volumeMultiplier;

      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume,
      });

      currentPrice = close;
    }

    return data;
  }

  /**
   * Generate current price data from historical data
   */
  generatePriceData(
    symbol: string,
    historicalData: OHLCV[]
  ): PriceData {
    const latest = historicalData[historicalData.length - 1];
    const previous = historicalData[historicalData.length - 2];

    const currentPrice = latest.close;
    const priceChange = currentPrice - previous.close;
    const priceChangePercent = (priceChange / previous.close) * 100;

    // Calculate 24h stats
    const last24h = historicalData.slice(-24);
    const high24h = Math.max(...last24h.map((d) => d.high));
    const low24h = Math.min(...last24h.map((d) => d.low));
    const volume24h = last24h.reduce((sum, d) => sum + d.volume, 0);

    return {
      symbol,
      currentPrice,
      priceChange,
      priceChangePercent,
      high24h,
      low24h,
      volume24h,
      lastUpdated: latest.timestamp,
    };
  }
}

/**
 * Stock configurations with base prices and volatility
 */
export const STOCK_CONFIGS = {
  AAPL: { name: 'Apple Inc.', basePrice: 230, volatility: 0.015 },
  GOOGL: { name: 'Alphabet Inc.', basePrice: 175, volatility: 0.018 },
  MSFT: { name: 'Microsoft Corp.', basePrice: 430, volatility: 0.016 },
  TSLA: { name: 'Tesla Inc.', basePrice: 350, volatility: 0.035 },
  AMZN: { name: 'Amazon.com Inc.', basePrice: 210, volatility: 0.02 },
  META: { name: 'Meta Platforms Inc.', basePrice: 620, volatility: 0.025 },
  NVDA: { name: 'NVIDIA Corp.', basePrice: 140, volatility: 0.03 },
  NFLX: { name: 'Netflix Inc.', basePrice: 890, volatility: 0.028 },
};

/**
 * Forex configurations (prices relative to USD)
 */
export const FOREX_CONFIGS = {
  EURUSD: { name: 'Euro / US Dollar', basePrice: 1.08, volatility: 0.005 },
  GBPUSD: { name: 'British Pound / US Dollar', basePrice: 1.27, volatility: 0.006 },
  USDJPY: { name: 'US Dollar / Japanese Yen', basePrice: 149.5, volatility: 0.008 },
  AUDUSD: { name: 'Australian Dollar / US Dollar', basePrice: 0.64, volatility: 0.007 },
  USDCAD: { name: 'US Dollar / Canadian Dollar', basePrice: 1.36, volatility: 0.005 },
  USDCHF: { name: 'US Dollar / Swiss Franc', basePrice: 0.89, volatility: 0.006 },
};
