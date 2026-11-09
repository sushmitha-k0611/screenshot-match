import { createFileRoute } from "@tanstack/react-router";
import { MarketMindApp } from "@/components/marketmind-app";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Research history | MarketMind AI" },
      { name: "description", content: "Search and filter illustrative sample stock research records and task statuses." },
      { property: "og:title", content: "Research history | MarketMind AI" },
      { property: "og:description", content: "Review sample financial research task history in the MarketMind workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <MarketMindApp page="history" />,
});