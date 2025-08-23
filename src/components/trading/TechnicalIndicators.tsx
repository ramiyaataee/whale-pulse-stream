import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";

interface TechnicalData {
  ema50: number;
  ema100: number;
  ema200: number;
  rsi: number;
  supportLevel: number;
  resistanceLevel: number;
  currentPrice: number;
  trend: 'bullish' | 'bearish' | 'sideways';
  pullbackSignal: boolean;
}

interface TechnicalIndicatorsProps {
  data: TechnicalData;
}

export const TechnicalIndicators = ({ data }: TechnicalIndicatorsProps) => {
  const getTrendIcon = () => {
    switch (data.trend) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-bull" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-bear" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (data.trend) {
      case 'bullish': return 'bg-bull/20 text-bull border-bull/30';
      case 'bearish': return 'bg-bear/20 text-bear border-bear/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const getRSIStatus = () => {
    if (data.rsi >= 70) return { status: 'اشباع خرید', color: 'text-bear' };
    if (data.rsi <= 30) return { status: 'اشباع فروش', color: 'text-bull' };
    return { status: 'خنثی', color: 'text-muted-foreground' };
  };

  const rsiStatus = getRSIStatus();

  return (
    <Card className="bg-gradient-chart border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <BarChart3 className="h-5 w-5 text-chart-ema50" />
          تحلیل تکنیکال
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trend Analysis */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">روند کلی</span>
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <Badge className={getTrendColor()}>
                {data.trend === 'bullish' ? 'صعودی' : data.trend === 'bearish' ? 'نزولی' : 'خنثی'}
              </Badge>
            </div>
          </div>
          {data.pullbackSignal && (
            <Badge variant="outline" className="bg-whale/20 text-whale border-whale/30">
              سیگنال پولبک تشخیص داده شد
            </Badge>
          )}
        </div>

        {/* EMA Lines */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">میانگین متحرک نمایی (EMA)</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-ema50"></div>
                EMA 50
              </span>
              <span className="font-mono text-foreground">${data.ema50.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-ema100"></div>
                EMA 100
              </span>
              <span className="font-mono text-foreground">${data.ema100.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-ema200"></div>
                EMA 200
              </span>
              <span className="font-mono text-foreground">${data.ema200.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* RSI */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">RSI (14)</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-foreground">{data.rsi.toFixed(1)}</span>
              <Badge variant="outline" className={rsiStatus.color}>
                {rsiStatus.status}
              </Badge>
            </div>
          </div>
          <Progress 
            value={data.rsi} 
            className="h-2"
            style={{
              background: `linear-gradient(to right, 
                hsl(var(--bull)) 0%, 
                hsl(var(--bull)) 30%, 
                hsl(var(--muted)) 30%, 
                hsl(var(--muted)) 70%, 
                hsl(var(--bear)) 70%, 
                hsl(var(--bear)) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>30 (اشباع فروش)</span>
            <span>70 (اشباع خرید)</span>
          </div>
        </div>

        {/* Support & Resistance */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">سطوح حمایت و مقاومت</h4>
          
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-resistance"></div>
              مقاومت
            </span>
            <span className="font-mono text-foreground">${data.resistanceLevel.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">قیمت فعلی</span>
            <span className="font-mono text-foreground font-semibold">${data.currentPrice.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-chart-support"></div>
              حمایت
            </span>
            <span className="font-mono text-foreground">${data.supportLevel.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};