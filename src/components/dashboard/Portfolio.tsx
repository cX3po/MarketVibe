'use client';

// Portfolio component for tracking holdings and performance

import { useState, useEffect } from 'react';
import { useMarketStore, PortfolioHolding } from '@/store/market-store';
import { MarketType } from '@/types';
import useSWR from 'swr';

interface HoldingWithPrice extends PortfolioHolding {
  currentPrice: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  loading: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Portfolio() {
  const {
    portfolioHoldings,
    addToPortfolio,
    removeFromPortfolio,
    setSelectedSymbol,
    setMarketType,
    setAppMode
  } = useMarketStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    marketType: 'stocks' as MarketType,
    quantity: '',
    purchasePrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  const [holdingsWithPrices, setHoldingsWithPrices] = useState<HoldingWithPrice[]>([]);

  // Autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Search API call with debounce for autocomplete
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const endpoint = `/api/${formData.marketType}/search?q=${encodeURIComponent(searchQuery)}`;
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.symbols) {
          setSearchResults(data.symbols);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, formData.marketType]);

  // Fetch current prices for all holdings
  useEffect(() => {
    const fetchPrices = async () => {
      const promises = portfolioHoldings.map(async (holding) => {
        try {
          const apiUrl = holding.marketType === 'stocks'
            ? `/api/stocks/${holding.symbol}?days=1&interval=1d`
            : holding.marketType === 'etf'
            ? `/api/etf/${holding.symbol}?days=1&interval=1d`
            : `/api/crypto/${holding.symbol}?days=1&interval=1d`;

          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error('Failed to fetch');

          const data = await response.json();
          const currentPrice = data.price.currentPrice;
          const currentValue = currentPrice * holding.quantity;
          const totalCost = holding.purchasePrice * holding.quantity;
          const totalGainLoss = currentValue - totalCost;
          const totalGainLossPercent = (totalGainLoss / totalCost) * 100;

          return {
            ...holding,
            currentPrice,
            currentValue,
            totalGainLoss,
            totalGainLossPercent,
            loading: false,
          };
        } catch (error) {
          return {
            ...holding,
            currentPrice: 0,
            currentValue: 0,
            totalGainLoss: 0,
            totalGainLossPercent: 0,
            loading: false,
          };
        }
      });

      const results = await Promise.all(promises);
      setHoldingsWithPrices(results);
    };

    if (portfolioHoldings.length > 0) {
      fetchPrices();
      // Refresh prices every 30 seconds
      const interval = setInterval(fetchPrices, 30000);
      return () => clearInterval(interval);
    } else {
      setHoldingsWithPrices([]);
    }
  }, [portfolioHoldings]);

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.symbol || !formData.name || !formData.quantity || !formData.purchasePrice) {
      alert('Please fill in all required fields');
      return;
    }

    addToPortfolio({
      symbol: formData.symbol,
      name: formData.name,
      marketType: formData.marketType,
      quantity: parseFloat(formData.quantity),
      purchasePrice: parseFloat(formData.purchasePrice),
      purchaseDate: formData.purchaseDate,
    });

    // Reset form
    setFormData({
      symbol: '',
      name: '',
      marketType: 'stocks',
      quantity: '',
      purchasePrice: '',
      purchaseDate: new Date().toISOString().split('T')[0],
    });
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setShowAddForm(false);
  };

  const handleSelectSearchResult = (result: any) => {
    setFormData({
      ...formData,
      symbol: result.symbol,
      name: result.name.replace(/\s*\([^)]*\)/, ''), // Remove parenthetical info
    });
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleSymbolChange = (value: string) => {
    setSearchQuery(value);
    setFormData({ ...formData, symbol: value });
  };

  const handleViewAsset = (holding: PortfolioHolding) => {
    setMarketType(holding.marketType);
    setSelectedSymbol(holding.symbol);
    setAppMode('trading');
  };

  const totalPortfolioValue = holdingsWithPrices.reduce((sum, h) => sum + h.currentValue, 0);
  const totalCost = portfolioHoldings.reduce((sum, h) => sum + (h.purchasePrice * h.quantity), 0);
  const totalGainLoss = totalPortfolioValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header with Portfolio Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>💼</span>
              My Portfolio
            </h2>
            <p className="text-blue-100 mt-2">
              Track your holdings and monitor performance
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2"
          >
            <span className="text-xl">{showAddForm ? '✕' : '+'}</span>
            {showAddForm ? 'Cancel' : 'Add Holding'}
          </button>
        </div>

        {/* Portfolio Summary Stats */}
        {holdingsWithPrices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-400/30">
            <div>
              <p className="text-sm text-blue-100 mb-1">Total Value</p>
              <p className="text-3xl font-bold">
                ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-100 mb-1">Total Cost</p>
              <p className="text-3xl font-bold">
                ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-100 mb-1">Total Gain/Loss</p>
              <p className={`text-3xl font-bold ${totalGainLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-lg ml-2">
                  ({totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%)
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Holding Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-blue-500">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Holding</h3>
          <form onSubmit={handleAddHolding} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Type *
                </label>
                <select
                  value={formData.marketType}
                  onChange={(e) => {
                    setFormData({ ...formData, marketType: e.target.value as MarketType, symbol: '', name: '' });
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowSearchResults(false);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="stocks">Stocks</option>
                  <option value="etf">ETF</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symbol {formData.marketType === 'crypto' && <span className="text-xs text-gray-500">(or Contract Address)</span>} *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.symbol}
                    onChange={(e) => handleSymbolChange(e.target.value)}
                    onFocus={() => {
                      if (searchResults.length > 0) setShowSearchResults(true);
                    }}
                    placeholder={formData.marketType === 'crypto' ? 'e.g., BTC or 0x...' : 'e.g., AAPL'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-3">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Autocomplete Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSearchResults(false)}
                    />
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSelectSearchResult(result)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{result.name}</div>
                          <div className="text-sm text-gray-500">{result.symbol}</div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Apple Inc., Bitcoin"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g., 10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Price (per unit) *
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  placeholder="e.g., 150.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date *
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowSearchResults(false);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add to Portfolio
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty State */}
      {holdingsWithPrices.length === 0 && !showAddForm && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your Portfolio is Empty</h3>
          <p className="text-gray-600 mb-6">
            Start tracking your investments by adding your first holding
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add First Holding
          </button>
        </div>
      )}

      {/* Holdings Table */}
      {holdingsWithPrices.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Asset</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Quantity</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Purchase Price</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Current Price</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Current Value</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">Gain/Loss</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {holdingsWithPrices.map((holding) => {
                  const totalCost = holding.purchasePrice * holding.quantity;

                  return (
                    <tr key={holding.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">{holding.name}</div>
                        <div className="text-sm text-gray-500">{holding.symbol.toUpperCase()}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Purchased: {new Date(holding.purchaseDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded uppercase">
                          {holding.marketType}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-gray-900">
                        {holding.quantity.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 8 })}
                      </td>
                      <td className="py-4 px-6 text-right text-gray-600">
                        ${holding.purchasePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <div className="text-xs text-gray-400">
                          Total: ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-gray-900">
                        ${holding.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-gray-900">
                        ${holding.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className={`font-bold ${holding.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.totalGainLoss >= 0 ? '+' : ''}${Math.abs(holding.totalGainLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className={`text-sm font-semibold ${holding.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.totalGainLoss >= 0 ? '+' : ''}{holding.totalGainLossPercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewAsset(holding)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                            title="View in Trading mode"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove ${holding.name} from portfolio?`)) {
                                removeFromPortfolio(holding.id);
                              }
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                            title="Remove from portfolio"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
