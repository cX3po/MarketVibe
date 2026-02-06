// API route for crypto data

import { NextRequest, NextResponse } from 'next/server';
import { multiSourceCryptoClient } from '@/lib/api/aggregator/crypto-multi-source';

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

    // Get both current price and historical data using multi-source client
    // Client will automatically try: Binance (primary) -> CoinCap -> CoinGecko (fallback)
    const [priceData, historicalData] = await Promise.all([
      multiSourceCryptoClient.getCurrentPrice(symbol),
      multiSourceCryptoClient.getHistoricalData(symbol, days, interval),
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
    console.error('Error fetching crypto data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch crypto data' },
      { status: error.statusCode || 500 }
    );
  }
}
