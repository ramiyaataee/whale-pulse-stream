// Market Data Service - Aggregates data from multiple sources
import { AlphaVantageService } from './alphaVantageService';
import { YahooFinanceService } from './yahooFinanceService';
import { BinanceService } from './binanceService';

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent: string;
  volume24h: number;
  lastUpdate: string;
  source: string;
}

export interface WhaleTransaction {
  id: string;
  timestamp: string;
  type: 'buy' | 'sell';
  amount: number;
  amountUsd: number;
  price: number;
  confidence: 'high' | 'medium' | 'low';
  source?: string;
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

export class MarketDataService {
  private alphaVantage: AlphaVantageService;
  private yahooFinance: YahooFinanceService;
  private binance: BinanceService;

  constructor() {
    this.alphaVantage = new AlphaVantageService();
    this.yahooFinance = new YahooFinanceService();
    this.binance = new BinanceService();
  }

  async getMarketData(symbol: string): Promise<MarketData> {
    const sources = [
      { service: this.yahooFinance, name: 'Yahoo Finance' },
      { service: this.alphaVantage, name: 'Alpha Vantage' },
      { service: this.binance, name: 'Binance' }
    ];

    for (const { service, name } of sources) {
      try {
        const data = await service.getMarketData(symbol);
        return { ...data, source: name };
      } catch (error) {
        console.warn(`Failed to fetch from ${name}:`, error);
      }
    }

    throw new Error('All market data sources failed');
  }

  async getTechnicalData(symbol: string): Promise<TechnicalData> {
    try {
      return await this.alphaVantage.getTechnicalData(symbol);
    } catch (error) {
      console.error('Failed to fetch technical data:', error);
      throw error;
    }
  }

  async getWhaleTransactions(symbol: string): Promise<WhaleTransaction[]> {
    try {
      // Use Binance for large volume transactions
      return await this.binance.getWhaleTransactions(symbol);
    } catch (error) {
      console.error('Failed to fetch whale transactions:', error);
      return [];
    }
  }

  // Real-time subscription method
  subscribeToMarketData(symbol: string, callback: (data: MarketData) => void): () => void {
    const intervals: NodeJS.Timeout[] = [];
    
    // Subscribe to different sources with different intervals
    const yahooInterval = setInterval(async () => {
      try {
        const data = await this.yahooFinance.getMarketData(symbol);
        callback({ ...data, source: 'Yahoo Finance' });
      } catch (error) {
        console.warn('Yahoo Finance update failed:', error);
      }
    }, 5000); // Every 5 seconds

    const binanceInterval = setInterval(async () => {
      try {
        const data = await this.binance.getMarketData(symbol);
        callback({ ...data, source: 'Binance' });
      } catch (error) {
        console.warn('Binance update failed:', error);
      }
    }, 3000); // Every 3 seconds

    intervals.push(yahooInterval, binanceInterval);

    // Return cleanup function
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }
}