# 🌱 GreenDash

Dashboard per il monitoraggio dei consumi energetici domestici.
Inserisci le tue bollette, analizza i trend e ricevi suggerimenti personalizzati.

**Live demo →** [greendash.vercel.app](https://greendash.vercel.app)

## Stack

- **Next.js 14** App Router + TypeScript
- **Supabase** — database PostgreSQL, autenticazione, RLS
- **Recharts** — grafici interattivi
- **Tailwind CSS** — styling
- **Vercel** — deploy

## Features

- 📊 Grafici consumi nel tempo (luce, gas, acqua)
- 📈 Proiezioni automatiche sui prossimi 3 mesi
- 🇮🇹 Confronto con la media nazionale ARERA
- 💡 Suggerimenti personalizzati sui consumi
- 🔐 Autenticazione sicura con sessioni per utente
- 📱 Responsive mobile-first

## Setup locale

\`\`\`bash
git clone https://github.com/tuousername/greendash
cd greendash
npm install
\`\`\`

Crea `.env.local`:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
\`\`\`

\`\`\`bash
npm run dev
\`\`\`

Apri [localhost:3000](http://localhost:3000)

## Database

Esegui questo SQL su Supabase per creare le tabelle:

\`\`\`sql
create table bills (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('luce', 'gas', 'acqua')),
  month int not null check (month between 1 and 12),
  year int not null,
  amount_eur numeric(8,2) not null,
  kwh numeric(8,2),
  created_at timestamptz default now()
);

alter table bills enable row level security;

create policy "user_sees_own_bills"
  on bills for all
  using (auth.uid() = user_id);
\`\`\`