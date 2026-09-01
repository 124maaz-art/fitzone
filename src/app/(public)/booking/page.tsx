import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { BookingForm } from "@/components/booking/booking-form";
import { getServices, getPackages, getTrainers } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Book your fitness session at FitZone. Choose a service, package and trainer, pick a date and time, and confirm your booking instantly.",
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; package?: string; trainer?: string }>;
}) {
  const params = await searchParams;
  const [services, packages, trainers] = await Promise.all([
    getServices(),
    getPackages(),
    getTrainers(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <img src="/images/hero.svg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="container-page relative z-10">
          <SectionHeading
            title="Book a Session"
            description="Reserve your spot at FitZone in just a few minutes."
          />
        </div>
      </section>
      <section className="py-14">
        <div className="container-page">
          <BookingForm
            services={services}
            packages={packages}
            trainers={trainers}
            initialService={params.service}
            initialPackage={params.package}
            initialTrainer={params.trainer}
          />
        </div>
      </section>
    </>
  );
}
