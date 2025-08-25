import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WebSocketStatus {
  connected: boolean;
  lastMessage: Date | null;
  messageCount: number;
  latency: number;
  reconnectAttempts: number;
}

interface MarketDataMessage {
  type: 'market_data' | 'whale_activity' | 'signal';
  symbol: string;
  data: any;
  timestamp: number;
}

export const WebSocketManager = () => {
  const [status, setStatus] = useState<WebSocketStatus>({
    connected: false,
    lastMessage: null,
    messageCount: 0,
    latency: 0,
    reconnectAttempts: 0
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const pingIntervalRef = useRef<NodeJS.Timeout>();

  // Mock WebSocket endpoints - در production باید با API واقعی جایگزین شود
  const WS_ENDPOINTS = {
    market: 'wss://api.whalepulse.com/market',
    whale: 'wss://api.whalepulse.com/whale',
    signals: 'wss://api.whalepulse.com/signals'
  };

  const connectWebSocket = () => {
    try {
      // در production، از endpoint واقعی استفاده کنید
      // wsRef.current = new WebSocket(WS_ENDPOINTS.market);
      
      // Mock WebSocket برای نمایش
      const mockConnect = () => {
        setStatus(prev => ({
          ...prev,
          connected: true,
          reconnectAttempts: 0
        }));

        toast({
          title: "اتصال برقرار شد",
          description: "اتصال WebSocket با موفقیت برقرار شد",
        });

        // Simulate incoming messages
        const messageInterval = setInterval(() => {
          const mockMessage: MarketDataMessage = {
            type: Math.random() > 0.5 ? 'market_data' : 'whale_activity',
            symbol: 'NAS100',
            data: {
              price: 13586.60 + (Math.random() - 0.5) * 100,
              volume: Math.random() * 1000000
            },
            timestamp: Date.now()
          };

          handleMessage(mockMessage);
        }, 2000 + Math.random() * 3000);

        // Store interval reference for cleanup
        wsRef.current = { close: () => clearInterval(messageInterval) } as any;
      };

      setTimeout(mockConnect, 1000);

    } catch (error) {
      console.error('خطا در اتصال WebSocket:', error);
      setStatus(prev => ({
        ...prev,
        connected: false,
        reconnectAttempts: prev.reconnectAttempts + 1
      }));

      toast({
        variant: "destructive",
        title: "خطا در اتصال",
        description: "امکان برقراری اتصال WebSocket وجود ندارد",
      });

      // Auto reconnect
      if (status.reconnectAttempts < 5) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, Math.pow(2, status.reconnectAttempts) * 1000);
      }
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }

    setStatus(prev => ({
      ...prev,
      connected: false
    }));

    toast({
      title: "اتصال قطع شد",
      description: "اتصال WebSocket قطع شد",
    });
  };

  const handleMessage = (message: MarketDataMessage) => {
    const now = new Date();
    const latency = now.getTime() - message.timestamp;

    setStatus(prev => ({
      ...prev,
      lastMessage: now,
      messageCount: prev.messageCount + 1,
      latency: latency
    }));

    // Process different message types
    switch (message.type) {
      case 'market_data':
        // Handle market data updates
        break;
      case 'whale_activity':
        // Handle whale activity alerts
        break;
      case 'signal':
        // Handle trading signals
        break;
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const getStatusColor = () => {
    if (status.connected) return 'text-bull';
    if (status.reconnectAttempts > 0) return 'text-yellow-500';
    return 'text-bear';
  };

  const getStatusIcon = () => {
    if (status.connected) return <CheckCircle className="h-4 w-4" />;
    if (status.reconnectAttempts > 0) return <AlertCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  return (
    <Card className="bg-trading-card border-border/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-whale" />
            <h2 className="text-lg font-semibold text-trading-foreground">اتصال زنده</h2>
          </div>

          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary"
              className={`flex items-center gap-2 ${getStatusColor()}`}
            >
              {getStatusIcon()}
              {status.connected ? 'متصل' : 'قطع'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Connection Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {status.connected ? (
                <Wifi className="h-4 w-4 text-bull" />
              ) : (
                <WifiOff className="h-4 w-4 text-bear" />
              )}
              <span className="text-sm font-medium">وضعیت اتصال</span>
            </div>
            <p className={`text-lg font-semibold ${getStatusColor()}`}>
              {status.connected ? 'آنلاین' : 'آفلاین'}
            </p>
          </div>

          {/* Message Count */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">پیام‌های دریافتی</span>
            <p className="text-lg font-semibold text-trading-foreground">
              {status.messageCount.toLocaleString()}
            </p>
          </div>

          {/* Latency */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">تاخیر</span>
            <p className="text-lg font-semibold text-whale">
              {status.latency}ms
            </p>
          </div>

          {/* Last Message */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground">آخرین پیام</span>
            <p className="text-lg font-semibold text-trading-foreground">
              {status.lastMessage ? status.lastMessage.toLocaleTimeString('fa-IR') : 'هیچ'}
            </p>
          </div>
        </div>

        {/* Connection Controls */}
        <div className="flex items-center gap-2 mt-6">
          {status.connected ? (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={disconnectWebSocket}
            >
              قطع اتصال
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm"
              onClick={connectWebSocket}
            >
              اتصال مجدد
            </Button>
          )}

          {status.reconnectAttempts > 0 && (
            <Badge variant="secondary" className="text-yellow-500">
              تلاش {status.reconnectAttempts}/5
            </Badge>
          )}
        </div>

        {/* Connection Info */}
        <div className="mt-4 p-3 rounded-lg bg-gradient-chart">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>🔗 Endpoints: Market, Whale, Signals</p>
            <p>📊 Protocol: WebSocket Secure (WSS)</p>
            <p>🔄 Auto-reconnect: فعال</p>
            <p>⚡ Real-time: بله</p>
          </div>
        </div>
      </div>
    </Card>
  );
};