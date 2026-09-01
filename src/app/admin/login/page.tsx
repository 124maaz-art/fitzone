"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { Dumbbell, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Label, FieldError } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { loginSchema } from "@/lib/validations";
import { adminLogin } from "@/lib/actions";

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setPending(true);
    const form = new FormData();
    form.set("email", values.email);
    form.set("password", values.password);
    form.set("callbackUrl", callbackUrl);
    try {
      const res = await adminLogin(form);
      setPending(false);
      if (res?.error) {
        toast.error(res.error);
      } else if (res?.success) {
        router.push(callbackUrl);
      }
    } catch {
      // NextAuth performs a redirect on success; in that case the call throws.
      setPending(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0">
        <img src="/images/hero.svg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/80" />
      </div>
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card/95 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Dumbbell className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black">Admin Login</h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage FitZone</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter the email" autoComplete="email" {...register("email")} />
            <FieldError message={errors.email?.message} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" {...register("password")} />
            <FieldError message={errors.password?.message} />
          </div>
          <Button type="submit" className="w-full rounded-full" size="lg" disabled={pending}>
            {pending ? <><Spinner className="h-4 w-4" /> Signing in...</> : "Sign In"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
