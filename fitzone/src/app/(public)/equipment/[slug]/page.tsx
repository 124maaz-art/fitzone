import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Target, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getEquipmentBySlug } from "@/lib/data";
import { SmartImage } from "@/components/ui/smart-image";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EquipmentCard } from "@/components/equipment/equipment-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let name = "Equipment Not Found";
  let description = "";
  try {
    const item = await prisma.equipment.findUnique({ where: { slug } });
    if (item) {
      name = item.name;
      description = item.description;
    }
  } catch {
    const sample = (await getEquipmentBySlug(slug)).item;
    if (sample) {
      name = sample.name;
      description = sample.description;
    }
  }
  return { title: name, description };
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { item: equipment, related } = await getEquipmentBySlug(slug);

  if (!equipment) notFound();

  return (
    <>
      <section className="border-b border-border bg-black/40">
        <div className="container-page flex flex-wrap items-center gap-3 py-5 text-sm">
          <Link href="/equipment" className="inline-flex items-center gap-1 text-muted hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Equipment
          </Link>
          <span className="text-muted">/</span>
          <Badge>{equipment.category?.name ?? "Gym"}</Badge>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="relative h-80 overflow-hidden rounded-3xl border border-border sm:h-96 lg:h-[520px]">
            <SmartImage src={equipment.image} alt={equipment.name} fill className="object-cover" sizes="50vw" priority />
          </div>
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">{equipment.name}</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>{equipment.category?.name ?? "Gym"}</Badge>
              {equipment.trainingType && <Badge>{equipment.trainingType}</Badge>}
              {equipment.targetMuscle && <Badge>{equipment.targetMuscle}</Badge>}
            </div>
            <p className="mt-5 leading-relaxed text-muted">{equipment.description}</p>

            {equipment.targetMuscle && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
                <Target className="h-6 w-6 shrink-0 text-accent" />
                <div>
                  <h3 className="font-bold">Target Muscle</h3>
                  <p className="mt-1 text-sm text-muted">{equipment.targetMuscle}</p>
                </div>
              </div>
            )}

            <Link href="/booking" className={`${buttonVariants({ size: "lg", className: "mt-8 rounded-full" })}`}>
              Book a Training Session
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8">
            <h2 className="text-xl font-bold">Features</h2>
            <ul className="mt-4 space-y-3">
              {(equipment.features ?? []).map((f: string) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8">
            <h2 className="text-xl font-bold">Benefits</h2>
            <ul className="mt-4 space-y-3">
              {(equipment.benefits ?? []).map((b: string) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-12">
          <div className="container-page">
            <h2 className="mb-8 text-2xl font-bold">Related Equipment</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((e: any) => (
                <EquipmentCard key={e.id} equipment={e} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
