import { TradingHeader } from "@/components/trading/TradingHeader";
import { WhaleActivityCard } from "@/components/trading/WhaleActivityCard";
import { TechnicalIndicators } from "@/components/trading/TechnicalIndicators";
import { SignalsPanel } from "@/components/trading/SignalsPanel";
import NAS100Analysis from "@/components/trading/NAS100Analysis";
import SettingsPanel from "@/components/trading/SettingsPanel";
import { useMockData } from "@/hooks/useMockData";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { useTradingStore } from "@/stores/tradingStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wifi, WifiOff, Download } from "lucide-react";

const Index = () => {
  const { marketData, whaleTransactions, technicalData, signals, clearSignals } = useMockData();
  const { isOnline, updateAvailable, updateServiceWorker, requestPersistentStorage } = useServiceWorker();
  const { autoMode } = useTradingStore();

  return (
    <div className="min-h-screen bg-trading-background text-trading-foreground">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header with Status */}
        <div className="flex items-center justify-between">
          <TradingHeader marketData={marketData} />
          <div className="flex items-center gap-4">
            {/* Online Status */}
            <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-2">
              {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              {isOnline ? "آنلاین" : "آفلاین"}
            </Badge>

            {/* Auto Mode Status */}
            <Badge variant={autoMode ? "default" : "secondary"}>
              {autoMode ? "🤖 خودکار" : "🎮 دستی"}
            </Badge>

            {/* Update Available */}
            {updateAvailable && (
              <Button onClick={updateServiceWorker} size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                به‌روزرسانی
              </Button>
            )}
          </div>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="dashboard">داشبورد</TabsTrigger>
            <TabsTrigger value="analysis">تحلیل</TabsTrigger>
            <TabsTrigger value="settings">تنظیمات</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <WhaleActivityCard transactions={whaleTransactions} />
              <TechnicalIndicators data={technicalData} />
              <SignalsPanel signals={signals} onClearSignals={clearSignals} />
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <NAS100Analysis />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
