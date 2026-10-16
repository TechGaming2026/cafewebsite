import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import buns from "@/assets/buns.jpg";
import garden from "@/assets/garden.jpg";
import latte from "@/assets/latte.jpg";
import { PageHero } from "@/components/Layout";
import { meta } from "@/lib/meta";

export const Route = createFileRoute("/gallery")({
  head: () => meta("Gallery — FIKA Cafe", "A look inside FIKA Cafe: coffee, pastries, the book-lined back room and the garden patio."),
  component: Gallery,
});

const IMAGES = [
  { src: hero, alt: "Book-lined café room with latte and cinnamon bun" },
  { src: buns, alt: "Swedish cinnamon buns with pearl sugar" },
  { src: garden, alt: "Garden patio with string lights" },
  { src: latte, alt: "Latte art beside an open book" },
];

function Gallery() {
  const [idx, setIdx] = useState<number | null>(null);
  useEffect(() => {
    if (idx === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") setIdx((i) => (i! + 1) % IMAGES.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i! - 1 + IMAGES.length) % IMAGES.length);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [idx]);

  return (
    <>
      <PageHero eyebrow="Gallery" title="Moments at Fika." />
      <div className="mx-auto max-w-7xl columns-1 gap-6 px-5 pb-24 sm:columns-2 md:px-10">
        {IMAGES.map((im, i) => (
          <button key={i} onClick={() => setIdx(i)} className="mb-6 block w-full overflow-hidden" aria-label={`Open: ${im.alt}`}>
            <img src={im.src} alt={im.alt} loading="lazy" className="w-full transition duration-500 hover:scale-[1.02]" />
          </button>
        ))}
      </div>
      {idx !== null && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 text-ink-foreground" onClick={() => setIdx(null)}>
          <img src={IMAGES[idx]!.src} alt={IMAGES[idx]!.alt} className="max-h-[85vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-5 top-5" onClick={() => setIdx(null)} aria-label="Close"><X /></button>
          <button className="absolute left-4" onClick={(e) => { e.stopPropagation(); setIdx((idx - 1 + IMAGES.length) % IMAGES.length); }} aria-label="Previous"><ChevronLeft className="h-8 w-8" /></button>
          <button className="absolute right-4" onClick={(e) => { e.stopPropagation(); setIdx((idx + 1) % IMAGES.length); }} aria-label="Next"><ChevronRight className="h-8 w-8" /></button>
        </div>
      )}
    </>
  );
}
