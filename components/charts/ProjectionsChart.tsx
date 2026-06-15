"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { ProjectionPoint } from "@/lib/projections";

type Props = {
  data: ProjectionPoint[];
  color: string;
  label: string;
};

function makeTooltip(color: string, label: string) {
  return function CustomTooltip({
    active,
    payload,
    label: axisLabel,
  }: TooltipProps<number, string>) {
    if (!active || !payload || payload.length === 0) return null;
    const point = payload[0].payload as ProjectionPoint;
    return (
      <div className="rounded-lg border border-border-strong bg-elevated px-3 py-2 shadow-xl">
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          {axisLabel}
          {point.isProjection && (
            <span className="ml-1.5 text-subtle-foreground">· stima</span>
          )}
        </p>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: color }} />
            {label}
          </span>
          <span className="font-mono text-xs font-medium tabular-nums text-foreground">
            €{Number(payload[0].value).toFixed(2)}
          </span>
        </div>
      </div>
    );
  };
}

export default function ProjectionChart({ data, color, label }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-border px-4 text-center">
        <p className="text-xs leading-relaxed text-subtle-foreground">
          Servono almeno 2 bollette di questo tipo per generare una proiezione.
        </p>
      </div>
    );
  }

  const firstProjection = data.find((d) => d.isProjection)?.label;
  const Tip = makeTooltip(color, label);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="0" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          dy={6}
        />
        <YAxis
          tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `€${v}`}
          width={44}
        />
        <Tooltip content={<Tip />} cursor={{ stroke: "var(--border-strong)", strokeWidth: 1 }} />
        {firstProjection && (
          <ReferenceLine
            x={firstProjection}
            stroke="var(--border-strong)"
            strokeDasharray="4 4"
          />
        )}
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={(props) => {
            const { cx, cy, payload } = props;
            return (
              <circle
                key={`dot-${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={3.5}
                fill={payload.isProjection ? "var(--card)" : color}
                stroke={color}
                strokeWidth={2}
                strokeDasharray={payload.isProjection ? "2 2" : "0"}
              />
            );
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
