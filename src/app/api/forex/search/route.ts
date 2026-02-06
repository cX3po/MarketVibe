// API route for forex search - REAL DATA

import { NextRequest, NextResponse } from 'next/server';
import { forexClient } from '@/lib/api/aggregator/unified-data-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    // Return supported forex pairs
    const symbols = forexClient.getSupportedPairs();

    if (query) {
      // Filter by query
      const filtered = symbols.filter(s =>
        s.symbol.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase())
      );
      return NextResponse.json({ symbols: filtered });
    }

    return NextResponse.json(
      { symbols },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error: any) {
    console.error('Error searching forex:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search forex pairs' },
      { status: 500 }
    );
  }
}
