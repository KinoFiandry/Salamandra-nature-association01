"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Play, Image as ImageIcon, X, ZoomIn, ZoomOut, Download } from "lucide-react";

function getEmbedUrl(url: string): string {
  if (!url) return url;
  // Already an embed URL
  if (url.includes('/embed/')) return url;
  // youtube.com/watch?v=ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // youtube.com/shorts/ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  return url;
}

interface MediaItem {
  id: string;
  type: 'video' | 'photo';
  url: string;
  caption_en: string;
  caption_fr: string;
  thumbnail_url: string;
}

export default function MediaPage() {
  const { t, language } = useI18n();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [zoom, setZoom] = useState(1);

  // Reset zoom when image changes
  useEffect(() => { setZoom(1); }, [selectedMedia]);

  const zoomIn = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setZoom(prev => Math.min(parseFloat((prev + 0.25).toFixed(2)), 3));
  };
  const zoomOut = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setZoom(prev => Math.max(parseFloat((prev - 0.25).toFixed(2)), 0.5));
  };

  const handleDownload = async (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!selectedMedia) return;
    try {
      const response = await fetch(selectedMedia.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `photo-${selectedMedia.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(selectedMedia.url, '_blank');
    }
  };

  useEffect(() => {
    async function fetchMedia() {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setMedia(data);
      setLoading(false);
    }
    fetchMedia();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="relative py-24 bg-sage-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {t('media.title')}
          </motion.h1>
          <div className="w-24 h-2 bg-terracotta-400 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-terracotta-500">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-bold text-lg">Loading Gallery...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {media.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedMedia(item)}
                className="group relative cursor-pointer overflow-hidden rounded-[2rem] aspect-square bg-sage-50 border border-sage-100 shadow-sm hover:shadow-xl transition-all"
              >
                <Image
                  src={item.thumbnail_url || item.url}
                  alt={language === 'en' ? item.caption_en : item.caption_fr}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-sage-800/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-terracotta-500 shadow-xl scale-75 group-hover:scale-100 transition-transform">
                    {item.type === 'video' ? <Play className="w-8 h-8 fill-current" /> : <ImageIcon className="w-8 h-8" />}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-sage-950/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform">
                  <p className="text-white font-bold line-clamp-2">
                    {language === 'en' ? item.caption_en : item.caption_fr}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
            onClick={() => setSelectedMedia(null)}
          >
            {/* Top bar: Download (photos only) + Close */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10">
              {selectedMedia.type === 'photo' ? (
                <button
                  onClick={handleDownload}
                  onTouchEnd={handleDownload}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/25 active:bg-white/30 transition-colors rounded-full px-4 py-2 text-white font-semibold text-sm select-none"
                  aria-label="Download image"
                >
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              ) : <div />}
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedMedia(null); }}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/25 active:bg-white/30 transition-colors rounded-full px-4 py-2 text-white font-semibold text-sm select-none"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>

            {/* Media content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-5xl px-4 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'video' ? (
                <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl bg-black">
                  <iframe
                    src={getEmbedUrl(selectedMedia.url)}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; encrypted-media"
                  />
                </div>
              ) : (
                <div className="w-full overflow-hidden rounded-3xl shadow-2xl" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                  <img
                    src={selectedMedia.url}
                    alt="Gallery content"
                    style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}
                    className="w-full h-full object-contain block"
                    draggable={false}
                  />
                </div>
              )}
              <p className="mt-4 text-white text-lg font-bold text-center px-4">
                {language === 'en' ? selectedMedia.caption_en : selectedMedia.caption_fr}
              </p>
            </motion.div>

            {/* Zoom controls (photos only) */}
            {selectedMedia.type === 'photo' && (
              <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur rounded-full px-5 py-3 select-none"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={zoomOut}
                  onTouchEnd={zoomOut}
                  disabled={zoom <= 0.5}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 active:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-white font-mono text-sm w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  onTouchEnd={zoomIn}
                  disabled={zoom >= 3}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 active:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
