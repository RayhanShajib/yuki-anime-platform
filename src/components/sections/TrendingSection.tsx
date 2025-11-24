"use client";

import { AnimeCard } from "@/components/ui/AnimeCard";
import { cn } from "@/lib/utils";
import { Anime } from "@/types/anime";
import { Calendar, Clock, Timer, TrendingUp } from "lucide-react";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface TrendingData {
  now: Anime[];
  day: Anime[];
  week: Anime[];
  month: Anime[];
}

interface TrendingSectionProps {
  trendingData: TrendingData;
}



type TimeFilter = "now" | "day" | "week" | "month";

const timeFilters: { key: TimeFilter; label: string; icon: React.ReactNode }[] =
  [
    { key: "now", label: "Now", icon: <TrendingUp className="h-4 w-4" /> },
    { key: "day", label: "Day", icon: <Clock className="h-4 w-4" /> },
    { key: "week", label: "Week", icon: <Calendar className="h-4 w-4" /> },
    { key: "month", label: "Month", icon: <Timer className="h-4 w-4" /> },
  ];

export function TrendingSection({ trendingData }: TrendingSectionProps) {
  const [activeFilter, setActiveFilter] = useState<TimeFilter>("day");
  
  // Filter the data based on the selected time period
  const getFilteredAnime = (filter: TimeFilter): Anime[] => {
    return trendingData[filter] || [];
  };
  
  const filteredAnime: Anime[] = getFilteredAnime(activeFilter).slice(0, 10);

  return (
    <section className="py-3 sm:py-12 backdrop-blur-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 text-3xl font-bold text-white flex-wrap gap-5">
          <h2 className="text-3xl font-bold text-white flex items-center txt-heading">
            <TrendingUp className="h-8 w-8 text-[#F5B9D4] mr-3" />
            Trending
          </h2>

          {/* Time Filter Buttons */}
          <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1 flex-wrap trending-navigation-tabs">
            {timeFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  "flex items-center space-x-1.5 px-2.5 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer",
                  activeFilter === filter.key
                    ? "btn-purple text-white/90 shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                )}>
                {filter.icon}
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Swiper Card Slider */}
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 25,
            },
            1280: {
              slidesPerView: 8,
              spaceBetween: 30,
            },
            1536: {
              slidesPerView: 8,
              spaceBetween: 30,
            },
          }}
          className="!pb-10 relations-swiper">
          {filteredAnime.map((anime) => (
            <SwiperSlide key={anime.id}>
              <div className="relative">
                <AnimeCard anime={anime} showPopup={true} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
