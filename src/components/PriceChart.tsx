
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { AssetPrice, CryptoPair } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface PriceChartProps {
  pair: CryptoPair | null;
  baseData?: AssetPrice;
  quoteData?: AssetPrice;
  spreadData?: { timestamp: number; spread: number }[];
}

const formatTimestamp = (timestamp: number) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

const PriceChart = ({ pair, baseData, quoteData, spreadData }: PriceChartProps) => {
  if (!pair || !baseData || !quoteData) {
    return (
      <Card className="col-span-2 h-[500px] flex items-center justify-center">
        <div className="text-muted-foreground">Select a trading pair to view chart</div>
      </Card>
    );
  }

  // Combine price data for chart
  const chartData = baseData.priceHistory.map((point, index) => {
    const quotePoint = quoteData.priceHistory[index];
    return {
      timestamp: point.timestamp,
      time: formatTimestamp(point.timestamp),
      [baseData.asset]: point.price,
      [quoteData.asset]: quotePoint.price,
      spread: spreadData ? spreadData[index]?.spread : undefined
    };
  });

  return (
    <Card className="col-span-2 h-[500px]">
      <CardHeader className="py-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>
            {pair.baseAsset}/{pair.quoteAsset} Price Chart
          </span>
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-crypto-blue mr-2"></div>
              <span>{pair.baseAsset}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-crypto-purple mr-2"></div>
              <span>{pair.quoteAsset}</span>
            </div>
            {spreadData && (
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-crypto-amber mr-2"></div>
                <span>Spread</span>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }}
              stroke="#6b7280"
            />
            <YAxis 
              yAxisId="left"
              orientation="left"
              stroke="#2563eb"
              tick={{ fontSize: 10 }}
              domain={['auto', 'auto']}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#9333ea"
              tick={{ fontSize: 10 }}
              domain={['auto', 'auto']}
            />
            <YAxis 
              yAxisId="spread"
              orientation="right"
              stroke="#f59e0b"
              hide={!spreadData}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', borderColor: '#374151' }}
              itemStyle={{ color: '#f3f4f6' }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey={baseData.asset} 
              stroke="#2563eb" 
              activeDot={{ r: 8 }}
              dot={false}
              isAnimationActive={false}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey={quoteData.asset} 
              stroke="#9333ea" 
              dot={false}
              isAnimationActive={false}
            />
            {spreadData && (
              <Line 
                yAxisId="spread"
                type="monotone" 
                dataKey="spread" 
                stroke="#f59e0b" 
                strokeDasharray="3 3"
                dot={false}
                isAnimationActive={false}
              />
            )}
            {pair.zScore && (
              <>
                <ReferenceLine yAxisId="spread" y={0} stroke="rgba(255,255,255,0.3)" strokeDasharray="3 3" />
                <ReferenceLine yAxisId="spread" y={2} stroke="rgba(0,255,136,0.3)" strokeDasharray="3 3" label="Upper" />
                <ReferenceLine yAxisId="spread" y={-2} stroke="rgba(255,59,105,0.3)" strokeDasharray="3 3" label="Lower" />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
