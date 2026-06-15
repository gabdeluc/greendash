"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";

type Bill = {
  month: number;
  year: number;
  type: string;
  amount_eur: number;
  kwh: number | null;
};

type Props = { bills: Bill[] };

const MONTHS = [
  "Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
  "Lug", "Ago", "Set", "Ott", "Nov", "Dic",
];

const SERIES = [
  { key: "luce", name: "Luce", color: "var(--electricity)" },
  { key: "gas", name: "Gas", color: "var(--gas)" },
  { key: "acqua", name: "Acqua", color: "var(--water)" },
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border-strong bg-elevated px-3 py-2 shadow-xl">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-col gap-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: entry.color }}
              />
              {entry.name}
            </span>
            <span className="font-mono text-xs font-medium tabular-nums text-foreground">
              €{Number(entry.value).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ConsumptionChart({ bills }: Props) {
  const map: Record<
    string,
    { label: string; luce?: number; gas?: number; acqua?: number }
  > = {};

  bills.forEach((b) => {
    const key = `${b.year}-${String(b.month).padStart(2, "0")}`;
    if (!map[key]) map[key] = { label: `${MONTHS[b.month - 1]} ${b.year}` };
    if (b.type === "luce") map[key].luce = b.amount_eur;
    if (b.type === "gas") map[key].gas = b.amount_eur;
    if (b.type === "acqua") map[key].acqua = b.amount_eur;
  });

  const data = Object.keys(map)
    .sort()
    .map((k) => map[k]);

  if (data.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <LineChartIcon className="h-5 w-5 text-subtle-foreground" />
        </span>
        <p className="max-w-xs text-sm text-muted-foreground">
          Nessun dato ancora. Inserisci la tua prima bolletta per vedere
          l&apos;andamento dei consumi.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: s.color }}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {s.name}
            </span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="0"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
            dy={8}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `€${v}`}
            width={56}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "var(--border-strong)", strokeWidth: 1 }}
          />
          {SERIES.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              name={s.name}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
