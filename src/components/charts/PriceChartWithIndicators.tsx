'use client';

// Enhanced price chart with MA overlays and Bollinger Bands

import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { OHLCV, MAResult, BollingerBandsResult } from '@/types';
import { getTimeScaleOptions, deduplicateTimeSeries } from '@/lib/chart-utils';

interface PriceChartWithIndicatorsProps {
  data: OHLCV[];
  sma?: Record<number, MAResult[]>;
  ema?: Record<number, MAResult[]>;
  bollingerBands?: BollingerBandsResult[];
  chartType?: 'candlestick' | 'line';
  height?: number;
  interval?: string; // Time interval (1m, 5m, 15m, etc.)
  visibleIndicators?: {
    sma20?: boolean;
    sma50?: boolean;
    sma200?: boolean;
    ema20?: boolean;
    ema50?: boolean;
    bb?: boolean;
  };
}

export function PriceChartWithIndicators({
  data,
  sma,
  ema,
  bollingerBands,
  chartType = 'candlestick',
  height = 400,
  interval = '1d',
  visibleIndicators = { sma20: true, sma50: true, sma200: false },
}: PriceChartWithIndicatorsProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !chartContainerRef.current || data.length === 0) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      timeScale: {
        ...getTimeScaleOptions(interval),
        borderColor: '#d1d5db',
      },
      rightPriceScale: {
        borderColor: '#d1d5db',
        visible: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      leftPriceScale: {
        visible: false, // Hide left price scale
      },
      crosshair: {
        mode: 1, // Normal crosshair
        vertLine: {
          color: '#9CA3AF',
          width: 1,
          style: 3,
          labelBackgroundColor: '#6B7280',
        },
        horzLine: {
          color: '#9CA3AF',
          width: 1,
          style: 3,
          labelBackgroundColor: '#6B7280',
        },
      },
    });

    chartRef.current = chart;

    // Add main price series
    if (chartType === 'candlestick') {
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderUpColor: '#10b981',
        borderDownColor: '#ef4444',
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });

      // Map and deduplicate data by timestamp
      const candleDataMap = new Map();
      data.forEach((d) => {
        const time = Math.floor(d.timestamp / 1000);
        // Keep only the first occurrence of each timestamp
        if (!candleDataMap.has(time)) {
          candleDataMap.set(time, {
            time: time as any,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          });
        }
      });

      // Convert to array and sort by time
      const candleData = Array.from(candleDataMap.values()).sort((a, b) => a.time - b.time);

      candlestickSeries.setData(candleData);
    } else {
      const lineSeries = chart.addLineSeries({
        color: '#3b82f6',
        lineWidth: 2,
      });

      // Map and deduplicate data by timestamp
      const lineDataMap = new Map();
      data.forEach((d) => {
        const time = Math.floor(d.timestamp / 1000);
        if (!lineDataMap.has(time)) {
          lineDataMap.set(time, {
            time: time as any,
            value: d.close,
          });
        }
      });

      const lineData = Array.from(lineDataMap.values()).sort((a, b) => a.time - b.time);

      lineSeries.setData(lineData);
    }

    // Add SMA 20 (Orange)
    if (visibleIndicators.sma20 && sma?.[20] && sma[20].length > 0) {
      const sma20Series = chart.addLineSeries({
        color: '#f97316',
        lineWidth: 2,
        title: 'SMA 20',
        priceLineVisible: false,
      });

      const sma20Data = deduplicateTimeSeries(
        sma[20].map((d) => ({
          time: Math.floor(d.timestamp / 1000) as any,
          value: d.value,
        }))
      );

      sma20Series.setData(sma20Data);
    }

    // Add SMA 50 (Blue)
    if (visibleIndicators.sma50 && sma?.[50] && sma[50].length > 0) {
      const sma50Series = chart.addLineSeries({
        color: '#3b82f6',
        lineWidth: 2,
        title: 'SMA 50',
        priceLineVisible: false,
      });

      const sma50Data = deduplicateTimeSeries(
        sma[50].map((d) => ({
          time: Math.floor(d.timestamp / 1000) as any,
          value: d.value,
        }))
      );

      sma50Series.setData(sma50Data);
    }

    // Add SMA 200 (Purple)
    if (visibleIndicators.sma200 && sma?.[200] && sma[200].length > 0) {
      const sma200Series = chart.addLineSeries({
        color: '#9333ea',
        lineWidth: 2,
        title: 'SMA 200',
        priceLineVisible: false,
      });

      const sma200Data = deduplicateTimeSeries(
        sma[200].map((d) => ({
          time: Math.floor(d.timestamp / 1000) as any,
          value: d.value,
        }))
      );

      sma200Series.setData(sma200Data);
    }

    // Add EMA 20 (Yellow)
    if (visibleIndicators.ema20 && ema?.[20] && ema[20].length > 0) {
      const ema20Series = chart.addLineSeries({
        color: '#eab308',
        lineWidth: 2,
        title: 'EMA 20',
        priceLineVisible: false,
        lineStyle: 0,
      });

      const ema20Data = deduplicateTimeSeries(
        ema[20].map((d) => ({
          time: Math.floor(d.timestamp / 1000) as any,
          value: d.value,
        }))
      );

      ema20Series.setData(ema20Data);
    }

    // Add EMA 50 (Cyan)
    if (visibleIndicators.ema50 && ema?.[50] && ema[50].length > 0) {
      const ema50Series = chart.addLineSeries({
        color: '#06b6d4',
        lineWidth: 2,
        title: 'EMA 50',
        priceLineVisible: false,
      });

      const ema50Data = deduplicateTimeSeries(
        ema[50].map((d) => ({
          time: Math.floor(d.timestamp / 1000) as any,
          value: d.value,
        }))
      );

      ema50Series.setData(ema50Data);
    }

    // Add Bollinger Bands (Upper and Lower)
    if (visibleIndicators.bb && bollingerBands && bollingerBands.length > 0) {
      // Upper band (Red)
      const upperBandSeries = chart.addLineSeries({
        color: '#ef4444',
        lineWidth: 1,
        title: 'BB Upper',
        priceLineVisible: false,
        lineStyle: 2, // Dashed
      });

      const upperBandData = deduplicateTimeSeries(
        bollingerBands.map((d) => ({
          time: Math.floor(d.timestamp / 1000) as any,
          value: d.upper,
        }))
      );

      upperBandSeries.setData(upperBandData);

      // Middle band (Gray)
      const middleBandSeries = chart.addLineSeries({
        color: '#6b7280',
        lineWidth: 1,
        title: 'BB Middle',
        priceLineVisible: false,
        lineStyle: 2,
      });

      const middleBandData = deduplicateTimeSeries(
        bollingerBands.map((d) => ({
          time: Math.floor(d.timestamp / 1000) as any,
          value: d.middle,
        }))
      );

      middleBandSeries.setData(middleBandData);

      // Lower band (Green)
      const lowerBandSeries = chart.addLineSeries({
        color: '#10b981',
        lineWidth: 1,
        title: 'BB Lower',
        priceLineVisible: false,
        lineStyle: 2,
      });

      const lowerBandData = deduplicateTimeSeries(
        bollingerBands.map((d) => ({
          time: Math.floor(d.timestamp / 1000) as any,
          value: d.lower,
        }))
      );

      lowerBandSeries.setData(lowerBandData);
    }

    // Fit content
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, sma, ema, bollingerBands, chartType, height, interval, isClient, visibleIndicators]);

  if (!isClient) {
    return (
      <div ref={chartContainerRef} style={{ width: '100%', height }} className="bg-gray-100 animate-pulse rounded-lg" />
    );
  }

  return <div ref={chartContainerRef} style={{ width: '100%', height }} className="rounded-lg" />;
}
