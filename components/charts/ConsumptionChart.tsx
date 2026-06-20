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
  months_covered?: number;
};

type Props = { bills: Bill[] };

const MONTHS = ["Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];

export default function ConsumptionChart({ bills }: Props) {
  const map: Record<string, Record<string, string | number>> = {};

  bills.forEach((b) => {
    const covered = b.months_covered ?? 1;
    // Normalizziamo a importo mensile: una bimestrale da €160 → €80/mese
    const monthly = Math.round((b.amount_eur / covered) * 100) / 100;

    // Espandiamo la bolletta su tutti i mesi coperti, andando indietro
    // dal mese di chiusura. Così il grafico è continuo e confrontabile.
    for (let i = 0; i < covered; i++) {
      let m = b.month - i;
      let y = b.year;
      while (m <= 0) { m += 12; y -= 1; }

      const key = `${y}-${String(m).padStart(2, "0")}`;
      if (!map[key]) map[key] = { label: `${MONTHS[m - 1]} ${y}` };

      // Non sovrascrivere se il mese è già valorizzato
      // (es. due bollette che si sovrappongono per errore)
      if (map[key][b.type] === undefined) {
        map[key][b.type] = monthly;
      }
    }
  });

  const data = Object.keys(map).sort().map((k) => map[k]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-[#bbcabf] text-sm">
        Nessun dato ancora — inserisci la prima bolletta
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={255}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 11 }} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} unit="€" />
          <Tooltip
            contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 8 }}
            labelStyle={{ color: "#f9fafb", fontSize: 12 }}
            formatter={(value) => {
              const num = typeof value === "number" ? value : Number(value);
              return [`€${num.toFixed(2)}/mese`];
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
          {/* connectNulls: collega i punti anche quando una linea ha mesi vuoti */}
          <Line type="monotone" dataKey="luce"     stroke="#f59e0b" strokeWidth={2} dot={false} name="Luce"     connectNulls />
          <Line type="monotone" dataKey="gas"      stroke="#f97316" strokeWidth={2} dot={false} name="Gas"      connectNulls />
          <Line type="monotone" dataKey="acqua"    stroke="#3b82f6" strokeWidth={2} dot={false} name="Acqua"    connectNulls />
          <Line type="monotone" dataKey="telefono" stroke="#a78bfa" strokeWidth={2} dot={false} name="Telefono" connectNulls />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[#bbcabf]/40 text-[10px] text-right mt-1 pr-2">
        Valori normalizzati a €/mese · confronto coerente tra cadenze diverse
      </p>
    </div>
  );
}