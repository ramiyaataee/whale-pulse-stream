import { useState, useEffect } from 'react';

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent: string;
  volume24h: number;
  lastUpdate: string;
}

export interface WhaleTransaction {
  id: string;
  timestamp: string;
  type: 'buy' | 'sell';
  amount: number;
  amountUsd: number;
  price: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface TechnicalData {
  ema50: number;
  ema100: number;
  ema200: number;
  rsi: number;
  supportLevel: number;
  resistanceLevel: number;
  currentPrice: number;
  trend: 'bullish' | 'bearish' | 'sideways';
  pullbackSignal: boolean;
}

export interface TradingSignal {
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

export const useMockData = () => {
  const [marketData, setMarketData] = useState<MarketData>({
    symbol: 'NAS100_i',
    price: 13450.25,
    change24h: 125.75,
    changePercent: '+0.94%',
    volume24h: 2340000000,
    lastUpdate: new Date().toISOString(),
  });

  const [whaleTransactions, setWhaleTransactions] = useState<WhaleTransaction[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'buy',
      amount: 1500,
      amountUsd: 2100000,
      price: 13440.50,
      confidence: 'high'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      type: 'sell',
      amount: 2200,
      amountUsd: 2950000,
      price: 13455.75,
      confidence: 'medium'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      type: 'buy',
      amount: 800,
      amountUsd: 1070000,
      price: 13420.25,
      confidence: 'high'
    }
  ]);

  const [technicalData, setTechnicalData] = useState<TechnicalData>({
    ema50: 13440.50,
    ema100: 13420.75,
    ema200: 13390.25,
    rsi: 65.2,
    supportLevel: 13380.00,
    resistanceLevel: 13480.00,
    currentPrice: 13450.25,
    trend: 'bullish',
    pullbackSignal: false
  });

  const [signals, setSignals] = useState<TradingSignal[]>([
    {
      id: '1',
      title: 'SIG | NAS100_i | خرید نهنگ + افزایش حجم',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      symbol: 'NAS100_i',
      confidence: 'high',
      type: 'whale_activity',
      description: 'تراکنش خرید بزرگ نهنگ همراه با افزایش قابل توجه حجم معاملات تشخیص داده شد',
      features: {
        price: 13445.50,
        volume: 2100000000,
        rsi: 65.2,
        whaleActivity: true
      },
      disclaimer: 'این اطلاعات صرفاً جهت اطلاع‌رسانی است و توصیه سرمایه‌گذاری محسوب نمی‌شود.'
    },
    {
      id: '2',
      title: 'SIG | NAS100_i | تقاطع EMA50/100',
      timestamp: new Date(Date.now() - 480000).toISOString(),
      symbol: 'NAS100_i',
      confidence: 'medium',
      type: 'ema_cross',
      description: 'EMA50 از EMA100 به سمت بالا عبور کرد - سیگنال صعودی',
      features: {
        price: 13430.25,
        volume: 1890000000,
        rsi: 62.8
      },
      disclaimer: 'این اطلاعات صرفاً جهت اطلاع‌رسانی است و توصیه سرمایه‌گذاری محسوب نمی‌شود.'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update market data
      setMarketData(prev => {
        const priceChange = (Math.random() - 0.5) * 20;
        const newPrice = Math.max(prev.price + priceChange, 13300);
        const change24h = newPrice - 13324.50;
        const changePercent = ((change24h / 13324.50) * 100).toFixed(2);
        
        return {
          ...prev,
          price: newPrice,
          change24h,
          changePercent: `${change24h >= 0 ? '+' : ''}${changePercent}%`,
          volume24h: prev.volume24h + Math.random() * 10000000,
          lastUpdate: new Date().toISOString(),
        };
      });

      // Update technical data
      setTechnicalData(prev => ({
        ...prev,
        currentPrice: marketData.price,
        rsi: Math.max(Math.min(prev.rsi + (Math.random() - 0.5) * 5, 100), 0),
        pullbackSignal: Math.random() > 0.9
      }));

      // Occasionally add new whale transactions
      if (Math.random() > 0.85) {
        const newTransaction: WhaleTransaction = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type: Math.random() > 0.5 ? 'buy' : 'sell',
          amount: Math.round(Math.random() * 2000 + 500),
          amountUsd: Math.round(Math.random() * 2000000 + 1000000),
          price: marketData.price,
          confidence: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any
        };

        setWhaleTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);
      }

      // Occasionally add new signals
      if (Math.random() > 0.92) {
        const signalTypes = ['volume_spike', 'whale_activity', 'technical_breakout', 'ema_cross', 'support_break'] as const;
        const confidences = ['high', 'medium', 'low'] as const;
        
        const newSignal: TradingSignal = {
          id: Date.now().toString(),
          title: `SIG | NAS100_i | ${Math.random() > 0.5 ? 'سیگنال صعودی' : 'هشدار نزولی'}`,
          timestamp: new Date().toISOString(),
          symbol: 'NAS100_i',
          confidence: confidences[Math.floor(Math.random() * 3)],
          type: signalTypes[Math.floor(Math.random() * 5)],
          description: 'سیگنال جدید بر اساس تحلیل الگوریتمی تولید شده است',
          features: {
            price: marketData.price,
            volume: marketData.volume24h,
            rsi: technicalData.rsi,
            whaleActivity: Math.random() > 0.7
          },
          disclaimer: 'این اطلاعات صرفاً جهت اطلاع‌رسانی است و توصیه سرمایه‌گذاری محسوب نمی‌شود.'
        };

        setSignals(prev => [newSignal, ...prev.slice(0, 19)]);
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [marketData.price, technicalData.rsi, marketData.volume24h]);

  const clearSignals = () => setSignals([]);

  return {
    marketData,
    whaleTransactions,
    technicalData,
    signals,
    clearSignals
  };
};