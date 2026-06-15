import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
};

export default function KpiCard({ label, value, sub, trend, icon: Icon }: Props) {
  // For energy spend: up = more money spent (negative), down = savings (positive)
  const trendStyles =
    trend === "up"
      ? { color: "text-negative", bg: "bg-negative/10", Arrow: ArrowUpRight }
      : trend === "down"
        ? { color: "text-positive", bg: "bg-positive/10", Arrow: ArrowDownRight }
        : { color: "text-subtle-foreground", bg: "bg-muted", Arrow: Minus };

  const showTrendBadge = trend && trend !== "neutral";
  const Arrow = trendStyles.Arrow;

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-border-strong">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {Icon && (
          <Icon className="h-4 w-4 text-subtle-foreground" strokeWidth={2} />
        )}
      </div>

      <p className="mt-3 font-mono text-3xl font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </p>

      {sub && (
        <div className="mt-2 flex items-center gap-1.5">
          {showTrendBadge && (
            <span
              className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium ${trendStyles.bg} ${trendStyles.color}`}
            >
              <Arrow className="h-3 w-3" strokeWidth={2.5} />
            </span>
          )}
          <p className={`text-xs ${showTrendBadge ? trendStyles.color : "text-subtle-foreground"}`}>
            {sub}
          </p>
        </div>
      )}
    </div>
  );
}
