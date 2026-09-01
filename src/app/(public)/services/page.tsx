import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/services/service-card";
import { Reveal } from "@/components/ui/reveal";
import { getServices } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Discover FitZone's range of fitness services including personal training, weight loss, muscle building, HIIT, yoga, boxing and more.",
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <img src="/images/cta.svg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="container-page relative z-10">
          <SectionHeading
            title="Our Services"
            description="Professional fitness services led by expert coaches to help you achieve every goal."
          />
        </div>
      </section>
      <section className="py-16">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.04}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
