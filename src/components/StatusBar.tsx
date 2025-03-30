
import React from 'react';
import { ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  isConnected: boolean;
  lastUpdated?: Date;
  activeExchanges: string[];
  activePairs: number;
}

const StatusBar = ({ isConnected, lastUpdated, activeExchanges, activePairs }: StatusBarProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-1 bg-background border-t border-border text-xs text-muted-foreground">
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <div className={cn(
            "w-2 h-2 rounded-full mr-1",
            isConnected ? "bg-crypto-green" : "bg-crypto-red"
          )}></div>
          <span>{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
        
        <div className="h-3 border-l border-border mx-1"></div>
        
        <div className="flex items-center">
          <span>Exchanges: </span>
          <span className="font-medium ml-1">
            {activeExchanges.join(", ")}
          </span>
        </div>
        
        <div className="h-3 border-l border-border mx-1"></div>
        
        <div className="flex items-center">
          <span>Pairs: </span>
          <span className="font-medium ml-1">{activePairs}</span>
        </div>
      </div>
      
      <div className="flex items-center">
        {lastUpdated ? (
          <div className="flex items-center">
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        ) : (
          <div className="flex items-center">
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
            <span>Updating...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
