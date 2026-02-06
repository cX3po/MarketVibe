'use client';

// Market type selector (Crypto / Stocks / Forex)

import { useMarketStore } from '@/store/market-store';
import { MarketType } from '@/types';

const MARKET_DEFAULTS: Record<MarketType, string> = {
  crypto: 'bitcoin',
  stocks: 'TSLA',
  forex: 'EURUSD',
  etf: 'SPY',
};

export function MarketTypeSelector() {
  const { marketType, setMarketType, setSelectedSymbol } = useMarketStore();

  const handleMarketChange = (type: MarketType) => {
    setMarketType(type);
    setSelectedSymbol(MARKET_DEFAULTS[type]);

    // Also ensure we're in CEX mode for crypto (not DEX)
    if (type === 'crypto') {
      const { setDataSource } = useMarketStore.getState();
      setDataSource('cex');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700">Market:</span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => handleMarketChange('crypto')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            marketType === 'crypto'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🪙 Crypto
        </button>
        <button
          onClick={() => handleMarketChange('stocks')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            marketType === 'stocks'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📈 Stocks
        </button>
        <button
          onClick={() => handleMarketChange('forex')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            marketType === 'forex'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          💱 Forex
        </button>
        <button
          onClick={() => handleMarketChange('etf')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            marketType === 'etf'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📊 ETFs
        </button>
      </div>
      {marketType === 'stocks' && (
        <span className="text-xs text-green-600 ml-2">
          ✅ Live Data - Yahoo Finance (Free)
        </span>
      )}
      {marketType === 'etf' && (
        <span className="text-xs text-green-600 ml-2">
          ✅ Live Data - Yahoo Finance (Free)
        </span>
      )}
      {marketType === 'forex' && (
        <span className="text-xs text-green-600 ml-2">
          ✅ Live Rates - ExchangeRate API (Free)
        </span>
      )}
      {marketType === 'crypto' && (
        <span className="text-xs text-amber-600 ml-2">
          ⚠️ CoinGecko (May have rate limits)
        </span>
      )}
    </div>
  );
}
