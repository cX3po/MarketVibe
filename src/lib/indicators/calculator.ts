// Main indicator calculator engine

import {
  OHLCV, IndicatorResults, RSIResult, MACDResult, MAResult, BollingerBandsResult,
  StochasticResult, ADXResult, ATRResult, CCIResult, WilliamsRResult, OBVResult, PSARResult
} from '@/types';
import {
  RSI, MACD, SMA, EMA, BollingerBands, Stochastic, ADX, ATR, CCI, WilliamsR, OBV, PSAR
} from 'technicalindicators';

export class IndicatorCalculator {
  /**
   * Calculate all indicators for the given OHLCV data
   */
  static calculateAll(data: OHLCV[]): IndicatorResults {
    if (data.length === 0) {
      return {};
    }

    const closePrices = data.map(d => d.close);
    const highPrices = data.map(d => d.high);
    const lowPrices = data.map(d => d.low);
    const volumes = data.map(d => d.volume);

    return {
      rsi: this.calculateRSI(closePrices, data),
      macd: this.calculateMACD(closePrices, data),
      sma: this.calculateSMA(closePrices, data),
      ema: this.calculateEMA(closePrices, data),
      bb: this.calculateBB(closePrices, data),
      stochastic: this.calculateStochastic(highPrices, lowPrices, closePrices, data),
      adx: this.calculateADX(highPrices, lowPrices, closePrices, data),
      atr: this.calculateATR(highPrices, lowPrices, closePrices, data),
      cci: this.calculateCCI(highPrices, lowPrices, closePrices, data),
      williamsr: this.calculateWilliamsR(highPrices, lowPrices, closePrices, data),
      obv: this.calculateOBV(closePrices, volumes, data),
      psar: this.calculatePSAR(highPrices, lowPrices, data),
    };
  }

  /**
   * Calculate RSI (Relative Strength Index)
   */
  static calculateRSI(closePrices: number[], data: OHLCV[], period: number = 14): RSIResult[] {
    if (closePrices.length < period) return [];

    const rsiValues = RSI.calculate({
      values: closePrices,
      period,
    });

    // RSI returns fewer values than input (needs period data points)
    // Align with timestamps
    const startIndex = closePrices.length - rsiValues.length;

    return rsiValues.map((value, index) => ({
      timestamp: data[startIndex + index].timestamp,
      value,
    }));
  }

  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   */
  static calculateMACD(
    closePrices: number[],
    data: OHLCV[],
    fastPeriod: number = 12,
    slowPeriod: number = 26,
    signalPeriod: number = 9
  ): MACDResult[] {
    if (closePrices.length < slowPeriod + signalPeriod) return [];

    const macdValues = MACD.calculate({
      values: closePrices,
      fastPeriod,
      slowPeriod,
      signalPeriod,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    });

    // MACD returns fewer values than input
    const startIndex = closePrices.length - macdValues.length;

    return macdValues.map((macdData, index) => ({
      timestamp: data[startIndex + index].timestamp,
      macd: macdData.MACD || 0,
      signal: macdData.signal || 0,
      histogram: macdData.histogram || 0,
    }));
  }

  /**
   * Calculate SMA (Simple Moving Average) for multiple periods
   */
  static calculateSMA(closePrices: number[], data: OHLCV[], periods: number[] = [20, 50, 200]): { [period: number]: MAResult[] } {
    const result: { [period: number]: MAResult[] } = {};

    for (const period of periods) {
      if (closePrices.length < period) continue;

      const smaValues = SMA.calculate({
        values: closePrices,
        period,
      });

      const startIndex = closePrices.length - smaValues.length;

      result[period] = smaValues.map((value, index) => ({
        timestamp: data[startIndex + index].timestamp,
        value,
      }));
    }

    return result;
  }

  /**
   * Calculate EMA (Exponential Moving Average) for multiple periods
   */
  static calculateEMA(closePrices: number[], data: OHLCV[], periods: number[] = [12, 26]): { [period: number]: MAResult[] } {
    const result: { [period: number]: MAResult[] } = {};

    for (const period of periods) {
      if (closePrices.length < period) continue;

      const emaValues = EMA.calculate({
        values: closePrices,
        period,
      });

      const startIndex = closePrices.length - emaValues.length;

      result[period] = emaValues.map((value, index) => ({
        timestamp: data[startIndex + index].timestamp,
        value,
      }));
    }

    return result;
  }

  /**
   * Calculate Bollinger Bands
   */
  static calculateBB(closePrices: number[], data: OHLCV[], period: number = 20, stdDev: number = 2): BollingerBandsResult[] {
    if (closePrices.length < period) return [];

    const bbValues = BollingerBands.calculate({
      values: closePrices,
      period,
      stdDev,
    });

    const startIndex = closePrices.length - bbValues.length;

    return bbValues.map((bb, index) => ({
      timestamp: data[startIndex + index].timestamp,
      upper: bb.upper,
      middle: bb.middle,
      lower: bb.lower,
    }));
  }

  /**
   * Calculate Stochastic Oscillator
   */
  static calculateStochastic(
    highPrices: number[],
    lowPrices: number[],
    closePrices: number[],
    data: OHLCV[],
    period: number = 14,
    signalPeriod: number = 3
  ): StochasticResult[] {
    if (closePrices.length < period) return [];

    const stochValues = Stochastic.calculate({
      high: highPrices,
      low: lowPrices,
      close: closePrices,
      period,
      signalPeriod,
    });

    const startIndex = closePrices.length - stochValues.length;

    return stochValues.map((stoch, index) => ({
      timestamp: data[startIndex + index].timestamp,
      k: stoch.k,
      d: stoch.d,
    }));
  }

  /**
   * Calculate ADX (Average Directional Index)
   */
  static calculateADX(
    highPrices: number[],
    lowPrices: number[],
    closePrices: number[],
    data: OHLCV[],
    period: number = 14
  ): ADXResult[] {
    if (closePrices.length < period * 2) return [];

    const adxValues = ADX.calculate({
      high: highPrices,
      low: lowPrices,
      close: closePrices,
      period,
    });

    const startIndex = closePrices.length - adxValues.length;

    return adxValues.map((adx, index) => ({
      timestamp: data[startIndex + index].timestamp,
      adx: adx.adx,
      pdi: adx.pdi,
      mdi: adx.mdi,
    }));
  }

  /**
   * Calculate ATR (Average True Range)
   */
  static calculateATR(
    highPrices: number[],
    lowPrices: number[],
    closePrices: number[],
    data: OHLCV[],
    period: number = 14
  ): ATRResult[] {
    if (closePrices.length < period) return [];

    const atrValues = ATR.calculate({
      high: highPrices,
      low: lowPrices,
      close: closePrices,
      period,
    });

    const startIndex = closePrices.length - atrValues.length;

    return atrValues.map((value, index) => ({
      timestamp: data[startIndex + index].timestamp,
      value,
    }));
  }

  /**
   * Calculate CCI (Commodity Channel Index)
   */
  static calculateCCI(
    highPrices: number[],
    lowPrices: number[],
    closePrices: number[],
    data: OHLCV[],
    period: number = 20
  ): CCIResult[] {
    if (closePrices.length < period) return [];

    const cciValues = CCI.calculate({
      high: highPrices,
      low: lowPrices,
      close: closePrices,
      period,
    });

    const startIndex = closePrices.length - cciValues.length;

    return cciValues.map((value, index) => ({
      timestamp: data[startIndex + index].timestamp,
      value,
    }));
  }

  /**
   * Calculate Williams %R
   */
  static calculateWilliamsR(
    highPrices: number[],
    lowPrices: number[],
    closePrices: number[],
    data: OHLCV[],
    period: number = 14
  ): WilliamsRResult[] {
    if (closePrices.length < period) return [];

    const williamsRValues = WilliamsR.calculate({
      high: highPrices,
      low: lowPrices,
      close: closePrices,
      period,
    });

    const startIndex = closePrices.length - williamsRValues.length;

    return williamsRValues.map((value, index) => ({
      timestamp: data[startIndex + index].timestamp,
      value,
    }));
  }

  /**
   * Calculate OBV (On Balance Volume)
   */
  static calculateOBV(
    closePrices: number[],
    volumes: number[],
    data: OHLCV[]
  ): OBVResult[] {
    if (closePrices.length < 2) return [];

    const obvValues = OBV.calculate({
      close: closePrices,
      volume: volumes,
    });

    const startIndex = closePrices.length - obvValues.length;

    return obvValues.map((value, index) => ({
      timestamp: data[startIndex + index].timestamp,
      value,
    }));
  }

  /**
   * Calculate Parabolic SAR
   */
  static calculatePSAR(
    highPrices: number[],
    lowPrices: number[],
    data: OHLCV[],
    step: number = 0.02,
    max: number = 0.2
  ): PSARResult[] {
    if (highPrices.length < 2) return [];

    const psarValues = PSAR.calculate({
      high: highPrices,
      low: lowPrices,
      step,
      max,
    });

    const startIndex = highPrices.length - psarValues.length;

    return psarValues.map((value, index) => ({
      timestamp: data[startIndex + index].timestamp,
      value,
    }));
  }
}
