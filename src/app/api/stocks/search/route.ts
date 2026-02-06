// API route for stock search - REAL DATA from Yahoo Finance

import { NextRequest, NextResponse } from 'next/server';
import { yahooFinanceClient } from '@/lib/api/aggregator/unified-data-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query) {
      // Return popular symbols if no query
      const popularSymbols = [
        { id: 'aapl', symbol: 'AAPL', name: 'Apple Inc.', marketType: 'stocks' as const },
        { id: 'googl', symbol: 'GOOGL', name: 'Alphabet Inc.', marketType: 'stocks' as const },
        { id: 'msft', symbol: 'MSFT', name: 'Microsoft Corp.', marketType: 'stocks' as const },
        { id: 'tsla', symbol: 'TSLA', name: 'Tesla Inc.', marketType: 'stocks' as const },
        { id: 'amzn', symbol: 'AMZN', name: 'Amazon.com Inc.', marketType: 'stocks' as const },
        { id: 'meta', symbol: 'META', name: 'Meta Platforms Inc.', marketType: 'stocks' as const },
        { id: 'nvda', symbol: 'NVDA', name: 'NVIDIA Corp.', marketType: 'stocks' as const },
        { id: 'nflx', symbol: 'NFLX', name: 'Netflix Inc.', marketType: 'stocks' as const },
      ];
      return NextResponse.json({ symbols: popularSymbols });
    }

    // Search Yahoo Finance for real symbols
    const symbols = await yahooFinanceClient.searchSymbols(query);

    return NextResponse.json(
      { symbols },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error: any) {
    console.error('Error searching stocks:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search stocks' },
      { status: 500 }
    );
  }
}
