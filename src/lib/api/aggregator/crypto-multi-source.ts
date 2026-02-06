// Multi-source crypto data client with fallback strategy
// Uses free APIs with generous/no rate limits

import axios from 'axios';
import { OHLCV, PriceData, Symbol } from '@/types';
import { searchCrypto } from '@/lib/data/crypto-database';
import { idToSymbol } from '@/lib/data/symbol-mapper';

/**
 * Binance Public API Client
 * FREE - No authentication required, very high rate limits
 * Documentation: https://developers.binance.com/docs/binance-spot-api-docs
 */
class BinancePublicClient {
  private baseUrl = 'https://api.binance.com/api/v3';

  async getCurrentPrice(symbol: string): Promise<PriceData> {
    try {
      // Convert ID format (bitcoin) to symbol format (BTC) for Binance
      const baseSymbol = idToSymbol(symbol);
      const binanceSymbol = `${baseSymbol}USDT`;

      // Get 24hr ticker stats
      const tickerUrl = `${this.baseUrl}/ticker/24hr?symbol=${binanceSymbol}`;
      const response = await axios.get(tickerUrl);

      const data = response.data;
      const currentPrice = parseFloat(data.lastPrice);
      const priceChange = parseFloat(data.priceChange);
      const priceChangePercent = parseFloat(data.priceChangePercent);

      return {
        symbol: symbol.toLowerCase(),
        currentPrice,
        priceChange,
        priceChangePercent,
        high24h: parseFloat(data.highPrice),
        low24h: parseFloat(data.lowPrice),
        volume24h: parseFloat(data.volume),
        marketCap: undefined, // Not available from Binance
        lastUpdated: Date.now(),
      };
    } catch (error: any) {
      throw new Error(`Binance: Failed to fetch ${symbol} - ${error.message}`);
    }
  }

  async getHistoricalData(symbol: string, days: number = 30, interval: string = '1d'): Promise<OHLCV[]> {
    try {
      // Convert ID format (bitcoin) to symbol format (BTC) for Binance
      const baseSymbol = idToSymbol(symbol);
      const binanceSymbol = `${baseSymbol}USDT`;

      // Map our intervals to Binance intervals
      // Binance supports: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
      let binanceInterval = '1d';
      let limit = 30;

      if (interval === '1h') {
        binanceInterval = '1h';
        limit = Math.min(days * 24, 1000); // Binance max 1000 candles
      } else if (interval === '4h') {
        binanceInterval = '4h';
        limit = Math.min(days * 6, 1000);
      } else if (interval === '12h') {
        binanceInterval = '12h';
        limit = Math.min(days * 2, 1000);
      } else if (interval === '1d') {
        binanceInterval = '1d';
        limit = Math.min(days, 1000);
      } else if (interval === '7d') {
        binanceInterval = '1d';
        limit = Math.min(days, 1000);
      } else if (interval === '30d') {
        binanceInterval = '1d';
        limit = Math.min(days, 1000);
      } else if (interval === '90d') {
        binanceInterval = '1w';
        limit = Math.min(Math.floor(days / 7), 1000);
      } else if (interval === '365d') {
        binanceInterval = '1w';
        limit = Math.min(Math.floor(days / 7), 1000);
      }

      const url = `${this.baseUrl}/klines?symbol=${binanceSymbol}&interval=${binanceInterval}&limit=${limit}`;
      const response = await axios.get(url);

      const ohlcv: OHLCV[] = response.data.map((candle: any) => ({
        timestamp: candle[0], // Open time in milliseconds
        open: parseFloat(candle[1]),
        high: parseFloat(candle[2]),
        low: parseFloat(candle[3]),
        close: parseFloat(candle[4]),
        volume: parseFloat(candle[5]),
      }));

      return ohlcv;
    } catch (error: any) {
      throw new Error(`Binance: Failed to fetch historical data - ${error.message}`);
    }
  }

  async searchSymbols(query: string): Promise<Symbol[]> {
    try {
      // Get all trading pairs from Binance
      const url = `${this.baseUrl}/exchangeInfo`;
      const response = await axios.get(url);

      // Filter USDT pairs that match the query
      const symbols = response.data.symbols
        .filter((s: any) =>
          s.quoteAsset === 'USDT' &&
          s.status === 'TRADING' &&
          (s.baseAsset.toLowerCase().includes(query.toLowerCase()) ||
           s.symbol.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 20) // Limit to 20 results
        .map((s: any) => ({
          id: s.baseAsset.toLowerCase(),
          symbol: s.baseAsset,
          name: `${s.baseAsset} / USDT`,
          marketType: 'crypto' as const,
        }));

      return symbols;
    } catch (error) {
      return [];
    }
  }
}

/**
 * CoinCap API Client
 * FREE - Reasonable rate limits, good for fallback
 * Documentation: https://docs.coincap.io/
 */
class CoinCapClient {
  private baseUrl = 'https://api.coincap.io/v2';

  async getCurrentPrice(symbol: string): Promise<PriceData> {
    try {
      // CoinCap uses coin IDs (bitcoin, ethereum, etc.)
      const coinId = symbol.toLowerCase();

      const url = `${this.baseUrl}/assets/${coinId}`;
      const response = await axios.get(url);

      const data = response.data.data;
      const currentPrice = parseFloat(data.priceUsd);
      const priceChangePercent = parseFloat(data.changePercent24Hr);
      const priceChange = currentPrice * (priceChangePercent / 100);

      return {
        symbol: symbol.toLowerCase(),
        currentPrice,
        priceChange,
        priceChangePercent,
        high24h: currentPrice * 1.01, // CoinCap doesn't provide 24h high/low
        low24h: currentPrice * 0.99,
        volume24h: parseFloat(data.volumeUsd24Hr || '0'),
        marketCap: parseFloat(data.marketCapUsd || '0'),
        lastUpdated: Date.now(),
      };
    } catch (error: any) {
      throw new Error(`CoinCap: Failed to fetch ${symbol} - ${error.message}`);
    }
  }

  async getHistoricalData(symbol: string, days: number = 30, interval: string = '1d'): Promise<OHLCV[]> {
    try {
      const coinId = symbol.toLowerCase();

      // CoinCap only supports h1, h12, d1 intervals
      let coinCapInterval = 'd1';
      if (interval === '1h' || interval === '4h') {
        coinCapInterval = 'h1';
      } else if (interval === '12h') {
        coinCapInterval = 'h12';
      } else {
        coinCapInterval = 'd1';
      }

      const end = Date.now();
      const start = end - (days * 24 * 60 * 60 * 1000);

      const url = `${this.baseUrl}/assets/${coinId}/history?interval=${coinCapInterval}&start=${start}&end=${end}`;
      const response = await axios.get(url);

      // CoinCap returns price points, not OHLCV, so we simulate candles
      const data = response.data.data;
      const ohlcv: OHLCV[] = [];

      for (let i = 0; i < data.length; i++) {
        const price = parseFloat(data[i].priceUsd);
        const timestamp = data[i].time;

        // Simulate OHLCV from price points (approximation)
        ohlcv.push({
          timestamp,
          open: price,
          high: price * 1.002,
          low: price * 0.998,
          close: price,
          volume: 0, // CoinCap history doesn't include volume per candle
        });
      }

      return ohlcv;
    } catch (error: any) {
      throw new Error(`CoinCap: Failed to fetch historical data - ${error.message}`);
    }
  }
}

/**
 * Kraken Public API Client
 * FREE - No authentication, good geographic coverage
 * Documentation: https://docs.kraken.com/rest/
 */
class KrakenPublicClient {
  private baseUrl = 'https://api.kraken.com/0/public';

  async getCurrentPrice(symbol: string): Promise<PriceData> {
    try {
      // Kraken uses pairs like XXBTZUSD (BTC/USD), XETHZUSD (ETH/USD)
      const krakenPair = this.symbolToKrakenPair(symbol);

      const url = `${this.baseUrl}/Ticker?pair=${krakenPair}`;
      const response = await axios.get(url);

      if (response.data.error && response.data.error.length > 0) {
        throw new Error(response.data.error[0]);
      }

      // Kraken returns data with the pair name as key
      const pairData = Object.values(response.data.result)[0] as any;
      const currentPrice = parseFloat(pairData.c[0]); // Last trade price
      const openPrice = parseFloat(pairData.o); // Open price
      const priceChange = currentPrice - openPrice;
      const priceChangePercent = (priceChange / openPrice) * 100;

      return {
        symbol: symbol.toLowerCase(),
        currentPrice,
        priceChange,
        priceChangePercent,
        high24h: parseFloat(pairData.h[0]), // 24h high
        low24h: parseFloat(pairData.l[0]), // 24h low
        volume24h: parseFloat(pairData.v[0]), // 24h volume
        lastUpdated: Date.now(),
      };
    } catch (error: any) {
      throw new Error(`Kraken: Failed to fetch ${symbol} - ${error.message}`);
    }
  }

  async getHistoricalData(symbol: string, days: number = 30, interval: string = '1d'): Promise<OHLCV[]> {
    try {
      const krakenPair = this.symbolToKrakenPair(symbol);

      // Map intervals to Kraken intervals (in minutes)
      let krakenInterval = 1440; // 1 day default
      if (interval === '1h') krakenInterval = 60;
      else if (interval === '4h') krakenInterval = 240;
      else if (interval === '12h') krakenInterval = 720;
      else if (interval === '1d') krakenInterval = 1440;
      else if (interval === '7d') krakenInterval = 10080;
      else if (interval === '30d') krakenInterval = 1440; // Use daily
      else if (interval === '90d' || interval === '365d') krakenInterval = 1440;

      // Kraken supports max 720 data points
      const since = Math.floor((Date.now() - days * 24 * 60 * 60 * 1000) / 1000);

      const url = `${this.baseUrl}/OHLC?pair=${krakenPair}&interval=${krakenInterval}&since=${since}`;
      const response = await axios.get(url);

      if (response.data.error && response.data.error.length > 0) {
        throw new Error(response.data.error[0]);
      }

      const pairData = Object.values(response.data.result)[0] as any[];
      const ohlcv: OHLCV[] = pairData
        .filter(candle => Array.isArray(candle)) // Filter out the 'last' field
        .map((candle: any) => ({
          timestamp: candle[0] * 1000, // Convert to milliseconds
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4]),
          volume: parseFloat(candle[6]),
        }));

      return ohlcv;
    } catch (error: any) {
      throw new Error(`Kraken: Failed to fetch historical data - ${error.message}`);
    }
  }

  private symbolToKrakenPair(symbol: string): string {
    // First convert ID format (bitcoin) to symbol format (BTC)
    const baseSymbol = idToSymbol(symbol);

    // Map symbols to Kraken-specific pair names
    const symbolMap: Record<string, string> = {
      'BTC': 'XXBTZUSD',
      'ETH': 'XETHZUSD',
      'XRP': 'XXRPZUSD',
      'ADA': 'ADAUSD',
      'SOL': 'SOLUSD',
      'DOGE': 'XDGEUSD',
      'DOT': 'DOTUSD',
      'MATIC': 'MATICUSD',
      'LTC': 'XLTCZUSD',
      'LINK': 'LINKUSD',
    };

    return symbolMap[baseSymbol] || `${baseSymbol}USD`;
  }
}

/**
 * DEXScreener API Client
 * FREE - No authentication, access to DEX listings across multiple chains
 * Documentation: https://docs.dexscreener.com/api/reference
 */
class DEXScreenerClient {
  private baseUrl = 'https://api.dexscreener.com/latest/dex';

  async getCurrentPrice(symbol: string): Promise<PriceData> {
    try {
      // Check if symbol is a contract address (starts with 0x and is 42 characters)
      const isContractAddress = /^0x[a-fA-F0-9]{40}$/i.test(symbol);

      let pairs: any[];

      if (isContractAddress) {
        // Fetch by contract address
        const tokenUrl = `${this.baseUrl}/tokens/${symbol}`;
        const response = await axios.get(tokenUrl);

        if (!response.data.pairs || response.data.pairs.length === 0) {
          throw new Error(`Token ${symbol} not found on DEXScreener`);
        }

        pairs = response.data.pairs;
      } else {
        // Search for the token by symbol
        const baseSymbol = idToSymbol(symbol).toUpperCase();
        const searchUrl = `${this.baseUrl}/search?q=${baseSymbol}`;
        const response = await axios.get(searchUrl);

        if (!response.data.pairs || response.data.pairs.length === 0) {
          throw new Error(`Token ${symbol} not found on DEXScreener`);
        }

        pairs = response.data.pairs;
      }

      // Get the most liquid pair (highest 24h volume)
      const sortedPairs = pairs.sort((a: any, b: any) =>
        parseFloat(b.volume?.h24 || 0) - parseFloat(a.volume?.h24 || 0)
      );

      const topPair = sortedPairs[0];
      const currentPrice = parseFloat(topPair.priceUsd);
      const priceChangePercent = parseFloat(topPair.priceChange?.h24 || 0);
      const priceChange = currentPrice * (priceChangePercent / 100);

      return {
        symbol: symbol.toLowerCase(),
        currentPrice,
        priceChange,
        priceChangePercent,
        high24h: currentPrice * (1 + Math.abs(priceChangePercent) / 100),
        low24h: currentPrice * (1 - Math.abs(priceChangePercent) / 100),
        volume24h: parseFloat(topPair.volume?.h24 || 0),
        marketCap: parseFloat(topPair.fdv || 0), // Fully diluted valuation
        lastUpdated: Date.now(),
      };
    } catch (error: any) {
      throw new Error(`DEXScreener: Failed to fetch ${symbol} - ${error.message}`);
    }
  }

  async getHistoricalData(symbol: string, days: number = 30, interval: string = '1d'): Promise<OHLCV[]> {
    try {
      // DEXScreener doesn't provide historical OHLC data in their public API
      // We can only get current price snapshot
      // Throw error to fall back to next source
      throw new Error('DEXScreener does not support historical OHLC data');
    } catch (error: any) {
      throw new Error(`DEXScreener: Failed to fetch historical data - ${error.message}`);
    }
  }

  async searchSymbols(query: string): Promise<Symbol[]> {
    try {
      const searchUrl = `${this.baseUrl}/search?q=${query}`;
      const response = await axios.get(searchUrl);

      if (!response.data.pairs || response.data.pairs.length === 0) {
        return [];
      }

      // Group by base token and get highest volume pair for each
      const tokenMap = new Map<string, any>();

      response.data.pairs.forEach((pair: any) => {
        const baseToken = pair.baseToken?.symbol?.toUpperCase();
        if (!baseToken) return;

        const volume = parseFloat(pair.volume?.h24 || 0);
        const existing = tokenMap.get(baseToken);

        if (!existing || volume > parseFloat(existing.volume?.h24 || 0)) {
          tokenMap.set(baseToken, pair);
        }
      });

      // Convert to Symbol format
      const symbols: Symbol[] = Array.from(tokenMap.values())
        .slice(0, 20)
        .map((pair: any) => ({
          id: pair.baseToken.symbol.toLowerCase(),
          symbol: pair.baseToken.symbol.toUpperCase(),
          name: `${pair.baseToken.name} (${pair.chainId})`,
          marketType: 'crypto' as const,
        }));

      return symbols;
    } catch (error) {
      return [];
    }
  }

  async searchByContractAddress(address: string): Promise<Symbol[]> {
    try {
      // Search by token contract address
      const tokenUrl = `${this.baseUrl}/tokens/${address}`;
      const response = await axios.get(tokenUrl);

      if (!response.data.pairs || response.data.pairs.length === 0) {
        return [];
      }

      // Get the most liquid pair for this token
      const pairs = response.data.pairs.sort((a: any, b: any) =>
        parseFloat(b.liquidity?.usd || 0) - parseFloat(a.liquidity?.usd || 0)
      );

      const topPair = pairs[0];
      const baseToken = topPair.baseToken;

      return [{
        id: address.toLowerCase(),
        symbol: baseToken.symbol.toUpperCase(),
        name: `${baseToken.name} (${topPair.chainId})`,
        marketType: 'crypto' as const,
      }];
    } catch (error: any) {
      throw new Error(`Failed to fetch token by address: ${error.message}`);
    }
  }
}

/**
 * CoinGecko API Client (Fallback)
 * FREE but has rate limits (10-30 calls/min)
 */
class CoinGeckoClient {
  private baseUrl = 'https://api.coingecko.com/api/v3';

  async getCurrentPrice(symbol: string): Promise<PriceData> {
    try {
      const coinId = symbol.toLowerCase();
      const url = `${this.baseUrl}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`;
      const response = await axios.get(url);

      const data = response.data[coinId];
      if (!data) {
        throw new Error(`Coin ${symbol} not found`);
      }

      const currentPrice = data.usd;
      const priceChangePercent = data.usd_24h_change || 0;
      const priceChange = currentPrice * (priceChangePercent / 100);

      return {
        symbol: coinId,
        currentPrice,
        priceChange,
        priceChangePercent,
        high24h: currentPrice * 1.01,
        low24h: currentPrice * 0.99,
        volume24h: data.usd_24h_vol || 0,
        marketCap: data.usd_market_cap,
        lastUpdated: Date.now(),
      };
    } catch (error: any) {
      throw new Error(`CoinGecko: Failed to fetch ${symbol} - ${error.message}`);
    }
  }

  async getHistoricalData(symbol: string, days: number = 30): Promise<OHLCV[]> {
    try {
      const coinId = symbol.toLowerCase();
      const url = `${this.baseUrl}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`;
      const response = await axios.get(url);

      const ohlcv: OHLCV[] = response.data.map((candle: number[]) => ({
        timestamp: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: 0,
      }));

      return ohlcv;
    } catch (error: any) {
      throw new Error(`CoinGecko: Failed to fetch historical data - ${error.message}`);
    }
  }
}

/**
 * Multi-Source Crypto Client with intelligent fallback
 * Tries sources in order: Binance -> Kraken -> DEXScreener -> CoinCap -> CoinGecko
 */
export class MultiSourceCryptoClient {
  private binance = new BinancePublicClient();
  private kraken = new KrakenPublicClient();
  private dexScreener = new DEXScreenerClient();
  private coinCap = new CoinCapClient();
  private coinGecko = new CoinGeckoClient();

  async getCurrentPrice(symbol: string): Promise<PriceData> {
    // Try Binance first (best free option, but may have geographic restrictions)
    try {
      return await this.binance.getCurrentPrice(symbol);
    } catch (binanceError: any) {
      console.warn('Binance failed, trying Kraken:', binanceError.message);

      // Try Kraken (no geographic restrictions)
      try {
        return await this.kraken.getCurrentPrice(symbol);
      } catch (krakenError: any) {
        console.warn('Kraken failed, trying DEXScreener:', krakenError.message);

        // Try DEXScreener (DEX listings from all chains)
        try {
          return await this.dexScreener.getCurrentPrice(symbol);
        } catch (dexScreenerError: any) {
          console.warn('DEXScreener failed, trying CoinCap:', dexScreenerError.message);

          // Try CoinCap
          try {
            return await this.coinCap.getCurrentPrice(symbol);
          } catch (coinCapError: any) {
            console.warn('CoinCap failed, trying CoinGecko:', coinCapError.message);

            // Last resort: CoinGecko
            try {
              return await this.coinGecko.getCurrentPrice(symbol);
            } catch (coinGeckoError: any) {
              throw new Error(
                `All crypto sources failed. Try switching to Stocks or Forex for unlimited data.`
              );
            }
          }
        }
      }
    }
  }

  async getHistoricalData(symbol: string, days: number = 30, interval: string = '1d'): Promise<OHLCV[]> {
    // Try Binance first (best OHLCV data)
    try {
      return await this.binance.getHistoricalData(symbol, days, interval);
    } catch (binanceError: any) {
      console.warn('Binance historical failed, trying Kraken:', binanceError.message);

      // Try Kraken
      try {
        return await this.kraken.getHistoricalData(symbol, days, interval);
      } catch (krakenError: any) {
        console.warn('Kraken historical failed, trying DEXScreener:', krakenError.message);

        // Try DEXScreener (will likely fail as it doesn't support historical data)
        try {
          return await this.dexScreener.getHistoricalData(symbol, days, interval);
        } catch (dexScreenerError: any) {
          console.warn('DEXScreener historical failed, trying CoinCap:', dexScreenerError.message);

          // Try CoinCap
          try {
            return await this.coinCap.getHistoricalData(symbol, days, interval);
          } catch (coinCapError: any) {
            console.warn('CoinCap historical failed, trying CoinGecko:', coinCapError.message);

            // Last resort: CoinGecko (note: doesn't support interval parameter)
            try {
              return await this.coinGecko.getHistoricalData(symbol, days);
            } catch (coinGeckoError: any) {
              throw new Error(
                `All crypto sources failed for historical data. Try switching to Stocks or Forex for unlimited data.`
              );
            }
          }
        }
      }
    }
  }

  async searchSymbols(query: string): Promise<Symbol[]> {
    // Use both local crypto database AND DEXScreener for comprehensive search
    // This allows finding both major coins and DEX-only tokens

    // If no query, return top cryptocurrencies from local database
    if (!query || query.trim().length === 0) {
      const topCryptos = [
        'bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple', 'cardano',
        'dogecoin', 'avalanche-2', 'chainlink', 'polkadot', 'polygon',
        'shiba-inu', 'litecoin', 'uniswap', 'stellar', 'monero', 'near',
        'aptos', 'internet-computer', 'optimism', 'arbitrum'
      ];

      return topCryptos.map((id) => {
        const asset = searchCrypto(id, 1)[0];
        return {
          id: asset.id,
          symbol: asset.id,
          name: `${asset.name} (${asset.symbol})`,
          marketType: 'crypto' as const,
        };
      }).filter((asset) => asset !== undefined);
    }

    // Check if query is a contract address (starts with 0x and is 42 characters)
    const isContractAddress = /^0x[a-fA-F0-9]{40}$/.test(query.trim());

    if (isContractAddress) {
      // Search DEXScreener by contract address
      try {
        const contractResults = await this.dexScreener.searchByContractAddress(query.trim());
        return contractResults;
      } catch (error) {
        console.warn('DEXScreener contract search failed:', error);
        return [];
      }
    }

    // Search local database first (major cryptocurrencies)
    const localResults = searchCrypto(query, 30);
    const localSymbols: Symbol[] = localResults.map((asset) => ({
      id: asset.id,
      symbol: asset.id, // Use ID for API calls (bitcoin, ethereum, etc.)
      name: `${asset.name} (${asset.symbol})`,
      marketType: 'crypto' as const,
    }));

    // Also search DEXScreener for DEX-only tokens
    let dexResults: Symbol[] = [];
    try {
      dexResults = await this.dexScreener.searchSymbols(query);
    } catch (error) {
      console.warn('DEXScreener search failed:', error);
    }

    // Combine results, prioritizing local database matches
    // Remove duplicates based on symbol
    const combinedResults = [...localSymbols];
    const existingSymbols = new Set(localSymbols.map(s => s.symbol.toLowerCase()));

    for (const dexResult of dexResults) {
      if (!existingSymbols.has(dexResult.symbol.toLowerCase())) {
        combinedResults.push(dexResult);
      }
    }

    // Limit to 50 total results
    return combinedResults.slice(0, 50);
  }
}

export const multiSourceCryptoClient = new MultiSourceCryptoClient();
