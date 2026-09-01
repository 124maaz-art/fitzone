import { SmartImage } from "@/components/ui/smart-image";

type Transformation = {
  id: string;
  memberName: string;
  beforeImage: string;
  afterImage: string;
  story: string;
  duration: string;
  goal: string;
  result: string;
};

export function TransformationCard({
  transformation,
  className,
}: {
  transformation: Transformation;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-border bg-card ${className ?? ""}`}>
      <div className="grid grid-cols-2">
        <div className="relative h-64">
          <SmartImage src={transformation.beforeImage} alt={`${transformation.memberName} before`} fill className="object-cover" sizes="50vw" />
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold uppercase">Before</span>
        </div>
        <div className="relative h-64">
          <SmartImage src={transformation.afterImage} alt={`${transformation.memberName} after`} fill className="object-cover" sizes="50vw" />
          <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase">After</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{transformation.memberName}</h3>
          <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">{transformation.duration}</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{transformation.story}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-xs text-muted">Goal</p>
            <p className="font-semibold">{transformation.goal}</p>
          </div>
          <div className="rounded-lg bg-white/5 p-3">
            <p className="text-xs text-muted">Result</p>
            <p className="font-semibold text-accent">{transformation.result}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
