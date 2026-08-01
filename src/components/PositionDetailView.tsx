import React, { useState } from 'react';
import { 
  LPPosition, 
  Chain 
} from '../types';
import { 
  calculateImpermanentLoss, 
  formatUSD, 
  formatToken 
} from '../utils/lpMath';
import { 
  ArrowLeft, 
  ExternalLink, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Volume2, 
  VolumeX, 
  Layers, 
  Clock, 
  Sliders, 
  Zap, 
  ShieldAlert,
  Info,
  SlidersHorizontal,
  RefreshCcw,
  Trash2
} from 'lucide-react';

interface PositionDetailViewProps {
  position: LPPosition;
  chain?: Chain;
  onBack: () => void;
  onUpdateAlertConfig: (updatedPosition: LPPosition) => void;
  onDeletePosition: (positionId: string) => void;
  onTriggerTestAlert: (position: LPPosition) => void;
}

export const PositionDetailView: React.FC<PositionDetailViewProps> = ({
  position,
  chain,
  onBack,
  onUpdateAlertConfig,
  onDeletePosition,
  onTriggerTestAlert,
}) => {
  const [timeframe, setTimeframe] = useState<'all' | '24h' | '7d'>('all');
  const [isAlertSettingsOpen, setIsAlertSettingsOpen] = useState(false);
  const [priceUnitToggle, setPriceUnitToggle] = useState<'token1' | 'token0'>('token1');

  // Form state for editing alert configuration
  const [upperAlertInput, setUpperAlertInput] = useState(position.alertConfig.upperPriceThreshold.toString());
  const [lowerAlertInput, setLowerAlertInput] = useState(position.alertConfig.lowerPriceThreshold.toString());
  const [ilLimitInput, setIlLimitInput] = useState(position.alertConfig.ilPercentageLimit.toString());
  const [notifyBrowser, setNotifyBrowser] = useState(position.alertConfig.notifyBrowser);
  const [notifyTelegram, setNotifyTelegram] = useState(position.alertConfig.notifyTelegram);
  const [notifyEmail, setNotifyEmail] = useState(position.alertConfig.notifyEmail);
  const [notifySound, setNotifySound] = useState(position.alertConfig.notifySound);

  const ilData = calculateImpermanentLoss(position);

  // Status checks
  const isOutOfRange = position.currentPrice <= position.minPrice || position.currentPrice >= position.maxPrice;
  const isAboveUpperAlert = position.currentPrice >= position.alertConfig.upperPriceThreshold;
  const isBelowLowerAlert = position.currentPrice <= position.alertConfig.lowerPriceThreshold;
  const isNearAlert = isAboveUpperAlert || isBelowLowerAlert;

  // Calculate percentage progress inside range [minPrice, maxPrice]
  const rangeWidth = position.maxPrice - position.minPrice;
  const rawProgress = rangeWidth > 0 ? ((position.currentPrice - position.minPrice) / rangeWidth) * 100 : 50;
  const rangeProgress = Math.max(0, Math.min(100, rawProgress));

  // Calculate inner alert pin position percentages
  const lowerAlertProgress = rangeWidth > 0 ? Math.max(0, Math.min(100, ((position.alertConfig.lowerPriceThreshold - position.minPrice) / rangeWidth) * 100)) : 20;
  const upperAlertProgress = rangeWidth > 0 ? Math.max(0, Math.min(100, ((position.alertConfig.upperPriceThreshold - position.minPrice) / rangeWidth) * 100)) : 80;

  const handleSaveAlertSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const upper = parseFloat(upperAlertInput);
    const lower = parseFloat(lowerAlertInput);
    const il = parseFloat(ilLimitInput);

    if (isNaN(upper) || isNaN(lower) || isNaN(il)) return;

    const updated: LPPosition = {
      ...position,
      alertConfig: {
        ...position.alertConfig,
        upperPriceThreshold: upper,
        lowerPriceThreshold: lower,
        ilPercentageLimit: il,
        notifyBrowser,
        notifyTelegram,
        notifyEmail,
        notifySound,
      },
    };

    onUpdateAlertConfig(updated);
    setIsAlertSettingsOpen(false);
  };

  return (
    <div className="space-y-6 text-white pb-12">
      
      {/* Top Header Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121824] border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Token Icons & Names */}
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs border-2 border-[#121824] text-white shadow-md">
                {position.token0.symbol.substring(0, 3)}
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs border-2 border-[#121824] text-white shadow-md">
                {position.token1.symbol.substring(0, 3)}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  {position.poolName}
                </h1>

                <span className="px-2 py-0.5 text-xs font-mono font-medium bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                  {position.feeTier}
                </span>

                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-md">
                  {position.protocol}
                </span>

                {/* Status Badge */}
                {isOutOfRange ? (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-full flex items-center space-x-1 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Out of Range</span>
                  </span>
                ) : isNearAlert ? (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full flex items-center space-x-1 animate-bounce">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Threshold Alert</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In Range</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                <span className="font-medium text-slate-300">{chain?.name || 'Robinhood Chain'}</span>
                <span>•</span>
                <span>Created {new Date(position.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Actions Menu */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAlertSettingsOpen(!isAlertSettingsOpen)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 rounded-xl transition flex items-center space-x-1.5"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Configure Alerts</span>
          </button>

          <button
            onClick={() => onTriggerTestAlert(position)}
            className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-xs font-semibold text-indigo-300 border border-indigo-500/30 rounded-xl transition flex items-center space-x-1.5"
            title="Fire a test notification now"
          >
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Test Alert</span>
          </button>

          {position.mintTxUrl && (
            <a
              href={position.mintTxUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-xl transition"
              title="View Mint Transaction"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={() => {
              if (confirm('Are you sure you want to stop tracking this LP position?')) {
                onDeletePosition(position.id);
                onBack();
              }
            }}
            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition"
            title="Delete Position"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alert Configuration Panel Drawer (Collapsible) */}
      {isAlertSettingsOpen && (
        <form onSubmit={handleSaveAlertSettings} className="bg-[#151D2C] border border-amber-500/30 rounded-2xl p-5 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Automated Range & Impermanent Loss Thresholds</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAlertSettingsOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lower Price Alert Limit ({position.token1.symbol} / {position.token0.symbol})
              </label>
              <input
                type="number"
                step="0.01"
                value={lowerAlertInput}
                onChange={(e) => setLowerAlertInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-sm font-mono text-amber-300 px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Trigger warning when price dips below this value (Min price: ${position.minPrice})
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Upper Price Alert Limit ({position.token1.symbol} / {position.token0.symbol})
              </label>
              <input
                type="number"
                step="0.01"
                value={upperAlertInput}
                onChange={(e) => setUpperAlertInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-sm font-mono text-amber-300 px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Trigger warning when price surges above this value (Max price: ${position.maxPrice})
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max Impermanent Loss Limit (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={ilLimitInput}
                onChange={(e) => setIlLimitInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-sm font-mono text-rose-300 px-3 py-2 rounded-xl focus:outline-none focus:border-rose-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Trigger alert if IL exceeds this % threshold (e.g. 5.0%)
              </p>
            </div>
          </div>

          {/* Delivery Channel Toggles */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-300 block mb-2">Notification Channels</span>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyBrowser}
                  onChange={(e) => setNotifyBrowser(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span>🌐 Browser Push</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyTelegram}
                  onChange={(e) => setNotifyTelegram(e.target.checked)}
                  className="rounded border-slate-700 text-sky-500 focus:ring-sky-500"
                />
                <span className="text-sky-300">✈️ Telegram Bot</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-500 focus:ring-indigo-500"
                />
                <span>📧 Webhook / Email</span>
              </label>

              <label className="flex items-center space-x-2 text-xs text-slate-300 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifySound}
                  onChange={(e) => setNotifySound(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span>🔔 Audio Chime</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAlertSettingsOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20"
            >
              Save Alert Rules
            </button>
          </div>
        </form>
      )}

      {/* Main Grid 1: Principal Card + Emissions Earned Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Principal Card (Matching uploaded layout) */}
        <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Principal
              </span>
              <span className="text-sm font-bold text-white font-mono">
                {formatUSD(ilData.lpValueUSD)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white block">
                  {formatToken(position.token0.amount, 6)}
                </span>
                <span className="text-xs font-medium text-slate-400 mt-1 block">
                  {position.token0.symbol}
                </span>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white block">
                  {formatToken(position.token1.amount, 3)}
                </span>
                <span className="text-xs font-medium text-slate-400 mt-1 block">
                  {position.token1.symbol}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Entry Value: {formatUSD(position.initialPrincipalUSD)}</span>
            <span className={ilData.lpValueUSD >= position.initialPrincipalUSD ? 'text-emerald-400' : 'text-rose-400'}>
              {(ilData.lpValueUSD >= position.initialPrincipalUSD ? '+' : '')}
              {(((ilData.lpValueUSD - position.initialPrincipalUSD) / position.initialPrincipalUSD) * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Emissions Earned Card (Matching uploaded layout) */}
        <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Emissions Earned
              </span>

              {/* Timeframe Filter Toggles */}
              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setTimeframe('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    timeframe === 'all'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All time
                </button>
                <button
                  onClick={() => setTimeframe('24h')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    timeframe === '24h'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  24h
                </button>
                <button
                  onClick={() => setTimeframe('7d')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    timeframe === '7d'
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  7d
                </button>
                <span className="text-[11px] text-slate-400 pl-2">
                  Implied APR: <strong className="text-emerald-400">~{position.rewards.apr.toFixed(2)}%</strong>
                </span>
              </div>
            </div>

            <div className="mt-6 bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-bold font-mono text-white block">
                  {formatToken(
                    timeframe === '24h' ? position.rewards.amount * 0.12 : timeframe === '7d' ? position.rewards.amount * 0.55 : position.rewards.amount,
                    6
                  )}
                </span>
                <span className="text-xs font-medium text-slate-400 mt-1 block">
                  {position.rewards.symbol}
                </span>
              </div>

              <div className="text-right">
                <span className="text-sm font-semibold text-emerald-400 font-mono block">
                  +{formatUSD(position.rewards.amountUSD)}
                </span>
                <span className="text-[11px] text-slate-500">Unclaimed Yield</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Auto-compounding Active</span>
            <span className="text-indigo-400 font-medium hover:underline cursor-pointer">Collect Rewards ↗</span>
          </div>
        </div>

      </div>

      {/* Main Section 2: Price Range & Divergence Visualizer (Crucial requirement from prompt!) */}
      <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Price Range & Range Bounds</span>
              <Info className="w-4 h-4 text-slate-400" title="Concentrated liquidity active bounds" />
            </h2>
            <p className="text-xs text-slate-400">
              Monitors position range and triggers alerts before price exits bounds
            </p>
          </div>

          <button
            onClick={() => setPriceUnitToggle(priceUnitToggle === 'token1' ? 'token0' : 'token1')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 rounded-xl border border-slate-800 flex items-center space-x-1 font-medium transition self-start sm:self-auto"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Unit: {priceUnitToggle === 'token1' ? `${position.token1.symbol} per ${position.token0.symbol}` : `${position.token0.symbol} per ${position.token1.symbol}`}</span>
          </button>
        </div>

        {/* 3 Price Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Min Price Card */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Min price
            </span>
            <span className="text-2xl font-bold font-mono text-white block">
              {position.minPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-[11px] text-slate-400 mt-2 leading-tight">
              The price at which the position will be converted entirely to {position.token0.symbol}.
            </p>
          </div>

          {/* Current Price Card */}
          <div className={`p-4 rounded-xl border transition ${
            isOutOfRange
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
              : isNearAlert
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
              : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Current price
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80">
                LIVE
              </span>
            </div>
            <span className="text-2xl font-bold font-mono block">
              {position.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-[11px] opacity-80 mt-2 leading-tight">
              The current price of the pool.
            </p>
          </div>

          {/* Max Price Card */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              Max price
            </span>
            <span className="text-2xl font-bold font-mono text-white block">
              {position.maxPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <p className="text-[11px] text-slate-400 mt-2 leading-tight">
              The price at which the position will be converted entirely to {position.token1.symbol}.
            </p>
          </div>

        </div>

        {/* Visual Liquidity Range & Alert Gauge Bar */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Min: ${position.minPrice}</span>
            <span className="text-amber-400 font-semibold">Lower Alert: ${position.alertConfig.lowerPriceThreshold}</span>
            <span className="text-emerald-400 font-bold">Current: ${position.currentPrice}</span>
            <span className="text-amber-400 font-semibold">Upper Alert: ${position.alertConfig.upperPriceThreshold}</span>
            <span>Max: ${position.maxPrice}</span>
          </div>

          {/* Multi-zone Progress Bar */}
          <div className="relative w-full h-8 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 p-1">
            
            {/* Background Safety Bands */}
            <div className="absolute inset-y-1 left-0 w-full flex">
              {/* Left Out of Range (Red) */}
              <div className="h-full bg-rose-500/20" style={{ width: `${lowerAlertProgress}%` }} />
              {/* Inner Safety Zone (Green/Emerald) */}
              <div className="h-full bg-emerald-500/20" style={{ width: `${upperAlertProgress - lowerAlertProgress}%` }} />
              {/* Right Out of Range (Red) */}
              <div className="h-full bg-rose-500/20" style={{ width: `${100 - upperAlertProgress}%` }} />
            </div>

            {/* Lower Alert Pin Marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
              style={{ left: `${lowerAlertProgress}%` }}
              title={`Lower Alert Threshold: $${position.alertConfig.lowerPriceThreshold}`}
            />

            {/* Upper Alert Pin Marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
              style={{ left: `${upperAlertProgress}%` }}
              title={`Upper Alert Threshold: $${position.alertConfig.upperPriceThreshold}`}
            />

            {/* Current Price Cursor Indicator */}
            <div 
              className="absolute top-1 bottom-1 -ml-2.5 w-5 rounded-md bg-white border-2 border-emerald-500 shadow-lg z-20 flex items-center justify-center transition-all duration-300"
              style={{ left: `${rangeProgress}%` }}
              title={`Current Price: $${position.currentPrice}`}
            >
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            </div>

          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-rose-500/50 inline-block" />
              <span>Out of bounds risk</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
              <span>Proactive alert thresholds</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>Optimal yield zone</span>
            </span>
          </div>

        </div>

      </div>

      {/* Main Section 3: Impermanent Loss & HODL Comparison */}
      <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Impermanent Loss & Strategy Comparison</span>
              <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded font-mono">
                Concentrated Model
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluates LP position performance relative to holding pure underlying tokens
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">IL Percentage</span>
            <span className={`text-lg font-bold font-mono ${ilData.ilPercentage < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {ilData.ilPercentage}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block">Current LP Value</span>
            <span className="text-2xl font-bold font-mono text-white block mt-1">
              {formatUSD(ilData.lpValueUSD)}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              {formatToken(position.token0.amount, 4)} {position.token0.symbol} + {formatToken(position.token1.amount, 2)} {position.token1.symbol}
            </span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block">HODL Value (Hold Strategy)</span>
            <span className="text-2xl font-bold font-mono text-slate-200 block mt-1">
              {formatUSD(ilData.hodlValueUSD)}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              {formatToken(position.token0.initialAmount, 4)} {position.token0.symbol} + {formatToken(position.token1.initialAmount, 2)} {position.token1.symbol}
            </span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block">Net Impermanent Loss ($)</span>
            <span className={`text-2xl font-bold font-mono block mt-1 ${ilData.ilUSD < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {formatUSD(ilData.ilUSD)}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              {ilData.ilUSD < 0 ? 'Difference vs Holding Raw Tokens' : 'No Impermanent Loss'}
            </span>
          </div>

        </div>

        {/* IL Price Shift Sensitivity Simulation Table */}
        <div className="overflow-x-auto">
          <span className="text-xs font-semibold text-slate-300 block mb-2">
            Price Shift Sensitivity Table (Simulated Volatility Scenarios)
          </span>
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-2.5">Simulated Shift</th>
                <th className="px-4 py-2.5">Simulated Price</th>
                <th className="px-4 py-2.5">Estimated LP Value</th>
                <th className="px-4 py-2.5">HODL Value</th>
                <th className="px-4 py-2.5">Est. IL %</th>
                <th className="px-4 py-2.5">Alert Trigger?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {[-20, -10, -5, 0, 5, 10, 20].map((shift) => {
                const simPrice = position.entryPrice * (1 + shift / 100);
                const simLPVal = (position.token0.initialAmount * simPrice) * (1 - Math.abs(shift) * 0.002) + position.token1.initialAmount;
                const simHodlVal = (position.token0.initialAmount * simPrice) + position.token1.initialAmount;
                const simIL = ((simLPVal - simHodlVal) / simHodlVal) * 100;
                const triggersAlert = simPrice <= position.alertConfig.lowerPriceThreshold || simPrice >= position.alertConfig.upperPriceThreshold;

                return (
                  <tr key={shift} className={shift === 0 ? 'bg-indigo-950/30 font-bold' : 'hover:bg-slate-900/40'}>
                    <td className="px-4 py-2 font-medium">
                      {shift > 0 ? `+${shift}%` : `${shift}%`}
                    </td>
                    <td className="px-4 py-2">${simPrice.toFixed(2)}</td>
                    <td className="px-4 py-2">${simLPVal.toFixed(2)}</td>
                    <td className="px-4 py-2">${simHodlVal.toFixed(2)}</td>
                    <td className={`px-4 py-2 ${simIL < 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {simIL.toFixed(2)}%
                    </td>
                    <td className="px-4 py-2 font-sans">
                      {triggersAlert ? (
                        <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 font-bold rounded">
                          ⚠️ Triggers Alert
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Safe</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Main Section 4: Position History Table (Matching uploaded layout) */}
      <div className="bg-[#121824] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white">
          Position History
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">{position.token0.symbol}</th>
                <th className="px-4 py-3">{position.token1.symbol}</th>
                <th className="px-4 py-3">{position.rewards.symbol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {position.positionHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50">
                  <td className="px-4 py-3 text-slate-400 flex items-center space-x-1.5 font-sans">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.timestamp}</span>
                  </td>
                  <td className="px-4 py-3 font-sans">
                    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                      item.action === 'Deposit'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : item.action === 'Alert Triggered'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {item.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white font-bold">{formatUSD(item.valueUSD)}</td>
                  <td className="px-4 py-3">{formatToken(item.token0Amount, 6)}</td>
                  <td className="px-4 py-3">{formatToken(item.token1Amount, 3)}</td>
                  <td className="px-4 py-3 text-emerald-400">
                    {item.rewardAmount ? formatToken(item.rewardAmount, 4) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
