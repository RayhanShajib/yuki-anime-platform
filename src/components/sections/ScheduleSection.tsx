"use client";

import { useState } from "react";
import { Calendar, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation as SwiperNavigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const daysOfWeek = [
  { key: "today", label: "Today", date: "Dec 28" },
  { key: "tomorrow", label: "Tomorrow", date: "Dec 29" },
  { key: "monday", label: "Monday", date: "Dec 30" },
  { key: "tuesday", label: "Tuesday", date: "Dec 31" },
  { key: "wednesday", label: "Wednesday", date: "Jan 1" },
  { key: "thursday", label: "Thursday", date: "Jan 2" },
  { key: "friday", label: "Friday", date: "Jan 3" },
];

const scheduleData = {
  today: [
    {
      id: "1",
      title: "Attack on Titan: Final Season",
      episode: "Episode 12",
      episodeTitle: "The Final Battle",
      time: "16:05 JST",
      poster:
        "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg",
      isNew: true,
    },
    {
      id: "2",
      title: "Demon Slayer: Kimetsu no Yaiba",
      episode: "Episode 8",
      episodeTitle: "The Sound of Thunder",
      time: "23:15 JST",
      poster:
        "https://m.media-amazon.com/images/M/MV5BODRmZDVmNzUtZDA4ZC00NjhkLWI2M2UtN2M0ZDIzNDcxYThjL2ltYWdlXkEyXkFqcGdeQXVyNTk0MzMzODA@._V1_FMjpg_UX1000_.jpg",
      isNew: true,
    },
  ],
  tomorrow: [
    {
      id: "3",
      title: "Jujutsu Kaisen Season 2",
      episode: "Episode 15",
      episodeTitle: "Hidden Inventory",
      time: "24:25 JST",
      poster: "https://via.placeholder.com/80x120/4a2d4a/white?text=JJK",
      isNew: true,
    },
  ],
  monday: [
    {
      id: "4",
      title: "One Piece",
      episode: "Episode 1095",
      episodeTitle: "The Legendary Devil Fruit",
      time: "09:30 JST",
      poster: "https://via.placeholder.com/80x120/4a4a2d/white?text=OP",
      isNew: false,
    },
  ],
  tuesday: [],
  wednesday: [
    {
      id: "5",
      title: "My Hero Academia Season 7",
      episode: "Episode 4",
      episodeTitle: "Heroes Rising",
      time: "17:30 JST",
      poster: "https://via.placeholder.com/80x120/2d2d4a/white?text=MHA",
      isNew: true,
    },
  ],
  thursday: [],
  friday: [
    {
      id: "6",
      title: "Chainsaw Man",
      episode: "Episode 13",
      episodeTitle: "The Devil Hunter",
      time: "24:00 JST",
      poster:
        "https://m.media-amazon.com/images/M/MV5BODRmZDVmNzUtZDA4ZC00NjhkLWI2M2UtN2M0ZDIzNDcxYThjL2ltYWdlXkEyXkFqcGdeQXVyNTk0MzMzODA@._V1_FMjpg_UX1000_.jpg",
      isNew: true,
    },
  ],
};

export default function ScheduleSection() {
  const [activeDay, setActiveDay] = useState("today");
  const currentSchedule =
    scheduleData[activeDay as keyof typeof scheduleData] || [];

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
                      ? "bg-blue-600 text-white/90 shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
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
                          ? "bg-blue-600 text-white/90 shadow-lg"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
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
              currentSchedule.map((anime) => (
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
                        height={50}
                        className="object-cover rounded-lg"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1 txt-para">
                            {anime.title}
                          </h3>
                          <p className="text-blue-600 font-medium mb-1 txt-small">
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
