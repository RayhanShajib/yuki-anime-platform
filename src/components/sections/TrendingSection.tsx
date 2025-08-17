"use client";

import { AnimeCard } from "@/components/ui/AnimeCard";
import { cn } from "@/lib/utils";
import { Anime } from "@/types/anime";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Timer,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TrendingSectionProps {
  trendingAnime: Anime[];
}

type TimeFilter = "now" | "day" | "week" | "month";

const timeFilters: { key: TimeFilter; label: string; icon: React.ReactNode }[] =
  [
    { key: "now", label: "Now", icon: <TrendingUp className="h-4 w-4" /> },
    { key: "day", label: "Day", icon: <Clock className="h-4 w-4" /> },
    { key: "week", label: "Week", icon: <Calendar className="h-4 w-4" /> },
    { key: "month", label: "Month", icon: <Timer className="h-4 w-4" /> },
  ];

export function TrendingSection({ trendingAnime }: TrendingSectionProps) {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>("now");
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // In a real app, this would filter the data based on the time period
  const filteredAnime = trendingAnime.slice(0, 10);

  // Calculate how many cards are visible at once based on container width
  const [cardsPerView, setCardsPerView] = useState(4);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = 170;
        const gap = 25;

        // Responsive navigation button space (no margins now, just button space)
        const buttonSpace = window.innerWidth >= 768 ? 80 : 64; // 40px each side for md+, 32px for smaller
        const availableWidth = containerWidth - buttonSpace;

        const maxCards = Math.floor((availableWidth + gap) / (cardWidth + gap));
        setCardsPerView(Math.min(maxCards, filteredAnime.length));
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, [filteredAnime.length]);

  const maxIndex = Math.max(0, filteredAnime.length - cardsPerView);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const goToPrev = () => {
    if (canGoPrev) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    }
  };

  return (
    <section className="py-12 backdrop-blur-sm relative">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 text-3xl font-bold text-white flex-wrap gap-5">
          <h2 className="text-3xl font-bold text-white flex items-center txt-heading">
            <TrendingUp className="h-8 w-8 text-blue-500 mr-3" />
            Trending
          </h2>

          {/* Time Filter Buttons */}
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1 flex-wrap">
            {timeFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer",
                  activeFilter === filter.key
                    ? "bg-blue-600 text-white/90 shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                )}>
                {filter.icon}
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Card Slider */}
        <div className="relative" ref={containerRef}>
          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            disabled={!canGoPrev}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all duration-200 group",
              "w-8 h-full md:w-15 md:h-full", // Responsive button size
              canGoPrev
                ? "text-white hover:text-blue-600"
                : "text-gray-500 cursor-not-allowed"
            )}>
            <ChevronLeft className="h-30 w-40 md:h-30 md:w-40 group-hover:text-blue-600" />
          </button>

          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all duration-200 group",
              "w-8 h-full md:w-15 md:h-full", // Responsive button size
              canGoNext
                ? "text-white hover:text-blue-600"
                : "text-gray-500 cursor-not-allowed"
            )}>
            <ChevronRight className="h-30 w-40 md:h-30 md:w-40 group-hover:text-blue-600" />
          </button>

          {/* Cards Container */}
          <div className="overflow-x-clip">
            <div
              className="flex transition-transform duration-300 ease-in-out h-auto"
              style={{
                transform: `translateX(-${currentIndex * 150}px)`,
                gap: "20px",
                height: "auto",
              }}>
              {filteredAnime.map((anime) => (
                <div
                  key={anime.id}
                  className="flex-shrink-0 overflow-visible  relative"
                  style={{ width: "170px" }}>
                  <AnimeCard
                    anime={anime}
                    showPopup={true}
                    className="h-auto overflow-visible"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}