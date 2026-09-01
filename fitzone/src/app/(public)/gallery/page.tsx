import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { GalleryBrowser } from "@/components/gallery/gallery-browser";
import { getGallery } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Take a tour of FitZone's modern facilities, training areas, equipment and events through our photo gallery.",
};

export default async function GalleryPage() {
  const { categories, items } = await getGallery();
  return (
    <>
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <img src="/images/about.svg" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="container-page relative z-10">
          <SectionHeading
            title="Our Gallery"
            description="Explore our world-class facilities, equipment and the energy of our community."
          />
        </div>
      </section>
      <section className="py-16">
        <div className="container-page">
          <GalleryBrowser categories={categories} items={items} />
        </div>
      </section>
    </>
  );
}
