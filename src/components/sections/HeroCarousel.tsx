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
    <div className="relative w-full h-[45vh] sm:h-[50vh] md:h-[55vh] lg:h-[65vh] xl:h-[650px] min-h-[350px] max-w-[1800px] mx-auto carousel overflow-hidden">
      <div className="absolute inset-0">
        {currentAnime.trailer ? (
          <video
            key={currentAnime.id}
            autoPlay
            muted={isMuted}
            loop
            className="w-full h-full object-cover carousel"
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
            className="w-full h-full object-cover"
            sizes="(max-width: 1800px) 100vw, 1800px"
            priority
          />
        )}
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex items-center carousel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex items-end">
          <div className="max-w-xl sm:max-w-2xl carousel-content">
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
              <span className="px-2 py-1 rounded text-xs font-semibold txt-small btn-purple">
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

            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 gap-2 sm:gap-3 md:gap-3.5 flex-wrap mb-4 sm:mb-6">
              <button className="flex items-center space-x-1 sm:space-x-2 bg-white text-black px-3 sm:px-4 py-2 rounded-lg hover:bg-white/90 transition-colors font-semibold cursor-pointer text-sm sm:text-base btn-purple">
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Watch Now</span>
              </button>

              <button className="flex items-center space-x-1 sm:space-x-2 bg-gray-700/80 backdrop-blur-sm text-white/90 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600/80 transition-colors font-semibold cursor-pointer text-sm sm:text-base btn-pink">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Add to List</span>
                <span className="sm:hidden">Add List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Left gradient overlay - full black at left edge */}
      <div
        className="absolute inset-0 z-0 pointer-events-none carousel"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 15%, rgba(0,0,0,0.75) 25%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.08) 75%, rgba(0,0,0,0.03) 85%, rgba(0,0,0,0) 100%)",
        }}></div>

      {/* Right tiny gradient overlay for xl screens only (>1800px) */}
      <div
        className="hidden xl:block absolute inset-0 z-0 pointer-events-none carousel"
        style={{
          background:
            "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 5%, rgba(0,0,0,0.4) 10%, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0) 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0) 65%, rgba(0,0,0,0) 75%, rgba(0,0,0,0) 85%, rgba(0,0,0,0) 100%)",
        }}></div>

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none carousel"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 5%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0) 15%, rgba(0,0,0,0) 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0) 65%, rgba(0,0,0,0) 75%, rgba(0,0,0,0) 85%, rgba(0,0,0,0) 100%)",
        }}></div>

      {currentAnime.trailer && (
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-7 right-2 sm:right-3 md:right-4 z-20 flex flex-col space-y-1 sm:space-y-2 carousel-control">
          {/* Carousel Navigation Buttons */}
          <div className="flex flex-col space-y-1">
            <button
              onClick={goToPrevious}
              className="p-1.5 sm:p-2 btn-purple backdrop-blur-sm text-white/90 rounded-full transition-colors cursor-pointer"
              aria-label="Previous slide">
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={goToNext}
              className="p-1.5 sm:p-2 btn-purple backdrop-blur-sm text-white/90 rounded-full transition-colors cursor-pointer"
              aria-label="Next slide">
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>

          {/* Mute/Unmute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 sm:p-3 btn-purple backdrop-blur-sm text-white/90 rounded-full transition-colors cursor-pointer"
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
