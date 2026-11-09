import { createFileRoute } from "@tanstack/react-router";
import { MarketMindApp } from "@/components/marketmind-app";

export const Route = createFileRoute("/ai-research")({
  head: () => ({
    meta: [
      { title: "AI research | MarketMind AI" },
      { name: "description", content: "Prepare a multi-agent stock research request with clearly marked planned analysis agents." },
      { property: "og:title", content: "AI research | MarketMind AI" },
      { property: "og:description", content: "Configure a future multi-agent financial research request in MarketMind AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <MarketMindApp page="ai-research" />,
});