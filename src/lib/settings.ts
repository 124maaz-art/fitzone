import { prisma } from "./prisma";

export type SiteSettings = {
  gymName: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  logo: string;
  heroTitle: string;
  heroDescription: string;
  footerContent: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
};

const defaults: SiteSettings = {
  gymName: "FitZone",
  phone: "+1 (555) 123-4567",
  email: "hello@fitzone.com",
  address: "1200 Fitness Ave, Downtown, NY 10001",
  hours: "Mon - Sat: 5:00 AM - 11:00 PM, Sun: 7:00 AM - 8:00 PM",
  logo: "",
  heroTitle: "BUILD YOUR STRONGEST SELF",
  heroDescription: "Train harder. Live stronger. Become better.",
  footerContent: "Premium fitness facility transforming bodies and lives since 2016.",
  facebook: "https://facebook.com/fitzone",
  twitter: "https://twitter.com/fitzone",
  instagram: "https://instagram.com/fitzone",
  youtube: "https://youtube.com/fitzone",
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...defaults, ...map };
  } catch {
    return defaults;
  }
}

export async function getSetting(key: string, fallback = "") {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    return row?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function updateSetting(key: string, value: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
