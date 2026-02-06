'use client';

// Main dashboard page

import { useState, useEffect } from 'react';
import { PriceChartWithIndicators } from '@/components/charts/PriceChartWithIndicators';
import { VolumeChart } from '@/components/charts/VolumeChart';
import { RSIChart } from '@/components/charts/RSIChart';
import { MACDChart } from '@/components/charts/MACDChart';
import { StochasticChart } from '@/components/charts/StochasticChart';
import { CCIChart } from '@/components/charts/CCIChart';
import { WilliamsRChart } from '@/components/charts/WilliamsRChart';
import { ADXChart } from '@/components/charts/ADXChart';
import { TimeRangeSelector } from '@/components/dashboard/TimeRangeSelector';
import { MarketSourceSelector } from '@/components/dashboard/MarketSourceSelector';
import { MarketTypeSelector } from '@/components/dashboard/MarketTypeSelector';
import { SymbolSelector } from '@/components/dashboard/SymbolSelector';
import { IndicatorToggle, VisibleIndicators } from '@/components/dashboard/IndicatorToggle';
import { ChartLegend } from '@/components/charts/ChartLegend';
import { IndicatorPanel } from '@/components/indicators/IndicatorPanel';
import { SentimentPanel } from '@/components/sentiment/SentimentPanel';
import { MarketTicker } from '@/components/dashboard/MarketTicker';
import { ModeSelector } from '@/components/dashboard/ModeSelector';
import { AISelection } from '@/components/dashboard/AISelection';
import { Portfolio } from '@/components/dashboard/Portfolio';
import { Tooltip } from '@/components/ui/Tooltip';
import { useMarketStore } from '@/store/market-store';
import { useChartStore } from '@/store/chart-store';
import { useMarketData } from '@/hooks/useMarketData';
import { useIndicators } from '@/hooks/useIndicators';
import { useSentiment } from '@/hooks/useSentiment';

export default function HomePage() {
  const { selectedSymbol, dataSource, marketType, appMode } = useMarketStore();
  const { timeRange } = useChartStore();
  const { priceData, historicalData, isLoading, error } = useMarketData(
    selectedSymbol,
    timeRange.days,
    dataSource,
    marketType,
    timeRange.value // Pass interval value (1h, 4h, 1d, etc.)
  );
  const indicators = useIndicators(historicalData);
  const vibeScore = useSentiment(indicators, historicalData, priceData?.currentPrice);

  // State for visible indicators on chart
  // Default: Show all indicators used in Vibe Score calculation
  const [visibleIndicators, setVisibleIndicators] = useState<VisibleIndicators>({
    sma20: true,   // Used in Vibe Score (MA position)
    sma50: true,   // Used in Vibe Score (MA position)
    sma200: true,  // Used in Vibe Score (MA position)
    ema20: false,
    ema50: false,
    bb: true,      // Used in Vibe Score (BB position)
  });

  // State for current time (client-side only to avoid hydration mismatch)
  const [currentTime, setCurrentTime] = useState('');

  // Update time every second on client side only
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString());
    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Trading Dashboard</h1>
              <p className="text-sm text-blue-100 mt-1">Technical Analysis & Market Vibe Sentiment</p>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              {/* MarketVibe Branding */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-white tracking-tight">MarketVibe</div>
                  <div className="text-xs text-blue-100">Technical Analysis Platform</div>
                </div>
              </div>

              {/* Powered by Demos.network */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-blue-100">Powered by</span>
                <Tooltip
                  title="Demos Network Integration"
                  content="This trading dashboard is powered by the Demos Network SDK, which provides advanced market data aggregation, real-time price feeds across multiple chains and exchanges, and sophisticated technical analysis tools. The SDK enables seamless access to comprehensive market data from stocks, ETFs, and cryptocurrencies, allowing for unified cross-market analysis and intelligent asset selection based on momentum, volume trends, and technical indicators."
                  learnOnly={false}
                  position="bottom"
                >
                  <a
                    href="https://demos.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-bold hover:text-blue-100 transition-colors cursor-help border-b-2 border-dotted border-blue-300"
                  >
                    demos.network
                  </a>
                </Tooltip>
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-100">Live Market Data</div>
                <div className="text-sm font-semibold text-white">
                  {currentTime || '--:--:-- --'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Market Ticker */}
      <MarketTicker />

      {/* Mode Selector */}
      <ModeSelector />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* AI Selection Mode */}
        {appMode === 'ai-selection' && <AISelection />}

        {/* Portfolio Mode */}
        {appMode === 'portfolio' && <Portfolio />}

        {/* Demos Wallet Mode - Coming Soon */}
        {appMode === 'demos-wallet' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-2xl p-12 text-center border-2 border-blue-200">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
                  <span className="text-5xl">🔐</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Demos Wallet</h2>
                <div className="inline-block bg-yellow-100 border-2 border-yellow-400 rounded-full px-6 py-2 mb-6">
                  <span className="text-yellow-800 font-bold text-lg">🚧 Coming Soon</span>
                </div>
              </div>

              <div className="space-y-6 text-left max-w-2xl mx-auto">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Connect your <strong>Demos Network wallet</strong> to unlock powerful blockchain trading features directly within MarketVibe.
                </p>

                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Features:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">Multi-chain wallet integration (EVM, Solana, Bitcoin, TON, NEAR)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">Real-time portfolio tracking across all chains</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">Execute trades directly from the dashboard</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">Cross-chain swaps and transfers</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 text-xl">✓</span>
                      <span className="text-gray-700">Transaction history and analytics</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-100 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <p className="text-blue-900 font-medium">
                    <span className="font-bold">Stay tuned!</span> This feature is powered by the Demos Network SDK and will be available soon.
                  </p>
                </div>

                <div className="pt-4">
                  <a
                    href="https://demos.network"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <span>Learn More About Demos Network</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trading/Learning Mode */}
        {(appMode === 'trading' || appMode === 'learning') && (
          <>
            {/* Market Type & Symbol Selector */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <MarketTypeSelector />
                <SymbolSelector />
              </div>
            </div>

        {/* Market Source Selector (only for crypto) - Hidden for now, DEX needs work */}
        {false && marketType === 'crypto' && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <MarketSourceSelector />
          </div>
        )}

        {/* Price Display */}
        {priceData && (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{priceData.symbol}</h2>
                <p className="text-5xl font-bold text-gray-900 mt-1">
                  ${priceData.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${priceData.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceData.priceChange >= 0 ? '↗' : '↘'} {priceData.priceChange >= 0 ? '+' : ''}
                  ${Math.abs(priceData.priceChange).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className={`text-lg font-semibold ${priceData.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceData.priceChangePercent >= 0 ? '+' : ''}
                  {priceData.priceChangePercent.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Market Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">24h High</p>
                <p className="text-xl font-bold text-green-600 mt-1">
                  ${priceData.high24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">24h Low</p>
                <p className="text-xl font-bold text-red-600 mt-1">
                  ${priceData.low24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">24h Volume</p>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  ${(priceData.volume24h / 1e9).toFixed(2)}B
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Market Cap</p>
                <p className="text-xl font-bold text-purple-600 mt-1">
                  ${priceData.marketCap ? (priceData.marketCap / 1e9).toFixed(2) + 'B' : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-lg p-8 mb-6 border border-gray-100">
            <div className="animate-pulse space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-14 bg-gray-300 rounded w-64"></div>
                </div>
                <div className="space-y-3 text-right">
                  <div className="h-10 bg-gray-200 rounded w-40"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center justify-center mt-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <span className="ml-3 text-gray-500 font-medium">Loading market data...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-red-800 font-bold text-lg">Error loading data</h3>
                <p className="text-red-700 text-sm mt-2 font-medium">{error.message}</p>
                {(error.message.includes('429') || error.message.includes('401')) && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="font-bold text-amber-900 flex items-center gap-2">
                      <span>⚠️</span> {error.message.includes('401') ? 'API Authentication Required' : 'Rate limit reached'}
                    </p>
                    <p className="mt-2 text-amber-800">
                      {error.message.includes('401')
                        ? 'CoinGecko may require an API key for this request.'
                        : 'The API has rate limits.'}
                      {' '}Try:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-amber-800">
                      <li>Switch to <strong>"📈 Stocks"</strong> or <strong>"💱 Forex"</strong> (no rate limits!)</li>
                      <li>Wait 2-3 minutes and refresh the page</li>
                      <li>Use stocks/forex for unlimited real-time data</li>
                    </ul>
                  </div>
                )}
                {error.message.includes('404') && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="font-bold text-amber-900 flex items-center gap-2">
                      <span>⚠️</span> Asset not found
                    </p>
                    <p className="mt-2 text-amber-800">Try:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-amber-800">
                      <li>Select a different symbol from the dropdown</li>
                      <li>Switch to a different market type</li>
                      <li>Check the symbol name is correct</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        {!isLoading && !error && historicalData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Charts Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Time Range Selector */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700">Timeframe</h3>
                  <TimeRangeSelector />
                </div>
              </div>

              {/* Indicator Toggle */}
              <IndicatorToggle
                visibleIndicators={visibleIndicators}
                onToggle={setVisibleIndicators}
              />

              {/* Price Chart with Overlays */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Price Chart
                  {Object.values(visibleIndicators).some(v => v) && (
                    <span className="ml-2 text-sm text-gray-500 font-normal">
                      with {Object.values(visibleIndicators).filter(Boolean).length} overlay{Object.values(visibleIndicators).filter(Boolean).length > 1 ? 's' : ''}
                    </span>
                  )}
                </h3>
                {/* Legend showing active indicators */}
                <ChartLegend visibleIndicators={visibleIndicators} />

                <PriceChartWithIndicators
                  data={historicalData}
                  sma={indicators.sma}
                  ema={indicators.ema}
                  bollingerBands={indicators.bb}
                  chartType="candlestick"
                  height={500}
                  interval={timeRange.value}
                  visibleIndicators={visibleIndicators}
                />
              </div>

              {/* Volume Chart */}
              <Tooltip
                title="Trading Volume"
                content="Volume shows the number of shares/coins traded in each period. Green bars indicate price increased (buying pressure), red bars indicate price decreased (selling pressure). High volume confirms price moves - a breakout with high volume is more reliable. Low volume suggests weak conviction in the price movement."
                learnMoreUrl="https://www.investopedia.com/terms/v/volume.asp"
              >
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume</h3>
                  <VolumeChart data={historicalData} height={150} interval={timeRange.value} />
                </div>
              </Tooltip>

              {/* RSI Chart */}
              {indicators.rsi && indicators.rsi.length > 0 && (
                <Tooltip
                  title="RSI (Relative Strength Index)"
                  content="RSI measures momentum on a scale of 0-100. Above 70 indicates overbought conditions (price may drop), below 30 indicates oversold conditions (price may rise). RSI divergence from price can signal trend reversals. The 14-period default is most common for daily trading."
                  learnMoreUrl="https://www.investopedia.com/terms/r/rsi.asp"
                >
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">RSI (14)</h3>
                    <RSIChart data={indicators.rsi} height={150} />
                  </div>
                </Tooltip>
              )}

              {/* MACD Chart */}
              {indicators.macd && indicators.macd.length > 0 && (
                <Tooltip
                  title="MACD (Moving Average Convergence Divergence)"
                  content="MACD shows the relationship between two moving averages (12 & 26 period). The MACD line crossing above the signal line (9 period) is bullish, crossing below is bearish. The histogram shows the difference between MACD and signal line. Larger histograms indicate stronger momentum."
                  learnMoreUrl="https://www.investopedia.com/terms/m/macd.asp"
                >
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">MACD (12, 26, 9)</h3>
                    <MACDChart data={indicators.macd} height={150} />
                  </div>
                </Tooltip>
              )}

              {/* Stochastic Chart */}
              {indicators.stochastic && indicators.stochastic.length > 0 && (
                <Tooltip
                  title="Stochastic Oscillator"
                  content="Stochastic compares closing price to price range over 14 periods. %K (fast line) and %D (slow signal line) range from 0-100. Above 80 is overbought, below 20 is oversold. Look for %K crossing %D for buy/sell signals. Divergence from price can indicate reversals."
                  learnMoreUrl="https://www.investopedia.com/terms/s/stochasticoscillator.asp"
                >
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Stochastic (14, 3)</h3>
                    <StochasticChart data={indicators.stochastic} height={150} />
                  </div>
                </Tooltip>
              )}

              {/* ADX Chart */}
              {indicators.adx && indicators.adx.length > 0 && (
                <Tooltip
                  title="ADX (Average Directional Index)"
                  content="ADX measures trend strength (not direction) from 0-100. Above 25 indicates a strong trend, below 20 is a weak/ranging market. +DI (green) and -DI (red) show trend direction. +DI above -DI = uptrend, -DI above +DI = downtrend. Use ADX to confirm if trends are worth trading."
                  learnMoreUrl="https://www.investopedia.com/terms/a/adx.asp"
                >
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">ADX (14)</h3>
                    <ADXChart data={indicators.adx} height={150} />
                  </div>
                </Tooltip>
              )}

              {/* CCI Chart */}
              {indicators.cci && indicators.cci.length > 0 && (
                <Tooltip
                  title="CCI (Commodity Channel Index)"
                  content="CCI measures price deviation from average price. Most values fall between -100 and +100. Above +100 indicates overbought (possible pullback), below -100 indicates oversold (possible bounce). CCI works well in trending and ranging markets. Originally designed for commodities but works for all assets."
                  learnMoreUrl="https://www.investopedia.com/terms/c/commoditychannelindex.asp"
                >
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">CCI (20)</h3>
                    <CCIChart data={indicators.cci} height={150} />
                  </div>
                </Tooltip>
              )}

              {/* Williams %R Chart */}
              {indicators.williamsr && indicators.williamsr.length > 0 && (
                <Tooltip
                  title="Williams %R (Williams Percent Range)"
                  content="Williams %R is a momentum oscillator ranging from 0 to -100. Above -20 indicates overbought conditions, below -80 indicates oversold conditions. Similar to Stochastic but with inverted scale. Readings near -100 suggest price is at the low end of its range, near 0 suggests it's at the high end."
                  learnMoreUrl="https://www.investopedia.com/terms/w/williamsr.asp"
                >
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Williams %R (14)</h3>
                    <WilliamsRChart data={indicators.williamsr} height={150} />
                  </div>
                </Tooltip>
              )}
            </div>

            {/* Indicators & Sentiment Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Market Vibe Score */}
                <Tooltip
                  title="Market Vibe Score"
                  content="The Vibe Score (0-100) combines RSI, MACD, Moving Averages, Bollinger Bands, and Volume into one sentiment indicator. 70+ = Strong Bullish (strong buying pressure), 50-70 = Bullish, 30-50 = Bearish, Below 30 = Strong Bearish (strong selling pressure). This helps you quickly gauge overall market sentiment without analyzing each indicator separately."
                  learnMoreUrl="https://www.investopedia.com/terms/s/sentimentindicator.asp"
                >
                  <SentimentPanel vibeScore={vibeScore} />
                </Tooltip>

                {/* Technical Indicators */}
                <Tooltip
                  title="Technical Indicators Panel"
                  content="This panel shows real-time values for all active technical indicators. Use these to confirm signals across multiple indicators. For example, if RSI shows overbought AND Stochastic is above 80 AND CCI is above +100, that's strong confirmation of overbought conditions. Multiple indicators agreeing increases confidence in the signal."
                  learnMoreUrl="https://www.investopedia.com/terms/t/technicalindicator.asp"
                >
                  <IndicatorPanel indicators={indicators} />
                </Tooltip>
              </div>
            </div>
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-12 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700">
              <span className="inline-flex items-center gap-1">
                📊 <span>Currently viewing:</span>
              </span>
              <span className="font-bold text-gray-900">{selectedSymbol.toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Market: {marketType.charAt(0).toUpperCase() + marketType.slice(1)}
              </span>
              <span className="text-gray-400">|</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Timeframe: {timeRange.label}
              </span>
              <span className="text-gray-400">|</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {marketType === 'crypto'
                  ? dataSource === 'dex'
                    ? 'Live - Updates every 2 min'
                    : 'Live - Updates every 30 sec'
                  : marketType === 'stocks'
                  ? 'Live - Yahoo Finance'
                  : marketType === 'etf'
                  ? 'Live - Yahoo Finance'
                  : 'Live - ExchangeRate API'}
              </span>
            </div>
            {marketType === 'stocks' && (
              <div className="mt-3 pt-3 border-t border-gray-300">
                <p className="text-xs text-green-600 italic font-medium">
                  ✅ Real stock prices from Yahoo Finance - Free, no API key required
                </p>
              </div>
            )}
            {marketType === 'etf' && (
              <div className="mt-3 pt-3 border-t border-gray-300">
                <p className="text-xs text-green-600 italic font-medium">
                  ✅ Real ETF prices from Yahoo Finance - Free, no API key required
                </p>
              </div>
            )}
            {marketType === 'forex' && (
              <div className="mt-3 pt-3 border-t border-gray-300">
                <p className="text-xs text-green-600 italic font-medium">
                  ✅ Real exchange rates from ExchangeRate-API - Free, no API key required
                </p>
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-400">
              <p>Trading Dashboard with Technical Analysis & Market Vibe</p>
              <p className="mt-1 text-xs">Powered by CoinGecko, Dexscreener & TradingView Charts</p>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <span>Built with Next.js & React</span>
              <span>•</span>
              <span>© 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
