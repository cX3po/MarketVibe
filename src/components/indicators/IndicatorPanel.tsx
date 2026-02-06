'use client';

// Indicator panel with RSI, MACD display

import { IndicatorResults } from '@/types';
import { Tooltip } from '@/components/ui/Tooltip';

interface IndicatorPanelProps {
  indicators: IndicatorResults;
}

export function IndicatorPanel({ indicators }: IndicatorPanelProps) {
  // Get latest values
  const latestRSI = indicators.rsi?.[indicators.rsi.length - 1];
  const latestMACD = indicators.macd?.[indicators.macd.length - 1];
  const latestSMA20 = indicators.sma?.[20]?.[indicators.sma[20].length - 1];
  const latestSMA50 = indicators.sma?.[50]?.[indicators.sma[50].length - 1];
  const latestBB = indicators.bb?.[indicators.bb.length - 1];
  const latestStochastic = indicators.stochastic?.[indicators.stochastic.length - 1];
  const latestADX = indicators.adx?.[indicators.adx.length - 1];
  const latestATR = indicators.atr?.[indicators.atr.length - 1];
  const latestCCI = indicators.cci?.[indicators.cci.length - 1];
  const latestWilliamsR = indicators.williamsr?.[indicators.williamsr.length - 1];
  const latestOBV = indicators.obv?.[indicators.obv.length - 1];
  const latestPSAR = indicators.psar?.[indicators.psar.length - 1];

  // Determine RSI signal
  const getRSISignal = (rsi: number) => {
    if (rsi >= 70) return { label: 'Overbought', color: 'text-red-600' };
    if (rsi <= 30) return { label: 'Oversold', color: 'text-green-600' };
    return { label: 'Neutral', color: 'text-gray-600' };
  };

  // Determine MACD signal
  const getMACDSignal = (macd: number, signal: number) => {
    if (macd > signal) return { label: 'Bullish', color: 'text-green-600' };
    if (macd < signal) return { label: 'Bearish', color: 'text-red-600' };
    return { label: 'Neutral', color: 'text-gray-600' };
  };

  const rsiSignal = latestRSI ? getRSISignal(latestRSI.value) : null;
  const macdSignal = latestMACD ? getMACDSignal(latestMACD.macd, latestMACD.signal) : null;

  // Determine Stochastic signal
  const getStochasticSignal = (k: number) => {
    if (k >= 80) return { label: 'Overbought', color: 'text-red-600' };
    if (k <= 20) return { label: 'Oversold', color: 'text-green-600' };
    return { label: 'Neutral', color: 'text-gray-600' };
  };

  // Determine ADX signal (trend strength)
  const getADXSignal = (adx: number) => {
    if (adx >= 25) return { label: 'Strong Trend', color: 'text-blue-600' };
    if (adx >= 20) return { label: 'Moderate Trend', color: 'text-gray-600' };
    return { label: 'Weak Trend', color: 'text-gray-400' };
  };

  // Determine CCI signal
  const getCCISignal = (cci: number) => {
    if (cci >= 100) return { label: 'Overbought', color: 'text-red-600' };
    if (cci <= -100) return { label: 'Oversold', color: 'text-green-600' };
    return { label: 'Neutral', color: 'text-gray-600' };
  };

  // Determine Williams %R signal
  const getWilliamsRSignal = (wr: number) => {
    if (wr >= -20) return { label: 'Overbought', color: 'text-red-600' };
    if (wr <= -80) return { label: 'Oversold', color: 'text-green-600' };
    return { label: 'Neutral', color: 'text-gray-600' };
  };

  const stochasticSignal = latestStochastic ? getStochasticSignal(latestStochastic.k) : null;
  const adxSignal = latestADX ? getADXSignal(latestADX.adx) : null;
  const cciSignal = latestCCI ? getCCISignal(latestCCI.value) : null;
  const williamsRSignal = latestWilliamsR ? getWilliamsRSignal(latestWilliamsR.value) : null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Indicators</h3>

      <div className="space-y-4">
        {/* RSI */}
        {latestRSI && (
          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">RSI (14)</span>
              <span className={`text-sm font-semibold ${rsiSignal?.color}`}>{rsiSignal?.label}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{latestRSI.value.toFixed(2)}</span>
              <div className="text-xs text-gray-500">
                <div>&gt;70 Overbought</div>
                <div>&lt;30 Oversold</div>
              </div>
            </div>
            {/* RSI Visual Bar */}
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  latestRSI.value >= 70
                    ? 'bg-red-500'
                    : latestRSI.value <= 30
                    ? 'bg-green-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${latestRSI.value}%` }}
              />
            </div>
          </div>
        )}

        {/* MACD */}
        {latestMACD && (
          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">MACD (12,26,9)</span>
              <span className={`text-sm font-semibold ${macdSignal?.color}`}>{macdSignal?.label}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs text-gray-500">MACD</div>
                <div className="text-sm font-semibold text-gray-900">{latestMACD.macd.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Signal</div>
                <div className="text-sm font-semibold text-gray-900">{latestMACD.signal.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Histogram</div>
                <div className={`text-sm font-semibold ${latestMACD.histogram >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {latestMACD.histogram.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Moving Averages */}
        {(latestSMA20 || latestSMA50) && (
          <div className="border-b pb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Moving Averages</div>
            <div className="space-y-2">
              {latestSMA20 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">SMA 20</span>
                  <span className="text-sm font-semibold text-gray-900">${latestSMA20.value.toFixed(2)}</span>
                </div>
              )}
              {latestSMA50 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">SMA 50</span>
                  <span className="text-sm font-semibold text-gray-900">${latestSMA50.value.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bollinger Bands */}
        {latestBB && (
          <div className="border-b pb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Bollinger Bands (20,2)</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Upper</span>
                <span className="text-sm font-semibold text-red-600">${latestBB.upper.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Middle</span>
                <span className="text-sm font-semibold text-blue-600">${latestBB.middle.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Lower</span>
                <span className="text-sm font-semibold text-green-600">${latestBB.lower.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stochastic Oscillator */}
        {latestStochastic && (
          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Stochastic (14,3)</span>
              <span className={`text-sm font-semibold ${stochasticSignal?.color}`}>{stochasticSignal?.label}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="text-xs text-gray-500">%K</div>
                <div className="text-sm font-semibold text-gray-900">{latestStochastic.k.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">%D</div>
                <div className="text-sm font-semibold text-gray-900">{latestStochastic.d.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* ADX */}
        {latestADX && (
          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">ADX (14)</span>
              <span className={`text-sm font-semibold ${adxSignal?.color}`}>{adxSignal?.label}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs text-gray-500">ADX</div>
                <div className="text-sm font-semibold text-blue-600">{latestADX.adx.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">+DI</div>
                <div className="text-sm font-semibold text-green-600">{latestADX.pdi.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">-DI</div>
                <div className="text-sm font-semibold text-red-600">{latestADX.mdi.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* ATR */}
        {latestATR && (
          <Tooltip
            title="ATR (Average True Range)"
            content="ATR measures volatility - how much the price moves on average. Higher ATR = more volatile (larger price swings), Lower ATR = less volatile (smaller price swings). Use ATR to set stop-loss levels (e.g., 2x ATR) and position sizes. High ATR means higher risk but potentially higher reward."
            learnMoreUrl="https://www.investopedia.com/terms/a/atr.asp"
          >
            <div className="border-b pb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">ATR (14)</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Volatility</span>
                <span className="text-sm font-semibold text-orange-600">${latestATR.value.toFixed(2)}</span>
              </div>
            </div>
          </Tooltip>
        )}

        {/* CCI */}
        {latestCCI && (
          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">CCI (20)</span>
              <span className={`text-sm font-semibold ${cciSignal?.color}`}>{cciSignal?.label}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{latestCCI.value.toFixed(2)}</span>
              <div className="text-xs text-gray-500">
                <div>&gt;100 Overbought</div>
                <div>&lt;-100 Oversold</div>
              </div>
            </div>
          </div>
        )}

        {/* Williams %R */}
        {latestWilliamsR && (
          <div className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Williams %R (14)</span>
              <span className={`text-sm font-semibold ${williamsRSignal?.color}`}>{williamsRSignal?.label}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{latestWilliamsR.value.toFixed(2)}</span>
              <div className="text-xs text-gray-500">
                <div>&gt;-20 Overbought</div>
                <div>&lt;-80 Oversold</div>
              </div>
            </div>
          </div>
        )}

        {/* OBV */}
        {latestOBV && (
          <Tooltip
            title="OBV (On Balance Volume)"
            content="OBV is a cumulative volume indicator that adds volume on up days and subtracts on down days. Rising OBV confirms uptrends (accumulation), falling OBV confirms downtrends (distribution). OBV diverging from price can signal reversals - price making new highs while OBV declining is bearish, price making new lows while OBV rising is bullish."
            learnMoreUrl="https://www.investopedia.com/terms/o/onbalancevolume.asp"
          >
            <div className="border-b pb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">OBV (On Balance Volume)</div>
              <div className="text-sm font-semibold text-purple-600">
                {latestOBV.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
          </Tooltip>
        )}

        {/* Parabolic SAR */}
        {latestPSAR && (
          <Tooltip
            title="Parabolic SAR (Stop and Reverse)"
            content="Parabolic SAR shows potential reversal points. Dots below price indicate uptrend (bullish), dots above price indicate downtrend (bearish). When SAR flips from below to above (or vice versa), it signals a potential trend reversal. Works best in trending markets, less reliable in ranging markets. Use as trailing stop-loss levels."
            learnMoreUrl="https://www.investopedia.com/terms/p/parabolicindicator.asp"
          >
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Parabolic SAR</div>
              <div className="text-sm font-semibold text-gray-900">${latestPSAR.value.toFixed(2)}</div>
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
