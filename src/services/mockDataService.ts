
import { CryptoPair, AssetPrice, BacktestResult } from "@/types";

// Generate mock data for crypto pairs
export const getMockPairs = (): CryptoPair[] => {
  return [
    {
      id: "ETH-BTC",
      baseAsset: "ETH",
      quoteAsset: "BTC",
      exchanges: ["Binance", "Coinbase"],
      correlation: 0.87,
      cointegration: 0.92,
      zScore: 2.35,
      spread: 0.028,
      opportunity: "high",
      direction: "long"
    },
    {
      id: "SOL-AVAX",
      baseAsset: "SOL",
      quoteAsset: "AVAX",
      exchanges: ["Binance", "FTX"],
      correlation: 0.76,
      cointegration: 0.81,
      zScore: 1.95,
      spread: 0.015,
      opportunity: "medium",
      direction: "short"
    },
    {
      id: "LINK-DOT",
      baseAsset: "LINK",
      quoteAsset: "DOT",
      exchanges: ["Binance", "Kraken"],
      correlation: 0.65,
      cointegration: 0.72,
      zScore: 0.88,
      spread: 0.009,
      opportunity: "low",
      direction: null
    },
    {
      id: "UNI-AAVE",
      baseAsset: "UNI",
      quoteAsset: "AAVE",
      exchanges: ["Uniswap", "Binance"],
      correlation: 0.79,
      cointegration: 0.83,
      zScore: 2.12,
      spread: 0.022,
      opportunity: "high",
      direction: "long"
    },
    {
      id: "MATIC-LTC",
      baseAsset: "MATIC",
      quoteAsset: "LTC",
      exchanges: ["Binance", "Coinbase"],
      correlation: 0.58,
      cointegration: 0.63,
      zScore: 1.05,
      spread: 0.011,
      opportunity: "medium",
      direction: "short"
    },
    {
      id: "XRP-ADA",
      baseAsset: "XRP",
      quoteAsset: "ADA",
      exchanges: ["Binance", "Kraken"],
      correlation: 0.71,
      cointegration: 0.75,
      zScore: 1.55,
      spread: 0.016,
      opportunity: "medium",
      direction: "long"
    }
  ];
};

// Generate mock price data
export const generateMockPriceData = (
  asset: string,
  exchange: string,
  basePrice: number,
  volatility = 0.02,
  dataPoints = 100
): AssetPrice => {
  const priceHistory = [];
  let price = basePrice;
  const now = Date.now();
  
  for (let i = 0; i < dataPoints; i++) {
    // Random walk with drift
    const change = (Math.random() - 0.5) * volatility * price;
    price = Math.max(0.01, price + change);
    
    priceHistory.push({
      timestamp: now - (dataPoints - i) * 60000, // 1-minute intervals
      price: price
    });
  }
  
  return {
    asset,
    exchange,
    currentPrice: priceHistory[priceHistory.length - 1].price,
    priceHistory
  };
};

// Generate mock backtest results
export const getMockBacktestResults = (pairId: string): BacktestResult => {
  return {
    pairId,
    startDate: "2023-01-01",
    endDate: "2023-06-30",
    totalTrades: Math.floor(Math.random() * 500) + 100,
    winRate: Math.random() * 0.4 + 0.4, // 40-80%
    profitLoss: (Math.random() * 50) - 10, // -10% to +40%
    sharpeRatio: Math.random() * 2 + 0.5, // 0.5 to 2.5
    maxDrawdown: Math.random() * 0.2 + 0.05 // 5% to 25%
  };
};
