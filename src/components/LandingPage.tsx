import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  BellRing, 
  Layers, 
  Search, 
  ArrowRight, 
  BarChart3, 
  SlidersHorizontal, 
  Globe, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Send
} from 'lucide-react';
import { Chain } from '../types';

interface LandingPageProps {
  onLaunchApp: () => void;
  chains: Chain[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp, chains }) => {
  return (
    <div className="text-white space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10 px-4">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>On-Chain Liquidity Protection Sentinel v2.5</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Automated Impermanent Loss & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Range Bound Sentinel
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            DivergeGuard delivers real-time price divergence monitoring, tick range boundary alerts, and multi-channel notifications for concentrated and ve(3,3) liquidity pools across Robinhood Chain and EVMs.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-xl shadow-emerald-500/25 transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Launch DivergeGuard App</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-sm rounded-xl border border-slate-800 transition flex items-center justify-center space-x-2"
            >
              <span>How DivergeGuard Works</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-[#121824]/90 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 block">Supported Networks</span>
              <span className="text-xl font-bold font-mono text-emerald-400 block mt-0.5">
                {chains.length} Blockchains
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Robinhood, EVMs & Custom</span>
            </div>

            <div className="bg-[#121824]/90 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 block">Monitoring Speed</span>
              <span className="text-xl font-bold font-mono text-white block mt-0.5">
                Real-Time RPC
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Instant Range Checks</span>
            </div>

            <div className="bg-[#121824]/90 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 block">Alert Channels</span>
              <span className="text-xl font-bold font-mono text-cyan-400 block mt-0.5">
                Telegram & Audio
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Browser + Telegram Bot</span>
            </div>

            <div className="bg-[#121824]/90 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs text-slate-400 block">Privacy Standard</span>
              <span className="text-xl font-bold font-mono text-emerald-300 block mt-0.5">
                100% Read-Only
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">No Keys / Non-Custodial</span>
            </div>
          </div>

        </div>
      </section>

      {/* Why Needed / Pain Points */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            The Liquidity Provider Challenge
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">
            Why Active LP Protection is Crucial in Modern DeFi
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Concentrated and ve(3,3) pools generate high yields, but market volatility presents silent capital risks if left unmonitored.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#121824] border border-slate-800 p-6 rounded-2xl space-y-3 relative group hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Unmonitored Impermanent Loss</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When asset prices diverge rapidly, token ratios shift automatically. Without automated tracking, unexpected price spikes erode accumulated trading fees.
            </p>
          </div>

          <div className="bg-[#121824] border border-slate-800 p-6 rounded-2xl space-y-3 relative group hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Out-of-Range Fee Halting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In concentrated liquidity pools, if the price slips beyond your min or max bounds, your position completely stops earning swap rewards until rebalanced.
            </p>
          </div>

          <div className="bg-[#121824] border border-slate-800 p-6 rounded-2xl space-y-3 relative group hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <BellRing className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Delayed Rebalance Alerts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Checking block explorers manually leads to missed entry and exit signals. DivergeGuard pushes instant Telegram alerts directly to your mobile device.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Overview */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="bg-gradient-to-b from-[#121824] to-[#0d121c] border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-10 shadow-2xl">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Engine Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Built for Precision LP Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Everything you need to fetch, inspect, and monitor on-chain pool health in one unified interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 font-bold mt-1">
                <Search className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Address & Contract On-Demand Fetching</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No preset default address needed. Provide any wallet address or LP position contract to auto-detect active mints, token balances, and unclaimed rewards.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0 font-bold mt-1">
                <BellRing className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Custom Threshold & Range Boundary Sentinel</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Set precise upper and lower price threshold limits for each pool. DivergeGuard constantly evaluates tick health and flags out-of-bounds positions.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 font-bold mt-1">
                <Send className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Direct Telegram Bot Integration</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Configure your custom Telegram Bot Token and Chat ID to receive instant mobile alerts whenever a position approaches or breaches range bounds.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 font-bold mt-1">
                <Globe className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Robinhood Chain & Custom EVM Provisioning</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Native support for Robinhood Chain, Ethereum, Arbitrum, Solana, and custom RPC chain parameters for emerging Layer 2 ecosystems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Step-by-Step */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 space-y-12 scroll-mt-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            3-Step Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How to Use DivergeGuard
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          <div className="bg-[#121824] border border-slate-800 p-6 rounded-2xl space-y-4 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="text-sm font-bold text-white">Select Network & Input Address</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open the App page, pick your target blockchain (e.g. Robinhood Chain), and paste your wallet address or LP contract.
            </p>
          </div>

          <div className="bg-[#121824] border border-slate-800 p-6 rounded-2xl space-y-4 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="text-sm font-bold text-white">Fetch Live Pool Details</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              DivergeGuard queries on-chain RPC nodes to calculate current LP principal value, underlying token ratios, and emission rewards.
            </p>
          </div>

          <div className="bg-[#121824] border border-slate-800 p-6 rounded-2xl space-y-4 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="text-sm font-bold text-white">Configure Sentinel Alerts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Set upper and lower threshold alerts, test your browser audio or Telegram bot triggers, and receive immediate alerts when prices drift.
            </p>
          </div>

        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-r from-emerald-950/80 via-[#121824] to-teal-950/80 border border-emerald-500/30 p-8 sm:p-12 rounded-3xl text-center space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Ready to Protect Your On-Chain LP Capital?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            No registration or private keys required. Select your chain, input your wallet, and activate real-time range bounds monitoring now.
          </p>
          <div className="pt-2">
            <button
              onClick={onLaunchApp}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition transform hover:scale-105 inline-flex items-center space-x-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Launch App Now</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
