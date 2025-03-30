
export interface CryptoPair {
  id: string;
  baseAsset: string;
  quoteAsset: string;
  exchanges: string[];
  correlation: number;
  cointegration: number;
  zScore: number;
  spread: number;
  opportunity: 'high' | 'medium' | 'low' | 'none';
  direction?: 'long' | 'short' | null;
}

export interface PricePoint {
  timestamp: number;
  price: number;
}

export interface AssetPrice {
  asset: string;
  exchange: string;
  currentPrice: number;
  priceHistory: PricePoint[];
}

export interface MarketData {
  [asset: string]: {
    [exchange: string]: AssetPrice;
  };
}

export interface BacktestResult {
  pairId: string;
  startDate: string;
  endDate: string;
  totalTrades: number;
  winRate: number;
  profitLoss: number;
  sharpeRatio: number;
  maxDrawdown: number;
}
