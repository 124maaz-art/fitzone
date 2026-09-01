import { getHomeData } from "@/lib/data";
import {
  Hero,
  Stats,
  GymIntro,
  FeaturedServices,
  FeaturedEquipment,
  MembershipSection,
  TrainersSection,
  FeaturedPrograms,
  TestimonialsSection,
  TransformationsPreview,
  CTA,
} from "@/components/home/sections";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getHomeData();
  const settings = await getSettings();

  return (
    <>
      <Hero settings={settings} />
      <Stats />
      <GymIntro />
      <FeaturedServices services={data.services} />
      <FeaturedEquipment equipment={data.equipment} />
      <MembershipSection packages={data.packages} />
      <TrainersSection trainers={data.trainers} />
      <FeaturedPrograms programs={data.programs} />
      <TestimonialsSection testimonials={data.testimonials} />
      <TransformationsPreview transformations={data.transformations} />
      <CTA />
    </>
  );
}
