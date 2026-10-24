import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoStore } from "@/context/DemoStoreContext";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Flame,
  Sparkles,
  Eye,
  Heart,
  Youtube,
  Film,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import type { KitchenVideo } from "@/types/kitchen";

export const KitchenVideoReelsSection: React.FC = () => {
  const { kitchenVideos } = useDemoStore();
  const [selectedVideo, setSelectedVideo] = useState<KitchenVideo | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  if (!kitchenVideos || kitchenVideos.length === 0) return null;

  const togglePlay = (video: KitchenVideo) => {
    const el = videoRefs.current[video.id];
    if (!el) {
      // If YouTube or external
      setSelectedVideo(video);
      return;
    }

    if (playingVideoId === video.id) {
      el.pause();
      setPlayingVideoId(null);
    } else {
      // Pause all others
      Object.keys(videoRefs.current).forEach((id) => {
        if (id !== video.id && videoRefs.current[id]) {
          videoRefs.current[id]?.pause();
        }
      });
      el.play().catch(() => {});
      setPlayingVideoId(video.id);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    // Extract video ID from youtube.com or youtu.be
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0] || "";
    } else {
      videoId = url;
    }
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  };

  return (
    <section
      id="kitchen-videos"
      className="relative overflow-hidden py-14 sm:py-20 bg-gradient-to-b from-[#18110B] via-[#21170F] to-[#160E08] text-cream border-t border-b border-orange-500/20"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/4 size-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 size-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/15 px-3.5 py-1 backdrop-blur-md mb-3">
              <Film className="size-3.5 text-orange-400 animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-orange-300">
                LIVE KITCHEN REELS &amp; COOKING VIDEOS
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Dekhiye Kaise Banta Hai <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] via-[#FFA726] to-[#FFD54F] italic">
                Aapka Shuddh Ghar Jaisa Khana!
              </span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-cream/70 max-w-xl">
              100% transparency! Watch raw unedited reels of our master chefs preparing hand-rolled
              rotis, slow-simmered handi daal, fresh vegetables &amp; sanitized packing in Kurji, Patna.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-cream/80 backdrop-blur-sm">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>Zero Artificial Colors · Pure Desi Ghee</span>
            </span>
          </div>
        </div>

        {/* Video Cards Grid / Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
          {kitchenVideos.map((video, idx) => {
            const isPlaying = playingVideoId === video.id;
            const isYouTube = video.sourceType === "youtube" || video.videoUrl.includes("youtube") || video.videoUrl.includes("youtu.be");

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group relative flex flex-col rounded-3xl border border-white/10 bg-[#251A12]/80 overflow-hidden shadow-xl hover:shadow-2xl hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1.5 backdrop-blur-md"
              >
                {/* Reel Video Container (9:16 vertical reels or 4:5 aspect ratio) */}
                <div className="relative aspect-[9/14] w-full overflow-hidden bg-black/90">
                  {/* Local Video Tag */}
                  {!isYouTube ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[video.id] = el;
                      }}
                      src={video.videoUrl}
                      poster={video.thumbnailUrl}
                      playsInline
                      muted={isMuted}
                      loop
                      preload="metadata"
                      onClick={() => togglePlay(video)}
                      className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    /* YouTube Preview */
                    <div
                      onClick={() => setSelectedVideo(video)}
                      className="relative w-full h-full cursor-pointer overflow-hidden group-hover:scale-105 transition-transform duration-500"
                    >
                      <img
                        src={
                          video.thumbnailUrl ||
                          `https://img.youtube.com/vi/${video.youtubeId || "default"}/hqdefault.jpg`
                        }
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                    </div>
                  )}

                  {/* Gradient overlays for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />

                  {/* Top Badge (Live cooking / YouTube) */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono font-bold text-orange-400 border border-white/10">
                      <Flame className="size-3 text-orange-500 animate-pulse" />
                      REEL #{idx + 1}
                    </span>

                    {isYouTube ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 px-2 py-0.5 text-[9px] font-mono font-bold text-white shadow-xs">
                        <Youtube className="size-3" /> YouTube
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono text-cream/70 border border-white/10">
                        <Clock className="size-2.5" /> {video.duration || "0:30"}
                      </span>
                    )}
                  </div>

                  {/* Play / Pause Interactive Central Button */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    {!isPlaying && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay(video);
                        }}
                        className="pointer-events-auto size-14 rounded-full bg-orange-600/90 text-white flex items-center justify-center shadow-xl border border-white/20 group-hover:scale-110 group-hover:bg-orange-500 transition-all cursor-pointer backdrop-blur-md active:scale-95"
                      >
                        <Play className="size-6 fill-white ml-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Audio Mute/Unmute Toggle (for local video) */}
                  {!isYouTube && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                      }}
                      className="absolute top-3 right-3 z-20 size-8 rounded-full bg-black/60 text-white/90 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
                    </button>
                  )}

                  {/* Expand Fullscreen / Modal Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVideo(video);
                    }}
                    className="absolute bottom-3 right-3 z-20 size-8 rounded-full bg-black/60 text-white/90 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors hover:bg-orange-600"
                    title="Watch Fullscreen"
                  >
                    <Maximize2 className="size-3.5" />
                  </button>

                  {/* Bottom Video Meta inside card */}
                  <div className="absolute bottom-3 left-3 right-12 z-10 pointer-events-none text-left">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-cream/80 mb-1">
                      <span className="flex items-center gap-1">
                        <Eye className="size-3 text-orange-400" /> {video.viewsCount || 1200}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Heart className="size-3 text-rose-400 fill-rose-400/40" /> {video.likesCount || 150}
                      </span>
                    </div>
                    <h3 className="font-display text-xs font-bold text-white line-clamp-2 leading-snug drop-shadow-md">
                      {video.title}
                    </h3>
                  </div>
                </div>

                {/* Footer details & tags */}
                <div className="p-3 bg-[#1C130D] flex-1 flex flex-col justify-between space-y-2">
                  <p className="text-[11px] text-cream/70 line-clamp-2 leading-relaxed">
                    {video.description || "Authentic kitchen preparations made fresh daily in Patna."}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {(video.tags || ["Desi Ghee", "Patna"]).slice(0, 2).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="rounded-md bg-white/5 px-1.5 py-0.5 text-[9px] font-mono text-orange-300 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Video Modal Popup */}
      <AnimatePresence>
        {selectedVideo && (
          <div
            onClick={() => setSelectedVideo(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl border border-white/20 bg-[#1A120B] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Video Player Side */}
              <div className="flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[480px]">
                {selectedVideo.sourceType === "youtube" ||
                selectedVideo.videoUrl.includes("youtube") ||
                selectedVideo.videoUrl.includes("youtu.be") ? (
                  <iframe
                    src={getYouTubeEmbedUrl(selectedVideo.videoUrl)}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full min-h-[360px] md:min-h-[500px] border-0"
                  />
                ) : (
                  <video
                    src={selectedVideo.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[70vh] object-contain"
                  />
                )}
              </div>

              {/* Video Info Side */}
              <div className="w-full md:w-80 p-5 sm:p-6 flex flex-col justify-between bg-[#1F150D] border-t md:border-t-0 md:border-l border-white/10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-mono font-bold text-orange-400">
                      <Flame className="size-3.5 text-orange-500" /> ANIMA'S KITCHEN
                    </span>
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-white leading-tight">
                    {selectedVideo.title}
                  </h3>

                  <p className="text-xs text-cream/75 leading-relaxed">
                    {selectedVideo.description ||
                      "Watch real-time authentic food prepared hot and fresh daily in Kurji, Patna."}
                  </p>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-cream/70">
                      <span>Live Location:</span>
                      <strong className="text-white">Kurji, Patna</strong>
                    </div>
                    <div className="flex justify-between text-cream/70">
                      <span>Kitchen Status:</span>
                      <strong className="text-emerald-400">Active Daily</strong>
                    </div>
                    <div className="flex justify-between text-cream/70">
                      <span>Quality Grade:</span>
                      <strong className="text-amber-300">100% Desi Ghee</strong>
                    </div>
                  </div>

                  {/* Next / Previous Reel Navigation (Videos Change Buttons) */}
                  <div className="pt-2">
                    <span className="text-[10px] text-cream/50 font-mono block mb-1.5 uppercase tracking-wider">
                      Watch Other Kitchen Reels:
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentIdx = kitchenVideos.findIndex((v) => v.id === selectedVideo.id);
                          const prevIdx = (currentIdx - 1 + kitchenVideos.length) % kitchenVideos.length;
                          setSelectedVideo(kitchenVideos[prevIdx] || null);
                        }}
                        className="flex-1 rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs gap-1 py-2 font-mono"
                      >
                        <ChevronLeft className="size-3.5" />
                        <span>Previous</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentIdx = kitchenVideos.findIndex((v) => v.id === selectedVideo.id);
                          const nextIdx = (currentIdx + 1) % kitchenVideos.length;
                          setSelectedVideo(kitchenVideos[nextIdx] || null);
                        }}
                        className="flex-1 rounded-xl border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs gap-1 py-2 font-mono"
                      >
                        <span>Next Reel</span>
                        <ChevronRight className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <a
                    href="#menu"
                    onClick={() => setSelectedVideo(null)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E25C1D] to-[#FF7A00] text-white py-3 text-xs font-bold shadow-lg hover:opacity-95 transition-all"
                  >
                    <span>Order This Dish Fresh Now</span>
                    <ArrowRight className="size-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
