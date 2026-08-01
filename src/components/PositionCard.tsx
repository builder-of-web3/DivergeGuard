import React from 'react';
import { LPPosition, Chain } from '../types';
import { calculateImpermanentLoss, formatUSD, formatToken } from '../utils/lpMath';
import { CheckCircle2, AlertTriangle, ShieldAlert, Zap, TrendingUp, ExternalLink } from 'lucide-react';

interface PositionCardProps {
  position: LPPosition;
  chain?: Chain;
  onSelect: (position: LPPosition) => void;
}

export const PositionCard: React.FC<PositionCardProps> = ({
  position,
  chain,
  onSelect,
}) => {
  const ilData = calculateImpermanentLoss(position);

  const isOutOfRange = position.currentPrice <= position.minPrice || position.currentPrice >= position.maxPrice;
  const isAboveUpperAlert = position.currentPrice >= position.alertConfig.upperPriceThreshold;
  const isBelowLowerAlert = position.currentPrice <= position.alertConfig.lowerPriceThreshold;
  const isNearAlert = isAboveUpperAlert || isBelowLowerAlert;

  // Calculate position progress % in range
  const rangeWidth = position.maxPrice - position.minPrice;
  const rawProgress = rangeWidth > 0 ? ((position.currentPrice - position.minPrice) / rangeWidth) * 100 : 50;
  const progress = Math.max(0, Math.min(100, rawProgress));

  return (
    <div 
      onClick={() => onSelect(position)}
      className="group bg-[#121824] hover:bg-[#161e2e] border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-all duration-200 cursor-pointer shadow-xl flex flex-col justify-between"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex -space-x-1.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-[11px] border-2 border-[#121824]">
                {position.token0.symbol.substring(0, 3)}
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-[11px] border-2 border-[#121824]">
                {position.token1.symbol.substring(0, 3)}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition">
                {position.poolName}
              </h3>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                <span>{chain?.name || 'Robinhood'}</span>
                <span>•</span>
                <span className="font-mono">{position.feeTier}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {isOutOfRange ? (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-full flex items-center space-x-1 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              <span>Out of Range</span>
            </span>
          ) : isNearAlert ? (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full flex items-center space-x-1 animate-bounce">
              <ShieldAlert className="w-3 h-3" />
              <span>Alert Bound</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>In Range</span>
            </span>
          )}
        </div>

        {/* Principal Value & Tokens */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Position Value</span>
            <span className="text-base font-bold font-mono text-white">
              {formatUSD(ilData.lpValueUSD)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300 font-mono pt-1 border-t border-slate-800/60">
            <span>{formatToken(position.token0.amount, 4)} {position.token0.symbol}</span>
            <span>+</span>
            <span>{formatToken(position.token1.amount, 2)} {position.token1.symbol}</span>
          </div>
        </div>

        {/* Price Range Visual Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Min: ${position.minPrice}</span>
            <span className="text-white font-bold">${position.currentPrice}</span>
            <span>Max: ${position.maxPrice}</span>
          </div>

          <div className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className={`h-full transition-all ${
                isOutOfRange ? 'bg-rose-500' : isNearAlert ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer: Rewards APR & IL */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div>
          <span className="text-[11px] text-slate-400 block">Implied APR</span>
          <span className="font-bold text-emerald-400 font-mono">
            ~{position.rewards.apr.toFixed(1)}%
          </span>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block">Impermanent Loss</span>
          <span className={`font-bold font-mono ${ilData.ilPercentage < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
            {ilData.ilPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
};
