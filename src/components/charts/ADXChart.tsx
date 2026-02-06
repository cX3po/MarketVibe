'use client';

// ADX (Average Directional Index) indicator chart

import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { ADXResult } from '@/types';

interface ADXChartProps {
  data: ADXResult[];
  height?: number;
}

export function ADXChart({ data, height = 150 }: ADXChartProps) {
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

    // Add ADX line (main trend strength indicator)
    const adxSeries = chart.addLineSeries({
      color: '#3b82f6',
      lineWidth: 2,
      title: 'ADX',
    });

    const adxData = data.map((d) => ({
      time: Math.floor(d.timestamp / 1000) as any,
      value: d.adx,
    }));

    adxSeries.setData(adxData);

    // Add +DI line (positive directional indicator)
    const pdiSeries = chart.addLineSeries({
      color: '#10b981',
      lineWidth: 2,
      title: '+DI',
    });

    const pdiData = data.map((d) => ({
      time: Math.floor(d.timestamp / 1000) as any,
      value: d.pdi,
    }));

    pdiSeries.setData(pdiData);

    // Add -DI line (negative directional indicator)
    const mdiSeries = chart.addLineSeries({
      color: '#ef4444',
      lineWidth: 2,
      title: '-DI',
    });

    const mdiData = data.map((d) => ({
      time: Math.floor(d.timestamp / 1000) as any,
      value: d.mdi,
    }));

    mdiSeries.setData(mdiData);

    // Add strong trend line (25)
    const strongTrendSeries = chart.addLineSeries({
      color: '#9ca3af',
      lineWidth: 1,
      lineStyle: 2, // Dashed
      priceLineVisible: false,
    });

    strongTrendSeries.setData(
      data.map((d) => ({
        time: Math.floor(d.timestamp / 1000) as any,
        value: 25,
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
