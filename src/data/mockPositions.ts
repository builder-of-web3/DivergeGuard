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
      amount: 0.252558,
      initialAmount: 0.250000,
      priceUSD: 1862.74,
      initialPriceUSD: 1860.00,
      color: '#627EEA',
    },
    token1: {
      symbol: 'USDG',
      name: 'Global USD',
      amount: 346.231,
      initialAmount: 350.000,
      priceUSD: 1.0,
      initialPriceUSD: 1.0,
      color: '#10B981',
    },
    
    principalUSD: 815.60,
    initialPrincipalUSD: 815.60,
    
    rewards: {
      symbol: 'STONX',
      amount: 1.452,
      amountUSD: 58.82,
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
        valueUSD: 815.60,
        token0Amount: 0.250000,
        token1Amount: 350.000,
        notes: 'Robinhood Chain ve33 pool LP deposit',
      },
    ],
    mintTxUrl: 'https://explorer.robinhoodchain.xyz/tx/0x9a8f...3e21',
    createdAt: '2026-08-01T17:07:00Z',
  },
  {
    id: 'pos-robinhood-stonx-usdg',
    poolName: 'STONX - USDG',
    poolSymbol: 'STONX/USDG',
    protocol: 've33',
    feeTier: '0.20%',
    poolType: 've33',
    chainId: 'robinhood',
    status: 'in_range',
    
    token0: {
      symbol: 'STONX',
      name: 'Stonx Governance Token',
      amount: 18.420,
      initialAmount: 18.000,
      priceUSD: 40.51,
      initialPriceUSD: 40.00,
      color: '#F59E0B',
    },
    token1: {
      symbol: 'USDG',
      name: 'Global USD',
      amount: 746.200,
      initialAmount: 760.000,
      priceUSD: 1.0,
      initialPriceUSD: 1.0,
      color: '#10B981',
    },
    
    principalUSD: 1492.20,
    initialPrincipalUSD: 1480.00,
    
    rewards: {
      symbol: 'STONX',
      amount: 3.250,
      amountUSD: 131.65,
      apr: 185.40,
      earnedTimeframe: 'all',
    },
    
    minPrice: 35.00,
    maxPrice: 48.00,
    currentPrice: 40.51,
    entryPrice: 40.00,
    
    alertConfig: {
      enabled: true,
      upperPriceThreshold: 46.00,
      lowerPriceThreshold: 36.50,
      ilPercentageLimit: 3.0,
      shiftPercentageThreshold: 2.0,
      notifyBrowser: true,
      notifyTelegram: true,
      notifyEmail: false,
      notifySound: true,
      telegramChatId: '',
      telegramBotToken: '',
    },
    
    positionHistory: [
      {
        id: 'hist-2',
        timestamp: '8/1/26, 3:30 PM',
        action: 'Deposit',
        valueUSD: 1480.00,
        token0Amount: 18.000,
        token1Amount: 760.000,
        notes: 'Robinhood Chain STONX/USDG ve33 pool deposit',
      },
    ],
    mintTxUrl: 'https://explorer.robinhoodchain.xyz/tx/0x4b7f...91c2',
    createdAt: '2026-08-01T15:30:00Z',
  }
];

const POSITIONS_STORAGE_KEY = 'divergeguard_robinhood_positions_v2';

export function loadStoredPositions(): LPPosition[] {
  try {
    // Clear out any old legacy keys if present
    localStorage.removeItem('omnilp_saved_positions_v1');
    localStorage.removeItem('omnilp_saved_positions');

    const raw = localStorage.getItem(POSITIONS_STORAGE_KEY);
    if (raw) {
      const parsed: LPPosition[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load stored positions', e);
  }
  return [];
}

export function saveStoredPositions(positions: LPPosition[]) {
  try {
    localStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(positions));
  } catch (e) {
    console.error('Failed to save positions', e);
  }
}
