'use client';

// RSI indicator chart

import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { RSIResult } from '@/types';

interface RSIChartProps {
  data: RSIResult[];
  height?: number;
}

export function RSIChart({ data, height = 150 }: RSIChartProps) {
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

    // Add RSI line
    const rsiSeries = chart.addLineSeries({
      color: '#9333ea',
      lineWidth: 2,
      title: 'RSI',
    });

    const rsiData = data.map((d) => ({
      time: Math.floor(d.timestamp / 1000) as any,
      value: d.value,
    }));

    rsiSeries.setData(rsiData);

    // Add overbought line (70)
    const overboughtSeries = chart.addLineSeries({
      color: '#ef4444',
      lineWidth: 1,
      lineStyle: 2, // Dashed
      priceLineVisible: false,
    });

    overboughtSeries.setData(
      data.map((d) => ({
        time: Math.floor(d.timestamp / 1000) as any,
        value: 70,
      }))
    );

    // Add oversold line (30)
    const oversoldSeries = chart.addLineSeries({
      color: '#10b981',
      lineWidth: 1,
      lineStyle: 2, // Dashed
      priceLineVisible: false,
    });

    oversoldSeries.setData(
      data.map((d) => ({
        time: Math.floor(d.timestamp / 1000) as any,
        value: 30,
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
