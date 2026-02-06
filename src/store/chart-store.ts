// Zustand store for chart configuration

import { create } from 'zustand';
import { TimeRange } from '@/types';

export const TIME_RANGES: TimeRange[] = [
  { label: '1m', value: '1m', days: 1 },      // Show 1 day of 1-min data
  { label: '5m', value: '5m', days: 1 },      // Show 1 day of 5-min data
  { label: '15m', value: '15m', days: 3 },    // Show 3 days of 15-min data
  { label: '30m', value: '30m', days: 5 },    // Show 5 days of 30-min data
  { label: '1h', value: '1h', days: 7 },      // Show 7 days of hourly data
  { label: '4h', value: '4h', days: 14 },     // Show 14 days of 4H data
  { label: '1d', value: '1d', days: 30 },     // Show 30 days
  { label: '1w', value: '1w', days: 90 },     // Show 90 days
  { label: '1M', value: '1M', days: 180 },    // Show 180 days (1 month)
  { label: '3M', value: '3M', days: 365 },    // Show 1 year (3 months)
  { label: '1Y', value: '1Y', days: 730 },    // Show 2 years
];

interface ChartState {
  timeRange: TimeRange;
  chartType: 'candlestick' | 'line';
  setTimeRange: (timeRange: TimeRange) => void;
  setChartType: (chartType: 'candlestick' | 'line') => void;
}

export const useChartStore = create<ChartState>((set) => ({
  timeRange: TIME_RANGES[6], // Default to 1d (30 days of daily candles)
  chartType: 'candlestick',
  setTimeRange: (timeRange) => set({ timeRange }),
  setChartType: (chartType) => set({ chartType }),
}));
