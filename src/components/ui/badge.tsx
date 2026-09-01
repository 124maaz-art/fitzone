import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-green-500/15 text-green-400 border-green-500/30",
  COMPLETED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  CANCELLED: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  REJECTED: "bg-red-500/15 text-red-400 border-red-500/30",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status] ?? "bg-white/5 text-muted border-border"
      )}
    >
      {status}
    </span>
  );
}

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}
