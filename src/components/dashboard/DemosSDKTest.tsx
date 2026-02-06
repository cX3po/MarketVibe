'use client';

// Demos SDK Test Component - Demonstrates wallet and blockchain features

import { useState } from 'react';

interface WalletInfo {
  address: string;
  mnemonic: string;
  balance: string;
}

export function DemosSDKTest() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDemosSDK = async () => {
    setIsConnecting(true);
    setError(null);
    setLogs([]);

    try {
      addLog('Importing Demos SDK...');

      // Dynamic import to avoid SSR issues
      const { Demos } = await import('@kynesyslabs/demosdk/websdk');

      addLog('✅ SDK imported successfully');
      addLog('Initializing Demos instance...');

      // 1. Initialize Demos SDK
      const demos = new Demos();
      addLog('✅ Demos instance created');

      // 2. Connect to the network
      addLog('Connecting to Demos network RPC...');
      const rpc = 'https://demosnode.discus.sh';
      await demos.connect(rpc);
      addLog(`✅ Connected to ${rpc}`);

      // 3. Generate a new mnemonic
      addLog('Generating new mnemonic phrase...');
      const mnemonic = demos.newMnemonic();
      addLog('✅ Mnemonic generated (12 words)');

      // 4. Connect wallet with mnemonic
      addLog('Connecting wallet with mnemonic...');
      await demos.connectWallet(mnemonic);
      addLog('✅ Wallet connected');

      // 5. Get wallet address
      const address = demos.getAddress();
      addLog(`✅ Wallet address: ${address}`);

      // 6. Try to get balance (may be 0 for new wallet)
      addLog('Checking DEM token balance...');
      try {
        const balance = await demos.getBalance(address);
        addLog(`✅ Balance: ${balance} DEM`);

        setWalletInfo({
          address,
          mnemonic,
          balance: balance.toString(),
        });
      } catch (balanceError: any) {
        addLog(`⚠️ Could not fetch balance: ${balanceError.message}`);
        setWalletInfo({
          address,
          mnemonic,
          balance: 'Unable to fetch',
        });
      }

      addLog('✅ Test completed successfully!');

    } catch (err: any) {
      console.error('SDK Test Error:', err);
      setError(err.message || 'Unknown error occurred');
      addLog(`❌ Error: ${err.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const testCrossChain = async () => {
    addLog('Testing cross-chain features...');

    try {
      addLog('Importing EVM module...');
      const { EVM } = await import('@kynesyslabs/demosdk/xm-websdk');
      addLog('✅ EVM module imported');

      addLog('Creating EVM instance for Ethereum Sepolia...');
      const evm = await EVM.create('https://rpc.ankr.com/eth_sepolia');
      addLog('✅ EVM instance created');

      addLog('ℹ️ Cross-chain features available:');
      addLog('  - Send transactions on 10+ chains');
      addLog('  - Bridge assets between chains');
      addLog('  - Check balances on any supported chain');
      addLog('  - Sign and execute cross-chain swaps');

    } catch (err: any) {
      addLog(`⚠️ Cross-chain test: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>🔐</span>
          Demos SDK Test
        </h2>
        <p className="text-purple-100 mt-2">
          Test the Demos SDK wallet and blockchain features
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h3 className="font-bold text-blue-900 mb-2">What is Demos SDK?</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li><strong>NOT a market data API</strong> - No stock/crypto prices or charts</li>
              <li><strong>Blockchain/Web3 SDK</strong> - For wallet operations and transactions</li>
              <li><strong>Cross-chain support</strong> - Ethereum, BSC, Solana, Bitcoin, and more</li>
              <li><strong>DeFi features</strong> - Swaps, bridges, smart contracts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">SDK Tests</h3>

        <div className="space-y-4">
          <button
            onClick={testDemosSDK}
            disabled={isConnecting}
            className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <span>🔐</span>
                Test Wallet Connection
              </>
            )}
          </button>

          <button
            onClick={testCrossChain}
            disabled={isConnecting}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <span>🔗</span>
            Test Cross-Chain Features
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start gap-3">
            <span className="text-2xl">❌</span>
            <div>
              <h3 className="font-bold text-red-900">Error</h3>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Info */}
      {walletInfo && (
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
          <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
            <span>✅</span>
            Wallet Created Successfully
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <label className="font-semibold text-green-800">Address:</label>
              <p className="text-green-700 font-mono break-all bg-green-100 p-2 rounded mt-1">
                {walletInfo.address}
              </p>
            </div>
            <div>
              <label className="font-semibold text-green-800">Balance:</label>
              <p className="text-green-700 font-mono bg-green-100 p-2 rounded mt-1">
                {walletInfo.balance} DEM
              </p>
            </div>
            <div>
              <label className="font-semibold text-green-800">Mnemonic (SAVE THIS!):</label>
              <p className="text-green-700 font-mono break-all bg-green-100 p-2 rounded mt-1 text-xs">
                {walletInfo.mnemonic}
              </p>
              <p className="text-xs text-green-600 mt-1">
                ⚠️ This is a test wallet. In production, never share your mnemonic!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Logs */}
      {logs.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <span>📋</span>
            Execution Log
          </h3>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div
                key={index}
                className="text-sm font-mono text-gray-300 hover:bg-gray-800 px-2 py-1 rounded transition-colors"
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Demos SDK vs Current Market Data APIs
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Feature</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Demos SDK</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Current APIs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 font-medium">Stock/Crypto Prices</td>
                <td className="py-3 px-4 text-center text-red-600">❌</td>
                <td className="py-3 px-4 text-center text-green-600">✅</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">OHLCV Chart Data</td>
                <td className="py-3 px-4 text-center text-red-600">❌</td>
                <td className="py-3 px-4 text-center text-green-600">✅</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Technical Indicators</td>
                <td className="py-3 px-4 text-center text-red-600">❌</td>
                <td className="py-3 px-4 text-center text-green-600">✅</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Wallet Management</td>
                <td className="py-3 px-4 text-center text-green-600">✅</td>
                <td className="py-3 px-4 text-center text-red-600">❌</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Execute Trades</td>
                <td className="py-3 px-4 text-center text-green-600">✅</td>
                <td className="py-3 px-4 text-center text-red-600">❌</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Cross-Chain Swaps</td>
                <td className="py-3 px-4 text-center text-green-600">✅</td>
                <td className="py-3 px-4 text-center text-red-600">❌</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Smart Contracts</td>
                <td className="py-3 px-4 text-center text-green-600">✅</td>
                <td className="py-3 px-4 text-center text-red-600">❌</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Conclusion:</strong> The Demos SDK and current market data APIs serve completely
            different purposes. The SDK is for blockchain transactions and wallet operations, while
            our current APIs provide the market data needed for charts and analysis. Both can coexist
            for different features!
          </p>
        </div>
      </div>
    </div>
  );
}
