import Link from "next/link";
import { Dumbbell, HeartPulse, ShieldCheck, Users, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { Reveal, Counter } from "@/components/ui/reveal";
import { HeroContent } from "./hero-content";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import { ServiceCard } from "@/components/services/service-card";
import { PackageCard } from "@/components/packages/package-card";
import { ProgramCard } from "@/components/programs/program-card";
import { TrainerCard } from "@/components/trainers/trainer-card";
import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { TransformationCard } from "@/components/transformations/transformation-card";
import { prisma } from "@/lib/prisma";
import type { SiteSettings } from "@/lib/settings";

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/hero.svg"
          alt="FitZone gym training area"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
      </div>
      <div className="container-page relative z-10 py-20">
        <HeroContent title={settings.heroTitle} description={settings.heroDescription} />
      </div>
    </section>
  );
}

export async function Stats() {
  let members = 0;
  let trainers = 0;
  let programs = 0;
  let yearsExperience = 0;
  try {
    const [memberCount, trainerCount, programCount, trainerAgg] = await Promise.all([
      prisma.user.count(),
      prisma.trainer.count({ where: { active: true } }),
      prisma.program.count({ where: { active: true } }),
      prisma.trainer.aggregate({ _max: { experience: true } }),
    ]);
    members = memberCount;
    trainers = trainerCount;
    programs = programCount;
    yearsExperience = trainerAgg._max.experience ?? 0;
  } catch {
    /* fallback to static values if DB is unavailable */
  }
  const stats = [
    { value: members, suffix: "+", label: "Members" },
    { value: trainers, suffix: "+", label: "Expert Trainers" },
    { value: programs, suffix: "+", label: "Programs" },
    { value: yearsExperience, suffix: "+", label: "Years Experience" },
  ];
  return (
    <section className="border-y border-border bg-black/40">
      <div className="container-page grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
        {stats.map((s) => (
          <Reveal key={s.label} className="text-center">
            <p className="text-4xl font-black text-accent sm:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-sm uppercase tracking-wider text-muted">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const features = [
  { icon: Users, title: "Expert Trainers", desc: "Certified coaches dedicated to your results." },
  { icon: Dumbbell, title: "Modern Equipment", desc: "State-of-the-art machines for every goal." },
  { icon: HeartPulse, title: "Flexible Programs", desc: "Programs tailored to your fitness level." },
  { icon: ShieldCheck, title: "Safe Environment", desc: "Clean, secure and welcoming space." },
];

export function GymIntro() {
  return (
    <section className="py-20">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <img src="/images/about.svg" alt="Inside FitZone gym" className="h-[480px] w-full rounded-3xl border border-border object-cover" loading="lazy" />
            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl border border-border bg-card p-6 shadow-2xl sm:block">
              <p className="text-4xl font-black text-accent"><Counter value={5000} suffix="+" /></p>
              <p className="text-sm text-muted">Happy Members</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <SectionHeading
            align="left"
            eyebrow="Who We Are"
            title="A Gym Built For Your Best Self"
            description="FitZone started with one mission: to make world-class fitness accessible to everyone. From our state-of-the-art equipment to our passionate trainers, everything is designed to help you train harder, live stronger and become better."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={0.15 + i * 0.08} effect="zoom">
                <div className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
                  <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/20">
                    <f.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Link href="/about" className={`${buttonVariants({ className: "mt-6 rounded-full" })}`}>
            Learn More <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function FeaturedServices({ services }: { services: any[] }) {
  const items = services.slice(0, 6);
  return (
    <section className="bg-black/40 py-20">
      <div className="container-page">
        <Reveal effect="blur">
          <SectionHeading
            eyebrow="What We Offer"
            title="Featured Services"
            description="From personal training to group classes, find the perfect service to reach your goals."
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05} effect="zoom">
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedEquipment({ equipment }: { equipment: any[] }) {
  return (
    <section className="py-20">
      <div className="container-page">
        <Reveal effect="blur">
          <SectionHeading
            eyebrow="State Of The Art"
            title="Featured Equipment"
            description="Explore our premium equipment range engineered for serious results."
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {equipment.slice(0, 6).map((e, i) => (
            <Reveal key={e.id} delay={i * 0.05} effect="rise">
              <EquipmentCard equipment={e} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MembershipSection({ packages }: { packages: any[] }) {
  return (
    <section className="bg-black/40 py-20">
      <div className="container-page">
        <Reveal effect="blur">
          <SectionHeading
            eyebrow="Join Us"
            title="Membership Packages"
            description="Flexible plans designed to fit your lifestyle and goals."
          />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} effect="zoom">
              <PackageCard pkg={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrainersSection({ trainers }: { trainers: any[] }) {
  return (
    <section className="py-20">
      <div className="container-page">
        <Reveal effect="blur">
          <SectionHeading
            eyebrow="Meet The Team"
            title="Our Expert Trainers"
            description="Learn from passionate professionals who will push you to your limits."
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trainers.slice(0, 4).map((t, i) => (
            <Reveal key={t.id} delay={i * 0.05} effect="rise">
              <TrainerCard trainer={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedPrograms({ programs }: { programs: any[] }) {
  return (
    <section className="py-20">
      <div className="container-page">
        <Reveal effect="blur">
          <SectionHeading
            eyebrow="Training Programs"
            title="Programs For Every Goal"
            description="Structured plans designed to take you from where you are to where you want to be."
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.slice(0, 3).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05} effect="rise">
              <ProgramCard program={p} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="text-center">
          <Link href="/programs" className={buttonVariants({ variant: "outline", className: "mt-8 rounded-full" })}>
            View All Programs <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function TestimonialsSection({ testimonials }: { testimonials: any[] }) {
  return (
    <section className="bg-black/40 py-20">
      <div className="container-page">
        <Reveal effect="blur">
          <SectionHeading
            eyebrow="Success Stories"
            title="What Our Members Say"
            description="Real results. Real people. Hear from those who transformed their lives at FitZone."
          />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <Reveal key={t.id} delay={i * 0.05} effect="zoom">
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TransformationsPreview({ transformations }: { transformations: any[] }) {
  return (
    <section className="py-20">
      <div className="container-page">
        <Reveal effect="blur">
          <SectionHeading
            eyebrow="Real Transformations"
            title="Before & After"
            description="See the incredible results our members achieve with dedication and our support."
          />
        </Reveal>
        <div className="grid gap-8 md:grid-cols-2">
          {transformations.slice(0, 2).map((t, i) => (
            <Reveal key={t.id} delay={i * 0.05} effect="rise">
              <TransformationCard transformation={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0">
        <img src="/images/cta.svg" alt="" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/75" />
      </div>
      <div className="container-page relative z-10 text-center">
        <Reveal effect="blur">
          <h2 className="mx-auto max-w-3xl text-4xl font-black sm:text-5xl">
            Ready To Transform <span className="text-gradient">Your Body?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-300">
            Join FitZone today and start your journey towards a stronger, healthier you.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/booking" className={buttonVariants({ size: "lg", className: "rounded-full" })}>
              Start Your Journey
            </Link>
            <Link
              href="/booking"
              className={`${buttonVariants({ variant: "outline", size: "lg" })} rounded-full border-white/30 text-white`}
            >
              Book a Session
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

