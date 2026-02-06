// API route for forex data - REAL DATA from ExchangeRate-API

import { NextRequest, NextResponse } from 'next/server';
import { forexClient } from '@/lib/api/aggregator/unified-data-client';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pair: string }> }
) {
  try {
    const { pair } = await params;
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30', 10);

    // Fetch REAL forex data in parallel
    const [price, history] = await Promise.all([
      forexClient.getCurrentPrice(pair),
      forexClient.getHistoricalData(pair, days),
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
    console.error('Error fetching forex data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch forex data' },
      { status: error.message.includes('not found') ? 404 : 500 }
    );
  }
}
