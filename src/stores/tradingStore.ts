import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TradingSettings {
  // تنظیمات عمومی
  autoMode: boolean;
  refreshInterval: number; // میلی‌ثانیه
  theme: 'dark' | 'light' | 'auto';
  language: 'fa' | 'en';
  
  // تنظیمات هشدارها
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    mobile: boolean;
    whaleAlerts: boolean;
    signalAlerts: boolean;
    priceAlerts: boolean;
  };
  
  // تنظیمات تحلیل
  analysis: {
    rsiThreshold: {
      overbought: number;
      oversold: number;
    };
    whaleMinAmount: number; // میلیون دلار
    confidenceLevel: 'low' | 'medium' | 'high';
    timeframes: string[];
  };
  
  // تنظیمات ریسک
  risk: {
    maxRiskLevel: 'low' | 'medium' | 'high';
    stopLossPercent: number;
    takeProfitPercent: number;
    positionSize: number;
  };
  
  // تنظیمات API
  api: {
    enabled: boolean;
    endpoints: {
      market: string;
      whale: string;
      signals: string;
    };
    keys: {
      primary: string;
      backup: string;
    };
  };
}

interface TradingStore extends TradingSettings {
  updateSettings: (settings: Partial<TradingSettings>) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (settings: string) => void;
}

const defaultSettings: TradingSettings = {
  autoMode: true,
  refreshInterval: 3000,
  theme: 'dark',
  language: 'fa',
  
  notifications: {
    enabled: true,
    sound: true,
    desktop: true,
    mobile: true,
    whaleAlerts: true,
    signalAlerts: true,
    priceAlerts: true,
  },
  
  analysis: {
    rsiThreshold: {
      overbought: 80,
      oversold: 20,
    },
    whaleMinAmount: 1.0,
    confidenceLevel: 'medium',
    timeframes: ['1m', '5m', '15m', '1h', '4h', '1d'],
  },
  
  risk: {
    maxRiskLevel: 'medium',
    stopLossPercent: 2,
    takeProfitPercent: 5,
    positionSize: 1000,
  },
  
  api: {
    enabled: false,
    endpoints: {
      market: '',
      whale: '',
      signals: '',
    },
    keys: {
      primary: '',
      backup: '',
    },
  },
};

export const useTradingStore = create<TradingStore>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      
      updateSettings: (newSettings) => {
        set((state) => ({
          ...state,
          ...newSettings,
        }));
      },
      
      resetSettings: () => {
        set(defaultSettings);
      },
      
      exportSettings: () => {
        const settings = get();
        return JSON.stringify(settings, null, 2);
      },
      
      importSettings: (settingsJson) => {
        try {
          const settings = JSON.parse(settingsJson);
          set(settings);
        } catch (error) {
          console.error('خطا در ایمپورت تنظیمات:', error);
        }
      },
    }),
    {
      name: 'whale-pulse-settings',
      version: 1,
    }
  )
);