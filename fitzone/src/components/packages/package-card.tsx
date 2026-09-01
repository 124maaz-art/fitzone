import Link from "next/link";
import { Check, Crown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatMoney } from "@/lib/utils";

type MembershipPackage = {
  slug: string;
  name: string;
  price: string | number | { toString(): string };
  duration: string;
  benefits: string[];
  featured: boolean;
};

export function PackageCard({ pkg }: { pkg: MembershipPackage }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl border p-8 transition-all hover:-translate-y-1 hover:shadow-2xl",
        pkg.featured
          ? "border-accent bg-gradient-to-b from-accent/15 to-transparent shadow-xl shadow-accent/10"
          : "border-border bg-card hover:shadow-black/30"
      )}
    >
      {pkg.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
          <Crown className="mr-1 inline h-3 w-3" /> Recommended
        </span>
      )}
      <h3 className="text-lg font-bold uppercase tracking-wide">{pkg.name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-accent">{formatMoney(pkg.price)}</span>
        <span className="text-sm text-muted">/ {pkg.duration}</span>
      </div>
      <ul className="mt-6 flex-1 space-y-3">
        {pkg.benefits.map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Check className="h-3.5 w-3.5" />
            </span>
            {b}
          </li>
        ))}
      </ul>
      <Link
        href={`/booking?package=${pkg.slug}`}
        className={cn(
          buttonVariants({ variant: pkg.featured ? "default" : "outline" }),
          "mt-8 w-full rounded-full"
        )}
      >
        Choose Package
      </Link>
    </div>
  );
}
