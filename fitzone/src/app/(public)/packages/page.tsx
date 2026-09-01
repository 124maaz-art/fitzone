import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { PackageCard } from "@/components/packages/package-card";
import { Reveal } from "@/components/ui/reveal";
import { getPackages } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Membership Packages",
  description:
    "Choose the perfect FitZone membership - Basic, Premium or VIP. Flexible plans designed to fit your goals and lifestyle.",
};

export default async function PackagesPage() {
  const packages = await getPackages();
  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <img src="/images/hero.svg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="container-page relative z-10">
          <SectionHeading
            title="Membership Packages"
            description="Flexible membership options with no hidden fees. Upgrade, downgrade or cancel anytime."
          />
        </div>
      </section>
      <section className="py-16">
        <div className="container-page">
          <div className="grid gap-8 md:grid-cols-3">
            {packages.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <PackageCard pkg={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
