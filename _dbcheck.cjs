require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const trainers = await prisma.trainer.findMany({ where: { active: true } });
  const programs = await prisma.program.findMany({ where: { active: true } });
  const services = await prisma.service.findMany({ where: { active: true } });
  const gallery = await prisma.galleryItem.findMany();
  const galleryCats = await prisma.galleryCategory.findMany();
  const packages = await prisma.membershipPackage.findMany();
  const equipment = await prisma.equipment.findMany();
  const transforms = await prisma.transformation.findMany();
  const testimonials = await prisma.testimonial.findMany();
  console.log("TRAINERS", JSON.stringify(trainers.map((t) => ({ txt: t.name, exp: t.experience, img: t.image }))));
  console.log("PROGRAMS", JSON.stringify(programs.map((p) => ({ txt: p.name, img: p.image }))));
  console.log("SERVICES", JSON.stringify(services.map((s) => ({ txt: s.name, img: s.image }))));
  console.log("GALLERY", JSON.stringify(gallery.map((g) => ({ id: g.id, title: g.title, img: g.image }))));
  console.log("GALLERYCATS", JSON.stringify(galleryCats.map((c) => ({ id: c.id, name: c.name }))));
  console.log("PACKAGES", JSON.stringify(packages.map((p) => ({ txt: p.name }))));
  console.log("EQUIPMENT", JSON.stringify(equipment.map((e) => ({ txt: e.name, img: e.image }))));
  console.log("TRANSFORMS", JSON.stringify(transforms.map((t) => ({ txt: t.memberName, img: t.afterImage }))));
  console.log("TESTIMONIALS", JSON.stringify(testimonials.map((t) => ({ txt: t.name, img: t.image }))));
  const allImages = []; const push = (arr) => { for (const r of arr) { for (const k of ["image", "beforeImage", "afterImage"]) { if (r[k] && typeof r[k] === "string") allImages.push(r[k]); } } };
  push(trainers); push(programs); push(services); push(gallery); push(packages); push(equipment); push(transforms); push(testimonials);
  const remotes = allImages.filter((i) => i.startsWith("http"));
  console.log("ALL_REMOTE_IMAGES", JSON.stringify([...new Set(remotes)]));
}

main().catch((e) => { console.error("DB ERROR", e); process.exit(1); }).finally(() => prisma.$disconnect());