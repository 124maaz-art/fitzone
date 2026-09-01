import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, Dumbbell, CalendarDays, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getTrainerBySlug } from "@/lib/data";
import { SmartImage } from "@/components/ui/smart-image";
import { buttonVariants } from "@/components/ui/button";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let trainer: Awaited<ReturnType<typeof prisma.trainer.findUnique>> = null;
  try {
    trainer = await prisma.trainer.findUnique({ where: { slug } });
  } catch {
    trainer = null;
  }
  if (!trainer) trainer = await getTrainerBySlug(slug) as any;
  if (!trainer) return { title: "Trainer Not Found" };
  return { title: trainer.name, description: trainer.bio };
}

export default async function TrainerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trainer = await getTrainerBySlug(slug);

  if (!trainer) notFound();

  const availabilityMap = Object.fromEntries(
    (trainer.availabilities ?? []).map((a: any) => [a.day, a])
  );

  return (
    <>
      <section className="border-b border-border bg-black/40">
        <div className="container-page py-5 text-sm">
          <Link href="/trainers" className="inline-flex items-center gap-1 text-muted hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Trainers
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="relative h-96 overflow-hidden rounded-3xl border border-border lg:h-[500px]">
            <SmartImage src={trainer.image} alt={trainer.name} fill className="object-cover" sizes="33vw" priority />
          </div>
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-black sm:text-4xl">{trainer.name}</h1>
            <p className="mt-2 font-semibold text-accent">{(trainer.specializations ?? []).join(" • ")}</p>
            <p className="mt-5 leading-relaxed text-muted">{trainer.bio}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 text-accent">
                  <Dumbbell className="h-5 w-5" />
                  <h3 className="font-bold">Experience</h3>
                </div>
                <p className="mt-2 text-sm text-muted">{trainer.experience}+ years of professional coaching</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 text-accent">
                  <Award className="h-5 w-5" />
                  <h3 className="font-bold">Certifications</h3>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {(trainer.certifications ?? []).map((c: string) => (
                    <li key={c} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-green-400" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 text-accent">
                <CalendarDays className="h-5 w-5" />
                <h3 className="font-bold">Weekly Availability</h3>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {DAYS.map((day, i) => {
                  const a = availabilityMap[i];
                  const available = a?.available !== false && a;
                  return (
                    <div key={day} className={`rounded-lg border p-3 text-sm ${available ? "border-green-500/30 bg-green-500/10" : "border-border bg-white/5 opacity-60"}`}>
                      <p className="font-semibold">{day}</p>
                      <p className="text-xs text-muted">{available ? `${a?.startTime ?? "7:00 AM"} - ${a?.endTime ?? "10:00 PM"}` : "Unavailable"}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link href={`/booking?trainer=${trainer.slug}`} className={`${buttonVariants({ size: "lg", className: "mt-8 rounded-full" })}`}>
              Book with {trainer.name.split(" ")[0]}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
