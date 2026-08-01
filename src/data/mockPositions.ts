import { LPPosition } from '../types';

export const INITIAL_POSITIONS: LPPosition[] = [
  {
    id: 'pos-robinhood-eth-usdg',
    poolName: 'ETH - USDG',
    poolSymbol: 'ETH/USDG',
    protocol: 've33',
    feeTier: '0.102%',
    poolType: 've33',
    chainId: 'robinhood',
    status: 'in_range',
    
    token0: {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 0.130793,
      initialAmount: 0.127663,
      priceUSD: 1862.74,
      initialPriceUSD: 1860.00,
      color: '#627EEA',
    },
    token1: {
      symbol: 'USDG',
      name: 'Global USD',
      amount: 240.453,
      initialAmount: 246.284,
      priceUSD: 1.0,
      initialPriceUSD: 1.0,
      color: '#10B981',
    },
    
    principalUSD: 484.07,
    initialPrincipalUSD: 483.74,
    
    rewards: {
      symbol: 'STONX',
      amount: 0.315953,
      amountUSD: 12.80,
      apr: 250.57,
      earnedTimeframe: 'all',
    },
    
    minPrice: 1832.67,
    maxPrice: 1893.71,
    currentPrice: 1862.74,
    entryPrice: 1860.00,
    
    alertConfig: {
      enabled: true,
      upperPriceThreshold: 1885.00,
      lowerPriceThreshold: 1840.00,
      ilPercentageLimit: 2.5,
      shiftPercentageThreshold: 1.5,
      notifyBrowser: true,
      notifyTelegram: true,
      notifyEmail: false,
      notifySound: true,
      telegramChatId: '',
      telegramBotToken: '',
    },
    
    positionHistory: [
      {
        id: 'hist-1',
        timestamp: '8/1/26, 5:07 PM',
        action: 'Deposit',
        valueUSD: 484.07,
        token0Amount: 0.127663,
        token1Amount: 246.284,
        notes: 'Initial LP Mint on Robinhood Chain ve33 pool',
      },
    ],
    mintTxUrl: 'https://explorer.robinhoodchain.xyz/tx/0x9a8f...3e21',
    createdAt: '2026-08-01T17:07:00Z',
  },
  {
    id: 'pos-eth-usdc-mainnet',
    poolName: 'ETH - USDC',
    poolSymbol: 'ETH/USDC',
    protocol: 'Uniswap V3',
    feeTier: '0.05%',
    poolType: 'v3',
    chainId: 'ethereum',
    status: 'in_range',
    
    token0: {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 0.15,
      initialAmount: 0.15,
      priceUSD: 1900.00,
      initialPriceUSD: 1900.00,
      color: '#627EEA',
    },
    token1: {
      symbol: 'USDC',
      name: 'USD Coin',
      amount: 300.00,
      initialAmount: 300.00,
      priceUSD: 1.0,
      initialPriceUSD: 1.0,
      color: '#2775CA',
    },
    
    principalUSD: 585.00,
    initialPrincipalUSD: 585.00,
    
    rewards: {
      symbol: 'UNI',
      amount: 4.85,
      amountUSD: 36.38,
      apr: 42.10,
      earnedTimeframe: 'all',
    },
    
    minPrice: 1800.00,
    maxPrice: 2200.00,
    currentPrice: 1900.00,
    entryPrice: 1900.00,
    
    alertConfig: {
      enabled: true,
      upperPriceThreshold: 1950.00, // Upper alert threshold requested by user!
      lowerPriceThreshold: 1850.00, // Lower alert threshold requested by user!
      ilPercentageLimit: 5.0,
      shiftPercentageThreshold: 2.5,
      notifyBrowser: true,
      notifyTelegram: true,
      notifyEmail: false,
      notifySound: true,
    },
    
    positionHistory: [
      {
        id: 'hist-2',
        timestamp: '8/1/26, 2:15 PM',
        action: 'Deposit',
        valueUSD: 585.00,
        token0Amount: 0.15,
        token1Amount: 300.00,
        notes: '0.15 ETH + 300 USDC added with range 1800 - 2200',
      },
    ],
    mintTxUrl: 'https://etherscan.io/tx/0x4b7f...91c2',
    createdAt: '2026-08-01T14:15:00Z',
  },
  {
    id: 'pos-sol-usdc-solana',
    poolName: 'SOL - USDC',
    poolSymbol: 'SOL/USDC',
    protocol: 'Raydium CLMM',
    feeTier: '0.25%',
    poolType: 'concentrated',
    chainId: 'solana',
    status: 'in_range',
    
    token0: {
      symbol: 'SOL',
      name: 'Solana',
      amount: 4.25,
      initialAmount: 4.20,
      priceUSD: 178.50,
      initialPriceUSD: 175.00,
      color: '#14F195',
    },
    token1: {
      symbol: 'USDC',
      name: 'USD Coin',
      amount: 491.38,
      initialAmount: 500.00,
      priceUSD: 1.0,
      initialPriceUSD: 1.0,
      color: '#2775CA',
    },
    
    principalUSD: 1250.00,
    initialPrincipalUSD: 1235.00,
    
    rewards: {
      symbol: 'RAY',
      amount: 28.50,
      amountUSD: 54.15,
      apr: 118.40,
      earnedTimeframe: 'all',
    },
    
    minPrice: 140.00,
    maxPrice: 210.00,
    currentPrice: 178.50,
    entryPrice: 175.00,
    
    alertConfig: {
      enabled: true,
      upperPriceThreshold: 198.00,
      lowerPriceThreshold: 152.00,
      ilPercentageLimit: 4.0,
      shiftPercentageThreshold: 3.0,
      notifyBrowser: true,
      notifyTelegram: false,
      notifyEmail: false,
      notifySound: true,
    },
    
    positionHistory: [
      {
        id: 'hist-3',
        timestamp: '7/28/26, 11:00 AM',
        action: 'Deposit',
        valueUSD: 1235.00,
        token0Amount: 4.20,
        token1Amount: 500.00,
        notes: 'Raydium Concentrated Pool Deposit',
      },
    ],
    mintTxUrl: 'https://solscan.io/tx/5x9k...2p8l',
    createdAt: '2026-07-28T11:00:00Z',
  }
];

const POSITIONS_STORAGE_KEY = 'omnilp_saved_positions_v1';

export function loadStoredPositions(): LPPosition[] {
  try {
    const raw = localStorage.getItem(POSITIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load stored positions', e);
  }
  return INITIAL_POSITIONS;
}

export function saveStoredPositions(positions: LPPosition[]) {
  try {
    localStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(positions));
  } catch (e) {
    console.error('Failed to save positions', e);
  }
}
