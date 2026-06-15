import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Wallet, Gauge, TrendingUp, ReceiptText, Zap, Flame, Droplet } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-servers";
import KpiCard from "@/components/ui/KpiCard";
import ConsumptionChart from "@/components/charts/ConsumptionChart";
import ProjectionChart from "@/components/charts/ProjectionsChart";
import SuggestionCard from "@/components/ui/SuggestionCard";
import { getProjections } from "@/lib/projections";
import { getSuggestions } from "@/lib/suggestion";

type Bill = {
  id: string;
  type: string;
  month: number;
  year: number;
  amount_eur: number;
  kwh: number | null;
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { data } = await supabase
    .from("bills")
    .select("*")
    .order("year", { ascending: true })
    .order("month", { ascending: true });

  const bills: Bill[] = (data ?? []).map((b) => ({
    id: b.id,
    type: b.type,
    month: Number(b.month),
    year: Number(b.year),
    amount_eur: Number(b.amount_eur),
    kwh: b.kwh ? Number(b.kwh) : null,
  }));

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const thisMonthBills = bills.filter(
    (b) => b.month === currentMonth && b.year === currentYear
  );
  const lastMonthBills = bills.filter(
    (b) => b.month === prevMonth && b.year === prevYear
  );

  const totalThisMonth = thisMonthBills.reduce((s, b) => s + b.amount_eur, 0);
  const totalLastMonth = lastMonthBills.reduce((s, b) => s + b.amount_eur, 0);
  const totalKwh = bills
    .filter((b) => b.kwh !== null)
    .reduce((s, b) => s + (b.kwh ?? 0), 0);
  const totalAll = bills.reduce((s, b) => s + b.amount_eur, 0);
  const avgMonthly = bills.length > 0 ? (totalAll / 12).toFixed(2) : "0.00";

  let trendLabel = "Nessun dato precedente";
  let trendDir: "up" | "down" | "neutral" = "neutral";
  if (totalLastMonth > 0) {
    const diff = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;
    const sign = diff > 0 ? "+" : "";
    trendLabel = `${sign}${diff.toFixed(1)}% vs mese scorso`;
    trendDir = diff > 0 ? "up" : "down";
  }

  const projLuce = getProjections(bills, "luce");
  const projGas = getProjections(bills, "gas");
  const projAcqua = getProjections(bills, "acqua");
  const suggestions = getSuggestions(bills);

  const projections = [
    { label: "Luce", icon: Zap, color: "var(--electricity)", text: "text-electricity", bg: "bg-electricity-soft", data: projLuce },
    { label: "Gas", icon: Flame, color: "var(--gas)", text: "text-gas", bg: "bg-gas-soft", data: projGas },
    { label: "Acqua", icon: Droplet, color: "var(--water)", text: "text-water", bg: "bg-water-soft", data: projAcqua },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Panoramica
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            I tuoi consumi di luce, gas e acqua in un colpo d&apos;occhio.
          </p>
        </div>
        <Link
          href="/inserisci"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Nuova bolletta
        </Link>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="Questo mese"
          value={`€${totalThisMonth.toFixed(2)}`}
          sub={trendLabel}
          trend={trendDir}
          icon={Wallet}
        />
        <KpiCard
          label="kWh totali"
          value={totalKwh > 0 ? `${totalKwh}` : "—"}
          sub="Tutti i periodi"
          icon={Gauge}
        />
        <KpiCard
          label="Media mensile"
          value={`€${avgMonthly}`}
          sub="Stima annuale"
          icon={TrendingUp}
        />
        <KpiCard
          label="Bollette"
          value={`${bills.length}`}
          sub="Totale registrate"
          icon={ReceiptText}
        />
      </div>

      {/* Consumption chart */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-foreground">
            Consumi nel tempo
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Spesa mensile per ciascuna utenza.
          </p>
        </div>
        <ConsumptionChart bills={bills} />
      </section>

      {/* Projections */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-foreground">
            Proiezioni prossimi 3 mesi
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Stima basata sull&apos;andamento recente. La linea tratteggiata
            indica la previsione.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {projections.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.label}
                className="rounded-xl border border-border bg-background/40 p-4"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-md ${p.bg}`}>
                    <Icon className={`h-4 w-4 ${p.text}`} strokeWidth={2} />
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {p.label}
                  </span>
                </div>
                <ProjectionChart data={p.data} color={p.color} label={p.label} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Suggestions */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-foreground">
            Suggerimenti
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Analisi dei tuoi consumi rispetto alla media nazionale.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {suggestions.map((s, i) => (
            <SuggestionCard key={i} type={s.type} title={s.title} body={s.body} />
          ))}
        </div>
      </section>
    </div>
  );
}
