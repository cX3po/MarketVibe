// API route for stock data - REAL DATA from Yahoo Finance

import { NextRequest, NextResponse } from 'next/server';
import { yahooFinanceClient } from '@/lib/api/aggregator/unified-data-client';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30', 10);
    const interval = searchParams.get('interval') || '1d';

    // Fetch REAL data from Yahoo Finance in parallel
    const [price, history] = await Promise.all([
      yahooFinanceClient.getCurrentPrice(symbol),
      yahooFinanceClient.getHistoricalData(symbol, days, interval),
    ]);

    return NextResponse.json(
      { price, history },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stock data' },
      { status: error.message.includes('not found') ? 404 : 500 }
    );
  }
}
