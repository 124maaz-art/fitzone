import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProgramCard } from "@/components/programs/program-card";
import { Reveal } from "@/components/ui/reveal";
import { getPrograms } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore FitZone fitness programs - fat loss, muscle building, strength training, HIIT, beginner programs and more.",
};

export default async function ProgramsPage() {
  const programs = await getPrograms();
  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <img src="/images/hero.svg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="container-page relative z-10">
          <SectionHeading
            title="Fitness Programs"
            description="Structured programs built by expert coaches to get you results - whatever your goal."
          />
        </div>
      </section>
      <section className="py-16">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.04}>
                <ProgramCard program={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
