import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { MarketMindApp } from "@/components/marketmind-app";

export const Route = createFileRoute("/stocks")({
  validateSearch: z.object({ ticker: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Stock research | MarketMind AI" },
      { name: "description", content: "Search NSE companies and explore illustrative stock quote and price history views." },
      { property: "og:title", content: "Stock research | MarketMind AI" },
      { property: "og:description", content: "Explore company profiles and sample NSE price histories in MarketMind AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StockResearchRoute,
});

function StockResearchRoute() {
  const { ticker } = Route.useSearch();
  return <MarketMindApp page="stocks" ticker={ticker} />;
}