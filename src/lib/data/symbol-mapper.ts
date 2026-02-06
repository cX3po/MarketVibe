// Symbol mapper to convert between different API formats
// CoinGecko/CoinCap use IDs like "bitcoin", Binance uses "BTC", Kraken uses "XXBTZUSD"

import { CRYPTO_DATABASE } from './crypto-database';

/**
 * Convert CoinGecko/CoinCap ID (e.g., "bitcoin") to Binance symbol (e.g., "BTC")
 */
export function idToSymbol(id: string): string {
  const normalized = id.toLowerCase();

  // First, check if it's already a short symbol
  const bySymbol = CRYPTO_DATABASE.find(
    (asset) => asset.symbol.toLowerCase() === normalized
  );
  if (bySymbol) {
    return bySymbol.symbol;
  }

  // Then check by ID
  const byId = CRYPTO_DATABASE.find((asset) => asset.id === normalized);
  if (byId) {
    return byId.symbol;
  }

  // Fallback: return uppercase (assume it's already a symbol)
  return id.toUpperCase();
}

/**
 * Convert Binance symbol (e.g., "BTC") to CoinGecko/CoinCap ID (e.g., "bitcoin")
 */
export function symbolToId(symbol: string): string {
  const normalized = symbol.toUpperCase();

  const asset = CRYPTO_DATABASE.find((asset) => asset.symbol === normalized);
  if (asset) {
    return asset.id;
  }

  // Fallback: return lowercase
  return symbol.toLowerCase();
}
