import { createFileRoute } from "@tanstack/react-router";
import { MarketMindApp } from "@/components/marketmind-app";

export const Route = createFileRoute("/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist | MarketMind AI" },
      { name: "description", content: "Track and manage a browser-local list of illustrative NSE stock quotes." },
      { property: "og:title", content: "Watchlist | MarketMind AI" },
      { property: "og:description", content: "Manage your locally saved sample stock watchlist in MarketMind AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <MarketMindApp page="watchlist" />,
});