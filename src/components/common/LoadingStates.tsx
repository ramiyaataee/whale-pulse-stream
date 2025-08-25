import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, TrendingUp, BarChart3 } from "lucide-react";

// Chart Loading Skeleton
export const ChartLoadingSkeleton = () => (
  <Card className="bg-trading-card border-border/50">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-64 w-full" />
        <div className="flex justify-between text-sm">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  </Card>
);

// Trading Card Loading Skeleton
export const TradingCardLoadingSkeleton = () => (
  <Card className="bg-trading-card border-border/50">
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-muted-foreground" />
        <Skeleton className="h-5 w-32" />
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded border border-border/30">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

// Table Loading Skeleton
export const TableLoadingSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <Card className="bg-trading-card border-border/50">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-9 w-24" />
      </div>
      
      <div className="space-y-1">
        {/* Header */}
        <div className="flex items-center gap-4 p-3 border-b border-border/50">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 border-b border-border/30">
            {[1, 2, 3, 4, 5].map((j) => (
              <Skeleton key={j} className="h-4 w-20" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </Card>
);

// Dashboard Loading Skeleton
export const DashboardLoadingSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
    
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-6 bg-trading-card border-border/50">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </Card>
      ))}
    </div>
    
    {/* Main Content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <TradingCardLoadingSkeleton />
      <TradingCardLoadingSkeleton />
      <TradingCardLoadingSkeleton />
    </div>
  </div>
);

// Spinner Component
export const Spinner = ({ size = "default", className = "" }: { 
  size?: "sm" | "default" | "lg"; 
  className?: string; 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${className}`}>
      <div className="h-full w-full rounded-full border-2 border-whale border-r-transparent"></div>
    </div>
  );
};

// Page Loading Screen
export const PageLoadingScreen = () => (
  <div className="min-h-screen bg-trading-background flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <Activity className="h-16 w-16 text-whale animate-pulse" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-trading-foreground">در حال بارگذاری...</h2>
        <p className="text-muted-foreground">WhalePulse در حال آماده‌سازی است</p>
      </div>
      <Spinner size="lg" />
    </div>
  </div>
);

// Suspense Fallback
export const SuspenseFallback = ({ message = "در حال بارگذاری..." }: { message?: string }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center space-y-4">
      <Spinner />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  </div>
);