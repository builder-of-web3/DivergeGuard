import React from 'react';
import { LPPosition, Chain } from '../types';
import { PositionCard } from './PositionCard';
import { calculateImpermanentLoss, formatUSD } from '../utils/lpMath';
import { ShieldCheck, AlertTriangle, Layers, Plus, TrendingUp, Zap, Sparkles } from 'lucide-react';

interface PositionListProps {
  positions: LPPosition[];
  chains: Chain[];
  selectedChainId: string;
  onSelectChain: (chainId: string) => void;
  onSelectPosition: (position: LPPosition) => void;
  onOpenAddPosition: () => void;
}

export const PositionList: React.FC<PositionListProps> = ({
  positions,
  chains,
  selectedChainId,
  onSelectChain,
  onSelectPosition,
  onOpenAddPosition,
}) => {
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
            Automated Range & IL Tracking
          </p>
        </div>

        {/* Active Alert Triggers */}
        <div className={`border rounded-2xl p-5 shadow-xl transition ${
          activeAlertsCount > 0
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
            : 'bg-[#121824] border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span>ALERT HEALTH STATUS</span>
            <AlertTriangle className={`w-4 h-4 ${activeAlertsCount > 0 ? 'text-amber-400 animate-bounce' : 'text-emerald-400'}`} />
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono block">
            {activeAlertsCount > 0 ? `${activeAlertsCount} Alerting` : '100% In Range'}
          </span>
          <p className="text-[11px] opacity-80 mt-1">
            {activeAlertsCount > 0 ? 'Price near bound or out of range' : 'All pools operating safely in range'}
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

      {/* Grid of Position Cards */}
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
        <div className="bg-[#121824] border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-900 mx-auto flex items-center justify-center text-slate-500 border border-slate-800">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No LP Positions Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              There are no tracked liquidity positions on this network yet.
            </p>
          </div>
          <button
            onClick={onOpenAddPosition}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            Track New LP Position
          </button>
        </div>
      )}

    </div>
  );
};
