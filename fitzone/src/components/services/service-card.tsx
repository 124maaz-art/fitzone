import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { buttonVariants } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";

type Service = {
  slug: string;
  name: string;
  image?: string | null;
  description: string;
  duration: number;
  durationUnit: string;
  price: string | number | { toString(): string };
};

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
      <div className="relative h-48 overflow-hidden">
        <SmartImage
          src={service.image}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <span className="text-2xl font-extrabold text-accent">{formatMoney(service.price)}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold">{service.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{service.description}</p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted">
          <Clock className="h-4 w-4" />
          {service.duration} {service.durationUnit}
        </div>
        <Link
          href={`/booking?service=${service.slug}`}
          className={`${buttonVariants({ variant: "outline" })} mt-4 w-full`}
        >
          Book Now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
