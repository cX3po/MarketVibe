// Indicator types for technical analysis

export type IndicatorType = 'rsi' | 'macd' | 'sma' | 'ema' | 'bb' | 'volume' | 'stochastic' | 'adx' | 'atr' | 'cci' | 'williamsr' | 'obv' | 'psar';

export interface IndicatorConfig {
  type: IndicatorType;
  period?: number;
  periods?: number[]; // For multiple moving averages
  enabled: boolean;
  color?: string;
  // MACD specific
  fastPeriod?: number;
  slowPeriod?: number;
  signalPeriod?: number;
  // Bollinger Bands specific
  stdDev?: number;
}

export interface RSIResult {
  timestamp: number;
  value: number;
}

export interface MACDResult {
  timestamp: number;
  macd: number;
  signal: number;
  histogram: number;
}

export interface MAResult {
  timestamp: number;
  value: number;
}

export interface BollingerBandsResult {
  timestamp: number;
  upper: number;
  middle: number;
  lower: number;
}

export interface VolumeIndicatorResult {
  timestamp: number;
  volume: number;
  volumeMA: number;
  relativeVolume: number;
}

export interface StochasticResult {
  timestamp: number;
  k: number; // %K line
  d: number; // %D line (signal)
}

export interface ADXResult {
  timestamp: number;
  adx: number; // ADX line
  pdi: number; // +DI (Positive Directional Indicator)
  mdi: number; // -DI (Negative Directional Indicator)
}

export interface ATRResult {
  timestamp: number;
  value: number;
}

export interface CCIResult {
  timestamp: number;
  value: number;
}

export interface WilliamsRResult {
  timestamp: number;
  value: number;
}

export interface OBVResult {
  timestamp: number;
  value: number;
}

export interface PSARResult {
  timestamp: number;
  value: number;
}

export interface IndicatorResults {
  rsi?: RSIResult[];
  macd?: MACDResult[];
  sma?: { [period: number]: MAResult[] };
  ema?: { [period: number]: MAResult[] };
  bb?: BollingerBandsResult[];
  volume?: VolumeIndicatorResult[];
  stochastic?: StochasticResult[];
  adx?: ADXResult[];
  atr?: ATRResult[];
  cci?: CCIResult[];
  williamsr?: WilliamsRResult[];
  obv?: OBVResult[];
  psar?: PSARResult[];
}
