import Link from "next/link";
import { Award, Dumbbell } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { buttonVariants } from "@/components/ui/button";

type Trainer = {
  slug: string;
  name: string;
  image?: string | null;
  specializations: string[];
  experience: number;
  certifications: string[];
};

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
      <div className="relative h-64 overflow-hidden">
        <SmartImage
          src={trainer.image}
          alt={trainer.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-lg font-bold">{trainer.name}</h3>
          <p className="text-sm text-accent">{trainer.specializations.join(" • ")}</p>
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Dumbbell className="h-4 w-4 text-accent" />
          {trainer.experience}+ years experience
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Award className="h-4 w-4 text-accent" />
          {trainer.certifications.length} certifications
        </div>
        <Link
          href={`/trainers/${trainer.slug}`}
          className={buttonVariants({ variant: "outline", className: "w-full" })}
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
