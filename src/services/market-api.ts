import axios from "axios";
import type { Candle, ResearchTask, Stock } from "@/types/market";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export const marketApi = {
  searchStocks: (query: string) => api.get<Stock[]>("/stocks/search", { params: { q: query } }),
  getStock: (ticker: string) => api.get<Stock>(`/stocks/${encodeURIComponent(ticker)}`),
  getHistory: (ticker: string, period: string) =>
    api.get<Candle[]>(`/stocks/${encodeURIComponent(ticker)}/history`, { params: { period } }),
  startResearch: (payload: { ticker: string; scope: string }) =>
    api.post<{ task_id: string }>("/research", payload),
  getResearch: (taskId: string) => api.get<ResearchTask>(`/research/${encodeURIComponent(taskId)}`),
  getResearchHistory: () => api.get<ResearchTask[]>("/research/history"),
};