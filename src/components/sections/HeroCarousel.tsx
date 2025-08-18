"use client";

import Image from "next/image";

import { formatRating, truncateText } from "@/lib/utils";
import { Anime } from "@/types/anime";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Plus,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useState } from "react";

interface HeroCarouselProps {
  featuredAnime: Anime[];
}

export function HeroCarousel({ featuredAnime }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying] = useState(true);

  const currentAnime = featuredAnime[currentIndex];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAnime.length);
    }, 60000); // 60 seconds (slower)

    return () => clearInterval(interval);
  }, [featuredAnime.length, isPlaying]);

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + featuredAnime.length) % featuredAnime.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredAnime.length);
  };

  if (!currentAnime) return null;

  return (
    <div className="relative w-full h-[80vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] xl:h-[100vh] carousel overflow-hidden min-w-full">
      <div className="absolute inset-0">
        {currentAnime.trailer ? (
          <video
            key={currentAnime.id}
            autoPlay
            muted={isMuted}
            loop
            className="w-full h-full object-cover scale-110 sm:scale-105 md:scale-100"
            poster={currentAnime.banner || currentAnime.poster}
            playsInline
            disablePictureInPicture
            controls={false}
            onTouchStart={(e) => e.preventDefault()}
            onClick={(e) => e.preventDefault()}>
            <source src={currentAnime.trailer} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={currentAnime.banner || currentAnime.poster}
            alt={currentAnime.title}
            fill
            className="w-full h-full object-cover scale-110 sm:scale-105 md:scale-100"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
            priority
          />
        )}

        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl m-auto px-4 sm:px-6 lg:px-8 w-full pt-4 sm:pt-6 md:pt-7">
          <div className="max-w-xl sm:max-w-2xl mt-16 sm:mt-32 md:mt-48 lg:mt-64 xl:mt-[300px] carousel-content">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white/90 mb-2 sm:mb-3 md:mb-4 animate-fadeIn txt-heading leading-tight">
              {currentAnime.title}
            </h1>

            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-3 md:mb-4 text-white/80 flex-wrap">
              <span className="flex items-center txt-para text-sm sm:text-base">
                ⭐ {formatRating(currentAnime.rating)}
              </span>
              <span className="txt-para text-sm sm:text-base">
                {currentAnime.releaseYear}
              </span>
              <span className="px-2 py-1 bg-blue-600 rounded text-xs font-semibold txt-small">
                {currentAnime.type.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3 md:mb-4">
              {currentAnime.genres.slice(0, 4).map((genre) => (
                <span
                  key={genre}
                  className="px-2 sm:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm text-white/90 txt-small">
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-sm sm:text-md text-white/90 mb-3 sm:mb-4 leading-relaxed txt-small line-clamp-3 sm:line-clamp-4 md:line-clamp-none">
              {truncateText(currentAnime.synopsis, 200)}
            </p>

            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 gap-2 sm:gap-3 md:gap-3.5 flex-wrap">
              <button className="flex items-center space-x-1 sm:space-x-2 bg-white text-black px-3 sm:px-4 py-2 rounded-lg hover:bg-white/90 transition-colors font-semibold cursor-pointer text-sm sm:text-base">
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Watch Now</span>
              </button>

              <button className="flex items-center space-x-1 sm:space-x-2 bg-gray-700/80 backdrop-blur-sm text-white/90 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600/80 transition-colors font-semibold cursor-pointer text-sm sm:text-base">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Add to List</span>
                <span className="sm:hidden">Add List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay gradient: strong black only at left-bottom and right-top corners, rest transparent */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 0% 100%, rgb(0 0 0) 0%, rgb(0 0 0) 20%, rgb(0 0 0 / 0%) 40%), radial-gradient(circle at 100% 0%, rgba(0, 0, 0, 1) 0%, rgb(0 0 0 / 0%) 20%, rgba(0, 0, 0, 0) 40%)",
        }}></div>

      {/* Strong black full-width bottom gradient overlay */}
      <div
        className="absolute bottom-0 left-0 w-full h-10 md:h-15 lg:h-15 xl:h-15 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 100%)",
        }}
      />

      {currentAnime.trailer && (
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-7 right-2 sm:right-3 md:right-4 z-20 flex flex-col space-y-1 sm:space-y-2 carousel-control">
          {/* Carousel Navigation Buttons */}
          <div className="flex flex-col space-y-1">
            <button
              onClick={goToPrevious}
              className="p-1.5 sm:p-2 bg-gray-900/50 backdrop-blur-sm text-white/90 rounded-full hover:bg-black/70 transition-colors cursor-pointer"
              aria-label="Previous slide">
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={goToNext}
              className="p-1.5 sm:p-2 bg-gray-900/50 backdrop-blur-sm text-white/90 rounded-full hover:bg-black/70 transition-colors cursor-pointer"
              aria-label="Next slide">
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Mute/Unmute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 sm:p-3 bg-gray-900/50 backdrop-blur-sm text-white/90 rounded-full hover:bg-black/70 transition-colors cursor-pointer"
            aria-label={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? (
              <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
