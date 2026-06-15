"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      setError("Per favore, inserisci email e password.");
      return;
    }
    setLoading(true);
    setError("");
    setInfo("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  async function handleSignup() {
    if (!email || !password) {
      setError("Per favore, inserisci email e password.");
      return;
    }
    setLoading(true);
    setError("");
    setInfo("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setInfo("Controlla la tua email e clicca sul link di conferma.");
    }
    setLoading(false);
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-subtle-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo showWordmark={false} />
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
            Accedi a GreenDash
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Tieni sotto controllo i consumi di casa.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-negative/10 px-3 py-2 text-sm text-negative">
                {error}
              </p>
            )}
            {info && (
              <p className="rounded-lg bg-primary-soft px-3 py-2 text-sm text-primary">
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "Attendere..." : "Accedi"}
            </button>
            <button
              type="button"
              onClick={handleSignup}
              disabled={loading}
              className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground disabled:opacity-60"
            >
              Crea un account
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-subtle-foreground">
          Monitora luce, gas e acqua. Riduci i costi.
        </p>
      </div>
    </div>
  );
}
