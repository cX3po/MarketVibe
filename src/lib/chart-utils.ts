// Chart utility functions

/**
 * Deduplicate and sort time series data by timestamp
 * Ensures data is in ascending order with unique timestamps for Lightweight Charts
 */
export function deduplicateTimeSeries<T extends { time: any }>(data: T[]): T[] {
  const map = new Map<number, T>();
  data.forEach(item => {
    if (!map.has(item.time)) {
      map.set(item.time, item);
    }
  });
  return Array.from(map.values()).sort((a, b) => a.time - b.time);
}

/**
 * Get time scale configuration based on interval
 */
export function getTimeScaleOptions(interval: string = '1d') {
  const showSeconds = ['1m', '5m'].includes(interval);

  return {
    timeVisible: true,
    secondsVisible: showSeconds,
    tickMarkFormatter: (time: any) => {
      const date = new Date(time * 1000);

      // Format based on interval
      if (interval === '1m' || interval === '5m') {
        // Show time with seconds for very short intervals
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
      } else if (interval === '15m' || interval === '30m') {
        // Show time without seconds
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      } else if (interval === '1h' || interval === '4h') {
        // Show hour and date
        return date.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          hour12: false
        });
      } else {
        // Show date for daily and longer
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      }
    },
  };
}
