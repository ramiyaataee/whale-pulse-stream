import { TradingHeader } from "@/components/trading/TradingHeader";
import { WhaleActivityCard } from "@/components/trading/WhaleActivityCard";
import { TechnicalIndicators } from "@/components/trading/TechnicalIndicators";
import { SignalsPanel } from "@/components/trading/SignalsPanel";
import NAS100Analysis from "@/components/trading/NAS100Analysis";
import { useMockData } from "@/hooks/useMockData";

const Index = () => {
  const { marketData, whaleTransactions, technicalData, signals, clearSignals } = useMockData();

  return (
    <div className="min-h-screen bg-trading-background text-trading-foreground">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header with Market Data */}
        <TradingHeader marketData={marketData} />
        
        {/* NAS100 Smart Analysis */}
        <NAS100Analysis />
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Whale Activity */}
          <WhaleActivityCard transactions={whaleTransactions} />
          
          {/* Technical Indicators */}
          <TechnicalIndicators data={technicalData} />
          
          {/* Trading Signals */}
          <SignalsPanel signals={signals} onClearSignals={clearSignals} />
        </div>
      </div>
    </div>
  );
};

export default Index;
