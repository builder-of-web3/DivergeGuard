import React, { useState } from 'react';
import { 
  Wallet, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  Coins, 
  Layers, 
  ShieldCheck, 
  Search,
  ArrowRight
} from 'lucide-react';
import { WalletPortfolioResult } from '../utils/blockchain';

interface WalletScannerBarProps {
  walletAddress: string;
  onAddressChange: (newAddress: string) => void;
  onSyncWallet: (address: string) => void;
  portfolio: WalletPortfolioResult | null;
  isLoading: boolean;
  onImportLpPositions: () => void;
}

export const WalletScannerBar: React.FC<WalletScannerBarProps> = ({
  walletAddress,
  onAddressChange,
  onSyncWallet,
  portfolio,
  isLoading,
  onImportLpPositions,
}) => {
  const [showHoldings, setShowHoldings] = useState(false);

  const truncatedAddress = walletAddress.length > 12 
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` 
    : walletAddress;

  return (
    <div className="bg-[#121824] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      
      {/* Search Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-white">Robinhood Chain & EVM On-Chain Portfolio Sync</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE RPC</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Fetch real balances, token reserves, and LP positions for address on Robinhood Chain
            </p>
          </div>
        </div>

        {/* Input & Sync Actions */}
        <div className="flex items-center space-x-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Enter EVM / Robinhood Chain address (0x...)"
              className="w-full bg-slate-900 border border-slate-700 font-mono text-xs text-emerald-300 font-medium pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500 transition placeholder:text-slate-600"
            />
          </div>

          <button
            onClick={() => onSyncWallet(walletAddress)}
            disabled={isLoading}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Syncing...' : 'Sync On-Chain'}</span>
          </button>
        </div>

      </div>

      {/* Portfolio Info Cards */}
      {portfolio && (
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* Wallet Address Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Target Address</span>
                <span className="font-mono text-xs text-white font-bold block mt-0.5" title={portfolio.address}>
                  {truncatedAddress}
                </span>
              </div>
              <a
                href={`https://explorer.robinhoodchain.xyz/address/${portfolio.address}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition"
                title="View on Robinhood Chain Explorer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            </div>

            {/* Total Portfolio Value */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Verified Net Worth</span>
              <span className="font-mono text-sm text-emerald-400 font-bold block mt-0.5">
                ${portfolio.totalValueUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* On-chain LP Positions Count */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">Active LP Positions</span>
                <span className="font-mono text-sm text-indigo-300 font-bold block mt-0.5">
                  {portfolio.lpPositions.length} Detected
                </span>
              </div>
              <button
                onClick={onImportLpPositions}
                className="px-2.5 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-[11px] font-semibold transition flex items-center space-x-1 cursor-pointer"
              >
                <span>Import</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Sync Timestamp & Status */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">RPC Status</span>
                <span className="text-xs text-slate-200 font-medium block mt-0.5 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Synced {portfolio.lastSyncedAt}</span>
                </span>
              </div>

              <button
                onClick={() => setShowHoldings(!showHoldings)}
                className="text-[11px] text-slate-400 hover:text-white underline font-medium"
              >
                {showHoldings ? 'Hide Tokens' : 'Tokens'}
              </button>
            </div>

          </div>

          {/* Token Holdings Expandable Drawer */}
          {showHoldings && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-slate-400 font-semibold border-b border-slate-800 pb-2 text-[11px] uppercase tracking-wider">
                <span>Wallet Asset</span>
                <span>Balance</span>
                <span>Price</span>
                <span>Value (USD)</span>
              </div>
              {portfolio.holdings.map((h, i) => (
                <div key={i} className="flex items-center justify-between font-mono text-slate-200 py-1 hover:bg-slate-800/40 rounded px-1">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${h.symbol === 'ETH' ? 'bg-indigo-400' : h.symbol === 'USDG' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                    <span className="font-bold font-sans text-white">{h.symbol}</span>
                    <span className="text-[10px] text-slate-500 hidden sm:inline">({h.name})</span>
                  </div>
                  <span>{h.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                  <span>${h.priceUSD.toLocaleString()}</span>
                  <span className="text-emerald-400 font-bold">${h.valueUSD.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
