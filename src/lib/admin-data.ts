import { prisma } from "./prisma";
import { formatMoney } from "./utils";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    // DB unavailable (e.g. no Postgres in local dev) -> return empty list.
    console.error("Database query failed, using fallback:", e);
    return fallback;
  }
}

export function getAdminBookings() {
  return safe(
    async () =>
      (await prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        include: { service: true, package: true, trainer: true },
      })).map((b) => ({
        ...b,
        service: b.service ? { ...b.service, price: Number(b.service.price) } : null,
        package: b.package ? { ...b.package, price: Number(b.package.price) } : null,
        date: b.date ? new Date(b.date).toISOString() : ("" as string),
        createdAt: b.createdAt ? new Date(b.createdAt).toISOString() : ("" as string),
      })),
    []
  );
}

export function getAdminEquipment() {
  return safe(
    () =>
      prisma.equipment.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
    []
  );
}

export function getAdminCategories() {
  return safe(
    async () =>
      (await prisma.equipmentCategory.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { equipment: true } } },
      })).map((c) => ({
        ...c,
        _extra: `${c._count?.equipment ?? "-"} equipment`,
      })),
    []
  );
}

export function getAdminServices() {
  return safe(
    async () =>
      (await prisma.service.findMany({ orderBy: { createdAt: "desc" } })).map((s) => ({
        ...s,
        price: Number(s.price),
        _extra: `${formatMoney(s.price)} · ${s.duration} ${s.durationUnit}`,
      })),
    []
  );
}

export function getAdminPackages() {
  return safe(
    async () =>
      (await prisma.membershipPackage.findMany({ orderBy: { createdAt: "desc" } })).map((p) => ({
        ...p,
        price: Number(p.price),
        _extra: `${formatMoney(p.price)} / ${p.duration}${p.featured ? " ★" : ""}`,
      })),
    []
  );
}

export function getAdminTrainers() {
  return safe(
    () =>
      prisma.trainer.findMany({
        orderBy: { createdAt: "desc" },
        include: { availabilities: true },
      }),
    []
  );
}

export function getAdminPrograms() {
  return safe(
    async () =>
      (await prisma.program.findMany({ orderBy: { createdAt: "desc" } })).map((p) => ({
        ...p,
        _extra: `${p.difficulty} · ${p.duration}`,
      })),
    []
  );
}

export function getAdminGallery() {
  return safe(
    async () => {
      const [categories, items] = await Promise.all([
        prisma.galleryCategory.findMany({ orderBy: { name: "asc" } }),
        prisma.galleryItem.findMany({
          orderBy: { createdAt: "desc" },
          include: { category: true },
        }),
      ]);
      return {
        categories,
        items: items.map((g) => ({ ...g, _extra: g.category?.name ?? "-" })),
      };
    },
    { categories: [], items: [] }
  );
}

export function getAdminTransformations() {
  return safe(
    async () =>
      (await prisma.transformation.findMany({ orderBy: { createdAt: "desc" } })).map((t) => ({
        ...t,
        _extra: t.duration,
      })),
    []
  );
}

export function getAdminTestimonials() {
  return safe(
    async () =>
      (await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } })).map((t) => ({
        ...t,
        _extra: `${t.rating}/5 stars`,
      })),
    []
  );
}

export function getAdminInquiries() {
  return safe(
    async () =>
      (await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } })).map((i) => ({
        ...i,
        createdAt: i.createdAt ? new Date(i.createdAt).toISOString() : ("" as string),
      })),
    []
  );
}
