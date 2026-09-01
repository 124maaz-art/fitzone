import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { Badge } from "@/components/ui/badge";

type Equipment = {
  slug: string;
  name: string;
  image?: string | null;
  description: string;
  category: { name: string };
};

export function EquipmentCard({ equipment }: { equipment: Equipment }) {
  return (
    <Link
      href={`/equipment/${equipment.slug}`}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-black/30"
    >
      <div className="relative h-52 overflow-hidden">
        <SmartImage
          src={equipment.image}
          alt={equipment.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-black/60 text-foreground">{equipment.category.name}</Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold transition-colors group-hover:text-accent">{equipment.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{equipment.description}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
          View Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
