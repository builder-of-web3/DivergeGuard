import React, { useState } from 'react';
import { Chain, LPPosition } from '../types';
import { X, Layers, Plus, Sparkles, ShieldAlert } from 'lucide-react';

interface AddPositionModalProps {
  chains: Chain[];
  isOpen: boolean;
  onClose: () => void;
  onAddPosition: (newPos: LPPosition) => void;
}

export const AddPositionModal: React.FC<AddPositionModalProps> = ({
  chains,
  isOpen,
  onClose,
  onAddPosition,
}) => {
  if (!isOpen) return null;

  const [chainId, setChainId] = useState(chains[0]?.id || 'robinhood');
  const [token0Symbol, setToken0Symbol] = useState('ETH');
  const [token1Symbol, setToken1Symbol] = useState('USDC');
  const [token0Amount, setToken0Amount] = useState('0.15');
  const [token1Amount, setToken1Amount] = useState('300');
  const [protocol, setProtocol] = useState('Uniswap V3');
  const [feeTier, setFeeTier] = useState('0.05%');
  
  const [currentPrice, setCurrentPrice] = useState('1900');
  const [minPrice, setMinPrice] = useState('1800');
  const [maxPrice, setMaxPrice] = useState('2200');
  
  const [lowerAlertThreshold, setLowerAlertThreshold] = useState('1850');
  const [upperAlertThreshold, setUpperAlertThreshold] = useState('1950');
  const [ilLimit, setIlLimit] = useState('5.0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const curP = parseFloat(currentPrice) || 1900;
    const minP = parseFloat(minPrice) || 1800;
    const maxP = parseFloat(maxPrice) || 2200;
    const lowerA = parseFloat(lowerAlertThreshold) || 1850;
    const upperA = parseFloat(upperAlertThreshold) || 1950;
    const ilL = parseFloat(ilLimit) || 5.0;

    const t0Amt = parseFloat(token0Amount) || 0.15;
    const t1Amt = parseFloat(token1Amount) || 300;

    const principalUSD = (t0Amt * curP) + (t1Amt * 1.0);

    const newPos: LPPosition = {
      id: `pos-${Date.now()}`,
      poolName: `${token0Symbol.toUpperCase()} - ${token1Symbol.toUpperCase()}`,
      poolSymbol: `${token0Symbol.toUpperCase()}/${token1Symbol.toUpperCase()}`,
      protocol,
      feeTier,
      poolType: 'v3',
      chainId,
      status: 'in_range',
      
      token0: {
        symbol: token0Symbol.toUpperCase(),
        name: token0Symbol.toUpperCase(),
        amount: t0Amt,
        initialAmount: t0Amt,
        priceUSD: curP,
        initialPriceUSD: curP,
      },
      token1: {
        symbol: token1Symbol.toUpperCase(),
        name: token1Symbol.toUpperCase(),
        amount: t1Amt,
        initialAmount: t1Amt,
        priceUSD: 1.0,
        initialPriceUSD: 1.0,
      },

      principalUSD: Number(principalUSD.toFixed(2)),
      initialPrincipalUSD: Number(principalUSD.toFixed(2)),

      rewards: {
        symbol: 'UNI',
        amount: 0.0,
        amountUSD: 0.0,
        apr: 45.0,
        earnedTimeframe: 'all',
      },

      minPrice: minP,
      maxPrice: maxP,
      currentPrice: curP,
      entryPrice: curP,

      alertConfig: {
        enabled: true,
        upperPriceThreshold: upperA,
        lowerPriceThreshold: lowerA,
        ilPercentageLimit: ilL,
        shiftPercentageThreshold: 2.5,
        notifyBrowser: true,
        notifyTelegram: true,
        notifyEmail: false,
        notifySound: true,
      },

      positionHistory: [
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          action: 'Deposit',
          valueUSD: Number(principalUSD.toFixed(2)),
          token0Amount: t0Amt,
          token1Amount: t1Amt,
          notes: 'LP Position Created & Range Alerts Configured',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    onAddPosition(newPos);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#121824] border border-slate-800 text-white rounded-2xl w-full max-w-xl p-6 shadow-2xl relative my-8 animate-fadeIn">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 border-b border-slate-800 pb-4 mb-5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Track New Liquidity Position</h2>
            <p className="text-xs text-slate-400">
              Configure pool tokens, range bounds, and automated early warning alert limits
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Blockchain & Protocol */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Blockchain Network</label>
              <select
                value={chainId}
                onChange={(e) => setChainId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
              >
                {chains.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Protocol / DEX</label>
              <input
                type="text"
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. Uniswap V3, ve33"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Fee Tier</label>
              <select
                value={feeTier}
                onChange={(e) => setFeeTier(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
              >
                <option value="0.05%">0.05% (Stables/Volatile)</option>
                <option value="0.102%">0.102% (ve33 / Robinhood)</option>
                <option value="0.30%">0.30% (Standard)</option>
                <option value="1.00%">1.00% (Exotic)</option>
              </select>
            </div>
          </div>

          {/* Token Deposit Amounts */}
          <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Token 0 (e.g. ETH)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={token0Symbol}
                  onChange={(e) => setToken0Symbol(e.target.value)}
                  className="w-1/3 bg-slate-900 border border-slate-700 text-white font-bold rounded-lg p-2 uppercase"
                />
                <input
                  type="number"
                  step="any"
                  value={token0Amount}
                  onChange={(e) => setToken0Amount(e.target.value)}
                  className="w-2/3 bg-slate-900 border border-slate-700 text-white font-mono rounded-lg p-2"
                  placeholder="Amount"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Token 1 (e.g. USDC / USDG)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={token1Symbol}
                  onChange={(e) => setToken1Symbol(e.target.value)}
                  className="w-1/3 bg-slate-900 border border-slate-700 text-white font-bold rounded-lg p-2 uppercase"
                />
                <input
                  type="number"
                  step="any"
                  value={token1Amount}
                  onChange={(e) => setToken1Amount(e.target.value)}
                  className="w-2/3 bg-slate-900 border border-slate-700 text-white font-mono rounded-lg p-2"
                  placeholder="Amount"
                />
              </div>
            </div>
          </div>

          {/* Current & Range Bounds */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Min Price Bound</label>
              <input
                type="number"
                step="any"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 font-mono text-white rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
                placeholder="1800"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Entry Price</label>
              <input
                type="number"
                step="any"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 font-mono text-emerald-400 font-bold rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
                placeholder="1900"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Max Price Bound</label>
              <input
                type="number"
                step="any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 font-mono text-white rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
                placeholder="2200"
              />
            </div>
          </div>

          {/* Inner Early Warning Alert Limits */}
          <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl space-y-2">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>Inner Proactive Alert Thresholds</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 text-[11px] font-medium mb-1">Lower Alert ($)</label>
                <input
                  type="number"
                  step="any"
                  value={lowerAlertThreshold}
                  onChange={(e) => setLowerAlertThreshold(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-500/50 font-mono text-amber-300 rounded-lg p-2"
                  placeholder="1850"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] font-medium mb-1">Upper Alert ($)</label>
                <input
                  type="number"
                  step="any"
                  value={upperAlertThreshold}
                  onChange={(e) => setUpperAlertThreshold(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-500/50 font-mono text-amber-300 rounded-lg p-2"
                  placeholder="1950"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] font-medium mb-1">Max IL Limit (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={ilLimit}
                  onChange={(e) => setIlLimit(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-500/50 font-mono text-rose-300 rounded-lg p-2"
                  placeholder="5.0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20"
            >
              Start Monitoring Position
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
