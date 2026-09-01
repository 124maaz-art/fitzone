"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Check, ChevronLeft, ChevronRight, User, CreditCard, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label, Select, FieldError } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { formatMoney, formatDate } from "@/lib/utils";
import { bookingSchema } from "@/lib/validations";
import { createBooking, getBookedSlots } from "@/lib/actions";

type Service = { id: string; slug: string; name: string; price: string | number | { toString(): string }; duration: number };
type Package = { id: string; slug: string; name: string; price: string | number | { toString(): string }; duration: string };
type Trainer = { id: string; slug: string; name: string; specializations: string[] };

type BookingValues = z.infer<typeof bookingSchema>;

const SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM",
];

const steps = ["Select", "Date & Time", "Details", "Review"];

export function BookingForm({
  services,
  packages,
  trainers,
  initialService,
  initialPackage,
  initialTrainer,
}: {
  services: Service[];
  packages: Package[];
  trainers: Trainer[];
  initialService?: string;
  initialPackage?: string;
  initialTrainer?: string;
}) {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState<string>("");
  const [packageId, setPackageId] = useState<string>("");
  const [trainerId, setTrainerId] = useState<string>(initialTrainer ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const match = (arr: any[], slug?: string) => (slug ? arr.find((a) => a.slug === slug)?.id ?? "" : "");
    setServiceId(match(services, initialService));
    setPackageId(match(packages, initialPackage));
    setTrainerId(match(trainers, initialTrainer) ?? initialTrainer ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!date) {
      setBookedSlots([]);
      return;
    }
    let cancelled = false;
    getBookedSlots(trainerId || null, date).then((res) => {
      if (!cancelled) setBookedSlots(res.slots);
    });
    return () => {
      cancelled = true;
    };
  }, [date, trainerId]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      trainerId: initialTrainer ?? "",
      time: "",
      date: "",
      serviceId: "",
      packageId: "",
    },
  });

  useEffect(() => {
    setValue("date", date);
  }, [date, setValue]);
  useEffect(() => {
    setValue("time", time);
  }, [time, setValue]);
  useEffect(() => {
    setValue("trainerId", trainerId);
  }, [trainerId, setValue]);
  useEffect(() => {
    setValue("serviceId", serviceId);
  }, [serviceId, setValue]);
  useEffect(() => {
    setValue("packageId", packageId);
  }, [packageId, setValue]);

  const selectedService = services.find((s) => s.id === serviceId);
  const selectedPackage = packages.find((p) => p.id === packageId);
  const selectedTrainer = trainers.find((t) => t.id === trainerId);

  const canNextStep1 = serviceId || packageId;
  const canNextStep2 = date && time;

  const minDate = new Date().toLocaleDateString("en-CA");

  async function onConfirmed(values: BookingValues) {
    setSubmitting(true);
    const form = new FormData();
    Object.entries(values).forEach(([k, v]) => form.set(k, v ?? ""));
    form.set("serviceId", serviceId || "");
    form.set("packageId", packageId || "");
    form.set("trainerId", trainerId || "");
    form.set("date", date);
    form.set("time", time);

    const res = await createBooking(form);
    setSubmitting(false);
    if (res?.booking) {
      setResult(res.booking);
      toast.success("Your booking has been submitted successfully!");
      return;
    }
    if (res?.error) toast.error(res.error);
  }

  if (result) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-green-500/30 bg-green-500/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
          <Check className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black text-green-400">Booking Submitted Successfully!</h2>
        <p className="mt-2 text-sm text-muted">We've received your booking request. Here are your details:</p>
        <div className="mx-auto mt-6 max-w-md space-y-3 rounded-2xl border border-border bg-card p-6 text-left">
          <div className="flex justify-between border-b border-border pb-2 text-sm">
            <span className="text-muted">Booking Reference</span>
            <span className="font-bold text-accent">{result.reference}</span>
          </div>
          <div className="flex justify-between text-sm"><span className="text-muted">Name</span><span className="font-semibold">{result.fullName}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted">Service</span><span className="font-semibold">{result.service?.name ?? "-"}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted">Package</span><span className="font-semibold">{result.package?.name ?? "-"}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted">Trainer</span><span className="font-semibold">{result.trainer?.name ?? "Any trainer"}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted">Date</span><span className="font-semibold">{formatDate(result.date)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted">Time</span><span className="font-semibold">{result.time}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted">Status</span><span className="font-semibold text-yellow-400">{result.status}</span></div>
        </div>
        <Button className="mt-6" onClick={() => { setResult(null); reset(); setStep(0); setServiceId(""); setPackageId(""); setTrainerId(""); setDate(""); setTime(""); }}>
          Make Another Booking
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <ol className="mb-8 flex items-center justify-between" aria-label="Booking progress">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold transition-colors ${i < step ? "border-green-500 bg-green-500 text-white" : i === step ? "border-accent bg-accent text-white" : "border-border text-muted"}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`mt-1.5 hidden text-xs sm:block ${i === step ? "text-accent" : "text-muted"}`}>{label}</span>
            </div>
            {i < steps.length - 1 && <div className={`mx-2 h-px flex-1 ${i < step ? "bg-green-500" : "bg-border"}`} />}
          </li>
        ))}
      </ol>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        {step === 0 && (
          <div>
            <h2 className="mb-2 text-xl font-bold">What would you like to book?</h2>
            <p className="mb-6 text-sm text-muted">Select a service or a membership package.</p>

            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent">
              <CreditCard className="h-4 w-4" /> Services
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setServiceId(s.id); setPackageId(""); }}
                  className={`rounded-xl border p-4 text-left transition-all ${serviceId === s.id ? "border-accent bg-accent/10" : "border-border hover:border-accent/40"}`}
                >
                  <p className="font-semibold">{s.name}</p>
                  <p className="mt-1 text-sm text-muted">{formatMoney(s.price)} • {s.duration} min</p>
                </button>
              ))}
            </div>

            <h3 className="mb-3 mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent">
              <User className="h-4 w-4" /> Membership Packages
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {packages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setPackageId(p.id); setServiceId(""); }}
                  className={`rounded-xl border p-4 text-left transition-all ${packageId === p.id ? "border-accent bg-accent/10" : "border-border hover:border-accent/40"}`}
                >
                  <p className="font-semibold">{p.name}</p>
                  <p className="mt-1 text-sm text-muted">{formatMoney(p.price)} / {p.duration}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="mb-2 text-xl font-bold">Choose Date, Time & Trainer</h2>
            <p className="mb-6 text-sm text-muted">Select your preferred trainer, date and an available time slot.</p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="booking-trainer">Preferred Trainer (optional)</Label>
                <Select id="booking-trainer" value={trainerId} onChange={(e) => setTrainerId(e.target.value)}>
                  <option value="">Any trainer</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="booking-date" required>Date</Label>
                <Input id="booking-date" type="date" min={minDate} value={date} onChange={(e) => { setDate(e.target.value); setTime(""); }} />
              </div>
            </div>
            <div className="mt-6">
              <Label required>Available Time Slots</Label>
              {!date ? (
                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
                  First select a date to see available slots.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {SLOTS.map((slot) => {
                    const booked = bookedSlots.includes(slot);
                    const selected = time === slot;
                    return (
                      <button
                        key={slot}
                        disabled={booked}
                        onClick={() => setTime(slot)}
                        className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed ${selected ? "border-accent bg-accent text-white" : booked ? "border-border bg-white/5 text-muted line-through opacity-50" : "border-border hover:border-accent/50"}`}
                      >
                        {booked ? "Booked" : slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-2 text-xl font-bold">Your Details</h2>
            <p className="mb-6 text-sm text-muted">Fill in your contact information to confirm the booking.</p>
            <form id="booking-details" onSubmit={handleSubmit(onConfirmed)} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fullName" required>Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" {...register("fullName")} />
                  <FieldError message={errors.fullName?.message} />
                </div>
                <div>
                  <Label htmlFor="phone" required>Phone Number</Label>
                  <Input id="phone" placeholder="+1 (555) 000-0000" {...register("phone")} />
                  <FieldError message={errors.phone?.message} />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email" required>Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                  <FieldError message={errors.email?.message} />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input id="whatsapp" placeholder="+1 (555) 000-0000" {...register("whatsapp")} />
                </div>
              </div>
              <div>
                <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                <Select id="fitnessGoal" {...register("fitnessGoal")}>
                  <option value="">Select your goal (optional)</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Building">Muscle Building</option>
                  <option value="Strength & Conditioning">Strength & Conditioning</option>
                  <option value="General Fitness">General Fitness</option>
                  <option value="Flexibility & Mobility">Flexibility & Mobility</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" placeholder="Anything we should know?" {...register("notes")} />
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="mb-2 text-xl font-bold">Review Your Booking</h2>
            <p className="mb-6 text-sm text-muted">Please review your details before submitting.</p>
            <div className="space-y-3 rounded-2xl border border-border bg-black/20 p-6">
              <div className="flex justify-between border-b border-border pb-2 text-sm"><span className="text-muted">Service</span><span className="font-semibold">{selectedService?.name ?? "-"}</span></div>
              <div className="flex justify-between border-b border-border pb-2 text-sm"><span className="text-muted">Package</span><span className="font-semibold">{selectedPackage?.name ?? "-"}</span></div>
              <div className="flex justify-between border-b border-border pb-2 text-sm"><span className="text-muted">Trainer</span><span className="font-semibold">{selectedTrainer?.name ?? "Any trainer"}</span></div>
              <div className="flex justify-between border-b border-border pb-2 text-sm"><span className="text-muted">Date</span><span className="font-semibold">{formatDate(date)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted">Time</span><span className="font-semibold">{time}</span></div>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted"><MapPin className="h-4 w-4" /> You'll receive a confirmation with your booking reference.</p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={(step === 0 && !canNextStep1) || (step === 1 && !canNextStep2)}
            >
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit(onConfirmed)}
              disabled={submitting}
            >
              {submitting ? <><Spinner className="h-4 w-4" /> Submitting...</> : "Confirm Booking"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
