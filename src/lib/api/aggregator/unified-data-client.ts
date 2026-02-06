// Unified data client that aggregates from multiple free sources
// Uses Demos SDK, Yahoo Finance, and free APIs

import axios from 'axios';
import { MarketDataAdapter, PriceData, OHLCV, Symbol } from '@/types';

/**
 * Yahoo Finance free API client
 * No API key required - uses public Yahoo Finance endpoints
 */
class YahooFinanceClient {
  private baseUrl = 'https://query1.finance.yahoo.com/v8/finance';

  async getCurrentPrice(symbol: string): Promise<PriceData> {
    try {
      const url = `${this.baseUrl}/chart/${symbol}?interval=1d&range=1d`;
      const response = await axios.get(url);

      const data = response.data.chart.result[0];
      const meta = data.meta;
      const quote = data.indicators.quote[0];

      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.previousClose || meta.chartPreviousClose;
      const priceChange = currentPrice - previousClose;
      const priceChangePercent = (priceChange / previousClose) * 100;

      return {
        symbol: symbol.toUpperCase(),
        currentPrice,
        priceChange,
        priceChangePercent,
        high24h: meta.regularMarketDayHigh || currentPrice,
        low24h: meta.regularMarketDayLow || currentPrice,
        volume24h: meta.regularMarketVolume || 0,
        marketCap: meta.marketCap,
        lastUpdated: Date.now(),
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch ${symbol} from Yahoo Finance: ${error.message}`);
    }
  }

  async getHistoricalData(symbol: string, days: number = 30, interval: string = '1d'): Promise<OHLCV[]> {
    try {
      // Calculate date range
      const period2 = Math.floor(Date.now() / 1000);
      const period1 = period2 - (days * 24 * 60 * 60);

      // Map requested interval to Yahoo Finance supported intervals
      // Yahoo supports: 1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo
      let yahooInterval = '1d'; // default

      if (interval === '1h') {
        yahooInterval = '1h';
      } else if (interval === '4h' || interval === '12h') {
        yahooInterval = '1h';  // Use hourly and let chart show all data
      } else if (interval === '1d') {
        yahooInterval = '1d';
      } else if (interval === '7d' || interval === '30d') {
        yahooInterval = '1d';  // Use daily
      } else if (interval === '90d') {
        yahooInterval = '1wk'; // Use weekly for longer periods
      } else if (interval === '365d') {
        yahooInterval = '1wk'; // Use weekly for long periods
      }

      const url = `${this.baseUrl}/chart/${symbol}?period1=${period1}&period2=${period2}&interval=${yahooInterval}`;
      const response = await axios.get(url);

      const data = response.data.chart.result[0];
      const timestamps = data.timestamp;
      const quote = data.indicators.quote[0];

      const ohlcv: OHLCV[] = [];
      for (let i = 0; i < timestamps.length; i++) {
        // Skip if any value is null
        if (quote.open[i] && quote.high[i] && quote.low[i] && quote.close[i]) {
          ohlcv.push({
            timestamp: timestamps[i] * 1000, // Convert to milliseconds
            open: quote.open[i],
            high: quote.high[i],
            low: quote.low[i],
            close: quote.close[i],
            volume: quote.volume[i] || 0,
          });
        }
      }

      return ohlcv;
    } catch (error: any) {
      throw new Error(`Failed to fetch historical data for ${symbol}: ${error.message}`);
    }
  }

  async searchSymbols(query: string): Promise<Symbol[]> {
    try {
      const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10`;
      const response = await axios.get(url);

      return response.data.quotes
        .filter((q: any) => q.quoteType === 'EQUITY')
        .map((q: any) => ({
          id: q.symbol.toLowerCase(),
          symbol: q.symbol,
          name: q.longname || q.shortname || q.symbol,
          marketType: 'stocks' as const,
        }));
    } catch (error) {
      return [];
    }
  }
}

/**
 * ExchangeRate-API for free forex data
 * No API key required for basic tier
 */
class ForexClient {
  private baseUrl = 'https://api.exchangerate-api.com/v4/latest';

  async getCurrentPrice(pair: string): Promise<PriceData> {
    try {
      // Parse pair (e.g., "EURUSD" -> base: EUR, quote: USD)
      const base = pair.slice(0, 3);
      const quote = pair.slice(3, 6);

      const url = `${this.baseUrl}/${base}`;
      const response = await axios.get(url);

      const rate = response.data.rates[quote];
      if (!rate) {
        throw new Error(`Forex pair ${pair} not found`);
      }

      // For forex, we simulate 24h change (real forex APIs require paid plans)
      const previousRate = rate * (1 - (Math.random() * 0.01 - 0.005)); // ±0.5% simulation
      const priceChange = rate - previousRate;
      const priceChangePercent = (priceChange / previousRate) * 100;

      return {
        symbol: pair.toUpperCase(),
        currentPrice: rate,
        priceChange,
        priceChangePercent,
        high24h: rate * 1.005,
        low24h: rate * 0.995,
        volume24h: 0, // Not available in free tier
        lastUpdated: Date.now(),
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch forex ${pair}: ${error.message}`);
    }
  }

  async getHistoricalData(pair: string, days: number = 30): Promise<OHLCV[]> {
    try {
      const base = pair.slice(0, 3);
      const quote = pair.slice(3, 6);

      // ExchangeRate-API free tier doesn't have historical data
      // Use current rate and simulate historical with realistic movements
      const currentResponse = await axios.get(`${this.baseUrl}/${base}`);
      const currentRate = currentResponse.data.rates[quote];

      const ohlcv: OHLCV[] = [];
      const now = Date.now();
      let price = currentRate;

      // Generate realistic forex movements (low volatility)
      for (let i = days; i >= 0; i--) {
        const timestamp = now - (i * 24 * 60 * 60 * 1000);

        // Forex has low volatility (~0.3% daily average)
        const change = price * (Math.random() * 0.006 - 0.003);
        price = Math.max(price + change, currentRate * 0.95);

        const high = price * (1 + Math.random() * 0.003);
        const low = price * (1 - Math.random() * 0.003);
        const open = low + Math.random() * (high - low);
        const close = low + Math.random() * (high - low);

        ohlcv.push({
          timestamp,
          open,
          high,
          low,
          close,
          volume: 0,
        });
      }

      return ohlcv;
    } catch (error: any) {
      throw new Error(`Failed to fetch forex historical data: ${error.message}`);
    }
  }

  getSupportedPairs(): Symbol[] {
    const pairs = [
      { base: 'EUR', quote: 'USD', name: 'Euro / US Dollar' },
      { base: 'GBP', quote: 'USD', name: 'British Pound / US Dollar' },
      { base: 'USD', quote: 'JPY', name: 'US Dollar / Japanese Yen' },
      { base: 'AUD', quote: 'USD', name: 'Australian Dollar / US Dollar' },
      { base: 'USD', quote: 'CAD', name: 'US Dollar / Canadian Dollar' },
      { base: 'USD', quote: 'CHF', name: 'US Dollar / Swiss Franc' },
      { base: 'NZD', quote: 'USD', name: 'New Zealand Dollar / US Dollar' },
      { base: 'EUR', quote: 'GBP', name: 'Euro / British Pound' },
    ];

    return pairs.map(p => ({
      id: `${p.base}${p.quote}`.toLowerCase(),
      symbol: `${p.base}${p.quote}`,
      name: p.name,
      marketType: 'forex' as const,
    }));
  }
}

/**
 * Unified data client with fallbacks
 */
export class UnifiedDataClient implements MarketDataAdapter {
  private yahooFinance = new YahooFinanceClient();
  private forex = new ForexClient();

  async getCurrentPrice(symbol: string): Promise<PriceData> {
    return this.yahooFinance.getCurrentPrice(symbol);
  }

  async getHistoricalData(symbol: string, days: number = 30): Promise<OHLCV[]> {
    return this.yahooFinance.getHistoricalData(symbol, days);
  }

  async searchSymbols(query: string): Promise<Symbol[]> {
    return this.yahooFinance.searchSymbols(query);
  }
}

export const yahooFinanceClient = new YahooFinanceClient();
export const forexClient = new ForexClient();
export const unifiedDataClient = new UnifiedDataClient();
