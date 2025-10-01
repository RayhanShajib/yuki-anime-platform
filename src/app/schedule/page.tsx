"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { cn } from "@/lib/utils";
import { pageApi } from "@/lib/api/pageApi";
import { BookOpen, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation as SwiperNavigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// API Response Types
interface ApiAnimeSchedule {
  id: string | null;
  airing_at: number;
  title: {
    romaji: string;
    english: string | null;
  };
  episode: number;
  episodes: number | null;
  genres: string[];
  thumbnail: string;
  trailer: string | null;
}

// Internal Component Types
interface ScheduleAnime {
  id: string;
  title: string;
  episode: string;
  episodeTitle?: string;
  time: string;
  poster: string;
  isNew: boolean;
}

// Utility functions for data transformation
const getDayKey = (date: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  
  if (isToday) return "today";
  if (isTomorrow) return "tomorrow";
  
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return dayNames[date.getDay()];
};

const formatJSTTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  // Convert to JST (UTC+9)
  const jstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
  return jstDate.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  }) + ' JST';
};

const transformApiDataToSchedule = (apiData: ApiAnimeSchedule[]): Record<string, ScheduleAnime[]> => {
  const schedule: Record<string, ScheduleAnime[]> = {
    today: [],
    tomorrow: [],
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  };

  apiData.forEach((anime, index) => {
    const date = new Date(anime.airing_at * 1000);
    const dayKey = getDayKey(date);
    
    const transformedAnime: ScheduleAnime = {
      id: anime.id || `anime-${index}`,
      title: anime.title.english || anime.title.romaji,
      episode: `Episode ${anime.episode}`,
      time: formatJSTTime(anime.airing_at),
      poster: anime.thumbnail,
      isNew: anime.episode === 1 || Math.random() > 0.5 // Temporary logic for "new" episodes
    };
    
    schedule[dayKey]?.push(transformedAnime);
  });

  return schedule;
};

const generateDaysOfWeek = () => {
  const days = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    let label = "";
    let key = "";
    
    if (i === 0) {
      label = "Today";
      key = "today";
    } else if (i === 1) {
      label = "Tomorrow";
      key = "tomorrow";
    } else {
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      label = dayNames[date.getDay()];
      key = label.toLowerCase();
    }
    
    days.push({
      key,
      label,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return days;
};

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState("today");
  const [scheduleData, setScheduleData] = useState<Record<string, ScheduleAnime[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const daysOfWeek = generateDaysOfWeek();

  // Fetch schedule data
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiResponse: ApiAnimeSchedule[] = await pageApi.getSchedulePageData();
        const transformedData = transformApiDataToSchedule(apiResponse);
        
        setScheduleData(transformedData);
      } catch (err) {
        console.error('Error fetching schedule data:', err);
        setError('Failed to load schedule data');
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  const currentSchedule = scheduleData[activeDay] || [];

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center txt-heading">
              Anime Schedule
            </h1>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Loading Schedule...
              </h3>
              <p className="text-gray-500">
                Please wait while we fetch the latest anime schedule.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-400 mb-2">
                Error Loading Schedule
              </h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-purple text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Day Navigation */}
          {!loading && !error && (
            <>
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
                      : "text-gray-300 hover:text-white hover:bg-[#7760A9]"
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
                          : "text-gray-300 hover:text-white hover:bg-[#7760A9]"
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
          <div className="space-y-6">
            {currentSchedule.length > 0 ? (
              currentSchedule.map((anime) => (
                <div
                  key={anime.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer">
                  <div className="flex items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 gap-3">
                    {/* Poster */}
                    <div className="flex-shrink-0 schedule-anime-img">
                      <Image
                        src={anime.poster}
                        alt={anime.title}
                        width={100}
                        height={130}
                        className="object-cover rounded-lg"
                        style={{ objectFit: "cover" }}
                        unoptimized={anime.poster.startsWith(
                          "https://via.placeholder.com"
                        )}
                        priority
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row items-start justify-between w-full">
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 txt-para">
                            {anime.title}
                          </h3>
                          <p className="text-pink font-medium mb-1 txt-small">
                            {anime.episode}
                            {anime.episodeTitle && (
                              <span className="text-gray-400 font-normal txt-small">
                                {" - "}
                                {anime.episodeTitle}
                              </span>
                            )}
                          </p>
                          <div className="flex items-center text-gray-400 text-sm flex-wrap">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="txt-small">{anime.time}</span>
                            <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded txt-small">
                              Simulcast
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3 mt-2 sm:mt-0 flex-wrap">
                          {anime.isNew && (
                            <span className="btn-purple text-white/90 px-2 py-1 rounded sm:text-xs font-bold text-[11px]">
                              NEW
                            </span>
                          )}
                          <button
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
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
            </>
          )}
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
