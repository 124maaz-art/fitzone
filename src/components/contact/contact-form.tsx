"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { z } from "zod";
import { Input, Textarea, Label, FieldError } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { inquirySchema } from "@/lib/validations";
import { submitInquiry } from "@/lib/actions";

type InquiryValues = z.infer<typeof inquirySchema>;

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
  });

  async function onSubmit(values: InquiryValues) {
    setPending(true);
    const form = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v != null) form.set(k, String(v));
    });
    const res = await submitInquiry(form);
    setPending(false);
    if (res?.success) {
      toast.success(res.success);
      reset();
    } else if (res?.error) {
      toast.error(res.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>Name</Label>
          <Input id="name" placeholder="Your full name" {...register("name")} />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="email" required>Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          <FieldError message={errors.email?.message} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="+1 (555) 000-0000" {...register("phone")} />
          <FieldError message={errors.phone?.message} />
        </div>
        <div>
          <Label htmlFor="subject" required>Subject</Label>
          <Input id="subject" placeholder="How can we help?" {...register("subject")} />
          <FieldError message={errors.subject?.message} />
        </div>
      </div>
      <div>
        <Label htmlFor="message" required>Message</Label>
        <Textarea id="message" placeholder="Tell us more..." {...register("message")} />
        <FieldError message={errors.message?.message} />
      </div>
      <Button type="submit" size="lg" className="w-full rounded-full sm:w-auto" disabled={pending}>
        {pending ? (
          <>
            <Spinner className="h-4 w-4" /> Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
