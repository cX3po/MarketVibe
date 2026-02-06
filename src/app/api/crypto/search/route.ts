// API route for searching crypto symbols

import { NextRequest, NextResponse } from 'next/server';
import { multiSourceCryptoClient } from '@/lib/api/aggregator/crypto-multi-source';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q') || '';

    const symbols = await multiSourceCryptoClient.searchSymbols(query);

    return NextResponse.json(
      { symbols },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error: any) {
    console.error('Error searching crypto symbols:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search symbols' },
      { status: error.statusCode || 500 }
    );
  }
}
