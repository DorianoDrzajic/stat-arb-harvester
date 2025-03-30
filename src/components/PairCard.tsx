
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { BadgeCheck, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { CryptoPair } from '@/types';
import { cn } from '@/lib/utils';

interface PairCardProps {
  pair: CryptoPair;
  onClick: (pair: CryptoPair) => void;
  isSelected: boolean;
}

const PairCard = ({ pair, onClick, isSelected }: PairCardProps) => {
  const {
    id,
    baseAsset,
    quoteAsset,
    correlation,
    cointegration,
    zScore,
    spread,
    opportunity,
    direction
  } = pair;

  const getOpportunityColor = (opp: string) => {
    switch (opp) {
      case 'high': return 'bg-crypto-green/20 text-crypto-green';
      case 'medium': return 'bg-crypto-amber/20 text-crypto-amber';
      case 'low': return 'bg-muted/50 text-muted-foreground';
      default: return 'bg-muted/30 text-muted-foreground';
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:border-primary/50",
        isSelected ? "border-primary ring-1 ring-primary/30" : "border-border"
      )}
      onClick={() => onClick(pair)}
    >
      <CardHeader className="py-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="font-mono">{baseAsset}/{quoteAsset}</span>
          <div className="flex items-center text-sm">
            {opportunity !== 'none' && opportunity === 'high' && (
              <BadgeCheck className="h-4 w-4 text-crypto-green mr-1" />
            )}
            {direction && (
              direction === 'long' 
                ? <TrendingUp className="h-4 w-4 text-crypto-green ml-1" /> 
                : <TrendingDown className="h-4 w-4 text-crypto-red ml-1" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3 grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Correlation</span>
          <span className="font-mono text-sm">{correlation.toFixed(2)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Cointegration</span>
          <span className="font-mono text-sm">{cointegration.toFixed(2)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Z-Score</span>
          <span className="font-mono text-sm">{zScore.toFixed(2)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Spread</span>
          <span className="font-mono text-sm">{(spread * 100).toFixed(2)}%</span>
        </div>
        <div className="col-span-2 mt-2">
          <div className={cn(
            "text-xs rounded px-2 py-0.5 font-medium inline-flex items-center",
            getOpportunityColor(opportunity)
          )}>
            {opportunity !== 'none' ? (
              <>
                <span className="capitalize">{opportunity}</span> opportunity
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" /> No arbitrage opportunity
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PairCard;
