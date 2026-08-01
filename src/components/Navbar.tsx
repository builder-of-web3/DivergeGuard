import React, { useState } from 'react';
import { Chain, AlertNotification } from '../types';
import { 
  ShieldAlert, 
  Bell, 
  Send, 
  Plus, 
  Layers, 
  ExternalLink,
  SlidersHorizontal,
  Zap,
  Volume2,
  VolumeX,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  chains: Chain[];
  selectedChainId: string;
  onSelectChain: (chainId: string) => void;
  onOpenAddCustomChain: () => void;
  onOpenAddPosition: () => void;
  onOpenTelegramConfig: () => void;
  onOpenNotificationCenter: () => void;
  notifications: AlertNotification[];
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeTab: 'positions' | 'chains';
  onChangeTab: (tab: 'positions' | 'chains') => void;
  pageMode: 'landing' | 'app';
  onSelectPageMode: (mode: 'landing' | 'app') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  chains,
  selectedChainId,
  onSelectChain,
  onOpenAddCustomChain,
  onOpenAddPosition,
  onOpenTelegramConfig,
  onOpenNotificationCenter,
  notifications,
  soundEnabled,
  onToggleSound,
  activeTab,
  onChangeTab,
  pageMode,
  onSelectPageMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeChain = chains.find((c) => c.id === selectedChainId) || chains[0];

  return (
    <header className="sticky top-0 z-40 bg-[#0F141C]/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <button 
            onClick={() => onSelectPageMode('landing')} 
            className="flex items-center space-x-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 p-0.5 shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition">
              <div className="w-full h-full bg-[#0F141C] rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-indigo-300 bg-clip-text text-transparent">
                  DivergeGuard
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full tracking-wider uppercase">
                  SENTINEL v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Cross-Chain Range & IL Sentinel
              </p>
            </div>
          </button>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => onSelectPageMode('landing')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
                pageMode === 'landing'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span>Home</span>
            </button>

            <button
              onClick={() => {
                onSelectPageMode('app');
                onChangeTab('positions');
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
                pageMode === 'app' && activeTab === 'positions'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sentinel App</span>
            </button>

            {pageMode === 'app' && (
              <button
                onClick={() => onChangeTab('chains')}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'chains'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Blockchains ({chains.length})</span>
              </button>
            )}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Chain Selector */}
            <div className="relative group">
              <select
                value={selectedChainId}
                onChange={(e) => {
                  if (e.target.value === '__add_custom__') {
                    onOpenAddCustomChain();
                  } else {
                    onSelectChain(e.target.value);
                  }
                }}
                className="appearance-none bg-slate-900 border border-slate-700/80 text-xs text-slate-200 font-medium pl-3 pr-8 py-2 rounded-xl focus:outline-none focus:border-emerald-500/50 hover:bg-slate-800 transition cursor-pointer"
              >
                <option value="all">⚡ All Chains ({chains.length})</option>
                {chains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.isCustom ? '🛠️ ' : ''}{chain.name}
                  </option>
                ))}
                <option value="__add_custom__">+ Provision Custom Chain...</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            {/* Telegram Bot Setup */}
            <button
              onClick={onOpenTelegramConfig}
              title="Configure Telegram Bot Alerts"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 hover:text-sky-300 hover:border-sky-500/40 hover:bg-sky-500/10 transition flex items-center space-x-1 text-xs"
            >
              <Send className="w-4 h-4" />
              <span className="hidden lg:inline text-[11px] font-medium">Telegram Bot</span>
            </button>

            {/* Mute/Sound Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
              className={`p-2 rounded-xl border text-xs transition ${
                soundEnabled
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotificationCenter}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
              title="Alert Notifications Center"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-md shadow-rose-500/50">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* New Position Button */}
            <button
              onClick={onOpenAddPosition}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Track LP Position</span>
            </button>

            {/* Mobile Hamburger Menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F141C] border-b border-slate-800 px-4 py-3 space-y-2">
          <button
            onClick={() => { onSelectPageMode('landing'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 ${
              pageMode === 'landing' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
            }`}
          >
            <span>Home (Landing)</span>
          </button>

          <button
            onClick={() => { onSelectPageMode('app'); onChangeTab('positions'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 ${
              pageMode === 'app' && activeTab === 'positions' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Sentinel App</span>
          </button>

          <button
            onClick={() => { onSelectPageMode('app'); onChangeTab('chains'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2 ${
              pageMode === 'app' && activeTab === 'chains' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            <span>Blockchains ({chains.length})</span>
          </button>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => { onOpenAddPosition(); setMobileMenuOpen(false); }}
              className="w-full py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Track New LP Position</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
