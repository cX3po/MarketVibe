// Mock forex data client using realistic data generation

import { MarketDataAdapter, PriceData, OHLCV, Symbol } from '@/types';
import { MockDataGenerator, FOREX_CONFIGS } from '../mock/mock-data-generator';

class MockForexClient implements MarketDataAdapter {
  private cache: Map<string, { data: OHLCV[]; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 30000; // 30 seconds

  /**
   * Get current price for a forex pair
   */
  async getCurrentPrice(symbol: string): Promise<PriceData> {
    const historicalData = await this.getHistoricalData(symbol, 1);
    const generator = new MockDataGenerator(symbol);
    return generator.generatePriceData(symbol.toUpperCase(), historicalData);
  }

  /**
   * Get historical OHLCV data for a forex pair
   */
  async getHistoricalData(symbol: string, days: number = 30): Promise<OHLCV[]> {
    const upperSymbol = symbol.toUpperCase();
    const config = FOREX_CONFIGS[upperSymbol as keyof typeof FOREX_CONFIGS];

    if (!config) {
      throw new Error(`Forex pair ${upperSymbol} not found`);
    }

    // Check cache
    const cached = this.cache.get(upperSymbol);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      // Return cached data filtered by days
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      return cached.data.filter((d) => d.timestamp >= cutoff);
    }

    // Generate new data
    const generator = new MockDataGenerator(upperSymbol);
    const data = generator.generateHistoricalData(
      config.basePrice,
      Math.max(days, 365), // Generate full year for caching
      config.volatility
    );

    // Cache the data
    this.cache.set(upperSymbol, { data, timestamp: Date.now() });

    // Return filtered by days
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return data.filter((d) => d.timestamp >= cutoff);
  }

  /**
   * Search for forex pairs
   */
  async searchSymbols(query: string): Promise<Symbol[]> {
    const results: Symbol[] = [];

    for (const [symbol, config] of Object.entries(FOREX_CONFIGS)) {
      if (
        symbol.toLowerCase().includes(query.toLowerCase()) ||
        config.name.toLowerCase().includes(query.toLowerCase())
      ) {
        results.push({
          id: symbol.toLowerCase(),
          symbol: symbol,
          name: config.name,
          marketType: 'forex',
        });
      }
    }

    return results;
  }

  /**
   * Get all available forex pairs
   */
  async getAllSymbols(): Promise<Symbol[]> {
    return Object.entries(FOREX_CONFIGS).map(([symbol, config]) => ({
      id: symbol.toLowerCase(),
      symbol,
      name: config.name,
      marketType: 'forex',
    }));
  }
}

export const mockForexClient = new MockForexClient();
