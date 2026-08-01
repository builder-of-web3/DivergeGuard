import React, { useState } from 'react';
import { SlidersHorizontal, Calculator, TrendingUp, Info, RefreshCw } from 'lucide-react';
import { calculateImpermanentLoss, formatUSD, formatToken } from '../utils/lpMath';

export const ILCalculatorView: React.FC = () => {
  const [token0Symbol, setToken0Symbol] = useState('ETH');
  const [token1Symbol, setToken1Symbol] = useState('USDC');
  
  const [token0Amount, setToken0Amount] = useState('0.15');
  const [token1Amount, setToken1Amount] = useState('300');
  
  const [entryPrice, setEntryPrice] = useState('1900');
  const [futurePrice, setFuturePrice] = useState('2100');
  const [minPrice, setMinPrice] = useState('1800');
  const [maxPrice, setMaxPrice] = useState('2200');

  const curPriceNum = parseFloat(futurePrice) || 2100;
  const entryPriceNum = parseFloat(entryPrice) || 1900;
  const minPriceNum = parseFloat(minPrice) || 1800;
  const maxPriceNum = parseFloat(maxPrice) || 2200;

  const t0Amt = parseFloat(token0Amount) || 0.15;
  const t1Amt = parseFloat(token1Amount) || 300;

  // Compute calculated metrics
  const mockPosition = {
    token0: { symbol: token0Symbol, name: token0Symbol, amount: t0Amt, initialAmount: t0Amt, priceUSD: curPriceNum, initialPriceUSD: entryPriceNum },
    token1: { symbol: token1Symbol, name: token1Symbol, amount: t1Amt, initialAmount: t1Amt, priceUSD: 1.0, initialPriceUSD: 1.0 },
    minPrice: minPriceNum,
    maxPrice: maxPriceNum,
    currentPrice: curPriceNum,
    entryPrice: entryPriceNum,
  };

  const ilResult = calculateImpermanentLoss(mockPosition);
  const priceChangePercent = ((curPriceNum - entryPriceNum) / entryPriceNum) * 100;

  return (
    <div className="space-y-6 text-white pb-12">
      
      {/* Title */}
      <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Impermanent Loss & Strategy Model Calculator</h1>
            <p className="text-xs text-slate-400">
              Model price divergence scenarios, range width sensitivity, and HODL comparison before depositing LP liquidity
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls Column */}
        <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Position Parameters</span>
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Token A Symbol</label>
              <input
                type="text"
                value={token0Symbol}
                onChange={(e) => setToken0Symbol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white font-bold rounded-xl p-2.5 uppercase"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Token B Symbol</label>
              <input
                type="text"
                value={token1Symbol}
                onChange={(e) => setToken1Symbol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white font-bold rounded-xl p-2.5 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Deposit {token0Symbol}</label>
              <input
                type="number"
                step="any"
                value={token0Amount}
                onChange={(e) => setToken0Amount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 font-mono text-white rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Deposit {token1Symbol}</label>
              <input
                type="number"
                step="any"
                value={token1Amount}
                onChange={(e) => setToken1Amount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 font-mono text-white rounded-xl p-2.5"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Entry Price ($)</label>
              <input
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 font-mono text-white rounded-xl p-2.5"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-slate-300 font-semibold">Simulated Future Price ($)</label>
                <span className={`font-mono text-[11px] font-bold ${priceChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
                </span>
              </div>
              <input
                type="number"
                step="any"
                value={futurePrice}
                onChange={(e) => setFuturePrice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 font-mono text-emerald-400 font-bold rounded-xl p-2.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Min Price Range</label>
                <input
                  type="number"
                  step="any"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 font-mono text-white rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Max Price Range</label>
                <input
                  type="number"
                  step="any"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 font-mono text-white rounded-xl p-2.5"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Results & Comparison Column */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-[#121824] border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-xs text-slate-400 block font-semibold">LP Position Value</span>
              <span className="text-2xl font-bold font-mono text-white block mt-1">
                {formatUSD(ilResult.lpValueUSD)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">At Future Price ${curPriceNum}</span>
            </div>

            <div className="bg-[#121824] border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-xs text-slate-400 block font-semibold">HODL Value</span>
              <span className="text-2xl font-bold font-mono text-slate-200 block mt-1">
                {formatUSD(ilResult.hodlValueUSD)}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">Holding Original Tokens</span>
            </div>

            <div className="bg-[#121824] border border-slate-800 rounded-2xl p-5 shadow-xl">
              <span className="text-xs text-slate-400 block font-semibold">Impermanent Loss</span>
              <span className={`text-2xl font-bold font-mono block mt-1 ${ilResult.ilPercentage < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {ilResult.ilPercentage}%
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">Delta: {formatUSD(ilResult.ilUSD)}</span>
            </div>

          </div>

          {/* Scenario Simulation Table */}
          <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white">
              Price Shock Sensitivity Model Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Price Move</th>
                    <th className="px-4 py-3">Price Level</th>
                    <th className="px-4 py-3">LP Value</th>
                    <th className="px-4 py-3">HODL Value</th>
                    <th className="px-4 py-3">Impermanent Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {[-50, -30, -15, -5, 0, 5, 15, 30, 50, 100].map((shift) => {
                    const testPrice = entryPriceNum * (1 + shift / 100);
                    const testLPVal = (t0Amt * testPrice) * (1 - Math.abs(shift) * 0.0018) + t1Amt;
                    const testHodlVal = (t0Amt * testPrice) + t1Amt;
                    const testIL = ((testLPVal - testHodlVal) / testHodlVal) * 100;

                    return (
                      <tr key={shift} className={shift === 0 ? 'bg-indigo-950/40 font-bold text-white' : 'hover:bg-slate-900/40'}>
                        <td className="px-4 py-2.5 font-sans font-medium">
                          {shift > 0 ? `+${shift}%` : `${shift}%`}
                        </td>
                        <td className="px-4 py-2.5">${testPrice.toFixed(2)}</td>
                        <td className="px-4 py-2.5">${testLPVal.toFixed(2)}</td>
                        <td className="px-4 py-2.5">${testHodlVal.toFixed(2)}</td>
                        <td className={`px-4 py-2.5 ${testIL < 0 ? 'text-rose-400 font-semibold' : 'text-emerald-400'}`}>
                          {testIL.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
