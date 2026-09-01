import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialCard } from "@/components/testimonials/testimonial-card";
import { Reveal } from "@/components/ui/reveal";
import { getTestimonials } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Read genuine reviews from FitZone members about their fitness journeys, our trainers and our programs.",
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <img src="/images/hero.svg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="container-page relative z-10">
          <SectionHeading
            title="Member Testimonials"
            description="Hear from the people who train at FitZone every day."
          />
        </div>
      </section>
      <section className="py-16">
        <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.04}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
