"use client";

import { useState } from "react";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation as SwiperNavigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface ApiAiringAnime {
  id: number | null;
  title: string;
  title_japanese?: string;
  sub_total?: number;
  image?: string;
  airing?: boolean;
  [key: string]: unknown;
}

interface TransformedAnime {
  id: string;
  title: string;
  episode: string;
  episodeTitle: string;
  time: string;
  poster: string;
  isNew: boolean;
}

interface ScheduleSectionProps {
  airingAnime: ApiAiringAnime[];
}

// Transform API airing data to schedule format
const transformAiringData = (airingAnime: ApiAiringAnime[]) => {
  const transformedAnime = airingAnime
    .filter((anime: ApiAiringAnime): anime is ApiAiringAnime & { id: number } => anime.id != null) // Filter out anime with null/undefined IDs
    .map((anime: ApiAiringAnime & { id: number }) => ({
      id: anime.id.toString(),
      title: anime.title || 'Unknown Title',
      episode: `Episode ${anime.sub_total || '?'}`,
      episodeTitle: anime.title_japanese || '',
      time: "TBA JST", // API doesn't seem to have time data
      poster: anime.image || '/placeholder-anime.jpg',
      isNew: anime.airing || false,
    }));

  // Generate dynamic day keys
  const daysKeys = generateDaysOfWeek().map(day => day.key);
  const schedule: Record<string, typeof transformedAnime> = {};
  
  daysKeys.forEach(day => {
    schedule[day] = [];
  });

  // Distribute anime across days (2-3 per day)
  transformedAnime.forEach((anime, index) => {
    const dayIndex = Math.floor(index / 3) % daysKeys.length;
    const dayKey = daysKeys[dayIndex];
    if (schedule[dayKey].length < 3) {
      schedule[dayKey].push(anime);
    }
  });

  return schedule;
};

// Generate dynamic dates
const generateDaysOfWeek = () => {
  const today = new Date();
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    let label = '';
    if (i === 0) label = 'Today';
    else if (i === 1) label = 'Tomorrow';
    else label = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    days.push({
      key: i === 0 ? 'today' : i === 1 ? 'tomorrow' : date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
      label,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return days;
};

const daysOfWeek = generateDaysOfWeek();

export default function ScheduleSection({ airingAnime }: ScheduleSectionProps) {
  const [activeDay, setActiveDay] = useState("today");
  
  // Transform API data to match the expected structure
  const transformedData = transformAiringData(airingAnime);
  const currentSchedule = transformedData[activeDay as keyof typeof transformedData] || [];

  return (
    <div className="bg-gray-900/30 bg-schedule-section">
      <main className="pt-3 sm:pt-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center txt-heading">
            Estimated Schedule
          </h1>

          {/* Day Navigation */}
          <div className="mt-8 mb-6 flex justify-center">
            {/* Desktop Navigation */}
            <div className="hidden sm:flex space-x-1 bg-gray-800 rounded-xl p-2 flex-wrap navigation-tabs justify-center">
              {daysOfWeek.map((day) => (
                <button
                  key={day.key}
                  onClick={() => setActiveDay(day.key)}
                  className={cn(
                    "flex-shrink-0 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer",
                    activeDay === day.key
                      ? "btn-purple text-white/90 shadow-lg"
                      : "text-gray-300 hover:text-white hover:btn-[#7760A9]"
                  )}>
                  <div className="text-center">
                    <div className="font-semibold">{day.label}</div>
                    <div className="text-xs opacity-75">{day.date}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Mobile Navigation with Swiper */}
            <div className="sm:hidden bg-gray-800 rounded-xl p-2 relative group w-[90%]">
              <Swiper
                modules={[SwiperNavigation]}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                slidesPerView="auto"
                spaceBetween={4}
                className="w-full px-6 relations-swiper">
                {daysOfWeek.map((day) => (
                  <SwiperSlide key={day.key} className="!w-auto">
                    <button
                      onClick={() => setActiveDay(day.key)}
                      className={cn(
                        "flex-shrink-0 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer",
                        activeDay === day.key
                          ? "btn-purple text-white/90 shadow-lg"
                          : "text-gray-300 hover:text-white hover:btn-[#7760A9]"
                      )}>
                      <div className="text-center">
                        <div className="font-semibold">{day.label}</div>
                        <div className="text-xs opacity-75">{day.date}</div>
                      </div>
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper-button-prev-custom absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-white">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 19.5L8.25 12 15.75 4.5"
                    />
                  </svg>
                </div>
              </div>
              <div className="swiper-button-next-custom absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10">
                <div className="p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-white">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Content */}
          <div className="space-y-6 pt-3">
            {currentSchedule.length > 0 ? (
              currentSchedule.map((anime: TransformedAnime) => (
                <div
                  key={anime.id}
                  className="rounded-lg borde transition-colors pb-2">
                  <div className="flex items-center space-x-4">
                    {/* Poster */}
                    <div className="flex-shrink-0">
                      <Image
                        src={anime.poster}
                        alt={anime.title}
                        width={70}
                        height={105}
                        className="object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-anime.jpg';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1 txt-para">
                            {anime.title}
                          </h3>
                          <p className="text-[#F5B9D4] font-medium mb-1 txt-small">
                            {anime.episode}
                            {anime.episodeTitle && (
                              <span className="text-gray-300 font-normal">
                                {" - "}
                                {anime.episodeTitle}
                              </span>
                            )}
                          </p>
                          <div className="flex items-center text-gray-300 text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="txt-small">{anime.time}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center">
                          <button
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
                            title="Add to watchlist">
                            <BookOpen className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No releases scheduled
                </h3>
                <p className="text-gray-500">
                  No anime episodes are scheduled for this day.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
