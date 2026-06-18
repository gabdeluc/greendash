"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

type Bill = {
  month: number;
  year: number;
  type: string;
  amount_eur: number;
  kwh: number | null;
};

type Props = { bills: Bill[] };

const MONTHS = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];

export default function ConsumptionChart({ bills }: Props) {
  const map: Record<
    string,
    { label: string; luce?: number; gas?: number; acqua?: number; telefono?: number }
  > = {};

  bills.forEach((b) => {
    const key = `${b.year}-${String(b.month).padStart(2, "0")}`;
    if (!map[key]) map[key] = { label: `${MONTHS[b.month - 1]} ${b.year}` };
    if (b.type === "luce") map[key].luce = b.amount_eur;
    if (b.type === "gas") map[key].gas = b.amount_eur;
    if (b.type === "acqua") map[key].acqua = b.amount_eur;
    if (b.type === "telefono") map[key].telefono = b.amount_eur;
  });

  const data = Object.keys(map).sort().map((k) => map[k]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-600 text-sm">
        Nessun dato ancora — inserisci la prima bolletta ↓
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 12 }} />
        <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} unit="€" />
        <Tooltip
          contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 8 }}
          labelStyle={{ color: "#f9fafb" }}
          formatter={(value) => {
            const num = typeof value === "number" ? value : Number(value);
            return [`€${num.toFixed(2)}`];
          }}
        />
        <Legend wrapperStyle={{ fontSize: 13, color: "#9ca3af" }} />
        <Line type="monotone" dataKey="luce" stroke="#facc15" strokeWidth={2} dot={false} name="Luce" />
        <Line type="monotone" dataKey="gas" stroke="#fb923c" strokeWidth={2} dot={false} name="Gas" />
        <Line type="monotone" dataKey="acqua" stroke="#60a5fa" strokeWidth={2} dot={false} name="Acqua" />
        <Line type="monotone" dataKey="telefono" stroke="#a78bfa" strokeWidth={2} dot={false} name="Telefono" />
      </LineChart>
    </ResponsiveContainer>
  );
}