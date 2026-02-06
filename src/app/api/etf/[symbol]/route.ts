// API route for ETF data - Uses Yahoo Finance (same as stocks)

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
    const days = Number(searchParams.get('days')) || 30;
    const interval = searchParams.get('interval') || '1d';

    // Get both current price and historical data using Yahoo Finance
    // Yahoo Finance supports ETFs the same way as stocks
    const [priceData, historicalData] = await Promise.all([
      yahooFinanceClient.getCurrentPrice(symbol),
      yahooFinanceClient.getHistoricalData(symbol, days, interval),
    ]);

    return NextResponse.json(
      {
        price: priceData,
        history: historicalData,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching ETF data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch ETF data' },
      { status: 500 }
    );
  }
}
