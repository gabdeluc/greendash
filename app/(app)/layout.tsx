import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-servers";
import Sidebar from "@/components/layout/Sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar email={session.user.email ?? ""} />
      <main className="md:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:px-8 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
