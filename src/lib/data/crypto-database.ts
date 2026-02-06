// Comprehensive cryptocurrency database for searching by name
// Maps common crypto names to their symbols across different exchanges

export interface CryptoAsset {
  id: string; // CoinGecko/CoinCap ID (lowercase)
  symbol: string; // Binance base asset (uppercase)
  name: string; // Full display name
  aliases?: string[]; // Alternative names for searching
}

export const CRYPTO_DATABASE: CryptoAsset[] = [
  // Top 100 Cryptocurrencies by Market Cap
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', aliases: ['btc'] },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', aliases: ['eth', 'ether'] },
  { id: 'tether', symbol: 'USDT', name: 'Tether', aliases: ['usdt'] },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', aliases: ['binance coin'] },
  { id: 'solana', symbol: 'SOL', name: 'Solana', aliases: ['sol'] },
  { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', aliases: ['usdc'] },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', aliases: ['ripple'] },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', aliases: ['ada'] },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', aliases: ['doge'] },
  { id: 'tron', symbol: 'TRX', name: 'TRON', aliases: ['trx'] },

  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', aliases: ['avax'] },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', aliases: ['link'] },
  { id: 'wrapped-bitcoin', symbol: 'WBTC', name: 'Wrapped Bitcoin', aliases: ['wbtc'] },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', aliases: ['dot'] },
  { id: 'polygon', symbol: 'MATIC', name: 'Polygon', aliases: ['matic'] },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', aliases: ['shib', 'shiba'] },
  { id: 'dai', symbol: 'DAI', name: 'Dai', aliases: ['dai'] },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', aliases: ['ltc'] },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', aliases: ['uni'] },
  { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash', aliases: ['bch', 'bcash'] },

  { id: 'leo-token', symbol: 'LEO', name: 'LEO Token', aliases: ['leo'] },
  { id: 'okb', symbol: 'OKB', name: 'OKB', aliases: [] },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar', aliases: ['xlm'] },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', aliases: ['atom'] },
  { id: 'monero', symbol: 'XMR', name: 'Monero', aliases: ['xmr'] },
  { id: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic', aliases: ['etc'] },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin', aliases: ['fil'] },
  { id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', aliases: ['near'] },
  { id: 'hedera-hashgraph', symbol: 'HBAR', name: 'Hedera', aliases: ['hbar'] },
  { id: 'aptos', symbol: 'APT', name: 'Aptos', aliases: ['apt'] },

  { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer', aliases: ['icp'] },
  { id: 'vechain', symbol: 'VET', name: 'VeChain', aliases: ['vet'] },
  { id: 'cronos', symbol: 'CRO', name: 'Cronos', aliases: ['cro'] },
  { id: 'algorand', symbol: 'ALGO', name: 'Algorand', aliases: ['algo'] },
  { id: 'quant-network', symbol: 'QNT', name: 'Quant', aliases: ['qnt'] },
  { id: 'optimism', symbol: 'OP', name: 'Optimism', aliases: ['op'] },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum', aliases: ['arb'] },
  { id: 'the-graph', symbol: 'GRT', name: 'The Graph', aliases: ['grt', 'graph'] },
  { id: 'maker', symbol: 'MKR', name: 'Maker', aliases: ['mkr'] },
  { id: 'aave', symbol: 'AAVE', name: 'Aave', aliases: [] },

  { id: 'fantom', symbol: 'FTM', name: 'Fantom', aliases: ['ftm'] },
  { id: 'the-sandbox', symbol: 'SAND', name: 'The Sandbox', aliases: ['sand', 'sandbox'] },
  { id: 'eos', symbol: 'EOS', name: 'EOS', aliases: [] },
  { id: 'tezos', symbol: 'XTZ', name: 'Tezos', aliases: ['xtz'] },
  { id: 'theta-token', symbol: 'THETA', name: 'Theta Network', aliases: ['theta'] },
  { id: 'decentraland', symbol: 'MANA', name: 'Decentraland', aliases: ['mana'] },
  { id: 'flow', symbol: 'FLOW', name: 'Flow', aliases: [] },
  { id: 'axie-infinity', symbol: 'AXS', name: 'Axie Infinity', aliases: ['axs', 'axie'] },
  { id: 'elrond-erd-2', symbol: 'EGLD', name: 'MultiversX', aliases: ['egld', 'elrond'] },
  { id: 'immutable-x', symbol: 'IMX', name: 'Immutable', aliases: ['imx'] },

  { id: 'bitdao', symbol: 'BIT', name: 'BitDAO', aliases: ['bit'] },
  { id: 'frax', symbol: 'FRAX', name: 'Frax', aliases: [] },
  { id: 'kucoin-shares', symbol: 'KCS', name: 'KuCoin Token', aliases: ['kcs'] },
  { id: 'zcash', symbol: 'ZEC', name: 'Zcash', aliases: ['zec'] },
  { id: 'apecoin', symbol: 'APE', name: 'ApeCoin', aliases: ['ape'] },
  { id: 'curve-dao-token', symbol: 'CRV', name: 'Curve DAO Token', aliases: ['crv', 'curve'] },
  { id: 'chiliz', symbol: 'CHZ', name: 'Chiliz', aliases: ['chz'] },
  { id: 'pancakeswap-token', symbol: 'CAKE', name: 'PancakeSwap', aliases: ['cake'] },
  { id: 'neo', symbol: 'NEO', name: 'NEO', aliases: [] },
  { id: 'gala', symbol: 'GALA', name: 'Gala', aliases: [] },

  { id: 'mina-protocol', symbol: 'MINA', name: 'Mina Protocol', aliases: ['mina'] },
  { id: 'conflux-token', symbol: 'CFX', name: 'Conflux', aliases: ['cfx'] },
  { id: 'compound-ether', symbol: 'CETH', name: 'cETH', aliases: [] },
  { id: 'fetch-ai', symbol: 'FET', name: 'Fetch.ai', aliases: ['fet'] },
  { id: 'injective-protocol', symbol: 'INJ', name: 'Injective', aliases: ['inj'] },
  { id: 'render-token', symbol: 'RNDR', name: 'Render Token', aliases: ['rndr', 'render'] },
  { id: 'rocket-pool', symbol: 'RPL', name: 'Rocket Pool', aliases: ['rpl'] },
  { id: 'synthetix-network-token', symbol: 'SNX', name: 'Synthetix', aliases: ['snx'] },
  { id: 'lido-dao', symbol: 'LDO', name: 'Lido DAO', aliases: ['ldo', 'lido'] },
  { id: 'bitcoin-bep2', symbol: 'BTCB', name: 'Bitcoin BEP2', aliases: ['btcb'] },

  { id: '1inch', symbol: '1INCH', name: '1inch Network', aliases: ['1inch'] },
  { id: 'compound-governance-token', symbol: 'COMP', name: 'Compound', aliases: ['comp'] },
  { id: 'enjincoin', symbol: 'ENJ', name: 'Enjin Coin', aliases: ['enj', 'enjin'] },
  { id: 'zilliqa', symbol: 'ZIL', name: 'Zilliqa', aliases: ['zil'] },
  { id: 'basic-attention-token', symbol: 'BAT', name: 'Basic Attention Token', aliases: ['bat'] },
  { id: 'loopring', symbol: 'LRC', name: 'Loopring', aliases: ['lrc'] },
  { id: 'sushi', symbol: 'SUSHI', name: 'Sushi', aliases: ['sushiswap'] },
  { id: 'yearn-finance', symbol: 'YFI', name: 'yearn.finance', aliases: ['yfi', 'yearn'] },
  { id: 'dash', symbol: 'DASH', name: 'Dash', aliases: [] },
  { id: 'waves', symbol: 'WAVES', name: 'Waves', aliases: [] },

  { id: 'harmony', symbol: 'ONE', name: 'Harmony', aliases: ['one'] },
  { id: 'iota', symbol: 'IOTA', name: 'IOTA', aliases: ['miota'] },
  { id: 'celo', symbol: 'CELO', name: 'Celo', aliases: [] },
  { id: 'kava', symbol: 'KAVA', name: 'Kava', aliases: [] },
  { id: 'trust-wallet-token', symbol: 'TWT', name: 'Trust Wallet Token', aliases: ['twt'] },
  { id: 'osmosis', symbol: 'OSMO', name: 'Osmosis', aliases: ['osmo'] },
  { id: 'blur', symbol: 'BLUR', name: 'Blur', aliases: [] },
  { id: 'woo-network', symbol: 'WOO', name: 'WOO Network', aliases: ['woo'] },
  { id: 'sui', symbol: 'SUI', name: 'Sui', aliases: [] },
  { id: 'dydx', symbol: 'DYDX', name: 'dYdX', aliases: [] },

  // Meme Coins
  { id: 'pepe', symbol: 'PEPE', name: 'Pepe', aliases: [] },
  { id: 'floki', symbol: 'FLOKI', name: 'FLOKI', aliases: ['floki inu'] },
  { id: 'bonk', symbol: 'BONK', name: 'Bonk', aliases: [] },

  // Stablecoins
  { id: 'true-usd', symbol: 'TUSD', name: 'TrueUSD', aliases: ['tusd'] },
  { id: 'paxos-standard', symbol: 'USDP', name: 'Pax Dollar', aliases: ['pax', 'usdp'] },
  { id: 'gemini-dollar', symbol: 'GUSD', name: 'Gemini Dollar', aliases: ['gusd'] },
  { id: 'binance-usd', symbol: 'BUSD', name: 'Binance USD', aliases: ['busd'] },
];

/**
 * Search cryptocurrencies by name or symbol
 * @param query Search term (partial match supported)
 * @param limit Maximum results to return
 */
export function searchCrypto(query: string, limit: number = 50): CryptoAsset[] {
  if (!query || query.trim().length < 1) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();

  return CRYPTO_DATABASE
    .filter((asset) => {
      // Search by name
      if (asset.name.toLowerCase().includes(normalizedQuery)) {
        return true;
      }

      // Search by symbol
      if (asset.symbol.toLowerCase().includes(normalizedQuery)) {
        return true;
      }

      // Search by ID
      if (asset.id.toLowerCase().includes(normalizedQuery)) {
        return true;
      }

      // Search by aliases
      if (asset.aliases && asset.aliases.some(alias => alias.toLowerCase().includes(normalizedQuery))) {
        return true;
      }

      return false;
    })
    .slice(0, limit)
    .map((asset) => ({
      ...asset,
      // Prioritize exact matches
      relevance:
        asset.name.toLowerCase() === normalizedQuery ? 100 :
        asset.symbol.toLowerCase() === normalizedQuery ? 90 :
        asset.name.toLowerCase().startsWith(normalizedQuery) ? 80 :
        asset.symbol.toLowerCase().startsWith(normalizedQuery) ? 70 :
        50
    }))
    .sort((a, b) => b.relevance - a.relevance);
}
