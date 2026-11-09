import { createFileRoute } from "@tanstack/react-router";
import { MarketMindApp } from "@/components/marketmind-app";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | MarketMind AI" },
      { name: "description", content: "View MarketMind workspace preferences, demo data mode, and future service integration status." },
      { property: "og:title", content: "Settings | MarketMind AI" },
      { property: "og:description", content: "Review the MarketMind research workspace configuration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <MarketMindApp page="settings" />,
});