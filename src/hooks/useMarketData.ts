// Hook for fetching market data with SWR

import useSWR from 'swr';
import { PriceData, OHLCV } from '@/types';
import { DataSource } from '@/store/market-store';

interface MarketDataResponse {
  price: PriceData;
  history: OHLCV[];
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch data');
  }
  return response.json();
};

export function useMarketData(
  symbol: string,
  days: number = 30,
  source: DataSource = 'cex',
  marketType?: string,
  interval?: string
) {
  // Use longer refresh interval for DEX data (2 minutes) due to rate limits
  const updateInterval = source === 'dex' ? 120000 : (Number(process.env.NEXT_PUBLIC_UPDATE_INTERVAL) || 30000);

  // Build API URL based on market type and data source
  let apiUrl: string | null = null;
  if (symbol) {
    const intervalParam = interval ? `&interval=${interval}` : '';
    if (marketType === 'stocks') {
      apiUrl = `/api/stocks/${symbol}?days=${days}${intervalParam}`;
    } else if (marketType === 'forex') {
      apiUrl = `/api/forex/${symbol}?days=${days}${intervalParam}`;
    } else if (marketType === 'etf') {
      apiUrl = `/api/etf/${symbol}?days=${days}${intervalParam}`;
    } else {
      // Default to crypto
      apiUrl = source === 'cex'
        ? `/api/crypto/${symbol}?days=${days}${intervalParam}`
        : `/api/dex/${symbol}?days=${days}${intervalParam}`;
    }
  }

  const { data, error, isLoading, mutate } = useSWR<MarketDataResponse>(
    apiUrl,
    fetcher,
    {
      refreshInterval: updateInterval,
      revalidateOnFocus: false, // Disable revalidate on focus to reduce API calls
      dedupingInterval: source === 'dex' ? 60000 : 10000, // Longer deduping for DEX
      onError: (err) => {
        console.error('Error fetching market data:', err);
      },
      // Retry with exponential backoff for rate limit errors
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Don't retry if 429 (rate limit)
        if (error.message.includes('429')) {
          console.warn('Rate limit hit, will retry after cache expires');
          return;
        }
        // Max 3 retries
        if (retryCount >= 3) return;
        // Exponential backoff
        setTimeout(() => revalidate({ retryCount }), 5000 * Math.pow(2, retryCount));
      },
    }
  );

  return {
    priceData: data?.price,
    historicalData: data?.history || [],
    isLoading,
    error,
    refresh: mutate,
  };
}
