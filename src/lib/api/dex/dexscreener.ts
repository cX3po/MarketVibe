// Dexscreener API client for multi-chain DEX data

import { createAPIClient } from '../base-client';
import { PriceData, OHLCV, Symbol, MarketDataAdapter } from '@/types';

const BASE_URL = 'https://api.dexscreener.com/latest';
const client = createAPIClient(BASE_URL);

// Cache for reducing API calls
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 120000; // 2 minutes (120 seconds) - Dexscreener has strict rate limits

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Supported chains for Dexscreener
export const SUPPORTED_CHAINS = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'bsc', name: 'BSC', symbol: 'BSC' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB' },
  { id: 'optimism', name: 'Optimism', symbol: 'OP' },
  { id: 'base', name: 'Base', symbol: 'BASE' },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX' },
];

export class DexscreenerAdapter implements MarketDataAdapter {
  async getCurrentPrice(pairAddress: string): Promise<PriceData> {
    const cacheKey = `dex:price:${pairAddress}`;
    const cached = getCached<PriceData>(cacheKey);
    if (cached) return cached;

    const response = await client.get(`/dex/pairs/${pairAddress}`);
    const pair = response.data.pair;

    if (!pair) {
      throw new Error('Pair not found');
    }

    const priceData: PriceData = {
      symbol: pair.baseToken.symbol,
      currentPrice: parseFloat(pair.priceUsd),
      priceChange: parseFloat(pair.priceChange.h24),
      priceChangePercent: parseFloat(pair.priceChange.h24),
      high24h: parseFloat(pair.priceUsd) * (1 + parseFloat(pair.priceChange.h24) / 100),
      low24h: parseFloat(pair.priceUsd) * (1 - Math.abs(parseFloat(pair.priceChange.h24)) / 100),
      volume24h: parseFloat(pair.volume.h24),
      marketCap: parseFloat(pair.fdv || pair.liquidity?.usd || 0),
      lastUpdated: Date.now(),
    };

    setCache(cacheKey, priceData);
    return priceData;
  }

  async getHistoricalData(pairAddress: string, days: number = 30): Promise<OHLCV[]> {
    // Note: Dexscreener doesn't provide historical OHLCV directly in free tier
    // We'll need to use their pair info and create approximations
    // For real OHLCV, would need to use chart endpoints or websocket

    const cacheKey = `dex:history:${pairAddress}:${days}`;
    const cached = getCached<OHLCV[]>(cacheKey);
    if (cached) return cached;

    // Get current pair data
    const response = await client.get(`/dex/pairs/${pairAddress}`);
    const pair = response.data.pair;

    if (!pair) {
      throw new Error('Pair not found');
    }

    // Generate approximate OHLCV data based on price changes
    // This is a temporary solution - for production use websocket or paid API
    const currentPrice = parseFloat(pair.priceUsd);
    const ohlcv: OHLCV[] = [];

    // Create mock data based on 24h price change
    const priceChange24h = parseFloat(pair.priceChange.h24) / 100;
    const avgVolume = parseFloat(pair.volume.h24) / 24;

    const numCandles = days <= 1 ? 24 : days;

    for (let i = numCandles; i >= 0; i--) {
      const timestamp = Date.now() - (i * (days <= 1 ? 3600000 : 86400000));

      // Create realistic price movement
      const variation = (Math.random() - 0.5) * 0.05; // +/- 5%
      const trendFactor = (priceChange24h / numCandles) * i;
      const price = currentPrice / (1 + trendFactor + variation);

      const open = price * (1 + (Math.random() - 0.5) * 0.02);
      const close = price * (1 + (Math.random() - 0.5) * 0.02);
      const high = Math.max(open, close) * (1 + Math.random() * 0.03);
      const low = Math.min(open, close) * (1 - Math.random() * 0.03);
      const volume = avgVolume * (0.5 + Math.random());

      ohlcv.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume,
      });
    }

    setCache(cacheKey, ohlcv);
    return ohlcv;
  }

  async searchSymbols(query: string): Promise<Symbol[]> {
    const cacheKey = `dex:search:${query}`;
    const cached = getCached<Symbol[]>(cacheKey);
    if (cached) return cached;

    const response = await client.get(`/dex/search?q=${encodeURIComponent(query)}`);

    const symbols: Symbol[] = response.data.pairs.slice(0, 10).map((pair: any) => ({
      id: pair.pairAddress,
      symbol: pair.baseToken.symbol,
      name: `${pair.baseToken.name} (${pair.dexId})`,
      marketType: 'crypto' as const,
    }));

    setCache(cacheKey, symbols);
    return symbols;
  }

  // Get trending pairs across all chains
  async getTrendingPairs(chain?: string): Promise<any[]> {
    const cacheKey = `dex:trending:${chain || 'all'}`;
    const cached = getCached<any[]>(cacheKey);
    if (cached) return cached;

    // Dexscreener doesn't have a trending endpoint, but we can search popular pairs
    const popularTokens = ['WETH', 'USDC', 'WBTC', 'SOL', 'BNB'];
    const results = [];

    for (const token of popularTokens.slice(0, 5)) {
      try {
        const response = await client.get(`/dex/search?q=${token}`);
        if (response.data.pairs && response.data.pairs.length > 0) {
          results.push(response.data.pairs[0]);
        }
      } catch (error) {
        console.error(`Failed to fetch ${token}:`, error);
      }
    }

    setCache(cacheKey, results);
    return results;
  }
}

// Export singleton instance
export const dexscreenerClient = new DexscreenerAdapter();

// Popular DEX pair addresses for quick access
export const POPULAR_DEX_PAIRS = {
  // Ethereum
  'WETH-USDC-UNI': '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640', // Uniswap V3
  'WBTC-WETH-UNI': '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed', // Uniswap V3

  // Solana
  'SOL-USDC-RAY': 'So11111111111111111111111111111111111111112', // Raydium

  // BSC
  'BNB-USDT-PANCAKE': '0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae', // PancakeSwap
};
