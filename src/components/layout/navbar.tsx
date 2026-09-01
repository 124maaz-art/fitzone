"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/equipment", label: "Equipment" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Membership" },
  { href: "/trainers", label: "Trainers" },
  { href: "/programs", label: "Programs" },
  { href: "/gallery", label: "Gallery" },
  { href: "/transformations", label: "Transformations" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({
  gymName,
  logo,
}: {
  gymName: string;
  logo?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "border-b border-border bg-background/90 backdrop-blur-lg" : "bg-transparent"
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between lg:h-20" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2" aria-label="FitZone home">
          {logo ? (
            <SmartImage src={logo} alt="FitZone logo" width={120} height={40} className="h-8 w-auto" />
          ) : (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Dumbbell className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">{gymName}</span>
            </>
          )}
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "text-accent" : "text-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <Link href="/booking" className={buttonVariants({ className: "rounded-full" })}>
            Book Now
          </Link>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-lg lg:hidden">
          <div className="container-page flex flex-col py-4">
            {links.map((link) => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-3 text-sm font-medium",
                    active ? "text-accent bg-white/5" : "text-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-4">
              <Link href="/booking" className={buttonVariants({ className: "w-full rounded-full" })}>
                Book Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
