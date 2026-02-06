'use client';

// Symbol/Asset selector dropdown with search

import { useState, useEffect, useRef } from 'react';
import { useMarketStore } from '@/store/market-store';
import { MarketType } from '@/types';

// Popular symbols for each market type
const POPULAR_SYMBOLS: Record<MarketType, { symbol: string; name: string }[]> = {
  crypto: [
    { symbol: 'bitcoin', name: 'Bitcoin (BTC)' },
    { symbol: 'ethereum', name: 'Ethereum (ETH)' },
    { symbol: 'binancecoin', name: 'BNB (BNB)' },
    { symbol: 'solana', name: 'Solana (SOL)' },
    { symbol: 'ripple', name: 'XRP (XRP)' },
    { symbol: 'cardano', name: 'Cardano (ADA)' },
    { symbol: 'dogecoin', name: 'Dogecoin (DOGE)' },
    { symbol: 'avalanche-2', name: 'Avalanche (AVAX)' },
    { symbol: 'chainlink', name: 'Chainlink (LINK)' },
    { symbol: 'polkadot', name: 'Polkadot (DOT)' },
    { symbol: 'polygon', name: 'Polygon (MATIC)' },
    { symbol: 'shiba-inu', name: 'Shiba Inu (SHIB)' },
    { symbol: 'litecoin', name: 'Litecoin (LTC)' },
    { symbol: 'uniswap', name: 'Uniswap (UNI)' },
    { symbol: 'stellar', name: 'Stellar (XLM)' },
    { symbol: 'monero', name: 'Monero (XMR)' },
  ],
  stocks: [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
    { symbol: 'BRK-B', name: 'Berkshire Hathaway' },
    { symbol: 'JPM', name: 'JPMorgan Chase' },
    { symbol: 'V', name: 'Visa Inc.' },
    { symbol: 'JNJ', name: 'Johnson & Johnson' },
    { symbol: 'WMT', name: 'Walmart Inc.' },
  ],
  forex: [
    { symbol: 'EURUSD', name: 'EUR/USD' },
    { symbol: 'GBPUSD', name: 'GBP/USD' },
    { symbol: 'USDJPY', name: 'USD/JPY' },
    { symbol: 'AUDUSD', name: 'AUD/USD' },
    { symbol: 'USDCAD', name: 'USD/CAD' },
    { symbol: 'USDCHF', name: 'USD/CHF' },
    { symbol: 'NZDUSD', name: 'NZD/USD' },
    { symbol: 'EURGBP', name: 'EUR/GBP' },
  ],
  etf: [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust' },
    { symbol: 'IWM', name: 'iShares Russell 2000 ETF' },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF' },
    { symbol: 'VOO', name: 'Vanguard S&P 500 ETF' },
    { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF' },
    { symbol: 'EFA', name: 'iShares MSCI EAFE ETF' },
    { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF' },
    { symbol: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF' },
    { symbol: 'BND', name: 'Vanguard Total Bond Market ETF' },
    { symbol: 'GLD', name: 'SPDR Gold Trust' },
    { symbol: 'SLV', name: 'iShares Silver Trust' },
    { symbol: 'XLE', name: 'Energy Select Sector SPDR Fund' },
    { symbol: 'XLF', name: 'Financial Select Sector SPDR Fund' },
    { symbol: 'XLK', name: 'Technology Select Sector SPDR Fund' },
    { symbol: 'VNQ', name: 'Vanguard Real Estate ETF' },
  ],
};

interface SearchResult {
  id: string;
  symbol: string;
  name: string;
  marketType: MarketType;
}

export function SymbolSelector() {
  const { marketType, selectedSymbol, setSelectedSymbol } = useMarketStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const symbols = POPULAR_SYMBOLS[marketType];
  const currentSymbolData = symbols.find((s) => s.symbol === selectedSymbol);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search API call with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const endpoint = `/api/${marketType}/search?q=${encodeURIComponent(searchQuery)}`;
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.symbols) {
          setSearchResults(data.symbols);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, marketType]);

  // Filter popular symbols by search query (matches name or symbol)
  const filteredPopularSymbols = symbols.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.symbol.toLowerCase().includes(query)
    );
  });

  const handleSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    setIsOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900">
          {currentSymbolData?.name || selectedSymbol.toUpperCase()}
        </span>
        <span className="text-xs text-gray-500">
          ({selectedSymbol.toUpperCase()})
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay to close dropdown */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setSearchQuery('');
              setSearchResults([]);
            }}
          />

          {/* Dropdown menu */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-[500px] flex flex-col">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={marketType === 'crypto' ? 'Search name, symbol, or paste 0x address...' : `Search ${marketType}...`}
                  className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {isSearching && (
                  <div className="absolute right-3 top-2.5">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="overflow-y-auto flex-1">
              {searchQuery.trim() && searchResults.length > 0 && (
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                    Search Results
                  </div>
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.symbol)}
                      className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                        selectedSymbol === item.symbol ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.symbol.toUpperCase()}</div>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.trim() && !isSearching && searchResults.length === 0 && (
                <div className="p-4 text-center text-sm text-gray-500">
                  No results found for "{searchQuery}"
                </div>
              )}

              {/* Popular Symbols */}
              {(filteredPopularSymbols.length > 0 || !searchQuery.trim()) && (
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">
                    {searchQuery.trim() ? 'Popular Matches' : `Popular ${marketType === 'crypto' ? 'Cryptocurrencies' : marketType === 'stocks' ? 'Stocks' : marketType === 'etf' ? 'ETFs' : 'Forex Pairs'}`}
                  </div>
                  {filteredPopularSymbols.map((item) => (
                    <button
                      key={item.symbol}
                      onClick={() => handleSelect(item.symbol)}
                      className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                        selectedSymbol === item.symbol ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.symbol.toUpperCase()}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
