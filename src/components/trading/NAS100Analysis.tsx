import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, TrendingUp, TrendingDown, Target, Shield } from "lucide-react";

interface NAS100Data {
  symbol: string;
  current_price: number;
  daily_change: string;
  volume: string;
  last_update: string;
  technical_indicators: {
    trend: string;
    ema: {
      ema50: number;
      ema100: number;
      ema200: number;
    };
    rsi: {
      value: number;
      status: string;
    };
    support_resistance: {
      resistance: number;
      support: number;
    };
  };
  whale_activity: Array<{
    time: string;
    type: string;
    confidence: string;
    amount: string;
    units: number;
    price: number;
  }>;
  recent_signals: Array<{
    time: string;
    type: string;
    confidence: string;
    trigger: string;
    rsi: number;
  }>;
}

const NAS100Analysis = () => {
  const data: NAS100Data = {
    symbol: "NAS100_i",
    current_price: 13586.60,
    daily_change: "+262.10 (+1.97%)",
    volume: "4263.7M",
    last_update: "07:31:21",
    technical_indicators: {
      trend: "صعودی",
      ema: { ema50: 13440.5, ema100: 13420.75, ema200: 13390.25 },
      rsi: { value: 93.5, status: "اشباع خرید" },
      support_resistance: { resistance: 13480, support: 13380 }
    },
    whale_activity: [
      { time: "07:31:21", type: "فروش", confidence: "بالا", amount: "$2.2M", units: 1231, price: 13588.084 },
      { time: "07:31:01", type: "فروش", confidence: "پایین", amount: "$2.9M", units: 1439, price: 13561.708 },
      { time: "07:30:37", type: "خرید", confidence: "بالا", amount: "$1.1M", units: 1245, price: 13591.952 }
    ],
    recent_signals: [
      { time: "07:30:41", type: "هشدار نزولی", confidence: "پایین", trigger: "تقاطع EMA", rsi: 95.7 },
      { time: "07:28:41", type: "سیگنال صعودی", confidence: "بالا", trigger: "فعالیت نهنگ", rsi: 100.0 }
    ]
  };

  // تحلیل هوشمند داده‌ها
  const analysis = () => {
    const { rsi, ema } = data.technical_indicators;
    const whaleNetFlow = data.whale_activity.reduce((acc, activity) => {
      const amount = parseFloat(activity.amount.replace(/[$M]/g, ''));
      return activity.type === 'خرید' ? acc + amount : acc - amount;
    }, 0);

    // تعیین سطح ریسک
    let riskLevel = "متوسط";
    let riskColor = "warning";
    
    if (rsi.value > 90 && whaleNetFlow < -2) {
      riskLevel = "بالا";
      riskColor = "destructive";
    } else if (rsi.value < 30 && whaleNetFlow > 2) {
      riskLevel = "پایین";
      riskColor = "success";
    }

    // سیگنال نهایی
    let finalSignal = "انتظار";
    let signalIcon = Target;
    let signalColor = "warning";

    if (rsi.value > 85 && whaleNetFlow < -1) {
      finalSignal = "فروش احتمالی";
      signalIcon = TrendingDown;
      signalColor = "destructive";
    } else if (rsi.value < 40 && whaleNetFlow > 1) {
      finalSignal = "خرید احتمالی";
      signalIcon = TrendingUp;
      signalColor = "success";
    }

    return { riskLevel, riskColor, finalSignal, signalIcon, signalColor, whaleNetFlow };
  };

  const { riskLevel, riskColor, finalSignal, signalIcon: SignalIcon, signalColor, whaleNetFlow } = analysis();

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          تحلیل هوشمند NAS100
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* اطلاعات کلیدی */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-accent/20">
            <div className="text-2xl font-bold text-primary">{data.current_price.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">قیمت فعلی</div>
            <div className="text-success text-sm">{data.daily_change}</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-accent/20">
            <div className="text-2xl font-bold text-primary">{data.technical_indicators.rsi.value}</div>
            <div className="text-sm text-muted-foreground">RSI</div>
            <Badge variant={data.technical_indicators.rsi.value > 80 ? "destructive" : data.technical_indicators.rsi.value < 30 ? "default" : "secondary"}>
              {data.technical_indicators.rsi.status}
            </Badge>
          </div>

          <div className="text-center p-4 rounded-lg bg-accent/20">
            <div className="text-2xl font-bold text-primary">${Math.abs(whaleNetFlow).toFixed(1)}M</div>
            <div className="text-sm text-muted-foreground">جریان نهنگ‌ها</div>
            <Badge variant={whaleNetFlow > 0 ? "default" : "destructive"}>
              {whaleNetFlow > 0 ? "خرید خالص" : "فروش خالص"}
            </Badge>
          </div>

          <div className="text-center p-4 rounded-lg bg-accent/20">
            <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
              <SignalIcon className="h-6 w-6" />
            </div>
            <div className="text-sm text-muted-foreground">سیگنال نهایی</div>
            <Badge variant={signalColor as any}>{finalSignal}</Badge>
          </div>
        </div>

        {/* هشدار ریسک */}
        <Alert variant={riskColor as any}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>سطح ریسک: {riskLevel}</strong>
            {riskLevel === "بالا" && " - RSI در ناحیه اشباع خرید و فروش نهنگ‌ها فعال"}
            {riskLevel === "پایین" && " - شرایط مناسب برای ورود"}
            {riskLevel === "متوسط" && " - نیاز به مراقبت بیشتر"}
          </AlertDescription>
        </Alert>

        {/* تحلیل EMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              تحلیل میانگین متحرک
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>EMA 50:</span>
                <span className="font-medium">{data.technical_indicators.ema.ema50.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>EMA 100:</span>
                <span className="font-medium">{data.technical_indicators.ema.ema100.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>EMA 200:</span>
                <span className="font-medium">{data.technical_indicators.ema.ema200.toLocaleString()}</span>
              </div>
              <Badge variant="default" className="w-full justify-center">
                ترند {data.technical_indicators.trend}
              </Badge>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              حمایت و مقاومت
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>مقاومت:</span>
                <span className="font-medium text-destructive">
                  {data.technical_indicators.support_resistance.resistance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>حمایت:</span>
                <span className="font-medium text-success">
                  {data.technical_indicators.support_resistance.support.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>فاصله از مقاومت:</span>
                <span className="font-medium">
                  {((data.current_price - data.technical_indicators.support_resistance.resistance) / data.current_price * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* استراتژی خروج */}
        <Card className="p-4 bg-accent/10">
          <h4 className="font-semibold mb-3">🎯 استراتژی پیشنهادی</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium text-success mb-2">📈 سناریو صعودی</h5>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• ورود: پس از شکست مقاومت 13,480</li>
                <li>• هدف 1: 13,650</li>
                <li>• هدف 2: 13,800</li>
                <li>• Stop Loss: زیر 13,380</li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-medium text-destructive mb-2">📉 سناریو نزولی</h5>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• ورود: پس از شکست حمایت 13,380</li>
                <li>• هدف 1: 13,250</li>
                <li>• هدف 2: 13,100</li>
                <li>• Stop Loss: بالای 13,480</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* آخرین فعالیت نهنگ‌ها */}
        <Card className="p-4">
          <h4 className="font-semibold mb-3">🐋 آخرین فعالیت نهنگ‌ها</h4>
          <div className="space-y-2">
            {data.whale_activity.slice(0, 3).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-accent/20">
                <div className="flex items-center gap-2">
                  <Badge variant={activity.type === 'خرید' ? 'default' : 'destructive'}>
                    {activity.type}
                  </Badge>
                  <span className="text-sm">{activity.amount}</span>
                  <Badge variant={activity.confidence === 'بالا' ? 'default' : 'secondary'}>
                    {activity.confidence}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </CardContent>
    </Card>
  );
};

export default NAS100Analysis;