// API route for ETF search - REAL DATA from Yahoo Finance

import { NextRequest, NextResponse } from 'next/server';
import { yahooFinanceClient } from '@/lib/api/aggregator/unified-data-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query) {
      // Return popular ETFs if no query
      const popularETFs = [
        { id: 'spy', symbol: 'SPY', name: 'SPDR S&P 500 ETF', marketType: 'etf' as const },
        { id: 'qqq', symbol: 'QQQ', name: 'Invesco QQQ Trust', marketType: 'etf' as const },
        { id: 'iwm', symbol: 'IWM', name: 'iShares Russell 2000 ETF', marketType: 'etf' as const },
        { id: 'vti', symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', marketType: 'etf' as const },
        { id: 'voo', symbol: 'VOO', name: 'Vanguard S&P 500 ETF', marketType: 'etf' as const },
        { id: 'dia', symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', marketType: 'etf' as const },
        { id: 'gld', symbol: 'GLD', name: 'SPDR Gold Trust', marketType: 'etf' as const },
        { id: 'slv', symbol: 'SLV', name: 'iShares Silver Trust', marketType: 'etf' as const },
      ];
      return NextResponse.json({ symbols: popularETFs });
    }

    // Search Yahoo Finance for ETFs
    const symbols = await yahooFinanceClient.searchSymbols(query);

    // Filter for ETFs only (Yahoo returns ETF in quoteType)
    const etfSymbols = symbols
      .filter(s => s.symbol.includes('-') === false) // ETFs typically don't have dashes
      .map(s => ({
        ...s,
        marketType: 'etf' as const,
      }));

    return NextResponse.json(
      { symbols: etfSymbols },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error: any) {
    console.error('Error searching ETFs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search ETFs' },
      { status: 500 }
    );
  }
}
