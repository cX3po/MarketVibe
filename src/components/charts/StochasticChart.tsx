'use client';

// Stochastic Oscillator indicator chart

import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { StochasticResult } from '@/types';

interface StochasticChartProps {
  data: StochasticResult[];
  height?: number;
}

export function StochasticChart({ data, height = 150 }: StochasticChartProps) {
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

    // Add %K line (fast)
    const kSeries = chart.addLineSeries({
      color: '#2563eb',
      lineWidth: 2,
      title: '%K',
    });

    const kData = data.map((d) => ({
      time: Math.floor(d.timestamp / 1000) as any,
      value: d.k,
    }));

    kSeries.setData(kData);

    // Add %D line (slow/signal)
    const dSeries = chart.addLineSeries({
      color: '#dc2626',
      lineWidth: 2,
      title: '%D',
    });

    const dData = data.map((d) => ({
      time: Math.floor(d.timestamp / 1000) as any,
      value: d.d,
    }));

    dSeries.setData(dData);

    // Add overbought line (80)
    const overboughtSeries = chart.addLineSeries({
      color: '#ef4444',
      lineWidth: 1,
      lineStyle: 2, // Dashed
      priceLineVisible: false,
    });

    overboughtSeries.setData(
      data.map((d) => ({
        time: Math.floor(d.timestamp / 1000) as any,
        value: 80,
      }))
    );

    // Add oversold line (20)
    const oversoldSeries = chart.addLineSeries({
      color: '#10b981',
      lineWidth: 1,
      lineStyle: 2, // Dashed
      priceLineVisible: false,
    });

    oversoldSeries.setData(
      data.map((d) => ({
        time: Math.floor(d.timestamp / 1000) as any,
        value: 20,
      }))
    );

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
