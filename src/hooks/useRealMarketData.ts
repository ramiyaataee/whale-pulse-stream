import { useState, useEffect } from 'react';
import { MarketDataService } from '@/services/marketDataService';
import type { MarketData, WhaleTransaction, TechnicalData } from '@/services/marketDataService';

interface TradingSignal {
  id: string;
  title: string;
  timestamp: string;
  symbol: string;
  confidence: 'high' | 'medium' | 'low';
  type: 'volume_spike' | 'whale_activity' | 'technical_breakout' | 'ema_cross' | 'support_break';
  description: string;
  features: {
    price: number;
    volume: number;
    rsi?: number;
    whaleActivity?: boolean;
  };
  disclaimer: string;
}

export const useRealMarketData = () => {
  const [marketData, setMarketData] = useState<MarketData>({
    symbol: "NAS100",
    price: 23580.50,
    change24h: 0,
    changePercent: "0.00%",
    volume24h: 0,
    lastUpdate: new Date().toISOString(),
    source: 'Loading...'
  });

  const [whaleTransactions, setWhaleTransactions] = useState<WhaleTransaction[]>([]);
  const [technicalData, setTechnicalData] = useState<TechnicalData>({
    ema50: 0,
    ema100: 0,
    ema200: 0,
    rsi: 50,
    supportLevel: 0,
    resistanceLevel: 0,
    currentPrice: 0,
    trend: 'sideways',
    pullbackSignal: false,
  });

  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const marketService = new MarketDataService();

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [market, technical, whales] = await Promise.all([
          marketService.getMarketData('NAS100'),
          marketService.getTechnicalData('NAS100'),
          marketService.getWhaleTransactions('NAS100')
        ]);

        setMarketData(market);
        setTechnicalData(technical);
        setWhaleTransactions(whales);

        // Generate initial signals based on technical data
        generateSignalsFromTechnical(technical);
        
      } catch (err) {
        console.error('Failed to load market data:', err);
        setError('خطا در بارگذاری داده‌ها. در حال استفاده از داده‌های شبیه‌سازی...');
        loadFallbackData();
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Real-time data updates
  useEffect(() => {
    if (isLoading) return;

    const unsubscribe = marketService.subscribeToMarketData('NAS100', (data) => {
      setMarketData(data);
      
      // Update technical data periodically
      if (Math.random() > 0.8) {
        marketService.getTechnicalData('NAS100')
          .then(setTechnicalData)
          .catch(console.error);
      }

      // Update whale transactions periodically
      if (Math.random() > 0.9) {
        marketService.getWhaleTransactions('NAS100')
          .then(whales => {
            setWhaleTransactions(prev => {
              const newTransactions = whales.filter(
                whale => !prev.some(existing => existing.id === whale.id)
              );
              return [...newTransactions, ...prev].slice(0, 10);
            });
          })
          .catch(console.error);
      }
    });

    return unsubscribe;
  }, [isLoading]);

  const generateSignalsFromTechnical = (technical: TechnicalData) => {
    const newSignals: TradingSignal[] = [];

    // RSI-based signals
    if (technical.rsi > 70) {
      newSignals.push({
        id: `rsi-${Date.now()}`,
        title: "SIG | NAS100 | هشدار اشباع خرید",
        timestamp: new Date().toISOString(),
        symbol: 'NAS100',
        confidence: 'high',
        type: 'technical_breakout',
        description: `RSI در سطح ${technical.rsi.toFixed(1)} - احتمال اصلاح قیمت`,
        features: {
          price: technical.currentPrice,
          volume: marketData.volume24h,
          rsi: technical.rsi
        },
        disclaimer: 'این اطلاعات صرفاً جهت اطلاع‌رسانی است و توصیه سرمایه‌گذاری محسوب نمی‌شود.'
      });
    } else if (technical.rsi < 30) {
      newSignals.push({
        id: `rsi-${Date.now()}`,
        title: "SIG | NAS100 | فرصت خرید - اشباع فروش",
        timestamp: new Date().toISOString(),
        symbol: 'NAS100',
        confidence: 'high',
        type: 'technical_breakout',
        description: `RSI در سطح ${technical.rsi.toFixed(1)} - اشباع فروش تشخیص داده شد`,
        features: {
          price: technical.currentPrice,
          volume: marketData.volume24h,
          rsi: technical.rsi
        },
        disclaimer: 'این اطلاعات صرفاً جهت اطلاع‌رسانی است و توصیه سرمایه‌گذاری محسوب نمی‌شود.'
      });
    }

    // EMA trend signals
    if (technical.ema50 > technical.ema200) {
      newSignals.push({
        id: `ema-${Date.now()}`,
        title: "SIG | NAS100 | تایید روند صعودی",
        timestamp: new Date().toISOString(),
        symbol: 'NAS100',
        confidence: 'medium',
        type: 'ema_cross',
        description: "EMA 50 بالای EMA 200 - روند صعودی قوی تایید شد",
        features: {
          price: technical.currentPrice,
          volume: marketData.volume24h
        },
        disclaimer: 'این اطلاعات صرفاً جهت اطلاع‌رسانی است و توصیه سرمایه‌گذاری محسوب نمی‌شود.'
      });
    }

    if (newSignals.length > 0) {
      setSignals(prev => [...newSignals, ...prev].slice(0, 20));
    }
  };

  const loadFallbackData = () => {
    // Fallback to mock-like data if APIs fail
    setMarketData({
      symbol: "NAS100",
      price: 23580.50,
      change24h: 125.75,
      changePercent: "0.54%",
      volume24h: 125000000,
      lastUpdate: new Date().toISOString(),
      source: 'Mock Data (API unavailable)'
    });

    setTechnicalData({
      ema50: 23512.34,
      ema100: 23445.67,
      ema200: 23123.89,
      rsi: 67.8,
      supportLevel: 23450.00,
      resistanceLevel: 23650.00,
      currentPrice: 23580.50,
      trend: 'bullish',
      pullbackSignal: false,
    });

    // Simulate some data updates even in fallback mode
    const fallbackInterval = setInterval(() => {
      setMarketData(prev => {
        const priceChange = (Math.random() - 0.5) * 20;
        const newPrice = Math.max(prev.price + priceChange, 23000);
        const change24h = newPrice - 23455;
        const changePercent = ((change24h / 23455) * 100).toFixed(2);
        
        return {
          ...prev,
          price: newPrice,
          change24h,
          changePercent: `${changePercent}%`,
          lastUpdate: new Date().toISOString(),
        };
      });
    }, 5000);

    // Store interval reference to clear it later
    setTimeout(() => clearInterval(fallbackInterval), 300000); // Stop after 5 minutes
  };

  const clearSignals = () => {
    setSignals([]);
  };

  return {
    marketData,
    whaleTransactions,
    technicalData,
    signals,
    clearSignals,
    isLoading,
    error,
  };
};