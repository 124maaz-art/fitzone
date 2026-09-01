import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = { title: "Admin | Settings" };

export default async function AdminSettingsPage() {
  let settings: Record<string, string> = {};
  try {
    const rows = await prisma.siteSetting.findMany();
    settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    settings = {};
  }
  return (
    <div>
      <h1 className="mb-6 text-2xl font-black sm:text-3xl">Settings</h1>
      <p className="mb-6 text-sm text-muted">Manage site-wide content. These values are used across the public website.</p>
      <SettingsForm settings={settings} />
    </div>
  );
}
