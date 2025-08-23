import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Signal, AlertTriangle, TrendingUp, Volume2, Activity } from "lucide-react";

interface TradingSignal {
  id: string;
  title: string;
  timestamp: string;
  symbol: string;
  confidence: 'high' | 'medium' | 'low';
  type: 'volume_spike' | 'whale_activity' | 'technical_breakout' | 'ema_cross' | 'support_break';
  description: string;
  features: {
    price: number;
    volume: number;
    rsi?: number;
    whaleActivity?: boolean;
  };
  disclaimer: string;
}

interface SignalsPanelProps {
  signals: TradingSignal[];
  onClearSignals?: () => void;
}

export const SignalsPanel = ({ signals, onClearSignals }: SignalsPanelProps) => {
  const getConfidenceColor = (confidence: TradingSignal['confidence']) => {
    switch (confidence) {
      case 'high': return 'bg-confidence-high/20 text-confidence-high border-confidence-high/30';
      case 'medium': return 'bg-confidence-medium/20 text-confidence-medium border-confidence-medium/30';
      case 'low': return 'bg-confidence-low/20 text-confidence-low border-confidence-low/30';
    }
  };

  const getTypeIcon = (type: TradingSignal['type']) => {
    switch (type) {
      case 'volume_spike': return <Volume2 className="h-4 w-4" />;
      case 'whale_activity': return <Activity className="h-4 w-4" />;
      case 'technical_breakout': return <TrendingUp className="h-4 w-4" />;
      case 'ema_cross': return <Signal className="h-4 w-4" />;
      case 'support_break': return <AlertTriangle className="h-4 w-4" />;
      default: return <Signal className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: TradingSignal['type']) => {
    switch (type) {
      case 'volume_spike': return 'افزایش حجم';
      case 'whale_activity': return 'فعالیت نهنگ';
      case 'technical_breakout': return 'شکست تکنیکال';
      case 'ema_cross': return 'تقاطع EMA';
      case 'support_break': return 'شکست حمایت';
      default: return 'سیگنال عمومی';
    }
  };

  return (
    <Card className="bg-gradient-chart border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Signal className="h-5 w-5 text-primary" />
            سیگنال‌های معاملاتی
            <Badge variant="secondary" className="ml-2">
              {signals.length}
            </Badge>
          </CardTitle>
          {signals.length > 0 && onClearSignals && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSignals}
              className="text-muted-foreground hover:text-foreground"
            >
              پاک کردن همه
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {signals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Signal className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>هیچ سیگنال فعالی وجود ندارد</p>
              <p className="text-sm mt-1">سیستم در حال نظارت بر بازار است...</p>
            </div>
          ) : (
            signals.map((signal) => (
              <div
                key={signal.id}
                className="p-4 rounded-lg bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-colors"
              >
                {/* Signal Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-primary">
                      {getTypeIcon(signal.type)}
                      <span className="font-semibold text-sm">{getTypeLabel(signal.type)}</span>
                    </div>
                    <Badge className={getConfidenceColor(signal.confidence)}>
                      {signal.confidence === 'high' ? 'اعتماد بالا' : 
                       signal.confidence === 'medium' ? 'اعتماد متوسط' : 'اعتماد پایین'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(signal.timestamp).toLocaleTimeString('fa-IR')}
                  </div>
                </div>

                {/* Signal Content */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">{signal.title}</h4>
                  <p className="text-sm text-muted-foreground">{signal.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="text-xs">
                      قیمت: ${signal.features.price.toLocaleString()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      حجم: ${(signal.features.volume / 1000000).toFixed(1)}M
                    </Badge>
                    {signal.features.rsi && (
                      <Badge variant="outline" className="text-xs">
                        RSI: {signal.features.rsi.toFixed(1)}
                      </Badge>
                    )}
                    {signal.features.whaleActivity && (
                      <Badge variant="outline" className="text-xs bg-whale/20 text-whale border-whale/30">
                        فعالیت نهنگ
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-3 pt-3 border-t border-border/30">
                  <p className="text-xs text-muted-foreground italic">
                    {signal.disclaimer}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};