// Zustand store for market and symbol selection

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MarketType } from '@/types';

export type DataSource = 'cex' | 'dex';
export type AppMode = 'trading' | 'learning' | 'ai-selection' | 'portfolio' | 'demos-wallet';

export interface PortfolioHolding {
  id: string;
  symbol: string;
  name: string;
  marketType: MarketType;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}

interface MarketState {
  marketType: MarketType;
  selectedSymbol: string;
  dataSource: DataSource;
  selectedChain: string;
  appMode: AppMode;
  portfolioHoldings: PortfolioHolding[];
  setMarketType: (marketType: MarketType) => void;
  setSelectedSymbol: (symbol: string) => void;
  setDataSource: (source: DataSource) => void;
  setSelectedChain: (chain: string) => void;
  setAppMode: (mode: AppMode) => void;
  addToPortfolio: (holding: Omit<PortfolioHolding, 'id'>) => void;
  removeFromPortfolio: (id: string) => void;
  updatePortfolioHolding: (id: string, updates: Partial<PortfolioHolding>) => void;
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set) => ({
      marketType: 'stocks',  // Default to stocks (real data, no rate limits)
      selectedSymbol: 'TSLA',
      dataSource: 'cex',
      selectedChain: 'ethereum',
      appMode: 'trading', // Default to trading mode
      portfolioHoldings: [],
      setMarketType: (marketType) => set({ marketType }),
      setSelectedSymbol: (selectedSymbol) => set({ selectedSymbol }),
      setDataSource: (dataSource) => set({ dataSource }),
      setSelectedChain: (selectedChain) => set({ selectedChain }),
      setAppMode: (appMode) => set({ appMode }),
      addToPortfolio: (holding) => set((state) => ({
        portfolioHoldings: [
          ...state.portfolioHoldings,
          { ...holding, id: `${Date.now()}-${Math.random()}` }
        ]
      })),
      removeFromPortfolio: (id) => set((state) => ({
        portfolioHoldings: state.portfolioHoldings.filter(h => h.id !== id)
      })),
      updatePortfolioHolding: (id, updates) => set((state) => ({
        portfolioHoldings: state.portfolioHoldings.map(h =>
          h.id === id ? { ...h, ...updates } : h
        )
      })),
    }),
    {
      name: 'market-storage',
      version: 3,
      migrate: (persistedState: any, version: number) => {
        // If version is less than 2, reset to defaults (clearing old crypto defaults)
        if (version < 2) {
          return {
            marketType: 'stocks',
            selectedSymbol: 'TSLA',
            dataSource: 'cex',
            selectedChain: 'ethereum',
            appMode: 'trading',
            portfolioHoldings: [],
          };
        }
        // If version is 2, add portfolio holdings array
        if (version < 3) {
          return {
            ...persistedState,
            portfolioHoldings: [],
          };
        }
        return persistedState as MarketState;
      },
    }
  )
);
