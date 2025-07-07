'use client';

import { useState, useEffect } from 'react';
import { Play, Plus, VolumeX, Volume2 } from 'lucide-react';
import { Anime } from '@/types/anime';
import { cn, truncateText, formatRating } from '@/lib/utils';

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

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!currentAnime) return null;

  return (
    <div className="relative w-full h-[100vh] overflow-hidden">
      <div className="absolute inset-0">
        {currentAnime.trailer ? (
          <video
            key={currentAnime.id}
            autoPlay
            muted={isMuted}
            loop
            className="w-full h-full object-cover"
            poster={currentAnime.banner || currentAnime.poster}
          >
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
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-lg text-white/90 mb-5 leading-relaxed">
              {truncateText(currentAnime.synopsis, 200)}
            </p>

            <div className="flex items-center space-x-4 mb-6">
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

      {currentAnime.trailer && (
        <div className="absolute bottom-4 right-4 z-20">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {featuredAnime.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
