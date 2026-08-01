import { Chain } from '../types';

export const DEFAULT_CHAINS: Chain[] = [
  {
    id: 'robinhood',
    name: 'Robinhood Chain',
    symbol: 'ETH',
    color: '#10B981', // Emerald
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rpcUrl: 'https://rpc.robinhoodchain.xyz',
    explorerUrl: 'https://explorer.robinhoodchain.xyz',
    chainIdNumber: 9991,
  },
  {
    id: 'ethereum',
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    color: '#627EEA',
    iconBg: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    rpcUrl: 'https://eth.llamarpc.com',
    explorerUrl: 'https://etherscan.io',
    chainIdNumber: 1,
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum One',
    symbol: 'ETH',
    color: '#28A0F0',
    iconBg: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    chainIdNumber: 42161,
  },
  {
    id: 'base',
    name: 'Base',
    symbol: 'ETH',
    color: '#0052FF',
    iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
    chainIdNumber: 8453,
  },
  {
    id: 'polygon',
    name: 'Polygon PoS',
    symbol: 'POL',
    color: '#8247E5',
    iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    chainIdNumber: 137,
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    color: '#14F195',
    iconBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorerUrl: 'https://solscan.io',
  },
  {
    id: 'optimism',
    name: 'Optimism',
    symbol: 'ETH',
    color: '#FF0420',
    iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
    chainIdNumber: 10,
  },
  {
    id: 'bsc',
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    color: '#F3BA2F',
    iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com',
    chainIdNumber: 56,
  },
  {
    id: 'avalanche',
    name: 'Avalanche C-Chain',
    symbol: 'AVAX',
    color: '#E84142',
    iconBg: 'bg-red-500/20 text-red-400 border-red-500/30',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    chainIdNumber: 43114,
  }
];

const CUSTOM_CHAINS_KEY = 'omnilp_custom_chains_v1';

export function getStoredChains(): Chain[] {
  try {
    const raw = localStorage.getItem(CUSTOM_CHAINS_KEY);
    if (raw) {
      const custom: Chain[] = JSON.parse(raw);
      return [...DEFAULT_CHAINS, ...custom];
    }
  } catch (e) {
    console.error('Failed to parse custom chains', e);
  }
  return DEFAULT_CHAINS;
}

export function saveCustomChain(chain: Chain): Chain[] {
  try {
    const currentCustom = getCustomChains();
    const updated = [...currentCustom, { ...chain, isCustom: true }];
    localStorage.setItem(CUSTOM_CHAINS_KEY, JSON.stringify(updated));
    return [...DEFAULT_CHAINS, ...updated];
  } catch (e) {
    console.error('Failed to save custom chain', e);
    return DEFAULT_CHAINS;
  }
}

export function getCustomChains(): Chain[] {
  try {
    const raw = localStorage.getItem(CUSTOM_CHAINS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load custom chains', e);
  }
  return [];
}
