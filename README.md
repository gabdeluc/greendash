# GreenDash

Dashboard per il monitoraggio dei consumi energetici domestici in Italia.
Traccia luce, gas, acqua e telefono, gestisce i contratti dei fornitori e mostra
proiezioni di spesa — con un occhio di riguardo alle vere cadenze di fatturazione
italiane (bimestrale, trimestrale), spesso ignorate dai tool generici di budgeting.

**Live demo →** [greendash.vercel.app](https://greendash.vercel.app)

## Il problema che risolve

Le bollette italiane non hanno cadenza mensile fissa: l'energia elettrica è
tipicamente bimestrale, l'acqua spesso trimestrale, mentre telefono/internet
restano mensili. Confrontare direttamente una bolletta da €160 (bimestrale)
con una da €80 (mensile) genera trend e proiezioni completamente sballati.

GreenDash normalizza ogni bolletta al suo equivalente mensile prima di calcolare
trend, medie e proiezioni, e la espande sui mesi effettivamente coperti nei grafici,
per un confronto coerente indipendentemente dalla cadenza di fatturazione.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Supabase** — database PostgreSQL, autenticazione, Row Level Security
- **Recharts** — grafici interattivi (linee, barre, donut)
- **Tailwind CSS** — styling, design system dark "Obsidian Precision"
- **Vercel** — deploy

## Feature

**Bollette**
- CRUD completo con filtro per tipo utenza e anno
- Export CSV (compatibile Excel, encoding UTF-8 con BOM)
- Normalizzazione automatica delle cadenze (mensile/bimestrale/trimestrale/quadrimestrale)

**Contratti**
- Tracciamento fornitore, tariffa, data attivazione e rinnovo per ogni utenza
- Badge colorati sul rinnovo (verde / giallo entro 30gg / rosso scaduto)
- Alert automatico in dashboard per rinnovi entro 60 giorni

**Statistiche**
- Grafico a barre della spesa annuale per utenza
- Donut chart della distribuzione di spesa dell'anno corrente
- Confronto anno su anno (YoY) con indicatori di variazione percentuale
- Proiezioni a 3 mesi via regressione lineare, per singola utenza

**Dashboard**
- Riepilogo annuale (spesa totale, media mensile, proiezione, bolletta più alta)
- KPI card con sparkline e barra di avanzamento rispetto al budget impostato
- Suggerimenti automatici basati sul confronto con la media nazionale ARERA
- Alert rinnovi contratto in scadenza

**Impostazioni**
- Budget mensile personalizzabile per ogni utenza

**Qualità del codice**
- Error boundary globale, stati di caricamento (skeleton) su tutte le pagine
- Toast notification e conferme di eliminazione inline (nessun `alert()`/`confirm()` nativo)
- Autenticazione con sessioni per utente, protezione route via middleware
- Row Level Security su tutte le tabelle Supabase

## Setup locale

```bash
git clone https://github.com/tuousername/greendash
cd greendash
npm install
```

Crea `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

```bash
npm run dev
```

Apri [localhost:3000](http://localhost:3000)

## Database

Esegui questo SQL su Supabase per creare lo schema completo:

```sql
create table bills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('luce', 'gas', 'acqua', 'telefono')),
  month int not null check (month between 1 and 12),
  year int not null,
  amount_eur numeric(8,2) not null,
  kwh numeric(8,2),
  months_covered int not null default 1 check (months_covered between 1 and 12),
  created_at timestamptz default now()
);

alter table bills enable row level security;
create policy "user_sees_own_bills" on bills for all using (auth.uid() = user_id);

create table contracts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('luce', 'gas', 'acqua', 'telefono')),
  provider_name text not null,
  tariff_name text,
  activation_date date,
  renewal_date date,
  monthly_eur numeric(8,2),
  notes text,
  created_at timestamptz default now()
);

alter table contracts enable row level security;
create policy "user_sees_own_contracts" on contracts for all using (auth.uid() = user_id);

create table budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('luce', 'gas', 'acqua', 'telefono')),
  monthly_eur numeric(8,2) not null,
  created_at timestamptz default now(),
  unique(user_id, type)
);

alter table budgets enable row level security;
create policy "user_sees_own_budgets" on budgets for all using (auth.uid() = user_id);
```

## Autore

Progetto portfolio di Gabriele De Luca, studente di Informatica presso
l'Università di Bari.