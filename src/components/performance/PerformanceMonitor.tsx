import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Zap, 
  Server, 
  Wifi,
  Clock,
  MemoryStick
} from "lucide-react";

interface PerformanceMetrics {
  memoryUsage: number;
  renderTime: number;
  networkLatency: number;
  dataProcessingTime: number;
  wsConnections: number;
  updatesPerSecond: number;
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    renderTime: 0,
    networkLatency: 0,
    dataProcessingTime: 0,
    wsConnections: 0,
    updatesPerSecond: 0
  });

  useEffect(() => {
    const updateMetrics = () => {
      // Simulate real performance metrics
      const performance = window.performance;
      const memoryInfo = (performance as any).memory;

      setMetrics({
        memoryUsage: memoryInfo ? (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100 : Math.random() * 50 + 30,
        renderTime: Math.random() * 16 + 2, // Target 60fps = 16ms
        networkLatency: Math.random() * 100 + 20,
        dataProcessingTime: Math.random() * 5 + 1,
        wsConnections: 3, // Mock WebSocket connections
        updatesPerSecond: Math.floor(Math.random() * 20 + 40)
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);

    return () => clearInterval(interval);
  }, []);

  const getPerformanceStatus = (value: number, type: 'memory' | 'render' | 'network') => {
    switch (type) {
      case 'memory':
        if (value < 60) return { color: 'text-bull', status: 'عالی' };
        if (value < 80) return { color: 'text-yellow-500', status: 'متوسط' };
        return { color: 'text-bear', status: 'ضعیف' };
      case 'render':
        if (value < 16) return { color: 'text-bull', status: 'عالی' };
        if (value < 33) return { color: 'text-yellow-500', status: 'متوسط' };
        return { color: 'text-bear', status: 'ضعیف' };
      case 'network':
        if (value < 50) return { color: 'text-bull', status: 'عالی' };
        if (value < 100) return { color: 'text-yellow-500', status: 'متوسط' };
        return { color: 'text-bear', status: 'ضعیف' };
      default:
        return { color: 'text-muted-foreground', status: 'نامشخص' };
    }
  };

  return (
    <Card className="bg-trading-card border-border/50">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-6 w-6 text-whale" />
          <h2 className="text-lg font-semibold text-trading-foreground">مانیتور عملکرد</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Memory Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MemoryStick className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">حافظه</span>
              </div>
              <Badge 
                variant="secondary"
                className={getPerformanceStatus(metrics.memoryUsage, 'memory').color}
              >
                {getPerformanceStatus(metrics.memoryUsage, 'memory').status}
              </Badge>
            </div>
            <Progress value={metrics.memoryUsage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {metrics.memoryUsage.toFixed(1)}% استفاده شده
            </p>
          </div>

          {/* Render Time */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">رندر</span>
              </div>
              <Badge 
                variant="secondary"
                className={getPerformanceStatus(metrics.renderTime, 'render').color}
              >
                {getPerformanceStatus(metrics.renderTime, 'render').status}
              </Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-trading-foreground">
              {metrics.renderTime.toFixed(1)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              زمان رندر فریم
            </p>
          </div>

          {/* Network Latency */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">شبکه</span>
              </div>
              <Badge 
                variant="secondary"
                className={getPerformanceStatus(metrics.networkLatency, 'network').color}
              >
                {getPerformanceStatus(metrics.networkLatency, 'network').status}
              </Badge>
            </div>
            <div className="text-2xl font-mono font-bold text-trading-foreground">
              {metrics.networkLatency.toFixed(0)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              تاخیر شبکه
            </p>
          </div>

          {/* Data Processing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">پردازش داده</span>
            </div>
            <div className="text-2xl font-mono font-bold text-whale">
              {metrics.dataProcessingTime.toFixed(1)}ms
            </div>
            <p className="text-xs text-muted-foreground">
              میانگین پردازش
            </p>
          </div>

          {/* WebSocket Connections */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">اتصالات زنده</span>
            </div>
            <div className="text-2xl font-mono font-bold text-bull">
              {metrics.wsConnections}
            </div>
            <p className="text-xs text-muted-foreground">
              WebSocket فعال
            </p>
          </div>

          {/* Updates per Second */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">به‌روزرسانی</span>
            </div>
            <div className="text-2xl font-mono font-bold text-primary">
              {metrics.updatesPerSecond}/s
            </div>
            <p className="text-xs text-muted-foreground">
              داده در ثانیه
            </p>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-chart">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-trading-foreground">
              وضعیت کلی سیستم
            </span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-bull animate-pulse"></div>
              <span className="text-sm text-bull">بهینه</span>
            </div>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            آخرین به‌روزرسانی: {new Date().toLocaleTimeString('fa-IR')}
          </div>
        </div>
      </div>
    </Card>
  );
};