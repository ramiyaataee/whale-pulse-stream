import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Maximize2,
  Settings
} from "lucide-react";
import { useTradingStore } from "@/stores/tradingStore";

interface TradingViewChartProps {
  symbol: string;
  height?: number;
}

export const TradingViewChart = ({ symbol, height = 400 }: TradingViewChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeframe, setTimeframe] = useState("1D");
  const { analysis } = useTradingStore();

  const timeframes = ["1m", "5m", "15m", "1h", "4h", "1D", "1W"];

  // Mock chart data - در production باید از TradingView widget استفاده کنید
  const mockData = {
    price: 13586.60,
    change: +262.10,
    changePercent: "+1.97%",
    volume: "4.26B",
    high24h: 13650.20,
    low24h: 13324.50
  };

  useEffect(() => {
    // اینجا باید TradingView widget لود شود
    // برای نمونه، یک placeholder chart نمایش می‌دهیم
    if (chartContainerRef.current) {
      // TradingView widget initialization would go here
    }
  }, [symbol, timeframe]);

  const isPositive = mockData.change > 0;

  return (
    <Card className={`bg-trading-card border-border/50 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-whale" />
            <h2 className="font-semibold text-trading-foreground">{symbol}</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl font-mono font-bold text-trading-foreground">
              ${mockData.price.toLocaleString()}
            </span>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-bull" />
              ) : (
                <TrendingDown className="h-4 w-4 text-bear" />
              )}
              <span className={isPositive ? "text-bull" : "text-bear"}>
                {mockData.changePercent}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex items-center gap-1">
            {timeframes.map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className="text-xs"
              >
                {tf}
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={chartContainerRef}
        className="relative bg-gradient-chart"
        style={{ height: isFullscreen ? 'calc(100vh - 120px)' : height }}
      >
        {/* Mock Chart Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-trading-foreground">نمودار {symbol}</h3>
              <p className="text-sm text-muted-foreground">
                در نسخه نهایی، نمودار TradingView اینجا نمایش داده می‌شود
              </p>
            </div>
          </div>
        </div>

        {/* Technical Indicators Overlay */}
        <div className="absolute top-4 left-4 space-y-2">
          <Badge className="bg-chart-ema50/20 text-chart-ema50 border-chart-ema50/30">
            EMA50: {analysis.rsiThreshold.overbought}
          </Badge>
          <Badge className="bg-chart-ema100/20 text-chart-ema100 border-chart-ema100/30">
            EMA100: {analysis.rsiThreshold.oversold}
          </Badge>
          <Badge className="bg-chart-ema200/20 text-chart-ema200 border-chart-ema200/30">
            EMA200: 13,390
          </Badge>
        </div>

        {/* Market Stats */}
        <div className="absolute bottom-4 right-4 bg-trading-card/90 backdrop-blur rounded-lg p-3 space-y-1">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">حجم:</span>
            <span className="text-trading-foreground font-mono">{mockData.volume}</span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">بالاترین:</span>
            <span className="text-bull font-mono">${mockData.high24h.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground">پایین‌ترین:</span>
            <span className="text-bear font-mono">${mockData.low24h.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Chart Footer */}
      <div className="flex items-center justify-between p-4 border-t border-border/50 text-sm text-muted-foreground">
        <div>آخرین به‌روزرسانی: {new Date().toLocaleTimeString('fa-IR')}</div>
        <div className="flex items-center gap-4">
          <span>منبع داده: Real-time Market</span>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-bull animate-pulse"></div>
            <span>زنده</span>
          </div>
        </div>
      </div>
    </Card>
  );
};