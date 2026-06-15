import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BillForm from "@/components/forms/BillForm";

export default function InserisciPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        Panoramica
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Nuova bolletta
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registra una bolletta per aggiornare i tuoi consumi e le proiezioni.
        </p>
      </div>

      <BillForm />
    </div>
  );
}
