// API route for DEX pair data

import { NextRequest, NextResponse } from 'next/server';
import { dexscreenerClient } from '@/lib/api/dex/dexscreener';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pair: string }> }
) {
  try {
    const { pair } = await params;
    const days = Number(request.nextUrl.searchParams.get('days')) || 30;

    // Get both current price and historical data
    const [priceData, historicalData] = await Promise.all([
      dexscreenerClient.getCurrentPrice(pair),
      dexscreenerClient.getHistoricalData(pair, days),
    ]);

    return NextResponse.json(
      {
        price: priceData,
        history: historicalData,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching DEX data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch DEX data' },
      { status: error.statusCode || 500 }
    );
  }
}
