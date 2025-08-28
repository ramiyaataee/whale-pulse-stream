// Binance API Service
import { MarketData, WhaleTransaction } from './marketDataService';

export class BinanceService {
  private baseUrl = 'https://api.binance.com/api/v3';

  async getMarketData(symbol: string): Promise<MarketData> {
    try {
      // Convert to Binance symbol format
      const binanceSymbol = this.convertSymbol(symbol);
      
      const [ticker, stats] = await Promise.all([
        this.fetch24hrTicker(binanceSymbol),
        this.fetchPrice(binanceSymbol)
      ]);

      const price = parseFloat(stats.price);
      const change = parseFloat(ticker.priceChange);
      const changePercent = ticker.priceChangePercent;
      const volume = parseFloat(ticker.quoteVolume);

      return {
        symbol,
        price,
        change24h: change,
        changePercent: `${changePercent}%`,
        volume24h: volume,
        lastUpdate: new Date().toISOString(),
        source: 'Binance'
      };
    } catch (error) {
      console.error('Binance API error:', error);
      throw error;
    }
  }

  async getWhaleTransactions(symbol: string): Promise<WhaleTransaction[]> {
    try {
      const binanceSymbol = this.convertSymbol(symbol);
      const response = await fetch(`${this.baseUrl}/aggTrades?symbol=${binanceSymbol}&limit=100`);
      
      if (!response.ok) {
        throw new Error(`Binance trades API error: ${response.status}`);
      }
      
      const trades = await response.json();
      
      // Filter for large volume trades (whale transactions)
      const whaleThreshold = await this.calculateWhaleThreshold(binanceSymbol);
      
      return trades
        .filter((trade: any) => parseFloat(trade.q) > whaleThreshold)
        .map((trade: any) => ({
          id: trade.a.toString(),
          timestamp: new Date(trade.T).toISOString(),
          type: trade.m ? 'sell' : 'buy', // m: true if buyer is market maker
          amount: parseFloat(trade.q),
          amountUsd: parseFloat(trade.q) * parseFloat(trade.p),
          price: parseFloat(trade.p),
          confidence: this.getConfidenceLevel(this.calculateConfidence(parseFloat(trade.q), whaleThreshold)),
          source: 'Binance'
        }))
        .slice(0, 10); // Return top 10 whale transactions
    } catch (error) {
      console.error('Failed to fetch whale transactions:', error);
      return [];
    }
  }

  private async fetch24hrTicker(symbol: string) {
    const response = await fetch(`${this.baseUrl}/ticker/24hr?symbol=${symbol}`);
    
    if (!response.ok) {
      throw new Error(`Binance 24hr ticker error: ${response.status}`);
    }
    
    return response.json();
  }

  private async fetchPrice(symbol: string) {
    const response = await fetch(`${this.baseUrl}/ticker/price?symbol=${symbol}`);
    
    if (!response.ok) {
      throw new Error(`Binance price error: ${response.status}`);
    }
    
    return response.json();
  }

  private async calculateWhaleThreshold(symbol: string): Promise<number> {
    try {
      const ticker = await this.fetch24hrTicker(symbol);
      const avgVolume = parseFloat(ticker.volume) / 24; // Average hourly volume
      return avgVolume * 0.001; // 0.1% of average hourly volume
    } catch (error) {
      return 1000; // Default threshold
    }
  }

  private calculateConfidence(tradeAmount: number, threshold: number): number {
    const ratio = tradeAmount / threshold;
    return Math.min(Math.round(ratio * 10), 100); // Convert to percentage, max 100%
  }

  private getConfidenceLevel(percentage: number): 'high' | 'medium' | 'low' {
    if (percentage >= 75) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
  }

  private convertSymbol(symbol: string): string {
    const symbolMap: Record<string, string> = {
      'NAS100': 'BTCUSDT', // Binance doesn't have NASDAQ, use BTC as proxy
      'NASDAQ': 'BTCUSDT',
      'BTCUSD': 'BTCUSDT',
      'ETHUSD': 'ETHUSDT',
      'ADAUSD': 'ADAUSDT',
      'SOLUSD': 'SOLUSDT'
    };

    return symbolMap[symbol] || 'BTCUSDT';
  }

  // WebSocket connection for real-time data
  createWebSocket(symbol: string, callback: (data: any) => void): WebSocket {
    const binanceSymbol = this.convertSymbol(symbol).toLowerCase();
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${binanceSymbol}@ticker`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback({
        symbol,
        price: parseFloat(data.c),
        change24h: parseFloat(data.P),
        volume24h: parseFloat(data.q),
        lastUpdate: new Date().toISOString()
      });
    };

    return ws;
  }
}