
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BacktestResult } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface BacktestResultsProps {
  result: BacktestResult | null;
}

// Generate mock equity curve data
const generateEquityCurveData = () => {
  const data = [];
  let equity = 10000;
  const days = 180;
  
  for (let i = 0; i < days; i++) {
    const dailyReturn = (Math.random() - 0.45) * 0.015 * equity;
    equity += dailyReturn;
    
    data.push({
      day: i + 1,
      equity: equity,
      dailyPnL: dailyReturn
    });
  }
  
  return data;
};

// Generate monthly returns data
const generateMonthlyReturnData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return months.map(month => ({
    month,
    return: (Math.random() - 0.4) * 10
  }));
};

const BacktestResults = ({ result }: BacktestResultsProps) => {
  if (!result) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Backtest Results</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-muted-foreground">Run a backtest to see results</div>
        </CardContent>
      </Card>
    );
  }
  
  const equityCurveData = generateEquityCurveData();
  const monthlyReturnData = generateMonthlyReturnData();
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Backtest Results</span>
          <span className="text-sm font-normal text-muted-foreground">
            {result.startDate} to {result.endDate}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="stat-card">
            <div className="text-xs text-muted-foreground">Total Trades</div>
            <div className="text-2xl font-semibold">{result.totalTrades}</div>
          </div>
          <div className="stat-card">
            <div className="text-xs text-muted-foreground">Win Rate</div>
            <div className="text-2xl font-semibold">{(result.winRate * 100).toFixed(1)}%</div>
          </div>
          <div className="stat-card">
            <div className="text-xs text-muted-foreground">Profit/Loss</div>
            <div className={`text-2xl font-semibold ${result.profitLoss >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
              {result.profitLoss >= 0 ? '+' : ''}{result.profitLoss.toFixed(2)}%
            </div>
          </div>
          <div className="stat-card">
            <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
            <div className="text-2xl font-semibold">{result.sharpeRatio.toFixed(2)}</div>
          </div>
        </div>
        
        <Tabs defaultValue="equity">
          <TabsList className="w-full">
            <TabsTrigger value="equity" className="flex-1">Equity Curve</TabsTrigger>
            <TabsTrigger value="monthly" className="flex-1">Monthly Returns</TabsTrigger>
            <TabsTrigger value="trades" className="flex-1">Trades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="equity" className="h-[230px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={equityCurveData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#374151' }}
                  itemStyle={{ color: '#f3f4f6' }}
                  labelStyle={{ color: '#9ca3af' }}
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="equity" 
                  stroke="#2563eb" 
                  fillOpacity={1}
                  fill="url(#colorEquity)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="monthly" className="h-[230px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyReturnData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#374151' }}
                  itemStyle={{ color: '#f3f4f6' }}
                  labelStyle={{ color: '#9ca3af' }}
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                />
                <Bar dataKey="return" radius={[4, 4, 0, 0]}>
                  {monthlyReturnData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.return >= 0 ? '#00ff88' : '#ff3b69'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="trades" className="h-[230px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={equityCurveData.slice(0, 30)} // Show only first 30 days for trade details
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  stroke="#6b7280"
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#374151' }}
                  itemStyle={{ color: '#f3f4f6' }}
                  labelStyle={{ color: '#9ca3af' }}
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
                <Line 
                  type="step" 
                  dataKey="dailyPnL" 
                  stroke="#06b6d4" 
                  dot={true}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BacktestResults;
