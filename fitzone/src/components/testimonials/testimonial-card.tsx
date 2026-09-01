import { Star } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { formatDate } from "@/lib/utils";

type Testimonial = {
  name: string;
  image?: string | null;
  rating: number;
  review: string;
  date: Date | string;
};

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30">
      <div className="mb-3 flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < testimonial.rating ? "fill-accent text-accent" : "text-zinc-600"}`}
          />
        ))}
      </div>
      <p className="flex-1 text-sm leading-relaxed text-muted">"{testimonial.review}"</p>
      <div className="mt-5 flex items-center gap-3">
        <div className="h-11 w-11 overflow-hidden rounded-full">
          <SmartImage src={testimonial.image} alt={testimonial.name} width={44} height={44} className="h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold">{testimonial.name}</p>
          <p className="text-xs text-muted">{formatDate(testimonial.date)}</p>
        </div>
      </div>
    </div>
  );
}
