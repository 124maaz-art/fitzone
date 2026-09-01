"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { slugify } from "./utils";
import { isAdmin } from "./auth";
import {
  equipmentSchema,
  serviceSchema,
  packageSchema,
  trainerSchema,
  programSchema,
  categorySchema,
  gallerySchema,
  transformationSchema,
  testimonialSchema,
} from "./validations";

async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) throw new Error("UNAUTHORIZED");
}

export async function upsertCategory(input: any, id?: string) {
  await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { error: "Validation failed. Please check your input." };
  const data = {
    name: parsed.data.name,
    slug: slugify(parsed.data.slug || parsed.data.name),
    description: parsed.data.description ?? null,
    active: parsed.data.active,
  };
  try {
    if (id) await prisma.equipmentCategory.update({ where: { id }, data });
    else await prisma.equipmentCategory.create({ data });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (e: any) {
    if (e?.code === "P2002") return { error: "A category with this slug already exists." };
    return { error: "Unable to save category." };
  }
}

export async function deleteCategory(id: string, force = false) {
  await requireAdmin();
  try {
    if (force) {
      await prisma.equipment.updateMany({ where: { categoryId: id }, data: { active: false } });
      await prisma.equipmentCategory.delete({ where: { id } });
    } else {
      const count = await prisma.equipment.count({ where: { categoryId: id } });
      if (count > 0) return { error: "This category has equipment. Deactivate the equipment first or force delete." };
      await prisma.equipmentCategory.delete({ where: { id } });
    }
    revalidatePath("/admin/categories");
    return { success: true };
  } catch {
    return { error: "Unable to delete category." };
  }
}

export async function upsertEquipment(input: any, id?: string) {
  await requireAdmin();
  const parsed = equipmentSchema.safeParse(input);
  if (!parsed.success) return { error: "Validation failed. Please check your input." };
  const data = {
    name: parsed.data.name,
    slug: slugify(parsed.data.slug || parsed.data.name),
    image: parsed.data.image ?? null,
    categoryId: parsed.data.categoryId,
    description: parsed.data.description,
    features: parsed.data.features,
    benefits: parsed.data.benefits,
    targetMuscle: parsed.data.targetMuscle ?? null,
    trainingType: parsed.data.trainingType ?? null,
    active: parsed.data.active,
  };
  try {
    if (id) await prisma.equipment.update({ where: { id }, data });
    else await prisma.equipment.create({ data });
    revalidatePath("/admin/equipment");
    return { success: true };
  } catch (e: any) {
    if (e?.code === "P2002") return { error: "Equipment with this slug already exists." };
    return { error: "Unable to save equipment." };
  }
}

export async function deleteEquipment(id: string) {
  await requireAdmin();
  try {
    await prisma.equipment.delete({ where: { id } });
    revalidatePath("/admin/equipment");
    return { success: true };
  } catch {
    return { error: "Unable to delete equipment." };
  }
}

export async function upsertService(input: any, id?: string) {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(input);
  if (!parsed.success) return { error: "Validation failed. Please check your input." };
  const data = {
    name: parsed.data.name,
    slug: slugify(parsed.data.slug || parsed.data.name),
    image: parsed.data.image ?? null,
    description: parsed.data.description,
    benefits: parsed.data.benefits,
    duration: parsed.data.duration,
    durationUnit: parsed.data.durationUnit,
    price: parsed.data.price,
    active: parsed.data.active,
  };
  try {
    if (id) await prisma.service.update({ where: { id }, data });
    else await prisma.service.create({ data });
    revalidatePath("/admin/services");
    return { success: true };
  } catch (e: any) {
    if (e?.code === "P2002") return { error: "Service with this slug already exists." };
    return { error: "Unable to save service." };
  }
}

export async function deleteService(id: string) {
  await requireAdmin();
  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath("/admin/services");
    return { success: true };
  } catch {
    return { error: "Unable to delete service." };
  }
}

export async function upsertPackage(input: any, id?: string) {
  await requireAdmin();
  const parsed = packageSchema.safeParse(input);
  if (!parsed.success) return { error: "Validation failed. Please check your input." };
  const data = {
    name: parsed.data.name,
    slug: slugify(parsed.data.slug || parsed.data.name),
    price: parsed.data.price,
    duration: parsed.data.duration,
    benefits: parsed.data.benefits,
    description: parsed.data.description ?? null,
    featured: parsed.data.featured,
    active: parsed.data.active,
  };
  try {
    if (id) await prisma.membershipPackage.update({ where: { id }, data });
    else await prisma.membershipPackage.create({ data });
    revalidatePath("/admin/packages");
    return { success: true };
  } catch (e: any) {
    if (e?.code === "P2002") return { error: "Package with this slug already exists." };
    return { error: "Unable to save package." };
  }
}

export async function deletePackage(id: string) {
  await requireAdmin();
  try {
    await prisma.membershipPackage.delete({ where: { id } });
    revalidatePath("/admin/packages");
    return { success: true };
  } catch {
    return { error: "Unable to delete package." };
  }
}

export async function upsertTrainer(input: any, id?: string) {
  await requireAdmin();
  const parsed = trainerSchema.safeParse(input);
  if (!parsed.success) return { error: "Validation failed. Please check your input." };
  const data = {
    name: parsed.data.name,
    slug: slugify(parsed.data.slug || parsed.data.name),
    image: parsed.data.image ?? null,
    bio: parsed.data.bio,
    specializations: parsed.data.specializations,
    experience: parsed.data.experience,
    certifications: parsed.data.certifications,
    availability: parsed.data.availability ?? null,
    active: parsed.data.active,
  };
  try {
    if (id) await prisma.trainer.update({ where: { id }, data });
    else await prisma.trainer.create({ data });
    revalidatePath("/admin/trainers");
    return { success: true };
  } catch (e: any) {
    if (e?.code === "P2002") return { error: "Trainer with this slug already exists." };
    return { error: "Unable to save trainer." };
  }
}

export async function deleteTrainer(id: string) {
  await requireAdmin();
  try {
    await prisma.trainer.delete({ where: { id } });
    revalidatePath("/admin/trainers");
    return { success: true };
  } catch {
    return { error: "Unable to delete trainer." };
  }
}

export async function saveTrainerAvailability(trainerId: string, slots: { day: number; startTime: string; endTime: string; available: boolean }[]) {
  await requireAdmin();
  try {
    await prisma.$transaction(async (tx) => {
      for (const slot of slots) {
        await tx.trainerAvailability.upsert({
          where: { trainerId_day: { trainerId, day: slot.day } },
          update: { available: slot.available, startTime: slot.startTime, endTime: slot.endTime },
          create: { trainerId, day: slot.day, available: slot.available, startTime: slot.startTime, endTime: slot.endTime },
        });
      }
    });
    revalidatePath("/admin/trainers");
    return { success: true };
  } catch {
    return { error: "Unable to save availability." };
  }
}

export async function upsertProgram(input: any, id?: string) {
  await requireAdmin();
  const parsed = programSchema.safeParse(input);
  if (!parsed.success) return { error: "Validation failed. Please check your input." };
  const data = {
    name: parsed.data.name,
    slug: slugify(parsed.data.slug || parsed.data.name),
    description: parsed.data.description,
    image: parsed.data.image ?? null,
    duration: parsed.data.duration,
    difficulty: parsed.data.difficulty,
    benefits: parsed.data.benefits,
    active: parsed.data.active,
  };
  try {
    if (id) await prisma.program.update({ where: { id }, data });
    else await prisma.program.create({ data });
    revalidatePath("/admin/programs");
    return { success: true };
  } catch (e: any) {
    if (e?.code === "P2002") return { error: "Program with this slug already exists." };
    return { error: "Unable to save program." };
  }
}

export async function deleteProgram(id: string) {
  await requireAdmin();
  try {
    await prisma.program.delete({ where: { id } });
    revalidatePath("/admin/programs");
    return { success: true };
  } catch {
    return { error: "Unable to delete program." };
  }
}

export async function upsertGallery(input: any, id?: string) {
  await requireAdmin();
  const parsed = gallerySchema.safeParse(input);
  if (!parsed.success) return { error: "Validation failed. Please check your input." };
  const data = {
    title: parsed.data.title,
    image: parsed.data.image,
    categoryId: parsed.data.categoryId,
    active: parsed.data.active,
  };
  try {
    if (id) await prisma.galleryItem.update({ where: { id }, data });
    else await prisma.galleryItem.create({ data });
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (e: any) {
    if (e?.code === "P2002") return { error: "A gallery item with this name/slug already exists." };
    console.error(e);
    return { error: "Unable to save gallery item." };
  }
}

export async function deleteGallery(id: string) {
  await requireAdmin();
  try {
    await prisma.galleryItem.delete({ where: { id } });
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch {
    return { error: "Unable to delete gallery item." };
  }
}

export async function upsertTransformation(input: any, id?: string) {
  await requireAdmin();
  const parsed = transformationSchema.safeParse(input);
  if (!parsed.success) return { error: "Validation failed. Please check your input." };
  const data = {
    memberName: parsed.data.memberName,
    beforeImage: parsed.data.beforeImage,
    afterImage: parsed.data.afterImage,
    story: parsed.data.story,
    duration: parsed.data.duration,
    goal: parsed.data.goal,
    result: parsed.data.result,
    active: parsed.data.active,
  };
  try {
    if (id) await prisma.transformation.update({ where: { id }, data });
    else await prisma.transformation.create({ data });
    revalidatePath("/admin/transformations");
    return { success: true };
  } catch {
    return { error: "Unable to save transformation." };
  }
}

export async function deleteTransformation(id: string) {
  await requireAdmin();
  try {
    await prisma.transformation.delete({ where: { id } });
    revalidatePath("/admin/transformations");
    return { success: true };
  } catch {
    return { error: "Unable to delete transformation." };
  }
}

export async function upsertTestimonial(input: any, id?: string) {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { error: "Validation failed. Please check your input." };
  const data = {
    name: parsed.data.name,
    image: parsed.data.image ?? null,
    rating: parsed.data.rating,
    review: parsed.data.review,
    active: parsed.data.active,
  };
  try {
    if (id) await prisma.testimonial.update({ where: { id }, data });
    else await prisma.testimonial.create({ data });
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch {
    return { error: "Unable to save testimonial." };
  }
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch {
    return { error: "Unable to delete testimonial." };
  }
}

export async function updateBookingStatus(id: string, status: string) {
  await requireAdmin();
  const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "REJECTED"];
  if (!validStatuses.includes(status)) {
    return { error: "Invalid booking status." };
  }
  try {
    await prisma.booking.update({ where: { id }, data: { status: status as any } });
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch {
    return { error: "Unable to update booking status." };
  }
}

export async function deleteBooking(id: string) {
  await requireAdmin();
  try {
    await prisma.booking.delete({ where: { id } });
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch {
    return { error: "Unable to delete booking." };
  }
}

export async function toggleInquiryRead(id: string, status: boolean) {
  await requireAdmin();
  try {
    await prisma.inquiry.update({ where: { id }, data: { status } });
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch {
    return { error: "Unable to update inquiry." };
  }
}

export async function deleteInquiry(id: string) {
  await requireAdmin();
  try {
    await prisma.inquiry.delete({ where: { id } });
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch {
    return { error: "Unable to delete inquiry." };
  }
}

export async function saveSettings(values: Record<string, string>) {
  await requireAdmin();
  try {
    for (const [key, value] of Object.entries(values)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    revalidatePath("/admin/settings");
    return { success: true };
  } catch {
    return { error: "Unable to save settings." };
  }
}
