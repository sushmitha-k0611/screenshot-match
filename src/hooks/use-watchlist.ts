import { useEffect, useState } from "react";
import { demoStocks } from "@/data/market-demo";
import type { Stock } from "@/types/market";

const STORAGE_KEY = "marketmind-demo-watchlist";

export function useWatchlist() {
  const [stocks, setStocks] = useState<Stock[]>(demoStocks.slice(0, 4));

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setStocks(JSON.parse(saved) as Stock[]);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const update = (next: Stock[]) => {
    setStocks(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return {
    stocks,
    addStock: (stock: Stock) => {
      if (!stocks.some((item) => item.ticker === stock.ticker)) update([...stocks, stock]);
    },
    removeStock: (ticker: string) => update(stocks.filter((stock) => stock.ticker !== ticker)),
  };
}