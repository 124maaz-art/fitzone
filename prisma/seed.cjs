const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");
require("dotenv/config");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@fitzone.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "FitZone Admin",
      email: adminEmail,
      passwordHash: hashed,
      role: "ADMIN",
    },
  });

  const categories = await Promise.all(
    [
      { name: "Strength", description: "Free weights, racks and machines for building strength and muscle." },
      { name: "Cardio", description: "Treadmills, bikes, rowers and ellipticals for heart health and endurance." },
      { name: "Functional", description: "Kettlebells, battle ropes, boxes and turf for functional training." },
      { name: "Accessories", description: "Bands, mats, dumbbells and everything you need to complete your workout." },
    ].map(async (c) => {
      const existing = await prisma.equipmentCategory.findFirst({ where: { name: c.name } });
      if (existing) return existing;
      return prisma.equipmentCategory.create({ data: { ...c, slug: c.name.toLowerCase() } });
    })
  );

  const equipmentSeed = [
    { name: "Adjustable Bench", category: "Strength", description: "Multi-angle bench for presses, flies and rows.", image: "/images/hero.svg" },
    { name: "Squat Rack", category: "Strength", description: "Heavy-duty rack with safety pins for squats and presses.", image: "/images/hero.svg" },
    { name: "Dumbbell Set", category: "Accessories", description: "Padded hex dumbbells from 2.5kg up to 40kg.", image: "/images/equipment.svg" },
    { name: "Treadmill Pro", category: "Cardio", description: "Commercial treadmill with incline and heart-rate tracking.", image: "/images/equipment.svg" },
    { name: "Rowing Machine", category: "Cardio", description: "Smooth, low-impact full body cardio.", image: "/images/equipment.svg" },
    { name: "Kettlebell Rack", category: "Functional", description: "A full range of kettlebells for swings and cleans.", image: "/images/equipment.svg" },
  ];
  for (const e of equipmentSeed) {
    const cat = categories.find((c) => c.name === e.category);
    if (!cat) continue;
    await prisma.equipment.upsert({
      where: { slug: e.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      update: {},
      create: {
        name: e.name,
        slug: e.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: e.description,
        image: e.image,
        categoryId: cat.id,
        active: true,
      },
    });
  }

  const servicesSeed = [
    { name: "Personal Training", price: 350, duration: 1, durationUnit: "hours", description: "One-on-one coaching with a certified trainer to hit your goals faster.", benefits: ["Custom workout plans", "Nutrition guidance", "Progress tracking"] },
    { name: "Group Classes", price: 120, duration: 1, durationUnit: "hours", description: "High-energy group workouts across HIIT, strength and conditioning.", benefits: ["Motivating group energy", "All fitness levels", "Certified instructors"] },
    { name: "Nutrition Coaching", price: 250, duration: 4, durationUnit: "weeks", description: "Tailored meal plans and accountability to fuel your performance.", benefits: ["Personalised meal plans", "Weekly check-ins", "Groceries made simple"] },
    { name: "Massage Therapy", price: 90, duration: 1, durationUnit: "hours", description: "Sports massage and recovery to keep you training pain-free.", benefits: ["Improved recovery", "Reduced soreness", "Relaxation"] },
  ];
  for (const s of servicesSeed) {
    const existing = await prisma.service.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.service.create({ data: { ...s, slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), image: "/images/services.svg", active: true } });
    }
  }

  const packagesSeed = [
    { name: "Day Pass", price: 15, duration: "One Day", description: "Perfect for a one-off session or trying us out.", benefits: ["Full facility access", "Locker room access", "Open gym hours"], featured: false },
    { name: "Monthly", price: 89, duration: "1 Month", description: "Our most popular option for regular training.", benefits: ["Unlimited gym access", "Free intro session", "Fitness assessment", "Group classes"], featured: true },
    { name: "Quarterly", price: 225, duration: "3 Months", description: "Great value for committed members.", benefits: ["Everything in Monthly", "1 free personal training session", "Guest passes (2)"], featured: false },
    { name: "Annual", price: 749, duration: "12 Months", description: "Best value for serious athletes.", benefits: ["Everything in Quarterly", "2 free PT sessions", "Priority booking", "Freeze up to 30 days"], featured: false },
  ];
  for (const p of packagesSeed) {
    const existing = await prisma.membershipPackage.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.membershipPackage.create({ data: { ...p, slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), active: true } });
    }
  }

  const trainersSeed = [
    { name: "Ali Raza", specializations: ["Strength", "Powerlifting"], bio: "Certified strength coach with 8 years of experience helping athletes add serious muscle.", experience: 8, certifications: ["NSCA-CSCS", "USA Powerlifting"] },
    { name: "Sana Malik", specializations: ["HIIT", "Functional"], bio: "High-energy trainer specialising in conditioning and functional movement.", experience: 5, certifications: ["ACE", "CrossFit L1"] },
    { name: "David Kim", specializations: ["Weight Loss", "Nutrition"], bio: "Focused on sustainable fat loss and building healthy habits that last.", experience: 6, certifications: ["NASM-CPT", "Precision Nutrition"] },
    { name: "Maria Gomez", specializations: ["Yoga", "Mobility"], bio: "Helps members move better, recover faster and find balance.", experience: 7, certifications: ["RYT-500", "FRC"] },
  ];
  for (const t of trainersSeed) {
    let trainer = await prisma.trainer.findFirst({ where: { name: t.name } });
    if (!trainer) {
      trainer = await prisma.trainer.create({ data: { ...t, slug: t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), image: "/images/trainers.svg", active: true } });
    }
    for (let day = 0; day < 7; day++) {
      const existing = await prisma.trainerAvailability.findUnique({
        where: { trainerId_day: { trainerId: trainer.id, day } },
      });
      if (!existing) {
        await prisma.trainerAvailability.create({
          data: { trainerId: trainer.id, day, available: true, startTime: "07:00", endTime: "22:00" },
        });
      }
    }
  }

  const programsSeed = [
    { name: "Muscle Builder", duration: "8 weeks", difficulty: "Intermediate", description: "A progressive strength program to build lean muscle.", benefits: ["Progressive overload", "Nutrition tips", "Weekly structure"] },
    { name: "Fat Burn 360", duration: "6 weeks", difficulty: "Beginner", description: "High-intensity fat loss program combining cardio and circuits.", benefits: ["Fast results", "Beginner friendly", "Meal guidance"] },
    { name: "Athlete Prep", duration: "10 weeks", difficulty: "Advanced", description: "Sport-specific conditioning to boost power and speed.", benefits: ["Sport performance", "Power & speed", "Strength endurance"] },
  ];
  for (const p of programsSeed) {
    const existing = await prisma.program.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.program.create({ data: { ...p, slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), image: "/images/equipment.svg", active: true } });
    }
  }

  const galleryCats = ["Facility", "Classes", "Trainers"];
  for (const c of galleryCats) {
    const slug = c.toLowerCase();
    await prisma.galleryCategory.upsert({ where: { slug }, update: {}, create: { name: c, slug } });
  }

  const transformationsSeed = [
    { memberName: "Imran K.", beforeImage: "/images/equipment.svg", afterImage: "/images/hero.svg", duration: "6 months", goal: "Weight loss", result: "-18kg", story: "Imran lost 18kg with consistent training and nutrition coaching.", active: true },
    { memberName: "Ayesha T.", beforeImage: "/images/equipment.svg", afterImage: "/images/hero.svg", duration: "4 months", goal: "Strength & toning", result: "+8kg muscle", story: "Ayesha transformed her physique and confidence in just 4 months.", active: true },
    { memberName: "Ravi S.", beforeImage: "/images/equipment.svg", afterImage: "/images/hero.svg", duration: "8 months", goal: "General fitness", result: "Full recomp", story: "Ravi rebuilt his lifestyle from the ground up.", active: true },
  ];
  for (const t of transformationsSeed) {
    const existing = await prisma.transformation.findFirst({ where: { memberName: t.memberName } });
    if (!existing) {
      await prisma.transformation.create({ data: t });
    }
  }

  const testimonialsSeed = [
    { name: "Hannah L.", rating: 5, review: "Best gym in town. The coaches genuinely care about your progress.", image: "/images/trainers.svg", active: true },
    { name: "Usman A.", rating: 5, review: "Dropped 15kg in 3 months. The community keeps me coming back every day.", image: "/images/trainers.svg", active: true },
    { name: "Priya N.", rating: 4, review: "Great equipment and never too crowded in the mornings.", image: "/images/trainers.svg", active: true },
  ];
  for (const t of testimonialsSeed) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }

  const settings = {
    gymName: "FitZone Gym",
    logo: "/images/logo.svg",
    footerContent: "FitZone Gym - your one-stop destination for fitness, strength and community.",
    phone: "+1 (555) 123-4567",
    email: "hello@fitzone.com",
    address: "123 Muscle Lane, Fitness City",
    hours: "Mon-Sat: 6:00 AM - 11:00 PM | Sun: 8:00 AM - 8:00 PM",
    heroTitle: "Train Hard. Live Strong.",
    heroDescription: "Join FitZone Gym and unlock your full potential with world-class equipment, expert coaches and a community that pushes you forward.",
    facebook: "https://facebook.com/fitzonegym",
    twitter: "https://twitter.com/fitzonegym",
    instagram: "https://instagram.com/fitzonegym",
    youtube: "https://youtube.com/fitzonegym",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
