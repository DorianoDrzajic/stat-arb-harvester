
import { useState, useEffect } from 'react';
import { CryptoPair, AssetPrice, BacktestResult } from '@/types';
import { getMockPairs, generateMockPriceData, getMockBacktestResults } from '@/services/mockDataService';
import PairCard from '@/components/PairCard';
import PriceChart from '@/components/PriceChart';
import BacktestPanel from '@/components/BacktestPanel';
import BacktestResults from '@/components/BacktestResults';
import StatusBar from '@/components/StatusBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArrowDownUp,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ArrowLeftRight,
  TrendingUp,
} from 'lucide-react';

const Index = () => {
  const [pairs, setPairs] = useState<CryptoPair[]>([]);
  const [selectedPair, setSelectedPair] = useState<CryptoPair | null>(null);
  const [baseAssetPrice, setBaseAssetPrice] = useState<AssetPrice | undefined>(undefined);
  const [quoteAssetPrice, setQuoteAssetPrice] = useState<AssetPrice | undefined>(undefined);
  const [spreadData, setSpreadData] = useState<{ timestamp: number; spread: number }[] | undefined>(undefined);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(new Date());
  
  // Fetch mock pairs data
  useEffect(() => {
    const mockPairs = getMockPairs();
    setPairs(mockPairs);
    
    // Auto-select first pair
    if (mockPairs.length > 0) {
      handleSelectPair(mockPairs[0]);
    }
    
    // Simulate connection status
    const connectionInterval = setInterval(() => {
      setIsConnected(prev => Math.random() > 0.05 ? true : false);
    }, 10000);
    
    // Simulate data updates
    const updateInterval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    
    return () => {
      clearInterval(connectionInterval);
      clearInterval(updateInterval);
    };
  }, []);
  
  // Filter pairs based on search term
  const filteredPairs = pairs.filter(pair => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      pair.baseAsset.toLowerCase().includes(searchLower) ||
      pair.quoteAsset.toLowerCase().includes(searchLower) ||
      `${pair.baseAsset}/${pair.quoteAsset}`.toLowerCase().includes(searchLower)
    );
  });
  
  // Handle pair selection
  const handleSelectPair = (pair: CryptoPair) => {
    setSelectedPair(pair);
    
    // Generate mock price data for the selected pair
    const basePrice = generateMockPriceData(
      pair.baseAsset, 
      pair.exchanges[0], 
      pair.baseAsset === "BTC" ? 68000 : pair.baseAsset === "ETH" ? 3500 : 100,
      pair.baseAsset === "BTC" ? 0.01 : 0.02
    );
    
    const quotePrice = generateMockPriceData(
      pair.quoteAsset, 
      pair.exchanges[0], 
      pair.quoteAsset === "BTC" ? 68000 : pair.quoteAsset === "ETH" ? 3500 : 50,
      pair.quoteAsset === "BTC" ? 0.01 : 0.02
    );
    
    setBaseAssetPrice(basePrice);
    setQuoteAssetPrice(quotePrice);
    
    // Calculate spread data
    const spreadData = basePrice.priceHistory.map((point, index) => {
      const quotePoint = quotePrice.priceHistory[index];
      const ratio = point.price / quotePoint.price;
      
      // Scale z-score for visualization
      const meanRatio = 1.0; // Simplified for demo
      const stdDevRatio = 0.1; // Simplified for demo
      const zScore = (ratio - meanRatio) / stdDevRatio;
      
      return {
        timestamp: point.timestamp,
        spread: zScore
      };
    });
    
    setSpreadData(spreadData);
    setBacktestResult(null); // Reset backtest results
  };
  
  const handleRefreshData = () => {
    if (selectedPair) {
      handleSelectPair(selectedPair);
      setLastUpdated(new Date());
    }
  };
  
  const handleBacktestComplete = (result: BacktestResult) => {
    setBacktestResult(result);
  };
  
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ArrowLeftRight className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Stat-Arb Harvester</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button size="sm" variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Button size="sm" variant="secondary" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border flex flex-col bg-card">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search pairs..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Pair Filters */}
          <div className="p-4 border-b border-border">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer">All</Badge>
              <Badge variant="secondary" className="cursor-pointer">High Score</Badge>
              <Badge variant="outline" className="cursor-pointer">BTC pairs</Badge>
              <Badge variant="outline" className="cursor-pointer">ETH pairs</Badge>
            </div>
          </div>
          
          {/* Pairs List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredPairs.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No pairs match your search
              </div>
            ) : (
              filteredPairs.map((pair) => (
                <PairCard 
                  key={pair.id}
                  pair={pair}
                  onClick={handleSelectPair}
                  isSelected={selectedPair?.id === pair.id}
                />
              ))
            )}
          </div>
          
          {/* Sidebar Footer */}
          <div className="p-3 border-t border-border text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Pairs: {pairs.length}</span>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleRefreshData}>
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Main Panel */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center">
              {selectedPair ? (
                <>
                  <h2 className="text-lg font-bold">
                    {selectedPair.baseAsset}/{selectedPair.quoteAsset}
                  </h2>
                  <Badge 
                    className="ml-2"
                    variant={selectedPair.opportunity === 'high' ? 'default' : 'secondary'}
                  >
                    {selectedPair.opportunity} opportunity
                  </Badge>
                </>
              ) : (
                <h2 className="text-lg font-medium">Select a pair</h2>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleRefreshData}>
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
              <Button size="sm" className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Run Strategy</span>
              </Button>
            </div>
          </div>
          
          {/* Chart Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              {/* Price Chart */}
              <PriceChart 
                pair={selectedPair}
                baseData={baseAssetPrice}
                quoteData={quoteAssetPrice}
                spreadData={spreadData}
              />
              
              {/* Backtest Panel & Results */}
              <BacktestPanel pair={selectedPair} onBacktestComplete={handleBacktestComplete} />
              <BacktestResults result={backtestResult} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Bar */}
      <StatusBar 
        isConnected={isConnected}
        lastUpdated={lastUpdated}
        activeExchanges={["Binance", "Coinbase", "FTX"]}
        activePairs={pairs.length}
      />
    </div>
  );
};

export default Index;
