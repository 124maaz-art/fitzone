import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSettings } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar gymName={settings.gymName} logo={settings.logo} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
