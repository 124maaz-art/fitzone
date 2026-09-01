import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, ThumbsUp, Share2, Camera, Play } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal } from "@/components/ui/reveal";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with FitZone. Visit our gym, call us, or send a message and we'll respond shortly.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  const info = [
    { icon: MapPin, title: "Address", line1: settings.address },
    { icon: Phone, title: "Phone", line1: settings.phone, href: `tel:${settings.phone}` },
    { icon: Mail, title: "Email", line1: settings.email, href: `mailto:${settings.email}` },
    { icon: Clock, title: "Opening Hours", line1: settings.hours },
  ];

  const social = [
    { icon: ThumbsUp, href: settings.facebook, label: "Facebook" },
    { icon: Share2, href: settings.twitter, label: "Twitter" },
    { icon: Camera, href: settings.instagram, label: "Instagram" },
    { icon: Play, href: settings.youtube, label: "YouTube" },
  ];

  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <img src="/images/cta.svg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="container-page relative z-10">
          <SectionHeading
            title="Contact Us"
            description="Have a question or ready to start? We'd love to hear from you."
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-4">
              {info.map((i) => (
                <div key={i.title} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <i.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{i.title}</h3>
                    {i.href ? (
                      <a href={i.href} className="text-sm text-muted hover:text-accent">{i.line1}</a>
                    ) : (
                      <p className="text-sm text-muted">{i.line1}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                {social.filter((s) => s.href).map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-bold">Send Us a Message</h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl border border-border">
            <iframe
              title="FitZone location map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-74.0060%2C40.7128%2C-73.9352%2C40.7614&layer=mapnik"
              className="h-[350px] w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
