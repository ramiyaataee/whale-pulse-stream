import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { useTradingStore } from "@/stores/tradingStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, WifiOff } from "lucide-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isOnline, updateAvailable, updateServiceWorker, sendNotification } = useServiceWorker();
  const { notifications } = useTradingStore();

  useEffect(() => {
    // Auto-send notification when app is ready
    if (notifications.enabled) {
      setTimeout(() => {
        sendNotification(
          "🐋 WhalePulse آماده است",
          "ربات شما آنلاین شده و آماده تحلیل بازار است"
        );
      }, 2000);
    }
  }, [notifications.enabled, sendNotification]);

  return (
    <>
      {/* Online/Offline Status & Update Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {!isOnline && (
          <Badge variant="destructive" className="flex items-center gap-2">
            <WifiOff className="h-3 w-3" />
            آفلاین
          </Badge>
        )}
        
        {updateAvailable && (
          <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-lg flex items-center gap-3">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">نسخه جدید موجود است</span>
            <Button size="sm" variant="secondary" onClick={updateServiceWorker}>
              بروزرسانی
            </Button>
          </div>
        )}

        {/* Subscribe to Notifications Button */}
        {!notifications.enabled && 'Notification' in window && (
          <Button 
            className="bg-bull hover:bg-bull/90 text-white flex items-center gap-2"
            onClick={async () => {
              const permission = await Notification.requestPermission();
              if (permission === 'granted') {
                const { updateSettings } = useTradingStore.getState();
                updateSettings({ notifications: { ...notifications, enabled: true } });
                sendNotification("🔔 هشدارها فعال شد", "شما اکنون هشدارهای مهم دریافت خواهید کرد");
              }
            }}
          >
            <Bell className="h-4 w-4" />
            دکمه سبز - فعال‌سازی هشدارها
          </Button>
        )}
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
