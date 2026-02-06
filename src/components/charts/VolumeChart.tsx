'use client';

// Volume chart component

import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { OHLCV } from '@/types';
import { getTimeScaleOptions, deduplicateTimeSeries } from '@/lib/chart-utils';

interface VolumeChartProps {
  data: OHLCV[];
  height?: number;
  interval?: string;
}

export function VolumeChart({ data, height = 150, interval = '1d' }: VolumeChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
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
          bottom: 0.1,
        },
      },
      leftPriceScale: {
        visible: false,
      },
    });

    chartRef.current = chart;

    // Create histogram series for volume
    const volumeSeries = chart.addHistogramSeries({
      color: '#6366f1',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    const volumeData = deduplicateTimeSeries(
      data.map((d, index) => {
        // Color by price direction (up = green, down = red)
        const isUp = index === 0 || d.close >= data[index - 1].close;

        return {
          time: Math.floor(d.timestamp / 1000) as any,
          value: d.volume,
          color: isUp ? '#10b98160' : '#ef444460',
        };
      })
    );

    volumeSeries.setData(volumeData);
    seriesRef.current = volumeSeries;

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
  }, [data, height, interval, isClient]);

  if (!isClient) {
    return (
      <div ref={chartContainerRef} style={{ width: '100%', height }} className="bg-gray-100 animate-pulse rounded-lg" />
    );
  }

  return <div ref={chartContainerRef} style={{ width: '100%', height }} className="rounded-lg" />;
}
