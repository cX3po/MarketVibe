// Market types for trading app

export type MarketType = 'crypto' | 'stocks' | 'forex' | 'etf';

export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceData {
  symbol: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap?: number;
  lastUpdated: number;
}

export interface Symbol {
  id: string;
  symbol: string;
  name: string;
  marketType: MarketType;
}

export interface TimeRange {
  label: string;
  value: string;
  days: number;
}

export interface MarketStats {
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap?: number;
  circulatingSupply?: number;
  totalSupply?: number;
}

// Unified interface for market data adapters
export interface MarketDataAdapter {
  getCurrentPrice(symbol: string): Promise<PriceData>;
  getHistoricalData(symbol: string, days: number): Promise<OHLCV[]>;
  searchSymbols(query: string): Promise<Symbol[]>;
}
