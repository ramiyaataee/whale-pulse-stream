import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  PieChart,
  Target,
  AlertTriangle
} from "lucide-react";

interface PortfolioPosition {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
  allocation: number;
}

const mockPositions: PortfolioPosition[] = [
  {
    symbol: "NAS100",
    quantity: 10,
    avgPrice: 13200,
    currentPrice: 13586.60,
    value: 135866,
    pnl: 3866,
    pnlPercent: 2.93,
    allocation: 65
  },
  {
    symbol: "SPX500",
    quantity: 5,
    avgPrice: 4420,
    currentPrice: 4456.30,
    value: 22281.50,
    pnl: 181.50,
    pnlPercent: 0.82,
    allocation: 25
  },
  {
    symbol: "EURUSD",
    quantity: 100000,
    avgPrice: 1.0845,
    currentPrice: 1.0867,
    value: 10867,
    pnl: 220,
    pnlPercent: 2.03,
    allocation: 10
  }
];

export const PortfolioOverview = () => {
  const totalValue = mockPositions.reduce((sum, pos) => sum + pos.value, 0);
  const totalPnL = mockPositions.reduce((sum, pos) => sum + pos.pnl, 0);
  const totalPnLPercent = (totalPnL / (totalValue - totalPnL)) * 100;

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-chart border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ارزش کل</p>
              <p className="text-2xl font-bold text-trading-foreground">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-whale" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-chart border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">سود/زیان</p>
              <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-bull' : 'text-bear'}`}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString()}
              </p>
            </div>
            {totalPnL >= 0 ? (
              <TrendingUp className="h-8 w-8 text-bull" />
            ) : (
              <TrendingDown className="h-8 w-8 text-bear" />
            )}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-chart border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">درصد بازده</p>
              <p className={`text-2xl font-bold ${totalPnLPercent >= 0 ? 'text-bull' : 'text-bear'}`}>
                {totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%
              </p>
            </div>
            <Target className="h-8 w-8 text-whale" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-chart border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">پوزیشن‌های فعال</p>
              <p className="text-2xl font-bold text-trading-foreground">
                {mockPositions.length}
              </p>
            </div>
            <PieChart className="h-8 w-8 text-whale" />
          </div>
        </Card>
      </div>

      {/* Positions Table */}
      <Card className="bg-trading-card border-border/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-trading-foreground">پوزیشن‌های فعال</h2>
            <Button variant="outline" size="sm">
              افزودن پوزیشن
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">نماد</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">مقدار</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">قیمت متوسط</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">قیمت فعلی</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">ارزش</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">سود/زیان</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">تخصیص</th>
                  <th className="text-right p-3 text-sm font-medium text-muted-foreground">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {mockPositions.map((position) => (
                  <tr key={position.symbol} className="border-b border-border/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{position.symbol}</Badge>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-trading-foreground">
                      {position.quantity.toLocaleString()}
                    </td>
                    <td className="p-3 font-mono text-trading-foreground">
                      ${position.avgPrice.toLocaleString()}
                    </td>
                    <td className="p-3 font-mono text-trading-foreground">
                      ${position.currentPrice.toLocaleString()}
                    </td>
                    <td className="p-3 font-mono text-trading-foreground">
                      ${position.value.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono ${position.pnl >= 0 ? 'text-bull' : 'text-bear'}`}>
                          {position.pnl >= 0 ? '+' : ''}${position.pnl.toLocaleString()}
                        </span>
                        <Badge 
                          variant="secondary"
                          className={position.pnl >= 0 ? 'bg-bull/20 text-bull border-bull/30' : 'bg-bear/20 text-bear border-bear/30'}
                        >
                          {position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={position.allocation} className="w-16" />
                        <span className="text-sm text-muted-foreground">{position.allocation}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          ویرایش
                        </Button>
                        <Button variant="ghost" size="sm" className="text-bear hover:text-bear">
                          بستن
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Risk Analysis */}
      <Card className="bg-trading-card border-border/50">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h2 className="text-lg font-semibold text-trading-foreground">تحلیل ریسک</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ریسک کل</span>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                  متوسط
                </Badge>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground">65% از سرمایه در معرض ریسک</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">تنوع‌سازی</span>
                <Badge variant="secondary" className="bg-bull/20 text-bull border-bull/30">
                  خوب
                </Badge>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">3 بازار مختلف</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">نوسانات</span>
                <Badge variant="secondary" className="bg-bear/20 text-bear border-bear/30">
                  بالا
                </Badge>
              </div>
              <Progress value={82} className="h-2" />
              <p className="text-xs text-muted-foreground">نوسانات روزانه 2.3%</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};