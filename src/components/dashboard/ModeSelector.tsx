'use client';

// Mode selector for switching between Trading, Learning, and AI Selection modes

import { useMarketStore, AppMode } from '@/store/market-store';

export function ModeSelector() {
  const { appMode, setAppMode } = useMarketStore();

  const modes: { value: AppMode; label: string; icon: string; description: string }[] = [
    {
      value: 'trading',
      label: 'Trading',
      icon: '📊',
      description: 'Active trading mode with real-time data',
    },
    {
      value: 'learning',
      label: 'Learning',
      icon: '🎓',
      description: 'Learn mode with tooltips explaining everything',
    },
    {
      value: 'ai-selection',
      label: 'AI Selection',
      icon: '🤖',
      description: 'AI picks top 5 assets based on vibe score',
    },
    {
      value: 'portfolio',
      label: 'Portfolio',
      icon: '💼',
      description: 'Track your holdings and portfolio performance',
    },
    {
      value: 'demos-wallet',
      label: 'Demos Wallet',
      icon: '🔐',
      description: 'Connect your Demos wallet (Coming Soon)',
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-2">
            Mode:
          </span>
          <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
            {modes.map((mode) => (
              <button
                key={mode.value}
                onClick={() => setAppMode(mode.value)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                  appMode === mode.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                title={mode.description}
              >
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>

          {/* Description of current mode */}
          <div className="ml-4 text-sm text-gray-600">
            {modes.find((m) => m.value === appMode)?.description}
          </div>
        </div>
      </div>
    </div>
  );
}
