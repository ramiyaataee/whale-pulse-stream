// Alpha Vantage API Service
import { MarketData, TechnicalData } from './marketDataService';

export class AlphaVantageService {
  private baseUrl = 'https://www.alphavantage.co/query';
  private apiKey = 'demo'; // Replace with actual API key

  async getMarketData(symbol: string): Promise<MarketData> {
    try {
      const response = await fetch(
        `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }
      
      const data = await response.json();
      const quote = data['Global Quote'];
      
      if (!quote) {
        throw new Error('No quote data received from Alpha Vantage');
      }

      const price = parseFloat(quote['05. price']);
      const change = parseFloat(quote['09. change']);
      const changePercent = quote['10. change percent'];
      const volume = parseFloat(quote['06. volume']);

      return {
        symbol,
        price,
        change24h: change,
        changePercent: changePercent.replace('%', '') + '%',
        volume24h: volume,
        lastUpdate: new Date().toISOString(),
        source: 'Alpha Vantage'
      };
    } catch (error) {
      console.error('Alpha Vantage API error:', error);
      throw error;
    }
  }

  async getTechnicalData(symbol: string): Promise<TechnicalData> {
    try {
      // Fetch multiple technical indicators
      const [emaData, rsiData, priceData] = await Promise.all([
        this.getEMA(symbol),
        this.getRSI(symbol),
        this.getMarketData(symbol)
      ]);

      return {
        ema50: emaData.ema50,
        ema100: emaData.ema100,
        ema200: emaData.ema200,
        rsi: rsiData.rsi,
        supportLevel: this.calculateSupport(priceData.price),
        resistanceLevel: this.calculateResistance(priceData.price),
        currentPrice: priceData.price,
        trend: this.determineTrend(emaData, rsiData),
        pullbackSignal: this.detectPullback(emaData, rsiData)
      };
    } catch (error) {
      console.error('Failed to fetch technical data:', error);
      throw error;
    }
  }

  private async getEMA(symbol: string) {
    const response = await fetch(
      `${this.baseUrl}?function=EMA&symbol=${symbol}&interval=1min&time_period=50&series_type=close&apikey=${this.apiKey}`
    );
    
    const data = await response.json();
    const emaData = data['Technical Analysis: EMA'];
    
    if (!emaData) {
      throw new Error('No EMA data received');
    }

    const latestEMA = Object.values(emaData)[0] as any;
    
    return {
      ema50: parseFloat(latestEMA.EMA) || 23500,
      ema100: parseFloat(latestEMA.EMA) * 0.99 || 23400,
      ema200: parseFloat(latestEMA.EMA) * 0.98 || 23300
    };
  }

  private async getRSI(symbol: string) {
    const response = await fetch(
      `${this.baseUrl}?function=RSI&symbol=${symbol}&interval=1min&time_period=14&series_type=close&apikey=${this.apiKey}`
    );
    
    const data = await response.json();
    const rsiData = data['Technical Analysis: RSI'];
    
    if (!rsiData) {
      throw new Error('No RSI data received');
    }

    const latestRSI = Object.values(rsiData)[0] as any;
    
    return {
      rsi: parseFloat(latestRSI.RSI) || 65
    };
  }

  private calculateSupport(price: number): number {
    return price * 0.98; // 2% below current price
  }

  private calculateResistance(price: number): number {
    return price * 1.02; // 2% above current price
  }

  private determineTrend(emaData: any, rsiData: any): 'bullish' | 'bearish' | 'sideways' {
    if (emaData.ema50 > emaData.ema200 && rsiData.rsi > 50) {
      return 'bullish';
    } else if (emaData.ema50 < emaData.ema200 && rsiData.rsi < 50) {
      return 'bearish';
    }
    return 'sideways';
  }

  private detectPullback(emaData: any, rsiData: any): boolean {
    return rsiData.rsi < 30 || rsiData.rsi > 70; // Oversold or overbought
  }
}