import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { LPPosition } from '../types';

interface PriceSimulatorBarProps {
  position: LPPosition;
  onUpdatePrice: (newPrice: number) => void;
  onResetPrice: () => void;
}

export const PriceSimulatorBar: React.FC<PriceSimulatorBarProps> = ({
  position,
  onUpdatePrice,
  onResetPrice,
}) => {
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [customPriceInput, setCustomPriceInput] = useState(position.currentPrice.toString());

  useEffect(() => {
    setCustomPriceInput(position.currentPrice.toFixed(2));
  }, [position.currentPrice]);

  // Auto volatility ticker interval
  useEffect(() => {
    if (!isAutoSimulating) return;

    const intervalMs = simulationSpeed === 'fast' ? 1500 : simulationSpeed === 'medium' ? 2500 : 4000;

    const timer = setInterval(() => {
      // Generate random price delta (-1.2% to +1.2%)
      const deltaPercent = (Math.random() * 2.4 - 1.2) / 100;
      const nextPrice = Math.max(10, position.currentPrice * (1 + deltaPercent));
      onUpdatePrice(Number(nextPrice.toFixed(2)));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isAutoSimulating, position.currentPrice, simulationSpeed, onUpdatePrice]);

  const handlePriceShift = (percentage: number) => {
    const nextPrice = Math.max(1, position.currentPrice * (1 + percentage / 100));
    onUpdatePrice(Number(nextPrice.toFixed(2)));
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customPriceInput);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdatePrice(Number(parsed.toFixed(2)));
    }
  };

  const isAboveUpperAlert = position.currentPrice >= position.alertConfig.upperPriceThreshold;
  const isBelowLowerAlert = position.currentPrice <= position.alertConfig.lowerPriceThreshold;
  const isOutOfRange = position.currentPrice <= position.minPrice || position.currentPrice >= position.maxPrice;

  return (
    <div className="bg-[#121824] border border-slate-800 rounded-2xl p-3.5 sm:p-4 text-white shadow-xl mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Active Test Status */}
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${
            isOutOfRange 
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
              : isAboveUpperAlert || isBelowLowerAlert
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-bounce'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {isOutOfRange || isAboveUpperAlert || isBelowLowerAlert ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Live Price Volatility Simulator
              </span>
              {isAutoSimulating && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full flex items-center space-x-1 animate-pulse">
                  <Zap className="w-3 h-3 fill-amber-400" />
                  <span>Market Sim Active</span>
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3 mt-0.5">
              <span className="text-lg font-bold text-white tracking-tight">
                ${position.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-slate-400">
                Range: ${position.minPrice.toLocaleString()} - ${position.maxPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Quick Price Jump Preset Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => handlePriceShift(-5)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition flex items-center space-x-1"
            title="Simulate -5% price drop"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-5% Dump</span>
          </button>

          <button
            onClick={() => handlePriceShift(-2)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 transition"
          >
            <span>-2%</span>
          </button>

          {/* Preset triggers for user's requested values (e.g., 1850 & 1950 when range is 1800-2200) */}
          <button
            onClick={() => onUpdatePrice(position.alertConfig.lowerPriceThreshold)}
            className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition"
            title={`Set price to Lower Alert limit ($${position.alertConfig.lowerPriceThreshold})`}
          >
            Trigger Lower Alert (${position.alertConfig.lowerPriceThreshold})
          </button>

          <button
            onClick={() => onUpdatePrice(position.alertConfig.upperPriceThreshold)}
            className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition"
            title={`Set price to Upper Alert limit ($${position.alertConfig.upperPriceThreshold})`}
          >
            Trigger Upper Alert (${position.alertConfig.upperPriceThreshold})
          </button>

          <button
            onClick={() => handlePriceShift(2)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition"
          >
            <span>+2%</span>
          </button>

          <button
            onClick={() => handlePriceShift(5)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition flex items-center space-x-1"
            title="Simulate +5% price pump"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+5% Pump</span>
          </button>

          <button
            onClick={onResetPrice}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Reset to entry price"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Custom Price Input + Live Ticker Toggle */}
        <div className="flex items-center space-x-2">
          
          <form onSubmit={handleCustomSubmit} className="flex items-center">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
              <input
                type="number"
                step="0.01"
                value={customPriceInput}
                onChange={(e) => setCustomPriceInput(e.target.value)}
                className="w-24 bg-slate-900 border border-slate-700 text-xs font-mono text-white pl-6 pr-2 py-1.5 rounded-l-lg focus:outline-none focus:border-emerald-500"
                placeholder="Set Price"
              />
            </div>
            <button
              type="submit"
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border-t border-b border-r border-slate-700 rounded-r-lg font-medium transition"
            >
              Set
            </button>
          </form>

          {/* Auto Ticker Toggle */}
          <button
            onClick={() => setIsAutoSimulating(!isAutoSimulating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
              isAutoSimulating
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/10'
            }`}
          >
            {isAutoSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoSimulating ? 'Stop Ticker' : 'Auto Live Ticker'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
