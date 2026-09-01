import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <Dumbbell className="mb-6 h-16 w-16 text-accent" />
      <p className="text-6xl font-black text-accent sm:text-8xl">404</p>
      <h1 className="mt-4 text-2xl font-black sm:text-3xl">Looks like you missed your workout.</h1>
      <p className="mt-3 max-w-md text-muted">
        The page you're looking for doesn't exist or has been moved. Let's get you back into training.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link href="/" className={buttonVariants({ size: "lg", className: "rounded-full" })}>
          Go Home
        </Link>
        <Link
          href="/programs"
          className={`${buttonVariants({ variant: "outline", size: "lg" })} rounded-full`}
        >
          Explore Programs
        </Link>
      </div>
    </div>
  );
}
