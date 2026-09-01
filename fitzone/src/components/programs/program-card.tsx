import Link from "next/link";
import { Clock, TrendingUp, ArrowRight } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Program = {
  slug: string;
  name: string;
  image?: string | null;
  description: string;
  duration: string;
  difficulty: string;
  benefits: string[];
};

export function ProgramCard({ program }: { program: Program }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
      <div className="relative h-44 overflow-hidden">
        <SmartImage
          src={program.image}
          alt={program.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <Badge>{program.difficulty}</Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold">{program.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{program.description}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {program.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" /> {program.difficulty}
          </span>
        </div>
        <Link
          href={`/booking`}
          className={buttonVariants({ variant: "ghost", className: "mt-4 w-full border border-border" })}
        >
          Start Program <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
