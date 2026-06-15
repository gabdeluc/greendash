"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Flame, Droplet, Check, Loader2, type LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase";

const MONTHS = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

type TypeOption = {
  value: string;
  label: string;
  icon: LucideIcon;
  activeText: string;
  activeBorder: string;
  activeBg: string;
};

const TYPES: TypeOption[] = [
  { value: "luce", label: "Luce", icon: Zap, activeText: "text-electricity", activeBorder: "border-electricity/50", activeBg: "bg-electricity-soft" },
  { value: "gas", label: "Gas", icon: Flame, activeText: "text-gas", activeBorder: "border-gas/50", activeBg: "bg-gas-soft" },
  { value: "acqua", label: "Acqua", icon: Droplet, activeText: "text-water", activeBorder: "border-water/50", activeBg: "bg-water-soft" },
];

const inputClass =
  "w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-subtle-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40";
const labelClass = "mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground";

export default function BillForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    type: "luce",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount_eur: "",
    kwh: "",
  });

  function set(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.amount_eur) {
      setError("Inserisci l'importo della bolletta.");
      return;
    }
    setError("");
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { error: insertError } = await supabase.from("bills").insert({
      user_id: user.id,
      type: form.type,
      month: Number(form.month),
      year: Number(form.year),
      amount_eur: Number(form.amount_eur),
      kwh: form.kwh ? Number(form.kwh) : null,
    });

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 1200);
  }

  const showKwh = form.type === "luce" || form.type === "gas";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-border bg-card p-5 sm:p-6"
    >
      {/* Type selector */}
      <div>
        <span className={labelClass}>Tipo di utenza</span>
        <div className="grid grid-cols-3 gap-2.5">
          {TYPES.map((t) => {
            const Icon = t.icon;
            const active = form.type === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => set("type", t.value)}
                aria-pressed={active}
                className={`flex flex-col items-center gap-2 rounded-xl border py-4 text-sm font-medium transition-all ${
                  active
                    ? `${t.activeBorder} ${t.activeBg} ${t.activeText}`
                    : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Period */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="month">
            Mese
          </label>
          <select
            id="month"
            value={form.month}
            onChange={(e) => set("month", e.target.value)}
            className={inputClass}
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="year">
            Anno
          </label>
          <select
            id="year"
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            className={inputClass}
          >
            {[2023, 2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className={labelClass} htmlFor="amount">
          Importo
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            €
          </span>
          <input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            value={form.amount_eur}
            onChange={(e) => set("amount_eur", e.target.value)}
            placeholder="87,50"
            className={`${inputClass} pl-7`}
          />
        </div>
      </div>

      {/* kWh */}
      {showKwh && (
        <div>
          <label className={labelClass} htmlFor="kwh">
            Consumo kWh{" "}
            <span className="normal-case text-subtle-foreground">(opzionale)</span>
          </label>
          <input
            id="kwh"
            type="number"
            inputMode="numeric"
            value={form.kwh}
            onChange={(e) => set("kwh", e.target.value)}
            placeholder="es. 210"
            className={inputClass}
          />
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-negative/10 px-3 py-2 text-sm text-negative">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || success}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        {success ? (
          <>
            <Check className="h-4 w-4" strokeWidth={2.5} /> Salvata
          </>
        ) : loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Salvataggio...
          </>
        ) : (
          "Salva bolletta"
        )}
      </button>
    </form>
  );
}
