import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const bookingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(7, "Valid phone number is required"),
  email: z.string().email("Invalid email address"),
  whatsapp: z.string().optional().nullable(),
  serviceId: z.string().optional().nullable(),
  packageId: z.string().optional().nullable(),
  trainerId: z.string().optional().nullable(),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  fitnessGoal: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const equipmentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  image: z.string().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().min(10, "Description is required"),
  features: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  targetMuscle: z.string().optional().nullable(),
  trainingType: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

export const serviceSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  image: z.string().optional().nullable(),
  description: z.string().min(10, "Description is required"),
  benefits: z.array(z.string()).default([]),
  duration: z.coerce.number().int().positive(),
  durationUnit: z.string().default("minutes"),
  price: z.coerce.number().nonnegative(),
  active: z.boolean().default(true),
});

export const packageSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  price: z.coerce.number().nonnegative(),
  duration: z.string().min(1, "Duration is required"),
  benefits: z.array(z.string()).default([]),
  description: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export const trainerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  image: z.string().optional().nullable(),
  bio: z.string().min(10, "Bio is required"),
  specializations: z.array(z.string()).default([]),
  experience: z.coerce.number().int().nonnegative(),
  certifications: z.array(z.string()).default([]),
  availability: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

export const programSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  description: z.string().min(10, "Description is required"),
  image: z.string().optional().nullable(),
  duration: z.string().min(1, "Duration is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  benefits: z.array(z.string()).default([]),
  active: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

export const gallerySchema = z.object({
  title: z.string().min(2, "Title is required"),
  image: z.string().min(1, "Image is required"),
  categoryId: z.string().min(1, "Category is required"),
  active: z.boolean().default(true),
});

export const transformationSchema = z.object({
  memberName: z.string().min(2, "Member name is required"),
  beforeImage: z.string().min(1, "Before image is required"),
  afterImage: z.string().min(1, "After image is required"),
  story: z.string().min(10, "Story is required"),
  duration: z.string().min(1, "Duration is required"),
  goal: z.string().min(1, "Goal is required"),
  result: z.string().min(1, "Result is required"),
  active: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  name: z.string().min(2, "Name is required"),
  image: z.string().optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5),
  review: z.string().min(10, "Review is required"),
  active: z.boolean().default(true),
});
