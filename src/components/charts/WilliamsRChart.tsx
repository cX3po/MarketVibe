'use client';

// Williams %R indicator chart

import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { WilliamsRResult } from '@/types';

interface WilliamsRChartProps {
  data: WilliamsRResult[];
  height?: number;
}

export function WilliamsRChart({ data, height = 150 }: WilliamsRChartProps) {
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

    // Add Williams %R line
    const williamsRSeries = chart.addLineSeries({
      color: '#8b5cf6',
      lineWidth: 2,
      title: 'Williams %R',
    });

    const williamsRData = data.map((d) => ({
      time: Math.floor(d.timestamp / 1000) as any,
      value: d.value,
    }));

    williamsRSeries.setData(williamsRData);

    // Add overbought line (-20)
    const overboughtSeries = chart.addLineSeries({
      color: '#ef4444',
      lineWidth: 1,
      lineStyle: 2, // Dashed
      priceLineVisible: false,
    });

    overboughtSeries.setData(
      data.map((d) => ({
        time: Math.floor(d.timestamp / 1000) as any,
        value: -20,
      }))
    );

    // Add oversold line (-80)
    const oversoldSeries = chart.addLineSeries({
      color: '#10b981',
      lineWidth: 1,
      lineStyle: 2, // Dashed
      priceLineVisible: false,
    });

    oversoldSeries.setData(
      data.map((d) => ({
        time: Math.floor(d.timestamp / 1000) as any,
        value: -80,
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
