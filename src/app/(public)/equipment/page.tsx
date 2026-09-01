import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { EquipmentBrowser } from "@/components/equipment/equipment-browser";
import { getEquipmentList, getEquipmentCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Equipment",
  description:
    "Explore FitZone's premium equipment range including cardio, strength, free weights and functional training gear.",
};

export default async function EquipmentPage() {
  const [equipment, categories] = await Promise.all([
    getEquipmentList(),
    getEquipmentCategories(),
  ]);

  // Read URL params for shareable filtering (searchParams supported in server component)
  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <img src="/images/hero.svg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="container-page relative z-10">
          <SectionHeading
            title="Our Equipment"
            description="Premium machines and free weights engineered for serious results."
          />
        </div>
      </section>
      <section className="py-16">
        <div className="container-page">
          <Suspense fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl border border-border bg-card" />
              ))}
            </div>
          }>
            <EquipmentBrowser equipment={equipment} categories={categories} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
