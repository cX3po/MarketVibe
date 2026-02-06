'use client';

// Market ticker showing major indices and crypto

import { useEffect, useState } from 'react';
import useSWR from 'swr';

interface TickerData {
  symbol: string;
  displayName: string;
  price: number;
  change: number;
  changePercent: number;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) return null;
  const data = await response.json();
  return data;
};

export function MarketTicker() {
  const [tickers, setTickers] = useState<TickerData[]>([]);

  // Fetch real indices (not ETFs) and crypto
  // Yahoo Finance supports index symbols with ^ prefix
  const { data: dowData } = useSWR('/api/stocks/%5EDJI?days=1&interval=1d', fetcher, { refreshInterval: 60000 });
  const { data: spData } = useSWR('/api/stocks/%5EGSPC?days=1&interval=1d', fetcher, { refreshInterval: 60000 });
  const { data: nasdaqData } = useSWR('/api/stocks/%5EIXIC?days=1&interval=1d', fetcher, { refreshInterval: 60000 });
  const { data: russellData } = useSWR('/api/stocks/%5ERUT?days=1&interval=1d', fetcher, { refreshInterval: 60000 });
  const { data: btcData } = useSWR('/api/crypto/bitcoin?days=1&interval=1d', fetcher, { refreshInterval: 60000 });
  const { data: ethData } = useSWR('/api/crypto/ethereum?days=1&interval=1d', fetcher, { refreshInterval: 60000 });

  useEffect(() => {
    const newTickers: TickerData[] = [];

    if (dowData?.price) {
      newTickers.push({
        symbol: 'DOW',
        displayName: 'Dow',
        price: dowData.price.currentPrice,
        change: dowData.price.priceChange,
        changePercent: dowData.price.priceChangePercent,
      });
    }

    if (spData?.price) {
      newTickers.push({
        symbol: 'S&P',
        displayName: 'S&P 500',
        price: spData.price.currentPrice,
        change: spData.price.priceChange,
        changePercent: spData.price.priceChangePercent,
      });
    }

    if (nasdaqData?.price) {
      newTickers.push({
        symbol: 'NDX',
        displayName: 'Nasdaq',
        price: nasdaqData.price.currentPrice,
        change: nasdaqData.price.priceChange,
        changePercent: nasdaqData.price.priceChangePercent,
      });
    }

    if (russellData?.price) {
      newTickers.push({
        symbol: 'RUT',
        displayName: 'Russell',
        price: russellData.price.currentPrice,
        change: russellData.price.priceChange,
        changePercent: russellData.price.priceChangePercent,
      });
    }

    if (btcData?.price) {
      newTickers.push({
        symbol: 'BTC',
        displayName: 'BTC',
        price: btcData.price.currentPrice,
        change: btcData.price.priceChange,
        changePercent: btcData.price.priceChangePercent,
      });
    }

    if (ethData?.price) {
      newTickers.push({
        symbol: 'ETH',
        displayName: 'ETH',
        price: ethData.price.currentPrice,
        change: ethData.price.priceChange,
        changePercent: ethData.price.priceChangePercent,
      });
    }

    setTickers(newTickers);
  }, [dowData, spData, nasdaqData, russellData, btcData, ethData]);

  if (tickers.length === 0) {
    return (
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-4 justify-between">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-2 animate-pulse flex-shrink-0">
                <div className="flex flex-col gap-1">
                  <div className="w-12 h-2.5 bg-gray-800 rounded"></div>
                  <div className="w-16 h-3.5 bg-gray-800 rounded"></div>
                </div>
                <div className="w-12 h-5 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center gap-4 justify-between overflow-x-auto scrollbar-hide">
          {tickers.map((ticker) => (
            <div
              key={ticker.symbol}
              className="flex items-center gap-2 min-w-fit flex-shrink-0"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide leading-tight">
                  {ticker.displayName}
                </span>
                <span className="text-sm font-bold text-white leading-tight">
                  ${ticker.price >= 1000
                    ? ticker.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                    : ticker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  }
                </span>
              </div>
              <div
                className={`flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                  ticker.changePercent >= 0
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-red-900/30 text-red-400'
                }`}
              >
                <span className="text-[10px]">
                  {ticker.changePercent >= 0 ? '▲' : '▼'}
                </span>
                <span>
                  {ticker.changePercent >= 0 ? '+' : ''}
                  {ticker.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
