"use client";

import { AnimeCard } from "@/components/ui/AnimeCard";
import { cn } from "@/lib/utils";
import { Anime } from "@/types/anime";
import { Calendar, Clock, Timer, TrendingUp } from "lucide-react";
import { useState } from "react";

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

  // In a real app, this would filter the data based on the time period
  const filteredAnime = trendingAnime.slice(0, 10);

  return (
    <section className="py-12 bg-gray-900/50 backdrop-blur-sm relative">
      {/* Top blur gradient */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black via-black/60 to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 text-3xl font-bold text-white flex-wrap gap-5">
          <h2 className="text-3xl font-bold text-white flex items-center">
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
                  "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeFilter === filter.key
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                )}>
                {filter.icon}
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trending List */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {filteredAnime.map((anime) => (
            <div key={anime.id} className="relative">
              <AnimeCard
                anime={anime}
                showPopup={true}
                className="transform transition-transform hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
