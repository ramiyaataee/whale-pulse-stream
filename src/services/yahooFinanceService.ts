// Yahoo Finance API Service
import { MarketData } from './marketDataService';

export class YahooFinanceService {
  private baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart';

  async getMarketData(symbol: string): Promise<MarketData> {
    try {
      // Convert NASDAQ symbols to Yahoo Finance format
      const yahooSymbol = this.convertSymbol(symbol);
      
      const response = await fetch(`${this.baseUrl}/${yahooSymbol}`);
      
      if (!response.ok) {
        throw new Error(`Yahoo Finance API error: ${response.status}`);
      }
      
      const data = await response.json();
      const result = data.chart.result[0];
      
      if (!result) {
        throw new Error('No chart data received from Yahoo Finance');
      }

      const meta = result.meta;
      const currentPrice = meta.regularMarketPrice;
      const previousClose = meta.previousClose;
      const change = currentPrice - previousClose;
      const changePercent = ((change / previousClose) * 100).toFixed(2);
      const volume = meta.regularMarketVolume;

      return {
        symbol,
        price: currentPrice,
        change24h: change,
        changePercent: `${changePercent}%`,
        volume24h: volume,
        lastUpdate: new Date().toISOString(),
        source: 'Yahoo Finance'
      };
    } catch (error) {
      console.error('Yahoo Finance API error:', error);
      throw error;
    }
  }

  private convertSymbol(symbol: string): string {
    const symbolMap: Record<string, string> = {
      'NAS100': '^NDX',
      'NASDAQ': '^IXIC',
      'SPX': '^GSPC',
      'DJI': '^DJI',
      'BTCUSD': 'BTC-USD',
      'ETHUSD': 'ETH-USD'
    };

    return symbolMap[symbol] || symbol;
  }

  async getHistoricalData(symbol: string, period: string = '1d'): Promise<any> {
    try {
      const yahooSymbol = this.convertSymbol(symbol);
      const response = await fetch(
        `${this.baseUrl}/${yahooSymbol}?interval=1m&period=${period}`
      );
      
      if (!response.ok) {
        throw new Error(`Yahoo Finance historical data error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.chart.result[0];
    } catch (error) {
      console.error('Yahoo Finance historical data error:', error);
      throw error;
    }
  }
}