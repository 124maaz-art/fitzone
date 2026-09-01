"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";

export type GalleryPhoto = {
  id: string;
  title: string;
  image: string;
};

export function GalleryLightbox({ photos }: { photos: GalleryPhoto[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const photo = index !== null ? photos[index] : null;

  function close() {
    setIndex(null);
  }

  function prev() {
    setIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }

  function next() {
    setIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }

  return (
    <>
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        role="region"
        aria-label="Gallery grid"
      >
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border"
            aria-label={`Open ${p.title}`}
          >
            <SmartImage src={p.image} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="25vw" />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-sm font-semibold">{p.title}</span>
            </div>
          </button>
        ))}
      </div>

      {photo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={photo.title}
          onClick={close}
        >
          <button className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-2 hover:bg-white/20" onClick={close} aria-label="Close">
            <X className="h-6 w-6" />
          </button>
          <button className="absolute left-4 z-10 rounded-full bg-white/10 p-2 hover:bg-white/20" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous image">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="relative max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <SmartImage src={photo.image} alt={photo.title} width={1200} height={800} className="max-h-[80vh] w-auto rounded-xl object-contain" />
            <p className="mt-3 text-center font-semibold">{photo.title}</p>
          </div>
          <button className="absolute right-4 z-10 rounded-full bg-white/10 p-2 hover:bg-white/20" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next image">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
