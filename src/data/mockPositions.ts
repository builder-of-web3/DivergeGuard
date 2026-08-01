import { LPPosition } from '../types';

export const DEFAULT_WALLETLP_POSITIONS: LPPosition[] = [
  {
    id: `pos-540e-eth-usdg-v3-1`,
    poolName: 'ETH - USDG (ve33 Pool)',
    poolSymbol: 'ETH/USDG',
    protocol: 've33',
    feeTier: '0.102%',
    poolType: 've33',
    chainId: 'robinhood',
    status: 'in_range',

    token0: {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 0.249657,
      initialAmount: 0.127663,
      priceUSD: 1835.24,
      initialPriceUSD: 1860.00,
      color: '#627EEA',
    },
    token1: {
      symbol: 'USDG',
      name: 'Global USD',
      amount: 20.6801,
      initialAmount: 246.284,
      priceUSD: 1.0,
      initialPriceUSD: 1.0,
      color: '#10B981',
    },

    principalUSD: 478.70,
    initialPrincipalUSD: 480.50,

    rewards: {
      symbol: 'STONX',
      amount: 0.475098,
      amountUSD: 19.00,
      apr: 295.43,
      earnedTimeframe: 'all',
    },

    minPrice: 1832.67,
    maxPrice: 1893.71,
    currentPrice: 1835.24,
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
      notifySMS: true,
      smsNumber: '+1 (555) 392-8104',
    },

    positionHistory: [
      {
        id: `hist-rh-1-${Date.now()}`,
        timestamp: '8/1/26, 5:07 PM',
        action: 'Deposit',
        valueUSD: 480.50,
        token0Amount: 0.127663,
        token1Amount: 246.284,
        notes: `On-Chain LP Deposit for 0x540e... on Robinhood Chain`,
      },
    ],
    mintTxUrl: `https://explorer.robinhoodchain.xyz/address/0x540e1dd1895E7bAc9115FF262004E0Fe6d6Ce2Ce`,
    createdAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: `pos-540e-eth-usdg-v3-2`,
    poolName: 'ETH - USDG (ve33 Pool)',
    poolSymbol: 'ETH/USDG',
    protocol: 've33',
    feeTier: '0.102%',
    poolType: 've33',
    chainId: 'robinhood',
    status: 'in_range',

    token0: {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 0.1650,
      initialAmount: 0.1650,
      priceUSD: 1835.24,
      initialPriceUSD: 1860.00,
      color: '#627EEA',
    },
    token1: {
      symbol: 'USDG',
      name: 'Global USD',
      amount: 328.58,
      initialAmount: 328.58,
      priceUSD: 1.0,
      initialPriceUSD: 1.0,
      color: '#10B981',
    },

    principalUSD: 631.58,
    initialPrincipalUSD: 635.48,

    rewards: {
      symbol: 'STONX',
      amount: 0.8500,
      amountUSD: 34.00,
      apr: 185.40,
      earnedTimeframe: 'all',
    },

    minPrice: 1433.35,
    maxPrice: 2421.29,
    currentPrice: 1835.24,
    entryPrice: 1860.00,

    alertConfig: {
      enabled: true,
      upperPriceThreshold: 2350.00,
      lowerPriceThreshold: 1480.00,
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
        id: `hist-rh-2-${Date.now()}`,
        timestamp: '8/1/26, 5:07 PM',
        action: 'Deposit',
        valueUSD: 631.58,
        token0Amount: 0.1650,
        token1Amount: 328.58,
        notes: `On-Chain LP Deposit for 0x540e... on Robinhood Chain`,
      },
    ],
    mintTxUrl: `https://explorer.robinhoodchain.xyz/address/0x540e1dd1895E7bAc9115FF262004E0Fe6d6Ce2Ce`,
    createdAt: '2026-08-01T10:00:00.000Z',
  }
];

export const INITIAL_POSITIONS: LPPosition[] = DEFAULT_WALLETLP_POSITIONS;

const POSITIONS_STORAGE_KEY = 'divergeguard_user_fetched_positions_v5';

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

