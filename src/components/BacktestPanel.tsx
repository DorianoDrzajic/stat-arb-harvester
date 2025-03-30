
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CryptoPair, BacktestResult } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Play } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BacktestPanelProps {
  pair: CryptoPair | null;
  onBacktestComplete?: (result: BacktestResult) => void;
}

const BacktestPanel = ({ pair, onBacktestComplete }: BacktestPanelProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 days ago
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [strategy, setStrategy] = useState<string>("mean-reversion");
  const [initialCapital, setInitialCapital] = useState<string>("10000");
  const [entryZScore, setEntryZScore] = useState<string>("2.0");
  const [exitZScore, setExitZScore] = useState<string>("0.5");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRunBacktest = () => {
    if (!pair) return;
    
    setIsLoading(true);
    toast.info(`Running backtest for ${pair.baseAsset}/${pair.quoteAsset}...`);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResult: BacktestResult = {
        pairId: pair.id,
        startDate: format(startDate || new Date(), 'yyyy-MM-dd'),
        endDate: format(endDate || new Date(), 'yyyy-MM-dd'),
        totalTrades: Math.floor(Math.random() * 200) + 50,
        winRate: Math.random() * 0.3 + 0.5, // 50-80%
        profitLoss: (Math.random() * 40) - 5, // -5% to +35%
        sharpeRatio: Math.random() * 1.5 + 0.8, // 0.8 to 2.3
        maxDrawdown: Math.random() * 0.15 + 0.03 // 3% to 18%
      };
      
      if (onBacktestComplete) {
        onBacktestComplete(mockResult);
      }
      
      toast.success(`Backtest complete for ${pair.baseAsset}/${pair.quoteAsset}`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Backtest Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="parameters">
          <TabsList className="w-full">
            <TabsTrigger value="parameters" className="flex-1">Parameters</TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="parameters" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <span className="text-muted-foreground">to</span>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Strategy Type</label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                  <SelectItem value="momentum">Momentum</SelectItem>
                  <SelectItem value="market-making">Market Making</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Capital (USD)</label>
              <Input 
                type="number" 
                value={initialCapital} 
                onChange={e => setInitialCapital(e.target.value)} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Entry Z-Score</label>
                <Input 
                  type="number" 
                  value={entryZScore} 
                  onChange={e => setEntryZScore(e.target.value)} 
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Exit Z-Score</label>
                <Input 
                  type="number" 
                  value={exitZScore} 
                  onChange={e => setExitZScore(e.target.value)} 
                  step="0.1"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Position Sizing</label>
              <Select defaultValue="fixed">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Size</SelectItem>
                  <SelectItem value="kelly">Kelly Criterion</SelectItem>
                  <SelectItem value="percent">Percent Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Stop Loss (%)</label>
              <Input type="number" defaultValue="5" step="0.5" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Take Profit (%)</label>
              <Input type="number" defaultValue="10" step="0.5" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Rebalancing Frequency</label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <Button 
          className="w-full mt-6" 
          onClick={handleRunBacktest} 
          disabled={!pair || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Backtest
            </span>
          ) : (
            <span className="flex items-center">
              <Play className="mr-2 h-4 w-4" /> 
              Run Backtest
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BacktestPanel;
