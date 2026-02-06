// API route for searching DEX pairs

import { NextRequest, NextResponse } from 'next/server';
import { dexscreenerClient } from '@/lib/api/dex/dexscreener';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    const pairs = await dexscreenerClient.searchSymbols(query);

    return NextResponse.json(
      { pairs },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error: any) {
    console.error('Error searching DEX pairs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search pairs' },
      { status: error.statusCode || 500 }
    );
  }
}
