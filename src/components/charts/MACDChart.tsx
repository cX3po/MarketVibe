'use client';

// MACD indicator chart

import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { MACDResult } from '@/types';

interface MACDChartProps {
  data: MACDResult[];
  height?: number;
}

export function MACDChart({ data, height = 150 }: MACDChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !chartContainerRef.current || data.length === 0) return;

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
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#d1d5db',
      },
      rightPriceScale: {
        borderColor: '#d1d5db',
        visible: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      leftPriceScale: {
        visible: false,
      },
    });

    chartRef.current = chart;

    // Add MACD line
    const macdSeries = chart.addLineSeries({
      color: '#3b82f6',
      lineWidth: 2,
      title: 'MACD',
    });

    const macdData = data.map((d) => ({
      time: Math.floor(d.timestamp / 1000) as any,
      value: d.macd,
    }));

    macdSeries.setData(macdData);

    // Add Signal line
    const signalSeries = chart.addLineSeries({
      color: '#f59e0b',
      lineWidth: 2,
      title: 'Signal',
    });

    const signalData = data.map((d) => ({
      time: Math.floor(d.timestamp / 1000) as any,
      value: d.signal,
    }));

    signalSeries.setData(signalData);

    // Add Histogram
    const histogramSeries = chart.addHistogramSeries({
      color: '#6366f1',
      priceFormat: {
        type: 'volume',
      },
    });

    const histogramData = data.map((d) => ({
      time: Math.floor(d.timestamp / 1000) as any,
      value: d.histogram,
      color: d.histogram >= 0 ? '#10b98160' : '#ef444460',
    }));

    histogramSeries.setData(histogramData);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, height, isClient]);

  if (!isClient) {
    return (
      <div ref={chartContainerRef} style={{ width: '100%', height }} className="bg-gray-100 animate-pulse rounded-lg" />
    );
  }

  return <div ref={chartContainerRef} style={{ width: '100%', height }} className="rounded-lg" />;
}
