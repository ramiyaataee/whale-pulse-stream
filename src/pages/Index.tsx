import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TradingViewChart } from "@/components/chart/TradingViewChart";
import { PortfolioOverview } from "@/components/portfolio/PortfolioOverview";
import { AlertsManager } from "@/components/alerts/AlertsManager";
import { PerformanceMonitor } from "@/components/performance/PerformanceMonitor";
import { WebSocketManager } from "@/components/websocket/WebSocketManager";
import { WhaleActivityCard } from "@/components/trading/WhaleActivityCard";
import { TechnicalIndicators } from "@/components/trading/TechnicalIndicators";
import { SignalsPanel } from "@/components/trading/SignalsPanel";
import NAS100Analysis from "@/components/trading/NAS100Analysis";
import SettingsPanel from "@/components/trading/SettingsPanel";
import { useRealMarketData } from "@/hooks/useRealMarketData";
import { useTradingShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

const Index = () => {
  const { marketData, whaleTransactions, technicalData, signals, clearSignals, isLoading, error } = useRealMarketData();
  const [activeTab, setActiveTab] = useState("overview");

  // Keyboard shortcuts
  useTradingShortcuts({
    openChart: () => setActiveTab("chart"),
    openPortfolio: () => setActiveTab("portfolio"),
    openAlerts: () => setActiveTab("alerts"),
    openSettings: () => setActiveTab("settings"),
    refresh: () => window.location.reload(),
  });

  if (isLoading) {
    return (
      <ErrorBoundary>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-muted-foreground">در حال بارگذاری داده‌های بازار...</p>
              <p className="text-sm text-muted-foreground">
                اتصال به Yahoo Finance، Alpha Vantage و Binance
              </p>
            </div>
          </div>
        </DashboardLayout>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <DashboardLayout>
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {/* Main Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-7 w-full max-w-3xl">
              <TabsTrigger value="overview">نمای کلی</TabsTrigger>
              <TabsTrigger value="chart">نمودار</TabsTrigger>
              <TabsTrigger value="portfolio">پورتفولیو</TabsTrigger>
              <TabsTrigger value="analysis">تحلیل</TabsTrigger>
              <TabsTrigger value="alerts">هشدارها</TabsTrigger>
              <TabsTrigger value="system">سیستم</TabsTrigger>
              <TabsTrigger value="settings">تنظیمات</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <WhaleActivityCard transactions={whaleTransactions} />
                <TechnicalIndicators data={technicalData} />
                <SignalsPanel signals={signals} onClearSignals={clearSignals} />
              </div>
              
              {/* Quick Chart Preview */}
              <TradingViewChart symbol="NAS100" height={300} />
            </TabsContent>

            {/* Chart Tab */}
            <TabsContent value="chart" className="space-y-6">
              <TradingViewChart symbol="NAS100" height={600} />
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <PortfolioOverview />
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              <NAS100Analysis />
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <AlertsManager />
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformanceMonitor />
                <WebSocketManager />
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <SettingsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ErrorBoundary>
  );
};

export default Index;
