export interface Chain {
  id: string;
  name: string;
  symbol: string;
  color: string;
  iconBg: string;
  isCustom?: boolean;
  rpcUrl?: string;
  explorerUrl?: string;
  chainIdNumber?: number;
}

export type PoolStatus = 'in_range' | 'near_bound' | 'out_of_range';
export type PoolType = 've33' | 'v3' | 'algebra' | 'concentrated';

export interface Token {
  symbol: string;
  name: string;
  amount: number;
  initialAmount: number;
  priceUSD: number;
  initialPriceUSD: number;
  color?: string;
}

export interface Reward {
  symbol: string;
  amount: number;
  amountUSD: number;
  apr: number;
  earnedTimeframe?: '24h' | '7d' | 'all';
}

export interface AlertConfig {
  enabled: boolean;
  upperPriceThreshold: number; // e.g. 1950 USD per ETH
  lowerPriceThreshold: number; // e.g. 1850 USD per ETH
  ilPercentageLimit: number;   // e.g. 5.0%
  shiftPercentageThreshold: number; // e.g. 5.0% price ratio shift
  notifyBrowser: boolean;
  notifyTelegram: boolean;
  notifyEmail: boolean;
  notifySound: boolean;
  telegramChatId?: string;
  telegramBotToken?: string;
  webhookUrl?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  action: 'Deposit' | 'Collect' | 'Rebalance' | 'Alert Triggered' | 'Withdraw';
  valueUSD: number;
  token0Amount: number;
  token1Amount: number;
  rewardAmount?: number;
  txHash?: string;
  notes?: string;
}

export interface LPPosition {
  id: string;
  poolName: string;         // e.g. "ETH - USDG"
  poolSymbol: string;       // e.g. "ETH/USDG"
  protocol: string;         // e.g. "ve33" or "Uniswap V3"
  feeTier: string;          // e.g. "0.102%"
  poolType: PoolType;
  chainId: string;          // e.g. "robinhood"
  status: PoolStatus;
  
  token0: Token;            // e.g. ETH
  token1: Token;            // e.g. USDG or USDC
  
  principalUSD: number;
  initialPrincipalUSD: number;
  
  rewards: Reward;
  
  minPrice: number;         // e.g. 1832.67
  maxPrice: number;         // e.g. 1893.71
  currentPrice: number;     // e.g. 1862.74
  entryPrice: number;       // e.g. 1860.00
  
  alertConfig: AlertConfig;
  positionHistory: HistoryItem[];
  
  mintTxUrl?: string;
  createdAt: string;
}

export interface AlertNotification {
  id: string;
  positionId: string;
  poolName: string;
  chainId: string;
  timestamp: string;
  type: 'upper_bound' | 'lower_bound' | 'il_limit' | 'out_of_range' | 'price_shift';
  message: string;
  severity: 'info' | 'warning' | 'critical';
  read: boolean;
  priceAtTrigger: number;
}
