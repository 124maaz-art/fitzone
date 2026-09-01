"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { inquirySchema, bookingSchema, loginSchema } from "./validations";
import { signIn } from "./auth";
import { generateReference } from "./utils";

const BOOKING_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM",
];

export async function submitInquiry(formData: FormData) {
  const parsed = inquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") ?? undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: "Please check your details and try again." };
  }

  try {
    await prisma.inquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone ?? null,
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
    });
    return { success: "Your inquiry has been received. We'll get back to you soon!" };
  } catch (e) {
    console.error(e);
    return { error: "Unable to submit your inquiry. Please try again." };
  }
}

export async function createBooking(formData: FormData) {
  const parsed = bookingSchema.safeParse({
    fullName: formData.get("fullName") ?? undefined,
    phone: formData.get("phone") ?? undefined,
    email: formData.get("email") ?? undefined,
    whatsapp: formData.get("whatsapp") ?? undefined,
    serviceId: formData.get("serviceId") ?? undefined,
    packageId: formData.get("packageId") ?? undefined,
    trainerId: formData.get("trainerId") ?? undefined,
    date: formData.get("date") ?? undefined,
    time: formData.get("time") ?? undefined,
    fitnessGoal: formData.get("fitnessGoal") ?? undefined,
    notes: formData.get("notes") ?? undefined,
  });

  if (!parsed.success) {
    return { error: "Please complete all required fields correctly." };
  }

  const data = parsed.data;

  if (!data.serviceId && !data.packageId) {
    return { error: "Please select a service or package." };
  }

  const date = new Date(`${data.date}T00:00:00`);
  if (isNaN(date.getTime())) {
    return { error: "Please select a valid date." };
  }

  if (!BOOKING_SLOTS.includes(data.time)) {
    return { error: "Please select a valid time slot." };
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      if (data.trainerId) {
        const existing = await tx.booking.findFirst({
          where: {
            trainerId: data.trainerId,
            date: date,
            time: data.time,
            status: { in: ["PENDING", "CONFIRMED"] },
          },
        });
        if (existing) {
          throw new Error("SLOT_TAKEN");
        }
      }

      let reference = generateReference();
      let dup = await tx.booking.findUnique({ where: { reference } });
      while (dup) {
        reference = generateReference();
        dup = await tx.booking.findUnique({ where: { reference } });
      }

      return tx.booking.create({
        data: {
          reference,
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          whatsapp: data.whatsapp ?? null,
          serviceId: data.serviceId || null,
          packageId: data.packageId || null,
          trainerId: data.trainerId || null,
          date,
          time: data.time,
          fitnessGoal: data.fitnessGoal ?? null,
          notes: data.notes ?? null,
        },
        include: { service: true, package: true, trainer: true },
      });
    });

    revalidatePath("/admin/bookings");
    return {
      success: "Booking submitted successfully!",
      booking: {
        ...booking,
        service: booking.service ? { ...booking.service, price: Number(booking.service.price) } : null,
        package: booking.package ? { ...booking.package, price: Number(booking.package.price) } : null,
      },
    };
  } catch (e: any) {
    if (e?.message === "SLOT_TAKEN") {
      return { error: "This time slot is no longer available. Please choose another time." };
    }
    console.error(e);
    return { error: "Unable to create booking. Please try again." };
  }
}

export async function adminLogin(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }

  const rawCallback = String(formData.get("callbackUrl") ?? "");
  const callbackUrl =
    rawCallback.startsWith("/admin") ? rawCallback : "/admin/dashboard";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    });
    return { success: "Logged in." };
  } catch (e: any) {
    // On success NextAuth performs a redirect via NEXT_REDIRECT which must propagate.
    const digest = typeof e?.digest === "string" ? e.digest : "";
    if (digest.startsWith("NEXT_REDIRECT") || e?.code === "NEXT_REDIRECT") {
      throw e;
    }
    if (e?.type === "CredentialsSignin" || (e?.cause?.err as any)?.name === "CredentialsSignin") {
      return { error: "Invalid email or password." };
    }
    if (e?.code === "P1001" || e?.code === "P1002" || /Can't reach database/.test(e?.message ?? "")) {
      return { error: "Database is unavailable. Please check that the database is running." };
    }
    console.error(e);
    return { error: "Unable to sign in. Please try again." };
  }
}

export async function getBookedSlots(trainerId: string | null, date: string) {
  const d = new Date(`${date}T00:00:00`);
  if (isNaN(d.getTime())) return { slots: [] as string[] };
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        date: d,
        ...(trainerId ? { trainerId } : {}),
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { time: true },
    });
    return { slots: bookings.map((b) => b.time) };
  } catch (e) {
    console.error(e);
    return { slots: [] as string[] };
  }
}


