import React, { useState } from 'react';
import { LPPosition, Chain } from '../types';
import { PositionCard } from './PositionCard';
import { calculateImpermanentLoss, formatUSD } from '../utils/lpMath';
import { ShieldCheck, AlertTriangle, Layers, Plus, TrendingUp, Search, RefreshCcw, Wallet, ArrowRight, BellRing } from 'lucide-react';

interface PositionListProps {
  positions: LPPosition[];
  chains: Chain[];
  selectedChainId: string;
  onSelectChain: (chainId: string) => void;
  onSelectPosition: (position: LPPosition) => void;
  onOpenAddPosition: () => void;
  onFetchPositions?: (address: string, chainId: string) => Promise<void>;
  isFetchingWallet?: boolean;
}

export const PositionList: React.FC<PositionListProps> = ({
  positions,
  chains,
  selectedChainId,
  onSelectChain,
  onSelectPosition,
  onOpenAddPosition,
  onFetchPositions,
  isFetchingWallet = false,
}) => {
  const [walletInput, setWalletInput] = useState('');
  const [targetChain, setTargetChain] = useState(selectedChainId === 'all' ? 'robinhood' : selectedChainId);

  const handleFetchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletInput.trim() || !onFetchPositions) return;
    await onFetchPositions(walletInput.trim(), targetChain);
  };

  // Filter positions by selected chain
  const filteredPositions = selectedChainId === 'all'
    ? positions
    : positions.filter((p) => p.chainId === selectedChainId);

  // Compute aggregate stats across filtered positions
  const totalLPValue = filteredPositions.reduce((acc, p) => {
    const il = calculateImpermanentLoss(p);
    return acc + il.lpValueUSD;
  }, 0);

  const totalRewardsUSD = filteredPositions.reduce((acc, p) => acc + p.rewards.amountUSD, 0);

  const activeAlertsCount = filteredPositions.filter((p) => {
    const isOutOfRange = p.currentPrice <= p.minPrice || p.currentPrice >= p.maxPrice;
    const isAboveUpper = p.currentPrice >= p.alertConfig.upperPriceThreshold;
    const isBelowLower = p.currentPrice <= p.alertConfig.lowerPriceThreshold;
    return isOutOfRange || isAboveUpper || isBelowLower;
  }).length;

  return (
    <div className="space-y-6 text-white">

      {/* Fetch LP Positions Header Banner */}
      <div className="bg-[#121824] border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <span>Fetch On-Chain Liquidity Positions</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select your blockchain network and provide your wallet address to fetch live LP positions & configure divergence alerts.
            </p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg self-start sm:self-auto">
            <BellRing className="w-3.5 h-3.5" />
            <span>Alert & Sentinel Ready</span>
          </div>
        </div>

        <form onSubmit={handleFetchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Blockchain Network
            </label>
            <select
              value={targetChain}
              onChange={(e) => setTargetChain(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs font-semibold text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
            >
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name} ({chain.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Wallet Address / LP Position Contract
            </label>
            <input
              type="text"
              placeholder="e.g. 0x540e1dd1895E7bAc9115FF262004E0Fe6d6Ce2Ce"
              value={walletInput}
              onChange={(e) => setWalletInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-300 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500 placeholder-slate-600"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isFetchingWallet || !walletInput.trim()}
              className="w-full h-[40px] bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isFetchingWallet ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Fetch LP Data</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1">
          <span className="font-semibold text-slate-500">Quick Test Address:</span>
          <button
            type="button"
            onClick={() => {
              setWalletInput('0x540e1dd1895E7bAc9115FF262004E0Fe6d6Ce2Ce');
              setTargetChain('robinhood');
            }}
            className="text-emerald-400 hover:underline font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800 transition cursor-pointer"
          >
            0x540e...Ce2Ce (Robinhood Chain)
          </button>
        </div>
      </div>
      
      {/* Prominent High-Attention Red Alert Message Banner when any position is alerting/out-of-range */}
      {activeAlertsCount > 0 && (
        <div className="bg-red-950/90 border-2 border-red-500 text-red-100 p-4 rounded-2xl shadow-2xl shadow-red-950/70 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <span className="text-2xl animate-bounce">🚨</span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm text-red-200 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  🚨 RED ALERT ON SCREEN: {activeAlertsCount} POOL(S) REQUIRE ATTENTION!
                </span>
              </div>
              <p className="text-xs text-red-200 mt-1 font-mono">
                Divergence risk or out-of-range position detected! SMS and screen alerts actively monitoring your LP capital.
              </p>
            </div>
          </div>
          <div className="text-right whitespace-nowrap">
            <span className="inline-block text-xs font-bold text-red-100 bg-red-800/80 px-3 py-1.5 rounded-xl border border-red-600">
              🚨 CRITICAL WARNING
            </span>
          </div>
        </div>
      )}

      {/* Top Portfolio Summary Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total LP Value */}
        <div className="bg-[#121824] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>TOTAL LP VALUE</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white block">
            {formatUSD(totalLPValue)}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">
            Across {filteredPositions.length} active liquidity positions
          </p>
        </div>

        {/* Unclaimed Yield */}
        <div className="bg-[#121824] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>UNCLAIMED REWARDS</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 block">
            +{formatUSD(totalRewardsUSD)}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">
            Earned emissions (STONX, UNI, RAY, etc.)
          </p>
        </div>

        {/* Active Positions */}
        <div className="bg-[#121824] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>MONITORED POOLS</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white block">
            {filteredPositions.length}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">
            Automated Range & Threshold Alerts
          </p>
        </div>

        {/* Active Alert Triggers */}
        <div className={`border rounded-2xl p-5 shadow-xl transition ${
          activeAlertsCount > 0
            ? 'bg-red-950/80 border-red-500 text-red-100 shadow-red-950/50 animate-pulse'
            : 'bg-[#121824] border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className={activeAlertsCount > 0 ? 'text-red-300 font-extrabold' : ''}>ALERT HEALTH STATUS</span>
            <AlertTriangle className={`w-4 h-4 ${activeAlertsCount > 0 ? 'text-red-400 animate-bounce' : 'text-emerald-400'}`} />
          </div>
          <span className={`text-2xl sm:text-3xl font-bold font-mono block ${activeAlertsCount > 0 ? 'text-red-200' : ''}`}>
            {activeAlertsCount > 0 ? `🚨 ${activeAlertsCount} Alerting` : '100% In Range'}
          </span>
          <p className={`text-[11px] mt-1 ${activeAlertsCount > 0 ? 'text-red-300 font-semibold' : 'opacity-80'}`}>
            {activeAlertsCount > 0 ? 'Price near bound or out of range!' : 'All pools operating safely in range'}
          </p>
        </div>

      </div>

      {/* Filter Tabs & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121824] p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => onSelectChain('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
              selectedChainId === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            All Networks ({positions.length})
          </button>

          {chains.map((chain) => {
            const count = positions.filter((p) => p.chainId === chain.id).length;
            if (count === 0 && selectedChainId !== chain.id) return null;

            return (
              <button
                key={chain.id}
                onClick={() => onSelectChain(chain.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap flex items-center space-x-1.5 ${
                  selectedChainId === chain.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{chain.name}</span>
                <span className="px-1.5 py-0.2 text-[10px] bg-slate-900/60 rounded-full font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onOpenAddPosition}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New LP Position</span>
        </button>
      </div>

      {/* Grid of Position Cards or Empty Prompt */}
      {filteredPositions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPositions.map((pos) => {
            const chain = chains.find((c) => c.id === pos.chainId);
            return (
              <PositionCard
                key={pos.id}
                position={pos}
                chain={chain}
                onSelect={onSelectPosition}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-[#121824] border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-emerald-400 border border-slate-800 shadow-inner">
            <Wallet className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Monitored Positions</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Please enter your wallet address and select your blockchain above to fetch your live LP positions and configure range alerts.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <button
              onClick={onOpenAddPosition}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-slate-700 rounded-xl transition flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Manually Track LP Position</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
