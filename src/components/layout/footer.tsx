import Link from "next/link";
import { Dumbbell, MapPin, Phone, Mail, Clock, ThumbsUp, Share2, Camera, Play } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";

const serviceLinks = [
  { href: "/services", label: "Personal Training" },
  { href: "/services", label: "Group Classes" },
  { href: "/packages", label: "Membership Plans" },
  { href: "/trainers", label: "Our Trainers" },
  { href: "/programs", label: "Programs" },
  { href: "/booking", label: "Book a Session" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/equipment", label: "Equipment" },
  { href: "/gallery", label: "Gallery" },
  { href: "/transformations", label: "Transformations" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export function Footer({ settings }: { settings: SiteSettings }) {
  const social = [
    { href: settings.facebook, icon: ThumbsUp, label: "Facebook" },
    { href: settings.twitter, icon: Share2, label: "Twitter" },
    { href: settings.instagram, icon: Camera, label: "Instagram" },
    { href: settings.youtube, icon: Play, label: "YouTube" },
  ];

  return (
    <footer className="border-t border-border bg-black">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Dumbbell className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold">{settings.gymName}</span>
          </div>
          <p className="text-sm leading-relaxed text-muted">{settings.footerContent}</p>
          <div className="flex gap-3">
            {social.filter((s) => s.href).map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">Services</h3>
          <ul className="space-y-2.5">
            {serviceLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-muted transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">Company</h3>
          <ul className="space-y-2.5">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-sm text-muted transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted">Contact</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-accent" />
              <span>{settings.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <a href={`tel:${settings.phone}`} className="hover:text-accent">{settings.phone}</a>
            </li>
            <li className="flex gap-3">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a href={`mailto:${settings.email}`} className="hover:text-accent">{settings.email}</a>
            </li>
            <li className="flex gap-3">
              <Clock className="h-4 w-4 shrink-0 text-accent" />
              <span>{settings.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {settings.gymName}. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-muted">
            <Link href="/privacy-policy" className="hover:text-accent">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-accent">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
