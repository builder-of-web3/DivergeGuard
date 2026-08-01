import { LPPosition, PoolStatus } from '../types';

/**
 * Calculates concentrated liquidity token amounts based on price P, P_min, P_max and base liquidity
 */
export function calculateConcentratedAmounts(
  currentPriceUSD: number,
  minPriceUSD: number,
  maxPriceUSD: number,
  initialToken0Amount: number,
  initialToken1Amount: number,
  entryPriceUSD: number
) {
  // Bound checks
  const Pa = Math.min(minPriceUSD, maxPriceUSD);
  const Pb = Math.max(minPriceUSD, maxPriceUSD);
  const P = currentPriceUSD;

  // Approximate relative liquidity L based on initial entry
  const sqrtP = Math.sqrt(Math.max(P, 0.0001));
  const sqrtPa = Math.sqrt(Math.max(Pa, 0.0001));
  const sqrtPb = Math.sqrt(Math.max(Pb, 0.0001));
  const sqrtPentry = Math.sqrt(Math.max(entryPriceUSD, 0.0001));

  // Determine effective relative balance shift inside range
  if (P <= Pa) {
    // 100% token0 (e.g. 100% ETH when price drops below min)
    // Estimate total token0 if converted entirely
    const totalToken0 = initialToken0Amount + (initialToken1Amount / Math.max(Pa, 0.001));
    return {
      token0Amount: Math.max(0, totalToken0),
      token1Amount: 0,
      isOutOfRange: true,
      rangeState: 'below_min' as const,
    };
  } else if (P >= Pb) {
    // 100% token1 (e.g. 100% USDG/USDC when price surges above max)
    const totalToken1 = initialToken1Amount + (initialToken0Amount * Pb);
    return {
      token0Amount: 0,
      token1Amount: Math.max(0, totalToken1),
      isOutOfRange: true,
      rangeState: 'above_max' as const,
    };
  } else {
    // In range [Pa, Pb]
    // Interpolate token balances based on position of sqrtP relative to sqrtPa and sqrtPb
    const progress = (sqrtP - sqrtPa) / (sqrtPb - sqrtPa); // 0 at minPrice, 1 at maxPrice
    
    // Total value capacity estimation
    const totalValInToken1 = (initialToken0Amount * entryPriceUSD) + initialToken1Amount;
    
    // Token0 decreases as price rises, Token1 increases as price rises
    const estimatedToken1 = totalValInToken1 * progress;
    const estimatedToken0 = (totalValInToken1 * (1 - progress)) / P;

    return {
      token0Amount: Math.max(0, estimatedToken0),
      token1Amount: Math.max(0, estimatedToken1),
      isOutOfRange: false,
      rangeState: 'in_range' as const,
    };
  }
}

/**
 * Calculates Impermanent Loss comparing LP current holding vs HODL
 */
export function calculateImpermanentLoss(
  position: Pick<LPPosition, 'token0' | 'token1' | 'minPrice' | 'maxPrice' | 'currentPrice' | 'entryPrice'>
) {
  const currentPrice = position.currentPrice;
  const entryPrice = position.entryPrice;
  
  if (!entryPrice || entryPrice <= 0 || !currentPrice || currentPrice <= 0) {
    return {
      ilPercentage: 0,
      ilUSD: 0,
      lpValueUSD: position.token0.amount * currentPrice + position.token1.amount,
      hodlValueUSD: position.token0.initialAmount * currentPrice + position.token1.initialAmount,
    };
  }

  // Token 0 price in USD = currentPrice (e.g., ETH price = 1862.74 USDG)
  // Token 1 price in USD = 1 (stablecoin like USDG / USDC)
  const lpValueUSD = (position.token0.amount * currentPrice) + (position.token1.amount * 1);
  const hodlValueUSD = (position.token0.initialAmount * currentPrice) + (position.token1.initialAmount * 1);

  const priceRatio = currentPrice / entryPrice;
  
  // Standard 50/50 IL formula
  const standardIL = (2 * Math.sqrt(priceRatio) / (1 + priceRatio)) - 1;
  
  // Concentrated Liquidity leverage factor amplification
  const Pa = Math.min(position.minPrice, position.maxPrice);
  const Pb = Math.max(position.minPrice, position.maxPrice);
  
  let concentratedFactor = 1;
  if (Pa > 0 && Pb > Pa) {
    const rangeWidthRatio = Math.sqrt(Pa / Pb);
    concentratedFactor = Math.min(10, Math.max(1, 1 / (1 - rangeWidthRatio)));
  }

  // Effective IL percentage
  let ilPercentage = standardIL * concentratedFactor * 100;
  
  // Ensure IL is bounded between -100% and 0%
  ilPercentage = Math.max(-99.99, Math.min(0, ilPercentage));
  
  const ilUSD = lpValueUSD - hodlValueUSD; // usually negative or zero

  return {
    ilPercentage: Number(ilPercentage.toFixed(2)),
    ilUSD: Number(ilUSD.toFixed(2)),
    lpValueUSD: Number(lpValueUSD.toFixed(2)),
    hodlValueUSD: Number(hodlValueUSD.toFixed(2)),
  };
}

/**
 * Determines position status given current price and alert limits
 */
export function evaluatePositionStatus(
  currentPrice: number,
  minPrice: number,
  maxPrice: number,
  lowerAlertThreshold: number,
  upperAlertThreshold: number
): PoolStatus {
  if (currentPrice <= minPrice || currentPrice >= maxPrice) {
    return 'out_of_range';
  }
  
  // Near bounds (near lower threshold or upper threshold)
  if (currentPrice <= lowerAlertThreshold || currentPrice >= upperAlertThreshold) {
    return 'near_bound';
  }

  // Buffer zone check (within 2% of min or max)
  const range = maxPrice - minPrice;
  const lowerBuffer = minPrice + (range * 0.05);
  const upperBuffer = maxPrice - (range * 0.05);

  if (currentPrice <= lowerBuffer || currentPrice >= upperBuffer) {
    return 'near_bound';
  }

  return 'in_range';
}

/**
 * Formats numbers into clean currency/token strings
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatToken(amount: number, decimals: number = 4): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '0';
  if (amount > 1000) return amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: Math.min(2, decimals),
    maximumFractionDigits: decimals,
  });
}
