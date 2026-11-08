import type { Candle, MarketIndex, ResearchTask, Stock } from "@/types/market";

export const marketIndices: MarketIndex[] = [
  { name: "NIFTY 50", value: "24,812.25", change: 186.30, changePercent: 0.76 },
  { name: "SENSEX", value: "81,330.56", change: 612.45, changePercent: 0.76 },
  { name: "BANK NIFTY", value: "51,428.70", change: -142.10, changePercent: -0.28 },
];

export const demoStocks: Stock[] = [
  { ticker: "RELIANCE", company: "Reliance Industries", exchange: "NSE", price: 1432.6, change: 18.4, changePercent: 1.30 },
  { ticker: "TCS", company: "Tata Consultancy Services", exchange: "NSE", price: 3986.25, change: -22.1, changePercent: -0.55 },
  { ticker: "HDFCBANK", company: "HDFC Bank", exchange: "NSE", price: 1684.3, change: 12.7, changePercent: 0.76 },
  { ticker: "INFY", company: "Infosys", exchange: "NSE", price: 1842.1, change: 31.8, changePercent: 1.76 },
  { ticker: "ICICIBANK", company: "ICICI Bank", exchange: "NSE", price: 1276.4, change: -8.6, changePercent: -0.67 },
  { ticker: "BHARTIARTL", company: "Bharti Airtel", exchange: "NSE", price: 1768.9, change: 24.5, changePercent: 1.40 },
  { ticker: "LT", company: "Larsen & Toubro", exchange: "NSE", price: 3628.15, change: 9.3, changePercent: 0.26 },
  { ticker: "SBIN", company: "State Bank of India", exchange: "NSE", price: 812.45, change: -4.2, changePercent: -0.51 },
];

export const demoTasks: ResearchTask[] = [
  { id: "MM-2408", company: "Reliance Industries", ticker: "RELIANCE", createdAt: "Today, 11:42 AM", status: "Completed", scope: "Full analysis" },
  { id: "MM-2407", company: "Infosys", ticker: "INFY", createdAt: "Yesterday, 3:18 PM", status: "Completed", scope: "Fundamental + risk" },
  { id: "MM-2406", company: "HDFC Bank", ticker: "HDFCBANK", createdAt: "Yesterday, 10:06 AM", status: "Running", scope: "Full analysis" },
  { id: "MM-2405", company: "Tata Consultancy Services", ticker: "TCS", createdAt: "Nov 06, 2026", status: "Failed", scope: "Technical analysis" },
];

export const demoCandles: Candle[] = Array.from({ length: 40 }, (_, index) => {
  const base = 24400 + index * 12 + Math.sin(index * 0.58) * 190 + Math.cos(index * 0.21) * 100;
  return {
    date: `Oct ${String(index + 1).padStart(2, "0")}`,
    close: Math.round(base * 100) / 100,
    volume: Math.round(240 + Math.abs(Math.sin(index * 0.47)) * 740),
  };
});

export const periods = ["1D", "1W", "1M", "3M", "6M", "1Y"] as const;
export type ChartPeriod = (typeof periods)[number];

export const agentDetails = [
  { name: "Fundamental analysis", details: "Statements · Revenue · Valuation", code: "01" },
  { name: "Technical analysis", details: "Price trends · Moving averages · RSI", code: "02" },
  { name: "News & sentiment", details: "Financial news · Market sentiment", code: "03" },
  { name: "Risk analysis", details: "Volatility · Downside factors", code: "04" },
];