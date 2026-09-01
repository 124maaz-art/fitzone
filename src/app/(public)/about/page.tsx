import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Counter } from "@/components/ui/reveal";
import { Users, Dumbbell, HeartPulse, ShieldCheck, Sparkles, HandHeart, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about FitZone's story, mission and vision. Discover why we're the preferred fitness club for thousands of members.",
};

export default function AboutPage() {
  const why = [
    { icon: Users, title: "Expert Trainers", desc: "Internationally certified coaches with years of real-world experience." },
    { icon: Dumbbell, title: "Modern Equipment", desc: "Premium gear from leading fitness brands in optimal condition." },
    { icon: HeartPulse, title: "Flexible Programs", desc: "Tailored training plans for every fitness level and goal." },
    { icon: Sparkles, title: "Personalized Training", desc: "One-to-one coaching focused entirely on your progress." },
    { icon: ShieldCheck, title: "Clean Environment", desc: "Spotless, hygienic and well-maintained training spaces." },
    { icon: HandHeart, title: "Supportive Community", desc: "A motivating community that celebrates every milestone." },
  ];

  const stats = [
    { value: 5000, suffix: "+", label: "Members" },
    { value: 25, suffix: "+", label: "Trainers" },
    { value: 50, suffix: "+", label: "Programs" },
    { value: 10, suffix: "+", label: "Years" },
  ];

  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <img src="/images/about.svg" alt="" className="h-full w-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="container-page relative z-10 text-center">
          <SectionHeading
            title="About FitZone"
            description="A premium fitness facility built on passion, expertise and results."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <img src="/images/hero.svg" alt="FitZone training floor" className="h-[460px] w-full rounded-3xl border border-border object-cover" loading="lazy" />
          </Reveal>
          <Reveal delay={0.1}>
            <SectionHeading align="left" eyebrow="Our Story" title="How FitZone Began" />
            <div className="space-y-4 text-muted">
              <p>
                FitZone was founded in 2016 with a simple but powerful vision: to create a fitness
                club where world-class training, cutting-edge equipment and genuine community come
                together. What started as a single training floor has grown into one of the most
                trusted fitness destinations in the city.
              </p>
              <p>
                Today, over 5,000 members call FitZone their home. Our team of 25+ expert trainers
                has helped countless individuals lose weight, build muscle, improve performance and,
                most importantly, build confidence that lasts a lifetime.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-black/40 py-20">
        <div className="container-page grid gap-8 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-border bg-card p-8">
            <Globe className="mb-4 h-8 w-8 text-accent" />
            <h3 className="text-2xl font-bold">Our Mission</h3>
            <p className="mt-3 leading-relaxed text-muted">
              To empower every individual to achieve their health and fitness goals through expert
              coaching, premium facilities and a supportive community - making world-class fitness
              accessible to everyone.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-3xl border border-border bg-card p-8">
            <ShieldCheck className="mb-4 h-8 w-8 text-accent" />
            <h3 className="text-2xl font-bold">Our Vision</h3>
            <p className="mt-3 leading-relaxed text-muted">
              To be the region's most trusted and inspiring fitness brand - transforming lives,
              building stronger communities and setting the standard for premium wellness.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Why Choose Us" title="The FitZone Difference" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {why.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/40">
                  <w.icon className="mb-4 h-8 w-8 text-accent" />
                  <h3 className="text-lg font-bold">{w.title}</h3>
                  <p className="mt-2 text-sm text-muted">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-black/40 py-16">
        <div className="container-page grid grid-cols-2 gap-8 lg:grid-cols-4">
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
    </>
  );
}
