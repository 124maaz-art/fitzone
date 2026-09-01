import { prisma } from "./prisma";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    // DB unavailable (e.g. no Postgres in local dev) -> serve sample fallback content.
    console.error("Database query failed, using sample fallback content:", e);
    return fallback;
  }
}

// ---------- Sample fallback content ----------
// Used whenever the database is unreachable (e.g. local dev without Postgres)
// so the site always renders rich content instead of blank sections.

export const sampleServices: any[] = [
  {
    id: "s1",
    slug: "personal-training",
    name: "Personal Training",
    image: "/images/hero.svg",
    description: "One-on-one coaching with a certified trainer to reach your goals faster.",
    price: 350,
    duration: 1,
    durationUnit: "hours",
    benefits: ["Custom workout plans", "Nutrition guidance", "Progress tracking"],
  },
  {
    id: "s2",
    slug: "group-classes",
    name: "Group Classes",
    image: "/images/about.svg",
    description: "High-energy group workouts across HIIT, strength and conditioning.",
    price: 120,
    duration: 1,
    durationUnit: "hours",
    benefits: ["Motivating group energy", "All fitness levels", "Certified instructors"],
  },
  {
    id: "s3",
    slug: "nutrition-coaching",
    name: "Nutrition Coaching",
    image: "/images/hero.svg",
    description: "Tailored meal plans and accountability to fuel your performance.",
    price: 250,
    duration: 4,
    durationUnit: "weeks",
    benefits: ["Personalised meal plans", "Weekly check-ins", "Groceries made simple"],
  },
  {
    id: "s4",
    slug: "massage-therapy",
    name: "Massage Therapy",
    image: "/images/about.svg",
    description: "Sports massage and recovery to keep you training pain-free.",
    price: 90,
    duration: 1,
    durationUnit: "hours",
    benefits: ["Improved recovery", "Reduced soreness", "Relaxation"],
  },
];

export const samplePackages: any[] = [
  {
    id: "p1",
    slug: "day-pass",
    name: "Day Pass",
    price: 15,
    duration: "One Day",
    description: "Perfect for a one-off session or trying us out.",
    benefits: ["Full facility access", "Locker room access", "Open gym hours"],
    featured: false,
  },
  {
    id: "p2",
    slug: "monthly",
    name: "Monthly",
    price: 89,
    duration: "1 Month",
    description: "Our most popular option for regular training.",
    benefits: ["Unlimited gym access", "Free intro session", "Fitness assessment", "Group classes"],
    featured: true,
  },
  {
    id: "p3",
    slug: "quarterly",
    name: "Quarterly",
    price: 225,
    duration: "3 Months",
    description: "Great value for committed members.",
    benefits: ["Everything in Monthly", "1 free personal training session", "Guest passes (2)"],
    featured: false,
  },
];

export const sampleTrainers: any[] = [
  {
    id: "t1",
    slug: "ali-raza",
    name: "Ali Raza",
    image: "/images/hero.svg",
    specializations: ["Strength", "Powerlifting"],
    experience: 8,
    certifications: ["NSCA-CSCS", "USA Powerlifting"],
    bio: "Certified strength coach with 8 years of experience helping athletes add serious muscle.",
  },
  {
    id: "t2",
    slug: "sana-malik",
    name: "Sana Malik",
    image: "/images/about.svg",
    specializations: ["HIIT", "Functional"],
    experience: 5,
    certifications: ["ACE", "CrossFit L1"],
    bio: "High-energy trainer specialising in conditioning and functional movement.",
  },
  {
    id: "t3",
    slug: "david-kim",
    name: "David Kim",
    image: "/images/hero.svg",
    specializations: ["Weight Loss", "Nutrition"],
    experience: 6,
    certifications: ["NASM-CPT", "Precision Nutrition"],
    bio: "Focused on sustainable fat loss and building healthy habits that last.",
  },
  {
    id: "t4",
    slug: "maria-gomez",
    name: "Maria Gomez",
    image: "/images/about.svg",
    specializations: ["Yoga", "Mobility"],
    experience: 7,
    certifications: ["RYT-500", "FRC"],
    bio: "Helps members move better, recover faster and find balance.",
  },
];

export const sampleEquipment: any[] = [
  {
    id: "e1",
    slug: "adjustable-bench",
    name: "Adjustable Bench",
    image: "/images/hero.svg",
    description: "Multi-angle bench for presses, flies and rows.",
    categoryId: "c1",
    category: { name: "Strength" },
    trainingType: "Strength",
    targetMuscle: "Chest, Shoulders, Triceps",
    features: ["Multi-angle adjustable positions", "Heavy-duty steel frame", "High-density padding"],
    benefits: ["Core strength", "Muscle definition", "Injury prevention"],
  },
  {
    id: "e2",
    slug: "squat-rack",
    name: "Squat Rack",
    image: "/images/about.svg",
    description: "Heavy-duty rack with safety pins for squats and presses.",
    categoryId: "c1",
    category: { name: "Strength" },
    trainingType: "Strength",
    targetMuscle: "Legs, Glutes, Back",
    features: ["Safety pins", "J-hooks", "Weight storage pegs"],
    benefits: ["Leg strength", "Core stability", "Full-body power"],
  },
  {
    id: "e3",
    slug: "dumbbell-set",
    name: "Dumbbell Set",
    image: "/images/hero.svg",
    description: "Padded hex dumbbells from 2.5kg up to 40kg.",
    categoryId: "c4",
    category: { name: "Accessories" },
    trainingType: "Strength",
    targetMuscle: "Full Body",
    features: ["Padded hex design", "2.5kg to 40kg range", "Anti-roll shape"],
    benefits: ["Muscle growth", "Balance & coordination", "Versatile training"],
  },
  {
    id: "e4",
    slug: "treadmill-pro",
    name: "Treadmill Pro",
    image: "/images/about.svg",
    description: "Commercial treadmill with incline and heart-rate tracking.",
    categoryId: "c2",
    category: { name: "Cardio" },
    trainingType: "Cardio",
    targetMuscle: "Legs, Heart & Lungs",
    features: ["0-15% incline", "Heart-rate monitor", "Cushioned deck"],
    benefits: ["Endurance", "Fat burning", "Heart health"],
  },
  {
    id: "e5",
    slug: "rowing-machine",
    name: "Rowing Machine",
    image: "/images/hero.svg",
    description: "Smooth, low-impact full body cardio machine.",
    categoryId: "c2",
    category: { name: "Cardio" },
    trainingType: "Cardio",
    targetMuscle: "Full Body",
    features: ["Adjustable resistance", "Ergonomic seat", "Performance monitor"],
    benefits: ["Full-body workout", "Low impact", "Endurance"],
  },
  {
    id: "e6",
    slug: "kettlebell-rack",
    name: "Kettlebell Rack",
    image: "/images/about.svg",
    description: "A full range of kettlebells for swings and cleans.",
    categoryId: "c3",
    category: { name: "Functional" },
    trainingType: "Functional",
    targetMuscle: "Full Body",
    features: ["Multiple weights", "Casting iron", "Wide handle"],
    benefits: ["Explosive power", "Grip strength", "Functional fitness"],
  },
];

export const sampleTestimonials: any[] = [
  {
    id: "tm1",
    name: "Hannah L.",
    image: "/images/hero.svg",
    rating: 5,
    review: "Best gym in town. The coaches genuinely care about your progress.",
    date: "2026-06-12",
  },
  {
    id: "tm2",
    name: "Usman A.",
    image: "/images/about.svg",
    rating: 5,
    review: "Dropped 15kg in 3 months. The community keeps me coming back every day.",
    date: "2026-05-30",
  },
  {
    id: "tm3",
    name: "Priya N.",
    image: "/images/hero.svg",
    rating: 4,
    review: "Great equipment and never too crowded in the mornings.",
    date: "2026-04-18",
  },
];

export const sampleTransformations: any[] = [
  {
    id: "x1",
    memberName: "Imran K.",
    beforeImage: "/images/about.svg",
    afterImage: "/images/hero.svg",
    duration: "6 months",
    goal: "Weight loss",
    result: "-18kg",
    story: "Imran lost 18kg with consistent training and nutrition coaching.",
  },
  {
    id: "x2",
    memberName: "Ayesha T.",
    beforeImage: "/images/about.svg",
    afterImage: "/images/hero.svg",
    duration: "4 months",
    goal: "Strength & toning",
    result: "+8kg muscle",
    story: "Ayesha transformed her physique and confidence in just 4 months.",
  },
];

export const sampleCategories: any[] = [
  { id: "c1", name: "Strength", description: "Free weights, racks and machines for building strength." },
  { id: "c2", name: "Cardio", description: "Treadmills, bikes, rowers and ellipticals for endurance." },
  { id: "c3", name: "Functional", description: "Kettlebells, ropes, boxes and turf for functional training." },
  { id: "c4", name: "Accessories", description: "Bands, mats and dumbbells to complete your workout." },
];

export const samplePrograms: any[] = [
  {
    id: "pr1",
    slug: "muscle-builder",
    name: "Muscle Builder",
    image: "/images/hero.svg",
    description: "A progressive strength program to build lean muscle.",
    duration: "8 weeks",
    difficulty: "Intermediate",
    benefits: ["Progressive overload", "Nutrition tips", "Weekly structure"],
  },
  {
    id: "pr2",
    slug: "fat-burn-360",
    name: "Fat Burn 360",
    image: "/images/about.svg",
    description: "High-intensity fat loss program combining cardio and circuits.",
    duration: "6 weeks",
    difficulty: "Beginner",
    benefits: ["Fast results", "Beginner friendly", "Meal guidance"],
  },
  {
    id: "pr3",
    slug: "athlete-prep",
    name: "Athlete Prep",
    image: "/images/hero.svg",
    description: "Sport-specific conditioning to boost power and speed.",
    duration: "10 weeks",
    difficulty: "Advanced",
    benefits: ["Sport performance", "Power & speed", "Strength endurance"],
  },
  {
    id: "pr4",
    slug: "yoga-flow",
    name: "Yoga & Mobility Flow",
    image: "/images/about.svg",
    description: "Improve flexibility, balance and recovery with guided flows.",
    duration: "4 weeks",
    difficulty: "All Levels",
    benefits: ["Better flexibility", "Reduced stress", "Injury prevention"],
  },
];

export const sampleGalleryCategories: any[] = [
  { id: "gc1", name: "Facility", slug: "facility" },
  { id: "gc2", name: "Classes", slug: "classes" },
  { id: "gc3", name: "Trainers", slug: "trainers" },
];

export const sampleGalleryItems: any[] = [
  { id: "g1", title: "Strength Floor", image: "/images/hero.svg", category: { slug: "facility", name: "Facility" } },
  { id: "g2", title: "Cardio Deck", image: "/images/about.svg", category: { slug: "facility", name: "Facility" } },
  { id: "g3", title: "HIIT Class", image: "/images/hero.svg", category: { slug: "classes", name: "Classes" } },
  { id: "g4", title: "Yoga Session", image: "/images/about.svg", category: { slug: "classes", name: "Classes" } },
  { id: "g5", title: "Coach Ali", image: "/images/hero.svg", category: { slug: "trainers", name: "Trainers" } },
  { id: "g6", title: "Coach Sana", image: "/images/about.svg", category: { slug: "trainers", name: "Trainers" } },
];

export function getHomeData() {
  return safe(
    async () => {
      const [services, equipment, packages, trainers, testimonials, transformations, programs] =
        await Promise.all([
          prisma.service.findMany({
            where: { active: true },
            orderBy: { createdAt: "asc" },
          }),
          prisma.equipment.findMany({
            where: { active: true },
            include: { category: true },
            orderBy: { createdAt: "asc" },
          }),
          prisma.membershipPackage.findMany({ where: { active: true } }),
          prisma.trainer.findMany({ where: { active: true } }),
          prisma.testimonial.findMany({
            where: { active: true },
            orderBy: { createdAt: "desc" },
          }),
          prisma.transformation.findMany({ where: { active: true } }),
          prisma.program.findMany({ where: { active: true } }),
        ]);
      return {
        services: services.map((s) => ({ ...s, price: Number(s.price) })),
        equipment,
        packages: packages.map((p) => ({ ...p, price: Number(p.price) })),
        trainers,
        testimonials,
        transformations,
        programs,
      };
    },
    {
      services: sampleServices,
      equipment: sampleEquipment,
      packages: samplePackages,
      trainers: sampleTrainers,
      testimonials: sampleTestimonials,
      transformations: sampleTransformations,
      programs: samplePrograms,
    }
  );
}

export function getEquipmentCategories() {
  return safe(
    () => prisma.equipmentCategory.findMany({ orderBy: { name: "asc" } }),
    sampleCategories
  );
}

export function getEquipmentList() {
  return safe(
    () =>
      prisma.equipment.findMany({
        where: { active: true },
        include: { category: true },
        orderBy: { createdAt: "asc" },
      }),
    sampleEquipment
  );
}

export async function getEquipmentBySlug(slug: string) {
  try {
    const item = await prisma.equipment.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!item) return { item: null, related: [] as any[] };
    const related = await prisma.equipment.findMany({
      where: { active: true, id: { not: item.id }, categoryId: item.categoryId },
      include: { category: true },
      orderBy: { createdAt: "asc" },
      take: 3,
    });
    return { item, related };
  } catch {
    const item = sampleEquipment.find((e: any) => e.slug === slug) ?? null;
    const related = sampleEquipment
      .filter((e: any) => e.id !== item?.id)
      .slice(0, 3);
    return { item, related };
  }
}

export function getServices() {
  return safe(
    async () =>
      (await prisma.service.findMany({ where: { active: true } })).map((s) => ({
        ...s,
        price: Number(s.price),
      })),
    sampleServices
  );
}

export function getPackages() {
  return safe(
    async () =>
      (await prisma.membershipPackage.findMany({ where: { active: true } })).map((p) => ({
        ...p,
        price: Number(p.price),
      })),
    samplePackages
  );
}

export function getTrainers() {
  return safe(() => prisma.trainer.findMany({ where: { active: true } }), sampleTrainers);
}

export async function getTrainerBySlug(slug: string) {
  try {
    const trainer = await prisma.trainer.findUnique({
      where: { slug },
      include: { availabilities: true },
    });
    return trainer;
  } catch {
    const sample = sampleTrainers.find((t: any) => t.slug === slug) ?? null;
    if (!sample) return null;
    const availabilities = Array.from({ length: 7 }).map((_, day) => ({
      day,
      available: true,
      startTime: "07:00",
      endTime: "22:00",
    }));
    return { ...sample, availabilities };
  }
}

export function getPrograms() {
  return safe(
    () =>
      prisma.program.findMany({
        where: { active: true },
      }),
    samplePrograms
  );
}

export function getGallery() {
  return safe(
    async () => {
      const [categories, items] = await Promise.all([
        prisma.galleryCategory.findMany({ orderBy: { name: "asc" } }),
        prisma.galleryItem.findMany({
          where: { active: true },
          include: { category: true },
          orderBy: { createdAt: "desc" },
        }),
      ]);
      return { categories, items };
    },
    { categories: sampleGalleryCategories, items: sampleGalleryItems }
  );
}

export function getTransformations() {
  return safe(() => prisma.transformation.findMany({ where: { active: true } }), sampleTransformations);
}

export function getTestimonials() {
  return safe(
    () =>
      prisma.testimonial.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
      }),
    sampleTestimonials
  );
}
