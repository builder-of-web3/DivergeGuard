import React, { useState } from 'react';
import { Chain } from '../types';
import { X, ExternalLink, Plus, Globe, Shield } from 'lucide-react';

interface AddCustomChainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveChain: (chain: Chain) => void;
}

export const AddCustomChainModal: React.FC<AddCustomChainModalProps> = ({
  isOpen,
  onClose,
  onSaveChain,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('ETH');
  const [rpcUrl, setRpcUrl] = useState('');
  const [explorerUrl, setExplorerUrl] = useState('');
  const [chainIdNumber, setChainIdNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newChain: Chain = {
      id,
      name: name.trim(),
      symbol: symbol.toUpperCase().trim() || 'ETH',
      color: '#10B981',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      isCustom: true,
      rpcUrl: rpcUrl.trim(),
      explorerUrl: explorerUrl.trim(),
      chainIdNumber: chainIdNumber ? parseInt(chainIdNumber) : undefined,
    };

    onSaveChain(newChain);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#121824] border border-slate-800 text-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fadeIn">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 border-b border-slate-800 pb-4 mb-5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Provision Custom Blockchain</h2>
            <p className="text-xs text-slate-400">
              Add any EVM or custom L1/L2 blockchain to monitor LP pools
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Blockchain Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
              placeholder="e.g. Berachain, Monad, Sonic Mainnet"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Native Token Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white font-bold rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none uppercase"
                placeholder="BERA, SOL, ETH"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Chain ID Number</label>
              <input
                type="number"
                value={chainIdNumber}
                onChange={(e) => setChainIdNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 font-mono text-white rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
                placeholder="80094"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">RPC Endpoint URL</label>
            <input
              type="url"
              value={rpcUrl}
              onChange={(e) => setRpcUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 font-mono text-white rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
              placeholder="https://rpc.berachain.com"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Block Explorer URL</label>
            <input
              type="url"
              value={explorerUrl}
              onChange={(e) => setExplorerUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 font-mono text-white rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
              placeholder="https://berascan.com"
            />
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
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20"
            >
              Provision Network
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
