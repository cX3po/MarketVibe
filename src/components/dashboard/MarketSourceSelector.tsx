'use client';

// Market source selector (CEX vs DEX)

import { useMarketStore } from '@/store/market-store';

export function MarketSourceSelector() {
  const { dataSource, setDataSource, setSelectedSymbol } = useMarketStore();

  const handleSourceChange = (source: 'cex' | 'dex') => {
    setDataSource(source);
    // Set default symbol for each source
    if (source === 'cex') {
      setSelectedSymbol('bitcoin');
    } else {
      setSelectedSymbol('0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640'); // WETH-USDC Uniswap V3
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Data Source:</span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => handleSourceChange('cex')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            dataSource === 'cex'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          CEX (CoinGecko)
        </button>
        <button
          onClick={() => handleSourceChange('dex')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            dataSource === 'dex'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          DEX (Multi-Chain)
        </button>
      </div>
      {dataSource === 'dex' && (
        <span className="text-xs text-amber-600 ml-2">
          ⚠️ DEX mode - Requires specific pair addresses (coming soon)
        </span>
      )}
      {dataSource === 'cex' && (
        <span className="text-xs text-green-600 ml-2">
          ✅ Active - Bitcoin, Ethereum, XRP, etc.
        </span>
      )}
    </div>
  );
}
