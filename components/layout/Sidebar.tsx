"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import BrandLogo from "@/components/ui/BrandLogo";

const NAV = [
  { href: "/dashboard", label: "Panoramica", icon: LayoutDashboard },
  { href: "/inserisci", label: "Nuova bolletta", icon: PlusCircle },
];

export default function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const NavLinks = (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <Icon
              className={`h-[18px] w-[18px] transition-colors ${
                active ? "text-primary" : "text-subtle-foreground group-hover:text-foreground"
              }`}
              strokeWidth={2}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const Account = (
    <div className="border-t border-border pt-4">
      <div className="flex items-center gap-3 px-3 pb-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase text-muted-foreground">
          {email.charAt(0)}
        </span>
        <span className="truncate text-xs text-muted-foreground" title={email}>
          {email}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-negative"
      >
        <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
        Esci
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:hidden">
        <BrandLogo />
        <button
          onClick={() => setOpen(true)}
          aria-label="Apri menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <BrandLogo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Chiudi menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex-1">{NavLinks}</div>
            {Account}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-card px-4 py-6 md:flex">
        <div className="px-3">
          <BrandLogo />
        </div>
        <div className="mt-8 flex-1">{NavLinks}</div>
        {Account}
      </aside>
    </>
  );
}
