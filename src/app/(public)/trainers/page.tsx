import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrainerCard } from "@/components/trainers/trainer-card";
import { Reveal } from "@/components/ui/reveal";
import { getTrainers } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trainers",
  description:
    "Meet FitZone's team of certified expert trainers - strength coaches, HIIT instructors, yoga teachers and nutrition coaches.",
};

export default async function TrainersPage() {
  const trainers = await getTrainers();
  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <img src="/images/about.svg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="container-page relative z-10">
          <SectionHeading
            title="Meet Our Trainers"
            description="Passionate professionals dedicated to guiding you toward your best self."
          />
        </div>
      </section>
      <section className="py-16">
        <div className="container-page">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trainers.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.04}>
                <TrainerCard trainer={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
