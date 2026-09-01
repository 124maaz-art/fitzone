import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    const from = "/admin/dashboard";
    redirect(`/admin/login?callbackUrl=${encodeURIComponent(from)}`);
  }

  if (session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        userName={session.user.name ?? "Admin"}
        userRole={session.user.role ?? "ADMIN"}
      />
      <main className="flex-1 overflow-x-hidden bg-zinc-950/40">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
