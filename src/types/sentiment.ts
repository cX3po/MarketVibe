// Sentiment analysis types

export type SentimentLabel = 'Strong Bearish' | 'Bearish' | 'Neutral' | 'Bullish' | 'Strong Bullish';

export interface VibeScore {
  overall: number;         // 0-100 composite score
  momentum: number;        // -100 to +100
  trendStrength: number;   // 0-100
  volumeSignal: number;    // -100 to +100
  confidence: number;      // 0-100
  label: SentimentLabel;
  timestamp: number;
}

export interface MomentumScore {
  rsiScore: number;        // -100 to +100
  macdScore: number;       // -100 to +100
  combined: number;        // -100 to +100
}

export interface TrendStrengthScore {
  maPositionScore: number; // 0-100 (price vs MAs)
  bbPositionScore: number; // 0-100 (position in BB)
  combined: number;        // 0-100
}

export interface VolumeMomentumScore {
  relativeVolume: number;  // Current volume vs MA
  volumeTrend: number;     // Trending up or down
  score: number;           // -100 to +100
}
