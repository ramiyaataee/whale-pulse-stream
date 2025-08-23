import { Activity, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent: string;
  volume24h: number;
  lastUpdate: string;
}

interface TradingHeaderProps {
  marketData: MarketData;
}

export const TradingHeader = ({ marketData }: TradingHeaderProps) => {
  const isPositive = marketData.change24h > 0;
  const trendIcon = isPositive ? TrendingUp : TrendingDown;
  const TrendIcon = trendIcon;

  return (
    <Card className="p-6 bg-gradient-chart border-border/50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Symbol & Price */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-whale" />
            <h1 className="text-2xl font-bold text-foreground">{marketData.symbol}</h1>
          </div>
          <div className="text-3xl font-mono font-bold text-foreground">
            ${marketData.price.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </div>
        </div>

        {/* Change & Trend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendIcon className={`h-5 w-5 ${isPositive ? 'text-bull' : 'text-bear'}`} />
            <span className={`text-lg font-semibold ${isPositive ? 'text-bull' : 'text-bear'}`}>
              {isPositive ? '+' : ''}{marketData.change24h.toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </span>
            <Badge 
              variant="secondary" 
              className={`${isPositive ? 'bg-bull/20 text-bull border-bull/30' : 'bg-bear/20 text-bear border-bear/30'}`}
            >
              {marketData.changePercent}
            </Badge>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Vol:</span>
            <span className="font-semibold text-foreground">
              ${(marketData.volume24h / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>

        {/* Last Update */}
        <div className="text-sm text-muted-foreground">
          آخرین به‌روزرسانی: {new Date(marketData.lastUpdate).toLocaleTimeString('fa-IR')}
        </div>
      </div>
    </Card>
  );
};