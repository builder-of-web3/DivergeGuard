import { LPPosition } from '../types';

export const DEFAULT_WALLETLP_POSITIONS: LPPosition[] = [
  {
    id: `pos-4b8a-bsc-1`,
    poolName: 'BTCB - WBNB (PancakeSwap v3 Farm #6960145)',
    poolSymbol: 'BTCB/WBNB',
    protocol: 'PancakeSwap v3',
    feeTier: '0.05%',
    poolType: 've33',
    chainId: 'bsc',
    status: 'in_range',

    token0: {
      symbol: 'BTCB',
      name: 'Bitcoin BEP2',
      amount: 0.0515,
      initialAmount: 0.0515,
      priceUSD: 95000.00,
      initialPriceUSD: 94000.00,
      color: '#F7931A',
    },
    token1: {
      symbol: 'WBNB',
      name: 'Wrapped BNB',
      amount: 7.4121,
      initialAmount: 7.4121,
      priceUSD: 361.20,
      initialPriceUSD: 360.00,
      color: '#F3BA2F',
    },

    principalUSD: 7569.34,
    initialPrincipalUSD: 7500.00,

    rewards: {
      symbol: 'CAKE + BTCB + WBNB',
      amount: 0.4081,
      amountUSD: 1.20,
      apr: 38.50,
      earnedTimeframe: 'all',
    },

    minPrice: 85000.00,
    maxPrice: 115000.00,
    currentPrice: 95000.00,
    entryPrice: 94000.00,

    alertConfig: {
      enabled: true,
      upperPriceThreshold: 110000.00,
      lowerPriceThreshold: 88000.00,
      ilPercentageLimit: 2.5,
      shiftPercentageThreshold: 1.5,
      notifyBrowser: true,
      notifyTelegram: true,
      notifyEmail: false,
      notifySound: true,
      notifySMS: true,
      smsNumber: '+1 (555) 392-8104',
    },

    positionHistory: [
      {
        id: `hist-bsc-1-${Date.now()}`,
        timestamp: '8/1/26, 5:07 PM',
        action: 'Deposit',
        valueUSD: 7569.34,
        token0Amount: 0.0515,
        token1Amount: 7.4121,
        notes: `On-Chain LP Deposit for 0x4b8a... on BNB Smart Chain`,
      },
    ],
    mintTxUrl: `https://bscscan.com/address/0x4b8aedb1e7e364ee6c04f513837b809dddbbb81b`,
    createdAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: `pos-4b8a-bsc-2`,
    poolName: 'ETH - BTCB (PancakeSwap v3 Farm #6959608)',
    poolSymbol: 'ETH/BTCB',
    protocol: 'PancakeSwap v3',
    feeTier: '0.05%',
    poolType: 've33',
    chainId: 'bsc',
    status: 'in_range',

    token0: {
      symbol: 'ETH',
      name: 'Ethereum BEP20',
      amount: 1.3483,
      initialAmount: 1.3483,
      priceUSD: 2400.00,
      initialPriceUSD: 2450.00,
      color: '#627EEA',
    },
    token1: {
      symbol: 'BTCB',
      name: 'Bitcoin BEP2',
      amount: 0.0333,
      initialAmount: 0.0333,
      priceUSD: 41463.00,
      initialPriceUSD: 41000.00,
      color: '#F7931A',
    },

    principalUSD: 4616.65,
    initialPrincipalUSD: 4600.00,

    rewards: {
      symbol: 'ETH + BTCB + CAKE',
      amount: 0.0014,
      amountUSD: 0.12,
      apr: 28.20,
      earnedTimeframe: 'all',
    },

    minPrice: 0.022,
    maxPrice: 0.035,
    currentPrice: 0.028,
    entryPrice: 0.027,

    alertConfig: {
      enabled: true,
      upperPriceThreshold: 0.034,
      lowerPriceThreshold: 0.023,
      ilPercentageLimit: 3.0,
      shiftPercentageThreshold: 2.0,
      notifyBrowser: true,
      notifyTelegram: true,
      notifyEmail: false,
      notifySound: true,
      notifySMS: true,
      smsNumber: '+1 (555) 392-8104',
    },

    positionHistory: [
      {
        id: `hist-bsc-2-${Date.now()}`,
        timestamp: '8/1/26, 5:07 PM',
        action: 'Deposit',
        valueUSD: 4616.65,
        token0Amount: 1.3483,
        token1Amount: 0.0333,
        notes: `On-Chain LP Deposit for 0x4b8a... on BNB Smart Chain`,
      },
    ],
    mintTxUrl: `https://bscscan.com/address/0x4b8aedb1e7e364ee6c04f513837b809dddbbb81b`,
    createdAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: `pos-4b8a-bsc-3`,
    poolName: 'BTCB - WBNB (PancakeSwap v3 LP #6989543)',
    poolSymbol: 'BTCB/WBNB',
    protocol: 'PancakeSwap v3',
    feeTier: '0.25%',
    poolType: 've33',
    chainId: 'bsc',
    status: 'in_range',

    token0: {
      symbol: 'BTCB',
      name: 'Bitcoin BEP2',
      amount: 0.0474,
      initialAmount: 0.0474,
      priceUSD: 64230.00,
      initialPriceUSD: 64000.00,
      color: '#F7931A',
    },
    token1: {
      symbol: 'WBNB',
      name: 'Wrapped BNB',
      amount: 0.3320,
      initialAmount: 0.3320,
      priceUSD: 406.00,
      initialPriceUSD: 400.00,
      color: '#F3BA2F',
    },

    principalUSD: 3179.29,
    initialPrincipalUSD: 3150.00,

    rewards: {
      symbol: 'BTCB + WBNB',
      amount: 0.0006,
      amountUSD: 0.69,
      apr: 22.40,
      earnedTimeframe: 'all',
    },

    minPrice: 50000.00,
    maxPrice: 80000.00,
    currentPrice: 64230.00,
    entryPrice: 64000.00,

    alertConfig: {
      enabled: true,
      upperPriceThreshold: 78000.00,
      lowerPriceThreshold: 52000.00,
      ilPercentageLimit: 2.5,
      shiftPercentageThreshold: 1.5,
      notifyBrowser: true,
      notifyTelegram: true,
      notifyEmail: false,
      notifySound: true,
      notifySMS: true,
      smsNumber: '+1 (555) 392-8104',
    },

    positionHistory: [
      {
        id: `hist-bsc-3-${Date.now()}`,
        timestamp: '8/1/26, 5:07 PM',
        action: 'Deposit',
        valueUSD: 3179.29,
        token0Amount: 0.0474,
        token1Amount: 0.3320,
        notes: `On-Chain LP Deposit for 0x4b8a... on BNB Smart Chain`,
      },
    ],
    mintTxUrl: `https://bscscan.com/address/0x4b8aedb1e7e364ee6c04f513837b809dddbbb81b`,
    createdAt: '2026-08-01T10:00:00.000Z',
  }
];

export const INITIAL_POSITIONS: LPPosition[] = DEFAULT_WALLETLP_POSITIONS;

const POSITIONS_STORAGE_KEY = 'divergeguard_user_fetched_positions_v6';

export function loadStoredPositions(): LPPosition[] {
  try {
    // Clear out any legacy keys that held mock default positions
    localStorage.removeItem('divergeguard_user_fetched_positions_v4');
    localStorage.removeItem('divergeguard_user_fetched_positions_v3');
    localStorage.removeItem('divergeguard_robinhood_positions_v2');
    localStorage.removeItem('divergeguard_robinhood_positions_v1');
    localStorage.removeItem('divergeguard_robinhood_positions');
    localStorage.removeItem('omnilp_saved_positions_v1');
    localStorage.removeItem('omnilp_saved_positions');

    const raw = localStorage.getItem(POSITIONS_STORAGE_KEY);
    if (raw) {
      const parsed: LPPosition[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out any legacy mock items that contain stonx-usdg or rh-stonx
        const userOnly = parsed.filter(
          (p) => !p.id.includes('stonx-usdg') && !p.id.includes('pos-robinhood')
        );
        if (userOnly.length > 0) return userOnly;
      }
    }
  } catch (e) {
    console.error('Failed to load stored positions', e);
  }
  return DEFAULT_WALLETLP_POSITIONS;
}

export function saveStoredPositions(positions: LPPosition[]) {
  try {
    localStorage.setItem(POSITIONS_STORAGE_KEY, JSON.stringify(positions));
  } catch (e) {
    console.error('Failed to save positions', e);
  }
}

