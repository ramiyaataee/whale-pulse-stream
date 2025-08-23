import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fish, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface WhaleTransaction {
  id: string;
  timestamp: string;
  type: 'buy' | 'sell';
  amount: number;
  amountUsd: number;
  price: number;
  confidence: 'high' | 'medium' | 'low';
}

interface WhaleActivityCardProps {
  transactions: WhaleTransaction[];
}

export const WhaleActivityCard = ({ transactions }: WhaleActivityCardProps) => {
  const getConfidenceColor = (confidence: WhaleTransaction['confidence']) => {
    switch (confidence) {
      case 'high': return 'bg-confidence-high/20 text-confidence-high border-confidence-high/30';
      case 'medium': return 'bg-confidence-medium/20 text-confidence-medium border-confidence-medium/30';
      case 'low': return 'bg-confidence-low/20 text-confidence-low border-confidence-low/30';
    }
  };

  const getTypeColor = (type: WhaleTransaction['type']) => {
    return type === 'buy' 
      ? 'bg-bull/20 text-bull border-bull/30' 
      : 'bg-bear/20 text-bear border-bear/30';
  };

  return (
    <Card className="bg-gradient-chart border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Fish className="h-5 w-5 text-whale" />
          فعالیت نهنگ‌ها
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {tx.type === 'buy' ? (
                  <TrendingUp className="h-4 w-4 text-bull" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-bear" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(tx.type)}>
                      {tx.type === 'buy' ? 'خرید' : 'فروش'}
                    </Badge>
                    <Badge variant="outline" className={getConfidenceColor(tx.confidence)}>
                      اعتماد: {tx.confidence === 'high' ? 'بالا' : tx.confidence === 'medium' ? 'متوسط' : 'پایین'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {new Date(tx.timestamp).toLocaleTimeString('fa-IR')}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="font-semibold text-foreground">
                    ${(tx.amountUsd / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {tx.amount.toLocaleString()} واحد
                </div>
                <div className="text-sm text-muted-foreground">
                  @ ${tx.price.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};