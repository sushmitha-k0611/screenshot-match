import { createFileRoute } from "@tanstack/react-router";
import { MarketMindApp } from "@/components/marketmind-app";

export const Route = createFileRoute("/stocks")({
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
  component: () => <MarketMindApp page="stocks" />,
});