"use client";

import { useState } from "react";
import { GalleryLightbox, type GalleryPhoto } from "./gallery-lightbox";

type Category = { id: string; name: string; slug: string };
type Item = { id: string; title: string; image: string; category: { slug: string; name: string } };

export function GalleryBrowser({
  categories,
  items,
}: {
  categories: Category[];
  items: Item[];
}) {
  const [active, setActive] = useState("all");

  const photos: GalleryPhoto[] =
    active === "all"
      ? items.map((i) => ({ id: i.id, title: i.title, image: i.image }))
      : items
          .filter((i) => i.category.slug === active)
          .map((i) => ({ id: i.id, title: i.title, image: i.image }));

  const chips = [{ slug: "all", name: "All" }, ...categories];

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {chips.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === c.slug ? "bg-accent text-white" : "bg-white/5 text-muted hover:text-foreground"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <GalleryLightbox photos={photos} />
    </div>
  );
}
