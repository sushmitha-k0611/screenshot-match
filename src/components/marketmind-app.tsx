import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Activity, ArrowDownRight, ArrowLeftRight, ArrowRight, ArrowUpRight, BarChart3,
  Bell, Bookmark, Check, ChevronLeft, ChevronRight,
  CircleHelp, Clock3, Command, FileClock, Filter, LayoutDashboard,
  LineChart, ListFilter, Menu, MoreHorizontal, Plus, Search, Settings2, Shield,
  Sparkles, Star, TrendingDown, TrendingUp, X,
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { agentDetails, demoCandles, demoStocks, demoTasks, marketIndices, periods, type ChartPeriod } from "@/data/market-demo";
import { useWatchlist } from "@/hooks/use-watchlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ResearchStatus, Stock } from "@/types/market";

type Page = "overview" | "stocks" | "ai-research" | "watchlist" | "history" | "settings";
type NavItem = { title: string; path: "/" | "/stocks" | "/ai-research" | "/watchlist" | "/history" | "/settings"; icon: typeof LayoutDashboard; key: Page };

const navigation: NavItem[] = [
  { title: "Overview", path: "/", icon: LayoutDashboard, key: "overview" },
  { title: "Stock research", path: "/stocks", icon: LineChart, key: "stocks" },
  { title: "AI research", path: "/ai-research", icon: Sparkles, key: "ai-research" },
  { title: "Watchlist", path: "/watchlist", icon: Bookmark, key: "watchlist" },
  { title: "Research history", path: "/history", icon: FileClock, key: "history" },
  { title: "Settings", path: "/settings", icon: Settings2, key: "settings" },
];

const currency = (value: number) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const positive = (value: number) => value >= 0;

function Tone({ value, compact = false }: { value: number; compact?: boolean }) {
  const up = positive(value);
  return <span className={`inline-flex items-center gap-1 font-medium ${up ? "text-market-positive" : "text-market-negative"}`}>
    {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
    {compact ? `${Math.abs(value).toFixed(2)}%` : `${up ? "+" : "−"}${Math.abs(value).toFixed(2)}%`}
  </span>;
}

function MarketMindLogo() {
  return <div className="flex items-center gap-3">
    <div className="grid size-9 place-items-center rounded-md bg-market-blue/15 text-market-blue"><Activity className="size-5" /></div>
    <div><p className="font-display text-sm font-semibold tracking-wide text-foreground">MarketMind <span className="text-market-blue">AI</span></p><p className="text-[10px] tracking-[0.14em] text-muted-foreground">MARKET INTELLIGENCE</p></div>
  </div>;
}

function Sidebar({ page, onClose }: { page: Page; onClose: () => void }) {
  return <aside className="flex h-full flex-col border-r border-border bg-card">
    <div className="flex h-[72px] items-center justify-between px-5"><MarketMindLogo /><Button variant="ghost" size="icon" className="md:hidden" onClick={onClose} aria-label="Close navigation"><X /></Button></div>
    <div className="px-3 pt-7"><p className="px-3 pb-3 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground">WORKSPACE</p>
      <nav className="space-y-1">{navigation.map((item) => {
        const Icon = item.icon; const active = item.key === page;
        return <Link key={item.key} to={item.path} search={item.key === "stocks" ? { ticker: undefined } : undefined} onClick={onClose} className={`group flex h-10 items-center gap-3 rounded-md px-3 text-[13px] transition-colors ${active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
          <Icon className={`size-[17px] ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />{item.title}{active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
        </Link>;
      })}</nav>
    </div>
    <div className="mt-auto px-4 pb-5">
      <div className="mb-4 rounded-md border border-border bg-background p-3"><div className="flex items-center gap-2 text-xs font-medium"><span className="size-2 rounded-full bg-market-blue" />Demo workspace</div><p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">Market figures are illustrative sample data, not live prices.</p></div>
      <div className="flex items-center gap-3 border-t border-border pt-4"><div className="grid size-9 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">SM</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">Sushmitha</p><p className="text-[10px] text-muted-foreground">Research workspace</p></div><MoreHorizontal className="size-4 text-muted-foreground" /></div>
    </div>
  </aside>;
}

function SearchBox({ compact = false }: { compact?: boolean }) {
  const [value, setValue] = useState(""); const [open, setOpen] = useState(false); const navigate = useNavigate();
  const matches = demoStocks.filter((stock) => `${stock.ticker} ${stock.company}`.toLowerCase().includes(value.toLowerCase())).slice(0, 5);
  const select = (ticker?: string) => { setOpen(false); setValue(""); void navigate({ to: "/stocks", search: { ticker } }); };
  return <div className={`relative ${compact ? "w-full" : "w-full max-w-[330px]"}`}>
    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    <Input value={value} onChange={(e) => { setValue(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={(e) => { if (e.key === "Enter" && value) select(); if (e.key === "Escape") setOpen(false); }} placeholder="Search stocks or companies" className="h-9 border-border bg-background pl-9 pr-14 text-xs" aria-label="Search stocks or companies" />
    {!compact && <span className="pointer-events-none absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground"><Command className="size-3" /> K</span>}
    {open && value && <div className="absolute left-0 right-0 top-11 z-30 overflow-hidden rounded-md border border-border bg-popover shadow-lg">
      {matches.length ? matches.map((stock) => <button key={stock.ticker} onClick={() => select(stock.ticker)} className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-muted"><span className="grid size-8 place-items-center rounded bg-secondary text-[10px] font-semibold">{stock.ticker.slice(0, 2)}</span><span className="min-w-0 flex-1"><span className="block text-xs font-medium">{stock.ticker}</span><span className="block truncate text-[10px] text-muted-foreground">{stock.company}</span></span><span className="text-[10px] text-muted-foreground">NSE</span></button>) : <p className="p-3 text-xs text-muted-foreground">No matching stocks in the sample list.</p>}
      <button onClick={() => select()} className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-[11px] text-primary"><Search className="size-3.5" /> Search stock directory</button>
    </div>}
  </div>;
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  return <header className="flex h-[72px] items-center justify-between gap-4 border-b border-border bg-background px-4 md:px-7">
    <div className="flex min-w-0 items-center gap-3"><Button variant="ghost" size="icon" className="md:hidden" onClick={onMenu} aria-label="Open navigation"><Menu /></Button><div className="hidden items-center gap-2 text-xs sm:flex"><span className="size-2 rounded-full bg-market-blue" /><span className="font-medium">Sample market data</span><span className="text-muted-foreground">· NSE</span></div><div className="sm:hidden"><SearchBox compact /></div></div>
    <div className="hidden flex-1 justify-center sm:flex"><SearchBox /></div>
    <div className="flex shrink-0 items-center gap-3"><span className="hidden text-xs text-muted-foreground lg:block">Monday, November 9</span><Button variant="ghost" size="icon" aria-label="Notifications" className="relative"><Bell /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-market-blue" /></Button><div className="grid size-8 place-items-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">SM</div></div>
  </header>;
}

function PageHeading({ eyebrow, title, sub, action }: { eyebrow: string; title: string; sub: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-market-blue">{eyebrow}</p><h1 className="font-display text-2xl font-semibold tracking-tight md:text-[28px]">{title}</h1><p className="mt-1.5 text-sm text-muted-foreground">{sub}</p></div>{action}</div>;
}

function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold">{title}</h2>{action}</div>;
}

function MarketChart({ period, setPeriod, tall = false }: { period: ChartPeriod; setPeriod: (period: ChartPeriod) => void; tall?: boolean }) {
  const count = period === "1D" ? 15 : period === "1W" ? 20 : period === "1M" ? 26 : period === "3M" ? 32 : period === "6M" ? 36 : 40;
  const data = demoCandles.slice(-count);
  const start = data[0]?.close ?? 0; const end = data.at(-1)?.close ?? 0;
  const diff = ((end - start) / start) * 100;
  return <section className="min-w-0 rounded-md border border-border bg-card">
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 md:px-5"><div><p className="text-xs text-muted-foreground">NIFTY 50 <span className="mx-1 text-border">/</span> NSE</p><div className="mt-1 flex items-baseline gap-3"><span className="font-display text-[22px] font-semibold tabular-nums">24,812.25</span><span className="text-[11px] text-market-positive">+186.30 (0.76%)</span></div></div><div className="flex rounded border border-border bg-background p-0.5">{periods.map((item) => <button key={item} onClick={() => setPeriod(item)} className={`rounded px-2 py-1 text-[10px] font-medium transition-colors ${item === period ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{item}</button>)}</div></div>
    <div className={`${tall ? "h-[320px] md:h-[390px]" : "h-[230px]"} w-full px-2 pt-3`}>
      <ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 8, right: 8, left: -17, bottom: 0 }}>
        <defs><linearGradient id="marketFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--market-blue)" stopOpacity={0.24} /><stop offset="96%" stopColor="var(--market-blue)" stopOpacity={0} /></linearGradient></defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={36} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
        <YAxis domain={["dataMin - 120", "dataMax + 120"]} orientation="right" tickLine={false} axisLine={false} width={57} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--market-blue)", strokeDasharray: "4 4" }} />
        <Area type="monotone" dataKey="close" stroke="var(--market-blue)" strokeWidth={2} fill="url(#marketFill)" activeDot={{ r: 4, fill: "var(--market-blue)", stroke: "var(--background)", strokeWidth: 2 }} />
      </AreaChart></ResponsiveContainer>
    </div>
    <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[10px] text-muted-foreground md:px-5"><span>DEMO DATA · Illustrative only</span><span className="tabular-nums">{positive(diff) ? "+" : ""}{diff.toFixed(2)}% over selected period</span></div>
  </section>;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-md border border-border bg-popover px-3 py-2 shadow-lg"><p className="text-[10px] text-muted-foreground">{label} · sample</p><p className="mt-1 text-xs font-semibold tabular-nums">{currency(payload[0]?.value ?? 0)}</p></div>;
}

function IndexStrip() {
  return <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">{marketIndices.map((index) => <div key={index.name} className="bg-card px-4 py-4 md:px-5"><div className="flex items-center justify-between"><p className="text-[11px] font-medium text-muted-foreground">{index.name}</p><BarChart3 className="size-4 text-muted-foreground/70" /></div><div className="mt-2 flex items-baseline justify-between gap-2"><p className="font-display text-lg font-semibold tabular-nums">{index.value}</p><span className={`text-[11px] font-medium ${positive(index.change) ? "text-market-positive" : "text-market-negative"}`}>{positive(index.change) ? "+" : "−"}{Math.abs(index.change).toFixed(2)}</span></div><div className="mt-1 flex items-center justify-between"><span className="text-[10px] text-muted-foreground">Market index</span><Tone value={index.changePercent} compact /></div></div>)}</div>;
}

function StockTable({ stocks, onRemove, actions = false }: { stocks: Stock[]; onRemove?: (ticker: string) => void; actions?: boolean }) {
  if (!stocks.length) return <div className="grid min-h-44 place-items-center px-4 text-center"><div><Star className="mx-auto mb-2 size-5 text-muted-foreground" /><p className="text-sm font-medium">Your watchlist is clear</p><p className="mt-1 text-xs text-muted-foreground">Search for a company to add your first stock.</p></div></div>;
  return <div className="market-scrollbar overflow-x-auto"><table className="w-full min-w-[570px] text-left"><thead className="border-y border-border bg-background/60"><tr className="text-[10px] uppercase tracking-wide text-muted-foreground"><th className="px-4 py-2.5 font-medium">Company</th><th className="px-4 py-2.5 font-medium">Price</th><th className="px-4 py-2.5 font-medium">Change</th><th className="px-4 py-2.5 font-medium">Exchange</th>{actions && <th className="px-4 py-2.5 text-right font-medium">Action</th>}</tr></thead><tbody>{stocks.map((stock) => <tr key={stock.ticker} className="border-b border-border last:border-b-0 hover:bg-background/60"><td className="px-4 py-3"><div className="flex items-center gap-3"><span className="grid size-8 shrink-0 place-items-center rounded bg-secondary text-[10px] font-semibold">{stock.ticker.slice(0, 2)}</span><span><span className="block text-xs font-semibold">{stock.ticker}</span><span className="block max-w-[180px] truncate text-[10px] text-muted-foreground">{stock.company}</span></span></div></td><td className="px-4 py-3 text-xs font-medium tabular-nums">{currency(stock.price)}</td><td className="px-4 py-3 text-xs"><span className="block tabular-nums">{stock.change >= 0 ? "+" : "−"}{currency(Math.abs(stock.change))}</span><Tone value={stock.changePercent} compact /></td><td className="px-4 py-3 text-[11px] text-muted-foreground">{stock.exchange}</td>{actions && <td className="px-4 py-3 text-right"><Button variant="ghost" size="icon" aria-label={`Remove ${stock.ticker} from watchlist`} onClick={() => onRemove?.(stock.ticker)}><X className="size-4" /></Button></td>}</tr>)}</tbody></table></div>;
}

function MarketOverview({ onNavigate, stocks }: { onNavigate: (page: Page) => void; stocks: Stock[] }) {
  const [period, setPeriod] = useState<ChartPeriod>("1M");
  const gainers = [...demoStocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 3);
  const losers = [...demoStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 3);
  return <>
    <PageHeading eyebrow="MONDAY, 09 NOVEMBER 2026" title="Market overview" sub="A clear view of your market, watchlist and research." action={<span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-[11px] text-muted-foreground"><span className="size-1.5 rounded-full bg-market-blue" />Sample environment</span>} />
    <IndexStrip />
    <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]"><MarketChart period={period} setPeriod={setPeriod} />
      <section className="min-w-0 rounded-md border border-border bg-card"><div className="p-4"><SectionHeader title="Watchlist" action={<Button variant="ghost" size="sm" className="h-7 text-[11px]" onClick={() => onNavigate("watchlist")}>View all <ArrowRight className="size-3.5" /></Button>} /><p className="-mt-2 mb-3 text-[10px] text-muted-foreground">{stocks.length} stocks · local demo list</p></div><StockTable stocks={stocks.slice(0, 4)} /></section>
    </div>
    <div className="mt-5 grid gap-5 lg:grid-cols-3">
      <section className="rounded-md border border-border bg-card p-4"><SectionHeader title="Top gainers" action={<TrendingUp className="size-4 text-market-positive" />} />{gainers.map((s) => <MiniStock key={s.ticker} stock={s} />)}</section>
      <section className="rounded-md border border-border bg-card p-4"><SectionHeader title="Top decliners" action={<TrendingDown className="size-4 text-market-negative" />} />{losers.map((s) => <MiniStock key={s.ticker} stock={s} />)}</section>
      <section className="rounded-md border border-border bg-card p-4"><SectionHeader title="Research activity" action={<Button variant="ghost" size="icon" aria-label="View research history" onClick={() => onNavigate("history")}><ArrowRight /></Button>} /><div className="grid grid-cols-3 gap-2 py-2">{[["12", "Total tasks"], ["08", "Completed"], ["02", "In progress"]].map(([value, label]) => <div key={label} className="border-r border-border last:border-0"><p className="font-display text-xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-[10px] text-muted-foreground">{label}</p></div>)}</div><div className="mt-3 border-t border-border pt-3"><p className="mb-2 text-[10px] text-muted-foreground">RECENT REQUESTS · SAMPLE</p>{demoTasks.slice(0, 2).map((task) => <div key={task.id} className="flex items-center justify-between gap-2 py-1.5"><span className="truncate text-[11px]">{task.ticker}</span><StatusPill status={task.status} /></div>)}</div></section>
    </div>
  </>;
}

function MiniStock({ stock }: { stock: Stock }) {
  return <div className="flex items-center justify-between border-t border-border py-2.5 first:border-0"><div><p className="text-xs font-medium">{stock.ticker}</p><p className="text-[10px] text-muted-foreground">{stock.company}</p></div><div className="text-right"><p className="text-[11px] tabular-nums">{currency(stock.price)}</p><Tone value={stock.changePercent} compact /></div></div>;
}

function StatusPill({ status }: { status: ResearchStatus }) {
  const cls = status === "Completed" ? "text-market-positive bg-market-positive/10" : status === "Running" ? "text-market-blue bg-market-blue/10" : status === "Failed" ? "text-market-negative bg-market-negative/10" : "text-muted-foreground bg-muted";
  return <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium ${cls}`}><span className="size-1.5 rounded-full bg-current" />{status}</span>;
}

function StockResearch({ addStock, stocks, ticker }: { addStock: (stock: Stock) => void; stocks: Stock[]; ticker?: string }) {
  const [query, setQuery] = useState(""); const [selected, setSelected] = useState<Stock | null>(demoStocks.find((stock) => stock.ticker === ticker) ?? demoStocks[0] ?? null); const [period, setPeriod] = useState<ChartPeriod>("3M");
  const matches = useMemo(() => query ? demoStocks.filter((s) => `${s.ticker} ${s.company}`.toLowerCase().includes(query.toLowerCase())) : [], [query]);
  const isAdded = selected ? stocks.some((s) => s.ticker === selected.ticker) : false;
  return <>
    <PageHeading eyebrow="EQUITY RESEARCH · NSE" title="Stock research" sub="Explore a company’s sample price history and market context." />
    <section className="mb-5 rounded-md border border-border bg-card p-4 md:p-5"><label htmlFor="stock-search" className="mb-2 block text-xs font-medium">Find a company or ticker</label><div className="relative max-w-2xl"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="stock-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try RELIANCE or Reliance Industries" className="h-11 pl-10" />{query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label="Clear search"><X className="size-4" /></button>}
      {query && <div className="absolute left-0 right-0 top-12 z-20 overflow-hidden rounded-md border border-border bg-popover shadow-lg">{matches.length ? matches.map((s) => <button key={s.ticker} className="flex w-full items-center justify-between p-3 text-left hover:bg-muted" onClick={() => { setSelected(s); setQuery(""); }}><span><span className="block text-xs font-semibold">{s.ticker}</span><span className="text-[11px] text-muted-foreground">{s.company}</span></span><span className="text-[10px] text-muted-foreground">NSE</span></button>) : <p className="p-3 text-xs text-muted-foreground">No matching company in this sample directory.</p>}</div>}
    </div><p className="mt-2 text-[10px] text-muted-foreground">NSE · Demo company directory · Prices shown below are illustrative.</p></section>
    {selected && <><section className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-md border border-border bg-card p-4 md:px-5"><div className="flex items-center gap-4"><div className="grid size-12 place-items-center rounded-md bg-secondary font-display text-sm font-bold">{selected.ticker.slice(0, 2)}</div><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-lg font-semibold">{selected.company}</h2><span className="rounded border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground">NSE</span></div><p className="mt-1 text-[11px] text-muted-foreground">{selected.ticker} · Illustrative sample quote</p></div></div><div className="flex items-center gap-4"><div className="text-right"><p className="font-display text-xl font-semibold tabular-nums">{currency(selected.price)}</p><p className="mt-1 text-xs"><Tone value={selected.changePercent} /> <span className="ml-1 text-muted-foreground">{selected.change >= 0 ? "+" : "−"}{currency(Math.abs(selected.change))}</span></p></div><Button size="sm" variant={isAdded ? "secondary" : "outline"} onClick={() => addStock(selected)} disabled={isAdded}>{isAdded ? <><Check /> Added</> : <><Plus /> Watchlist</>}</Button></div></section><MarketChart period={period} setPeriod={setPeriod} tall /><div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground"><span>Chart: illustrative closing-price series</span><span>Last sample point · November 2026</span></div></>}
  </>;
}

function AiResearch() {
  const [ticker, setTicker] = useState(""); const [scope, setScope] = useState("Full analysis"); const [feedback, setFeedback] = useState(""); const [submitted, setSubmitted] = useState(false);
  const match = demoStocks.find((s) => s.ticker.toLowerCase() === ticker.trim().toLowerCase() || s.company.toLowerCase() === ticker.trim().toLowerCase());
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!match) { setFeedback("Choose an NSE ticker from the sample list to continue."); setSubmitted(false); return; } setFeedback("Research is not connected yet. This request was not sent or saved."); setSubmitted(false); };
  return <>
    <PageHeading eyebrow="MULTI-AGENT WORKSPACE" title="AI research" sub="Prepare an analysis request for your future research service." action={<span className="inline-flex items-center gap-2 rounded border border-market-blue/30 bg-market-blue/10 px-2.5 py-1.5 text-[10px] font-medium text-market-blue"><span className="size-1.5 rounded-full bg-market-blue" />Coming soon</span>} />
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]"><section className="rounded-md border border-border bg-card p-4 md:p-6"><div className="mb-5 flex items-center gap-3"><div className="grid size-9 place-items-center rounded-md bg-market-blue/10 text-market-blue"><Sparkles className="size-[18px]" /></div><div><h2 className="text-sm font-semibold">New research request</h2><p className="mt-0.5 text-[11px] text-muted-foreground">Configure a stock and scope.</p></div></div>
      <form onSubmit={submit} className="space-y-5"><div><label htmlFor="research-ticker" className="mb-2 block text-xs font-medium">Stock ticker</label><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="research-ticker" value={ticker} onChange={(e) => { setTicker(e.target.value.toUpperCase()); setFeedback(""); }} placeholder="e.g. RELIANCE" className="pl-10" list="research-tickers" /><datalist id="research-tickers">{demoStocks.map((stock) => <option key={stock.ticker} value={stock.ticker}>{stock.company}</option>)}</datalist></div>{match && <p className="mt-1.5 text-[11px] text-market-positive">{match.company} · NSE · sample directory</p>}</div>
      <fieldset><legend className="mb-2 text-xs font-medium">Research scope</legend><div className="grid gap-2 sm:grid-cols-3">{["Full analysis", "Fundamental + risk", "Technical analysis"].map((option) => <button key={option} type="button" onClick={() => setScope(option)} className={`min-h-10 rounded border px-3 py-2 text-left text-[11px] transition-colors ${scope === option ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-muted"}`}>{scope === option && <Check className="mr-1 inline size-3" />}{option}</button>)}</div></fieldset>
      <Button type="submit" className="w-full" size="lg"><Sparkles /> Prepare research request</Button>{feedback && <div role="status" className={`rounded-md border px-3 py-2.5 text-xs ${submitted ? "border-market-positive/30 bg-market-positive/10 text-market-positive" : "border-market-blue/30 bg-market-blue/10 text-foreground"}`}>{feedback}</div>}</form>
      <div className="mt-5 rounded-md border border-border bg-background p-3 text-[11px] leading-relaxed text-muted-foreground"><CircleHelp className="mr-1.5 inline size-3.5 align-[-2px]" />Requests are not sent in this demo. Connect your FastAPI service before running or tracking research.</div>
    </section><div><section className="rounded-md border border-border bg-card p-4"><SectionHeader title="Research agents" action={<span className="text-[10px] text-muted-foreground">4 planned</span>} /><div className="divide-y divide-border">{agentDetails.map((agent) => <div key={agent.code} className="flex items-start gap-3 py-3 first:pt-1"><span className="font-display text-[10px] text-market-blue">{agent.code}</span><div className="min-w-0 flex-1"><p className="text-xs font-medium">{agent.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{agent.details}</p></div><span className="rounded bg-muted px-2 py-1 text-[9px] text-muted-foreground">Planned</span></div>)}</div></section><section className="mt-5 rounded-md border border-border bg-card p-4"><SectionHeader title="Request progress" /><div className="grid min-h-28 place-items-center text-center"><div><Clock3 className="mx-auto mb-2 size-5 text-muted-foreground" /><p className="text-xs font-medium">Nothing running</p><p className="mt-1 text-[10px] text-muted-foreground">Progress appears here when research is connected.</p></div></div></section></div></div>
  </>;
}

function Watchlist({ stocks, addStock, removeStock }: { stocks: Stock[]; addStock: (stock: Stock) => void; removeStock: (ticker: string) => void }) {
  const [query, setQuery] = useState(""); const matches = query ? demoStocks.filter((s) => `${s.ticker} ${s.company}`.toLowerCase().includes(query.toLowerCase()) && !stocks.some((w) => w.ticker === s.ticker)).slice(0, 5) : [];
  return <><PageHeading eyebrow="YOUR TRACKED COMPANIES" title="Watchlist" sub="Keep an eye on the NSE companies you follow." action={<span className="text-[11px] text-muted-foreground">Saved in this browser only</span>} /><section className="mb-5 rounded-md border border-border bg-card p-4"><label htmlFor="add-watchlist" className="mb-2 block text-xs font-medium">Add a stock</label><div className="relative max-w-lg"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="add-watchlist" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ticker or company name" className="pl-10" />{matches.length > 0 && <div className="absolute left-0 right-0 top-11 z-20 overflow-hidden rounded-md border border-border bg-popover shadow-lg">{matches.map((stock) => <button key={stock.ticker} onClick={() => { addStock(stock); setQuery(""); }} className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-muted"><span><span className="block text-xs font-semibold">{stock.ticker}</span><span className="text-[10px] text-muted-foreground">{stock.company}</span></span><Plus className="size-4" /></button>)}</div>}</div><p className="mt-2 text-[10px] text-muted-foreground">Sample prices · local demo list · no backend connected.</p></section><section className="rounded-md border border-border bg-card"><div className="flex items-center justify-between px-4 py-3"><h2 className="text-sm font-semibold">Tracked stocks <span className="ml-1 text-xs font-normal text-muted-foreground">{stocks.length}</span></h2><Button variant="ghost" size="sm" className="text-[11px]" onClick={() => setQuery("")}><ListFilter /> NSE</Button></div><StockTable stocks={stocks} actions onRemove={removeStock} /></section></>;
}

function ResearchHistory() {
  const [query, setQuery] = useState(""); const [status, setStatus] = useState("All statuses"); const [page, setPage] = useState(1); const [newestFirst, setNewestFirst] = useState(true);
  const filtered = demoTasks.filter((task) => (status === "All statuses" || task.status === status) && `${task.company} ${task.ticker}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => (newestFirst ? 1 : -1) * (demoTasks.indexOf(a) - demoTasks.indexOf(b)));
  const pageSize = 5;
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
  return <><PageHeading eyebrow="PAST ANALYSIS REQUESTS" title="Research history" sub="Review and filter research task records." action={<span className="rounded border border-border px-2.5 py-1.5 text-[10px] text-muted-foreground">Sample records</span>} /><section className="overflow-hidden rounded-md border border-border bg-card"><div className="flex flex-wrap items-center justify-between gap-3 p-4"><div className="relative min-w-[220px] flex-1 sm:max-w-sm"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search company or ticker" className="pl-9" /></div><div className="flex items-center gap-2"><Filter className="size-4 text-muted-foreground" /><select aria-label="Filter by status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="h-9 rounded-md border border-input bg-background px-3 text-xs"><option>All statuses</option><option>Pending</option><option>Running</option><option>Completed</option><option>Failed</option></select><Button variant="outline" size="icon" aria-label={newestFirst ? "Sort oldest first" : "Sort newest first"} onClick={() => setNewestFirst((value) => !value)}><ArrowLeftRight /></Button></div></div><div className="market-scrollbar overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="border-y border-border bg-background/60"><tr className="text-[10px] uppercase tracking-wide text-muted-foreground"><th className="px-4 py-3 font-medium">Company</th><th className="px-4 py-3 font-medium">Research date</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Scope</th><th className="px-4 py-3 text-right font-medium">Report</th></tr></thead><tbody>{filtered.length ? pageItems.map((task) => <tr key={task.id} className="border-b border-border last:border-0"><td className="px-4 py-3"><p className="text-xs font-medium">{task.company}</p><p className="mt-0.5 text-[10px] text-muted-foreground">{task.ticker} · NSE · {task.id}</p></td><td className="px-4 py-3 text-[11px] text-muted-foreground">{task.createdAt}</td><td className="px-4 py-3"><StatusPill status={task.status} /></td><td className="px-4 py-3 text-[11px] text-muted-foreground">{task.scope}</td><td className="px-4 py-3 text-right"><Button variant="ghost" size="sm" disabled={task.status !== "Completed"} onClick={() => window.alert("Reports are sample records and are not available in this demo.")}><ArrowRight />View</Button></td></tr>) : <tr><td colSpan={5} className="h-36 text-center text-xs text-muted-foreground">No research tasks match these filters.</td></tr>}</tbody></table></div><div className="flex items-center justify-between border-t border-border px-4 py-3 text-[10px] text-muted-foreground"><span>{filtered.length ? `${filtered.length} sample records` : "0 records"} · Demo data</span><div className="flex items-center gap-2"><span>Page {page} of {Math.max(1, Math.ceil(filtered.length / pageSize))}</span><Button variant="outline" size="icon" aria-label="Previous page" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}><ChevronLeft /></Button><Button variant="outline" size="icon" aria-label="Next page" onClick={() => setPage(Math.min(Math.max(1, Math.ceil(filtered.length / pageSize)), page + 1))} disabled={page >= Math.max(1, Math.ceil(filtered.length / pageSize))}><ChevronRight /></Button></div></div></section></>;
}

function Settings() {
  return <><PageHeading eyebrow="WORKSPACE PREFERENCES" title="Settings" sub="Review your current MarketMind workspace configuration." /><div className="max-w-3xl divide-y divide-border rounded-md border border-border bg-card px-4 md:px-6">{[["Workspace", "MarketMind research workspace"], ["Market", "National Stock Exchange of India (NSE)"], ["Quote currency", "Indian Rupee (₹)"], ["Data mode", "Illustrative demo data · no live feed"], ["Watchlist storage", "This browser · local only"], ["Research service", "Not connected · FastAPI integration ready"]].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-2 py-4"><span className="text-xs font-medium">{label}</span><span className="text-xs text-muted-foreground">{value}</span></div>)}</div><p className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground"><Shield className="size-4" />No account, market feed, or research service is connected in this frontend milestone.</p></>;
}

export function MarketMindApp({ page, ticker }: { page: Page; ticker?: string }) {
  const [mobileNav, setMobileNav] = useState(false); const navigate = useNavigate(); const { stocks, addStock, removeStock } = useWatchlist();
  const changePage = (next: Page) => { const route = navigation.find((item) => item.key === next); if (route) void navigate({ to: route.path, search: route.key === "stocks" ? { ticker: undefined } : undefined }); };
  const title = navigation.find((item) => item.key === page)?.title ?? "Overview";
  return <div className="min-h-screen bg-background text-foreground"><div className="fixed inset-y-0 left-0 z-20 hidden w-[250px] md:block"><Sidebar page={page} onClose={() => setMobileNav(false)} /></div>{mobileNav && <div className="fixed inset-0 z-40 md:hidden"><Button variant="ghost" aria-label="Close navigation overlay" className="absolute inset-0 h-full w-full rounded-none bg-foreground/30" onClick={() => setMobileNav(false)} /><div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw]"><Sidebar page={page} onClose={() => setMobileNav(false)} /></div></div>}
    <div className="md:pl-[250px]"><Topbar onMenu={() => setMobileNav(true)} /><main className="mx-auto max-w-[1600px] px-4 py-6 md:px-7 md:py-8"><div className="sr-only" aria-live="polite">{title}</div>{page === "overview" && <MarketOverview onNavigate={changePage} stocks={stocks} />}{page === "stocks" && <StockResearch addStock={addStock} stocks={stocks} ticker={ticker?.toUpperCase()} />}{page === "ai-research" && <AiResearch />}{page === "watchlist" && <Watchlist stocks={stocks} addStock={addStock} removeStock={removeStock} />}{page === "history" && <ResearchHistory />}{page === "settings" && <Settings />}<footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-[10px] text-muted-foreground"><span>MarketMind AI · Frontend demo</span><span>All figures are illustrative and are not investment advice.</span></footer></main></div>
  </div>;
}