"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (typeof window === "undefined") {
    console.error("Global error:", error);
  } else {
    console.error("Global error:", error);
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <AlertTriangle className="mb-6 h-14 w-14 text-accent" />
      <h1 className="text-2xl font-black sm:text-3xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={() => reset()} className="mt-8 rounded-full">
        Try Again
      </Button>
    </div>
  );
}
