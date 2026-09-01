import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { TransformationCard } from "@/components/transformations/transformation-card";
import { Reveal } from "@/components/ui/reveal";
import { getTransformations } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Transformations",
  description:
    "Real before and after results from FitZone members who transformed their bodies and lives with our programs.",
};

export default async function TransformationsPage() {
  const transformations = await getTransformations();
  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <img src="/images/cta.svg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="container-page relative z-10">
          <SectionHeading
            title="Member Transformations"
            description="Every transformation starts with a single decision. These members decided - and saw incredible results."
          />
        </div>
      </section>
      <section className="py-16">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          {transformations.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.04}>
              <TransformationCard transformation={t} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
