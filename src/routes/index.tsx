import { createFileRoute } from "@tanstack/react-router";
import { MarketMindApp } from "@/components/marketmind-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Market overview | MarketMind AI" },
      { name: "description", content: "Review illustrative NSE index movements, company watchlists, and research activity in MarketMind AI." },
      { property: "og:title", content: "Market overview | MarketMind AI" },
      { property: "og:description", content: "An at-a-glance financial research workspace with clearly labeled sample data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <MarketMindApp page="overview" />,
});