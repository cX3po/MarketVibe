'use client';

// AI Selection component that analyzes multiple assets and recommends top 5 based on vibe score

import { useState, useEffect } from 'react';
import { useMarketStore } from '@/store/market-store';
import { PriceData, OHLCV } from '@/types';
import { useIndicators } from '@/hooks/useIndicators';
import { useSentiment } from '@/hooks/useSentiment';

interface AssetAnalysis {
  symbol: string;
  name: string;
  marketType: string;
  vibeScore: number;
  vibeLabel: string;
  price: number;
  changePercent: number;
  loading: boolean;
  error?: string;
}

// Comprehensive market coverage for AI analysis
const ALL_STOCKS = [
  // Top 100 US Stocks by Market Cap
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'BRK-B', name: 'Berkshire Hathaway' },
  { symbol: 'TSM', name: 'Taiwan Semiconductor' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'UNH', name: 'UnitedHealth Group' },
  { symbol: 'XOM', name: 'Exxon Mobil' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' },
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'JPM', name: 'JPMorgan Chase' },
  { symbol: 'MA', name: 'Mastercard Inc.' },
  { symbol: 'PG', name: 'Procter & Gamble' },
  { symbol: 'HD', name: 'Home Depot' },
  { symbol: 'CVX', name: 'Chevron Corp.' },
  { symbol: 'ABBV', name: 'AbbVie Inc.' },
  { symbol: 'MRK', name: 'Merck & Co.' },
  { symbol: 'KO', name: 'Coca-Cola Co.' },
  { symbol: 'PEP', name: 'PepsiCo Inc.' },
  { symbol: 'COST', name: 'Costco Wholesale' },
  { symbol: 'AVGO', name: 'Broadcom Inc.' },
  { symbol: 'TMO', name: 'Thermo Fisher Scientific' },
  { symbol: 'ADBE', name: 'Adobe Inc.' },
  { symbol: 'MCD', name: 'McDonald\'s Corp.' },
  { symbol: 'CSCO', name: 'Cisco Systems' },
  { symbol: 'ACN', name: 'Accenture plc' },
  { symbol: 'ABT', name: 'Abbott Laboratories' },
  { symbol: 'NKE', name: 'Nike Inc.' },
  { symbol: 'TXN', name: 'Texas Instruments' },
  { symbol: 'CRM', name: 'Salesforce Inc.' },
  { symbol: 'LLY', name: 'Eli Lilly and Co.' },
  { symbol: 'ORCL', name: 'Oracle Corp.' },
  { symbol: 'DIS', name: 'Walt Disney Co.' },
  { symbol: 'INTC', name: 'Intel Corp.' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
  { symbol: 'QCOM', name: 'QUALCOMM Inc.' },
  { symbol: 'BA', name: 'Boeing Co.' },
  { symbol: 'GE', name: 'General Electric' },
  { symbol: 'IBM', name: 'IBM Corp.' },
  { symbol: 'PYPL', name: 'PayPal Holdings' },
  { symbol: 'CAT', name: 'Caterpillar Inc.' },
  { symbol: 'UPS', name: 'United Parcel Service' },
  { symbol: 'GS', name: 'Goldman Sachs Group' },
  { symbol: 'MS', name: 'Morgan Stanley' },
  { symbol: 'BAC', name: 'Bank of America' },
];

const ALL_ETFS = [
  // Major ETFs
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust' },
  { symbol: 'IWM', name: 'iShares Russell 2000' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market' },
  { symbol: 'VOO', name: 'Vanguard S&P 500' },
  { symbol: 'DIA', name: 'SPDR Dow Jones Industrial' },
  { symbol: 'EFA', name: 'iShares MSCI EAFE' },
  { symbol: 'VEA', name: 'Vanguard FTSE Developed' },
  { symbol: 'AGG', name: 'iShares Core US Aggregate Bond' },
  { symbol: 'BND', name: 'Vanguard Total Bond Market' },
  { symbol: 'GLD', name: 'SPDR Gold Trust' },
  { symbol: 'SLV', name: 'iShares Silver Trust' },
  { symbol: 'XLE', name: 'Energy Select Sector SPDR' },
  { symbol: 'XLF', name: 'Financial Select Sector SPDR' },
  { symbol: 'XLK', name: 'Technology Select Sector SPDR' },
  { symbol: 'XLV', name: 'Health Care Select Sector SPDR' },
  { symbol: 'XLI', name: 'Industrial Select Sector SPDR' },
  { symbol: 'XLP', name: 'Consumer Staples Select Sector' },
  { symbol: 'XLY', name: 'Consumer Discretionary Select' },
  { symbol: 'XLU', name: 'Utilities Select Sector SPDR' },
  { symbol: 'VNQ', name: 'Vanguard Real Estate' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond' },
  { symbol: 'HYG', name: 'iShares iBoxx High Yield Corp Bond' },
  { symbol: 'EEM', name: 'iShares MSCI Emerging Markets' },
  { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets' },
];

const ALL_CRYPTO = [
  // Top 50 Crypto by Market Cap
  { symbol: 'bitcoin', name: 'Bitcoin' },
  { symbol: 'ethereum', name: 'Ethereum' },
  { symbol: 'binancecoin', name: 'BNB' },
  { symbol: 'solana', name: 'Solana' },
  { symbol: 'ripple', name: 'XRP' },
  { symbol: 'cardano', name: 'Cardano' },
  { symbol: 'dogecoin', name: 'Dogecoin' },
  { symbol: 'avalanche-2', name: 'Avalanche' },
  { symbol: 'chainlink', name: 'Chainlink' },
  { symbol: 'polkadot', name: 'Polkadot' },
  { symbol: 'polygon', name: 'Polygon' },
  { symbol: 'shiba-inu', name: 'Shiba Inu' },
  { symbol: 'litecoin', name: 'Litecoin' },
  { symbol: 'uniswap', name: 'Uniswap' },
  { symbol: 'stellar', name: 'Stellar' },
  { symbol: 'monero', name: 'Monero' },
  { symbol: 'near', name: 'NEAR Protocol' },
  { symbol: 'aptos', name: 'Aptos' },
  { symbol: 'internet-computer', name: 'Internet Computer' },
  { symbol: 'optimism', name: 'Optimism' },
  { symbol: 'arbitrum', name: 'Arbitrum' },
  { symbol: 'vechain', name: 'VeChain' },
  { symbol: 'cosmos', name: 'Cosmos' },
  { symbol: 'ethereum-classic', name: 'Ethereum Classic' },
  { symbol: 'filecoin', name: 'Filecoin' },
  { symbol: 'hedera-hashgraph', name: 'Hedera' },
  { symbol: 'algorand', name: 'Algorand' },
  { symbol: 'the-graph', name: 'The Graph' },
  { symbol: 'aave', name: 'Aave' },
  { symbol: 'fantom', name: 'Fantom' },
  { symbol: 'eos', name: 'EOS' },
  { symbol: 'tezos', name: 'Tezos' },
  { symbol: 'flow', name: 'Flow' },
  { symbol: 'axie-infinity', name: 'Axie Infinity' },
  { symbol: 'immutable-x', name: 'Immutable' },
  { symbol: 'apecoin', name: 'ApeCoin' },
  { symbol: 'chiliz', name: 'Chiliz' },
  { symbol: 'pancakeswap-token', name: 'PancakeSwap' },
  { symbol: 'neo', name: 'NEO' },
  { symbol: 'gala', name: 'Gala' },
  { symbol: 'mina-protocol', name: 'Mina Protocol' },
  { symbol: 'fetch-ai', name: 'Fetch.ai' },
  { symbol: 'injective-protocol', name: 'Injective' },
  { symbol: 'render-token', name: 'Render Token' },
  { symbol: 'lido-dao', name: 'Lido DAO' },
  { symbol: 'compound-governance-token', name: 'Compound' },
  { symbol: 'enjincoin', name: 'Enjin Coin' },
  { symbol: 'zilliqa', name: 'Zilliqa' },
  { symbol: 'basic-attention-token', name: 'Basic Attention Token' },
  { symbol: 'sushi', name: 'Sushi' },
];

export function AISelection() {
  const { setSelectedSymbol, setMarketType, setAppMode } = useMarketStore();
  const [analyses, setAnalyses] = useState<AssetAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);
  const [selectedMarkets, setSelectedMarkets] = useState({
    stocks: true,
    etfs: true,
    crypto: true,
  });
  const [analysisLimit, setAnalysisLimit] = useState<number | 'all'>(50);

  useEffect(() => {
    analyzeAssets();
  }, []);

  const analyzeAssets = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    const results: AssetAnalysis[] = [];

    // Build asset list based on selected markets
    let assetsToAnalyze: { symbol: string; name: string; marketType: string }[] = [];

    if (selectedMarkets.stocks) {
      assetsToAnalyze = assetsToAnalyze.concat(
        ALL_STOCKS.map(s => ({ ...s, marketType: 'stocks' }))
      );
    }
    if (selectedMarkets.etfs) {
      assetsToAnalyze = assetsToAnalyze.concat(
        ALL_ETFS.map(s => ({ ...s, marketType: 'etf' }))
      );
    }
    if (selectedMarkets.crypto) {
      assetsToAnalyze = assetsToAnalyze.concat(
        ALL_CRYPTO.map(s => ({ ...s, marketType: 'crypto' }))
      );
    }

    // Apply limit
    if (analysisLimit !== 'all') {
      assetsToAnalyze = assetsToAnalyze.slice(0, analysisLimit);
    }

    setTotalAssets(assetsToAnalyze.length);

    // Batch process assets (5 at a time to avoid overwhelming APIs)
    const batchSize = 5;
    for (let i = 0; i < assetsToAnalyze.length; i += batchSize) {
      const batch = assetsToAnalyze.slice(i, i + batchSize);

      const batchPromises = batch.map(async (asset) => {
        try {
          const apiUrl = asset.marketType === 'stocks'
            ? `/api/stocks/${asset.symbol}?days=30&interval=1d`
            : asset.marketType === 'etf'
            ? `/api/etf/${asset.symbol}?days=30&interval=1d`
            : `/api/crypto/${asset.symbol}?days=30&interval=1d`;

          const response = await fetch(apiUrl);
          if (!response.ok) throw new Error('API error');

          const data = await response.json();
          const priceData: PriceData = data.price;
          const historicalData: OHLCV[] = data.history;

          const vibeScore = calculateVibeScore(historicalData, priceData.currentPrice);

          return {
            symbol: asset.symbol,
            name: asset.name,
            marketType: asset.marketType,
            vibeScore: vibeScore.score,
            vibeLabel: vibeScore.label,
            price: priceData.currentPrice,
            changePercent: priceData.priceChangePercent,
            loading: false,
          };
        } catch (error) {
          return null; // Skip failed assets
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(r => r !== null) as AssetAnalysis[]);

      setProgress(Math.min(i + batchSize, assetsToAnalyze.length));
      setAnalyses([...results].sort((a, b) => b.vibeScore - a.vibeScore));
    }

    // Final sort by vibe score
    results.sort((a, b) => b.vibeScore - a.vibeScore);
    setAnalyses(results);
    setIsAnalyzing(false);
  };

  const calculateVibeScore = (historicalData: OHLCV[], currentPrice: number) => {
    if (historicalData.length < 10) {
      return { score: 50, label: 'Neutral' };
    }

    // Calculate momentum-based vibe score
    const recentData = historicalData.slice(-20);

    // 1. Price momentum (30 days vs 10 days)
    const price30dAgo = historicalData[Math.max(0, historicalData.length - 30)]?.close || recentData[0].close;
    const price10dAgo = recentData[Math.max(0, recentData.length - 10)]?.close || recentData[0].close;
    const priceNow = recentData[recentData.length - 1].close;

    const momentum30d = ((priceNow - price30dAgo) / price30dAgo) * 100;
    const momentum10d = ((priceNow - price10dAgo) / price10dAgo) * 100;

    // 2. Volume trend (increasing = bullish)
    const recentVolume = recentData.slice(-5).reduce((sum, d) => sum + d.volume, 0) / 5;
    const olderVolume = recentData.slice(-15, -10).reduce((sum, d) => sum + d.volume, 0) / 5;
    const volumeTrend = olderVolume > 0 ? ((recentVolume - olderVolume) / olderVolume) * 100 : 0;

    // 3. Volatility (lower = better for score)
    const prices = recentData.map(d => d.close);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance) / avgPrice * 100;

    // Composite score calculation
    let score = 50; // Start neutral

    // Momentum contribution (40%)
    score += (momentum30d * 2); // Long-term momentum
    score += (momentum10d * 2); // Short-term momentum

    // Volume contribution (20%)
    score += (volumeTrend * 0.5);

    // Volatility penalty (10%)
    score -= (volatility * 0.5);

    // Recent trend direction (30%)
    const last5Closes = recentData.slice(-5).map(d => d.close);
    let upDays = 0;
    for (let i = 1; i < last5Closes.length; i++) {
      if (last5Closes[i] > last5Closes[i - 1]) upDays++;
    }
    const trendScore = (upDays / 4) * 30; // 0-30 points
    score += trendScore;

    // Clamp to 0-100
    score = Math.max(0, Math.min(100, score));

    // Determine label
    let label = 'Neutral';
    if (score >= 75) label = 'Strong Bullish';
    else if (score >= 60) label = 'Bullish';
    else if (score <= 25) label = 'Strong Bearish';
    else if (score <= 40) label = 'Bearish';

    return { score, label };
  };

  const handleSelectAsset = (asset: AssetAnalysis) => {
    setMarketType(asset.marketType as any);
    setSelectedSymbol(asset.symbol);
    setAppMode('trading'); // Switch to trading mode to view the asset
  };

  const topPicks = analyses.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span>🤖</span>
                AI-Powered Asset Selection
              </h2>
              <p className="text-blue-100 mt-2">
                Analyzes entire market to find top assets with the strongest vibe score
              </p>
            </div>
            <button
              onClick={analyzeAssets}
              disabled={isAnalyzing}
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                '🔄 Start Analysis'
              )}
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-blue-400/30">
            {/* Market Selection */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-blue-100">Analyze:</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedMarkets.stocks}
                  onChange={(e) => setSelectedMarkets({ ...selectedMarkets, stocks: e.target.checked })}
                  className="w-4 h-4 rounded"
                  disabled={isAnalyzing}
                />
                <span className="text-sm">Stocks ({ALL_STOCKS.length})</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedMarkets.etfs}
                  onChange={(e) => setSelectedMarkets({ ...selectedMarkets, etfs: e.target.checked })}
                  className="w-4 h-4 rounded"
                  disabled={isAnalyzing}
                />
                <span className="text-sm">ETFs ({ALL_ETFS.length})</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedMarkets.crypto}
                  onChange={(e) => setSelectedMarkets({ ...selectedMarkets, crypto: e.target.checked })}
                  className="w-4 h-4 rounded"
                  disabled={isAnalyzing}
                />
                <span className="text-sm">Crypto ({ALL_CRYPTO.length})</span>
              </label>
            </div>

            {/* Limit Selection */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-blue-100">Limit:</span>
              <select
                value={analysisLimit}
                onChange={(e) => setAnalysisLimit(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-3 py-1 rounded bg-white/20 text-white border border-white/30 text-sm"
                disabled={isAnalyzing}
              >
                <option value={25}>Top 25</option>
                <option value={50}>Top 50</option>
                <option value={100}>Top 100</option>
                <option value="all">All Assets</option>
              </select>
            </div>
          </div>

          {/* Progress Bar */}
          {isAnalyzing && (
            <div className="pt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Analyzing assets...</span>
                <span className="font-semibold">{progress} / {totalAssets}</span>
              </div>
              <div className="w-full bg-blue-900/30 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-white h-3 transition-all duration-300 rounded-full"
                  style={{ width: `${(progress / totalAssets) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* Top 5 Assets */}
      {!isAnalyzing && topPicks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topPicks.map((asset, index) => (
            <button
              key={asset.symbol}
              onClick={() => handleSelectAsset(asset)}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all text-left border-2 hover:border-blue-500 relative overflow-hidden group"
            >
              {/* Rank badge */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                #{index + 1}
              </div>

              {/* Asset Info */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {asset.marketType}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{asset.name}</h3>
                <p className="text-sm text-gray-600">{asset.symbol.toUpperCase()}</p>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-900">
                  ${asset.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div
                  className={`text-sm font-semibold ${
                    asset.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {asset.changePercent >= 0 ? '+' : ''}
                  {asset.changePercent.toFixed(2)}%
                </div>
              </div>

              {/* Vibe Score */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Vibe Score</span>
                  <span className="text-lg font-bold text-blue-600">
                    {asset.vibeScore.toFixed(0)}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      asset.vibeScore >= 70
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : asset.vibeScore >= 60
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                        : asset.vibeScore >= 40
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        : 'bg-gradient-to-r from-red-500 to-rose-500'
                    }`}
                    style={{ width: `${asset.vibeScore}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-1 font-medium">
                  {asset.vibeLabel}
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
            </button>
          ))}
        </div>
      )}

      {/* All analyzed assets table */}
      {!isAnalyzing && analyses.length > 5 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            All Analyzed Assets ({analyses.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Asset</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Change</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Vibe Score</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((asset, index) => (
                  <tr
                    key={asset.symbol}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-gray-600">#{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{asset.name}</div>
                      <div className="text-sm text-gray-500">{asset.symbol.toUpperCase()}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded uppercase font-medium text-gray-600">
                        {asset.marketType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${asset.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-blue-600">{asset.vibeScore.toFixed(0)}</span>
                      <span className="text-sm text-gray-500 ml-1">/ 100</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleSelectAsset(asset)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
