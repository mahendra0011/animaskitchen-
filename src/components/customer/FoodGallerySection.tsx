import React, { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Camera,
  Maximize2,
  X,
  Heart,
  Flame,
} from "lucide-react";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";

export const FoodGallerySection: React.FC = () => {
  const { foodGallery } = useDemoStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<typeof foodGallery[0] | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  if (!foodGallery || foodGallery.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 360;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="food-gallery" className="py-10 px-4 sm:px-6 bg-cream/60 relative overflow-hidden">
      {/* Decorative ambient subtle background glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-spice/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-spice/10 border border-spice/20 text-spice text-xs font-bold tracking-wide uppercase">
              <Camera className="size-3.5" />
              <span>Live Kitchen Moments & Food Showcase</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight flex items-center gap-2">
              <span>Authentic Food Gallery</span>
              <Sparkles className="size-5 text-amber-500 fill-amber-500 inline-block animate-pulse" />
            </h2>
            <p className="text-xs sm:text-sm text-ink/70 max-w-2xl">
              Freshly prepared meals, hygienic kitchen preparation, and genuine Patna home-style cooking captured straight from our stove.
            </p>
          </div>

          {/* Navigation < and > Buttons */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <span className="text-xs font-mono text-ink/50 mr-1 hidden sm:inline-block">
              {foodGallery.length} Kitchen Photos
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="size-10 rounded-full bg-white hover:bg-spice hover:text-white border-ink/20 shadow-sm transition-all duration-200 active:scale-95"
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="size-10 rounded-full bg-white hover:bg-spice hover:text-white border-ink/20 shadow-sm transition-all duration-200 active:scale-95"
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>

        {/* Horizontal Scrollable Gallery Container */}
        <div
          ref={scrollRef}
          tabIndex={0}
          aria-label="Food photo gallery carousel"
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {foodGallery.map((photo, index) => {
            const isLiked = !!likedIds[photo.id];
            return (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative flex-none w-[270px] sm:w-[320px] aspect-[4/5] rounded-2xl overflow-hidden bg-stone-900 border border-ink/10 shadow-md hover:shadow-xl transition-all duration-300 snap-start cursor-pointer hover:-translate-y-1"
              >
                {/* Photo Image */}
                <img
                  src={photo.imageUrl}
                  alt={photo.title || `Food photo ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  onError={(e) => {
                    // Fallback to high quality food placeholder if local image issue
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80";
                  }}
                />

                {/* Top Overlay Tag & Like Button */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                  {photo.tag ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-bold text-amber-300 border border-white/20 shadow-sm">
                      <Flame className="size-3 text-spice" />
                      {photo.tag}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-300 border border-white/20 shadow-sm">
                      100% Homestyle
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => toggleLike(photo.id, e)}
                    className="pointer-events-auto size-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:text-rose-500 hover:bg-white transition-colors"
                    aria-label="Like photo"
                  >
                    <Heart
                      className={`size-4 transition-transform active:scale-125 ${
                        isLiked ? "fill-rose-500 text-rose-500" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Dark Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

                {/* Expand Icon on Hover */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 pointer-events-none">
                  <Maximize2 className="size-5" />
                </div>

                {/* Bottom Caption & Details */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10 pointer-events-none space-y-1">
                  <h3 className="font-display text-base font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {photo.title}
                  </h3>
                  {photo.caption && (
                    <p className="font-body text-xs text-cream/80 line-clamp-2 leading-relaxed">
                      {photo.caption}
                    </p>
                  )}
                  <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-cream/60">
                    <span>Tap to view HD photo</span>
                    <span>•</span>
                    <span>Anima's Kitchen</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe / Click Guide */}
        <div className="mt-3 flex items-center justify-between text-xs text-ink/50 sm:hidden">
          <span>👈 Swipe or use buttons to browse 👉</span>
          <span>{foodGallery.length} photos</span>
        </div>
      </div>

      {/* Fullscreen Photo Modal / Lightbox */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-ink rounded-3xl overflow-hidden border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 size-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-colors"
              aria-label="Close photo preview"
            >
              <X className="size-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-black">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Details Footer */}
            <div className="p-5 sm:p-6 bg-gradient-to-t from-black to-stone-900 border-t border-white/10 text-cream space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {selectedPhoto.tag && (
                    <span className="rounded-full bg-spice/30 border border-spice/50 px-3 py-1 text-xs font-mono font-bold text-spice-light">
                      {selectedPhoto.tag}
                    </span>
                  )}
                  <span className="text-xs font-mono text-cream/60">
                    Anima's Kitchen Live Feed
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  ✓ 100% Prepared in RO Water & Clean Utensils
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                {selectedPhoto.title}
              </h3>
              {selectedPhoto.caption && (
                <p className="text-xs sm:text-sm text-cream/80 leading-relaxed max-w-2xl">
                  {selectedPhoto.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
