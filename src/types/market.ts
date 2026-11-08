export type MarketIndex = {
  name: string;
  value: string;
  change: number;
  changePercent: number;
};

export type Stock = {
  ticker: string;
  company: string;
  exchange: "NSE";
  price: number;
  change: number;
  changePercent: number;
};

export type ResearchStatus = "Pending" | "Running" | "Completed" | "Failed";

export type ResearchTask = {
  id: string;
  company: string;
  ticker: string;
  createdAt: string;
  status: ResearchStatus;
  scope: string;
};

export type Candle = {
  date: string;
  close: number;
  volume: number;
};