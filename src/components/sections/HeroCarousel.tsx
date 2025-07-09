"use client";

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
  const [isPlaying, setIsPlaying] = useState(true);

  const currentAnime = featuredAnime[currentIndex];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredAnime.length);
    }, 8000);

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
    <div className="relative w-full h-[100vh] overflow-hidden min-w-full">
      <div className="absolute inset-0">
        {currentAnime.trailer ? (
          <video
            key={currentAnime.id}
            autoPlay
            muted={isMuted}
            loop
            className="w-full h-full object-cover"
            poster={currentAnime.banner || currentAnime.poster}
            playsInline
            disablePictureInPicture
            controls={false}
            onTouchStart={(e) => e.preventDefault()}
            onClick={(e) => e.preventDefault()}>
            <source src={currentAnime.trailer} type="video/mp4" />
          </video>
        ) : (
          <img
            src={currentAnime.banner || currentAnime.poster}
            alt={currentAnime.title}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Main content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-7">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fadeIn">
              {currentAnime.title}
            </h1>

            <div className="flex items-center space-x-4 mb-4 text-white/80">
              <span className="flex items-center">
                ⭐ {formatRating(currentAnime.rating)}
              </span>
              <span>{currentAnime.releaseYear}</span>
              <span className="px-2 py-1 bg-blue-600 rounded text-xs font-semibold">
                {currentAnime.type.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {currentAnime.genres.slice(0, 4).map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white">
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-lg text-white/90 mb-5 leading-relaxed">
              {truncateText(currentAnime.synopsis, 200)}
            </p>

            <div className="flex items-center space-x-4 gap-3.5 flex-wrap">
              <button className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-lg hover:bg-white/90 transition-colors font-semibold">
                <Play className="h-5 w-5" />
                <span>Watch Now</span>
              </button>

              <button className="flex items-center space-x-2 bg-gray-700/80 backdrop-blur-sm text-white px-8 py-3 rounded-lg hover:bg-gray-600/80 transition-colors font-semibold">
                <Plus className="h-5 w-5" />
                <span>Add to List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom blur gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none" />

      {currentAnime.trailer && (
        <div className="absolute bottom-7 right-4 z-20 flex flex-col space-y-2">
          {/* Carousel Navigation Buttons */}
          <div className="flex flex-col space-y-1">
            <button
              onClick={goToPrevious}
              className="p-2 bg-gray-900/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
              aria-label="Previous slide">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 bg-gray-900/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
              aria-label="Next slide">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Mute/Unmute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 bg-gray-900/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}>
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
