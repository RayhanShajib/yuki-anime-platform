"use client";

import { Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data with random images and progress
const mockContinueWatching = [
  {
    id: "1",
    title: "Attack on Titan: Final Season",
    poster: "https://picsum.photos/340/510?random=1",
    episode: 15,
    currentTime: 24 * 60,
    totalTime: 50 * 60,
    progress: 48,
    rating: 9.0,
    subEpisodes: 20,
    dubEpisodes: 12,
  },
  {
    id: "2",
    title: "Demon Slayer: Kimetsu no Yaiba",
    poster: "https://picsum.photos/340/510?random=2",
    episode: 8,
    currentTime: 18 * 60,
    totalTime: 45 * 60,
    progress: 40,
    rating: 8.7,
    subEpisodes: 30,
    dubEpisodes: 22,
  },
  {
    id: "3",
    title: "Jujutsu Kaisen",
    poster: "https://picsum.photos/340/510?random=3",
    episode: 22,
    currentTime: 42 * 60,
    totalTime: 48 * 60,
    progress: 87,
    rating: 8.6,
    subEpisodes: 24,
    dubEpisodes: 18,
  },
  {
    id: "4",
    title: "My Hero Academia",
    poster: "https://picsum.photos/340/510?random=4",
    episode: 45,
    currentTime: 5 * 60,
    totalTime: 52 * 60,
    progress: 10,
    rating: 8.4,
    subEpisodes: 90,
    dubEpisodes: 85,
  },
];

// Helper function to format time
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function ContinueWatchingSection() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Play className="h-8 w-8 text-[#F5B9D4] mr-3" />
            Continue Watching
          </h2>

          <Link
            href="/continue-watching"
            className="text-pink hover:text-blue-300 transition-colors font-medium">
            View All
          </Link>
        </div>

        {/* Continue Watching Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-7 gap-2 sm:gap-3 lg:gap-7">
          {mockContinueWatching.map((item) => (
            <div key={item.id} className="relative group">
              <div className="relative overflow-hidden rounded-xl bg-gray-800 transition-all duration-300 group-hover:scale-95">
                <Link href="#">
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={item.poster}
                      alt={item.title}
                      width={340}
                      height={510}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button className="absolute top-2 right-2 z-20 p-1 bg-black/70 hover:bg-black/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-4 w-4 text-white" />
                    </button>

                    {/* Episode Info */}
                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-semibold">
                      EP {item.episode}
                    </div>
                  </div>
                </Link>
              </div>

              {/* Bottom info bar: like AnimeCard */}
              <div className="w-full py-1 flex flex-col gap-1 mt-1">
                <h3 className="text-white font-bold text-base leading-tight">
                  {item.title.length > 40
                    ? item.title.substring(0, 40) + "..."
                    : item.title}
                </h3>

                {/* Time Progress */}
                <div className="flex items-center justify-between text-xs text-gray-300 mt-1">
                  <span>
                    {formatTime(item.currentTime)}/{formatTime(item.totalTime)}
                  </span>
                </div>

                {/* Progress Bar - positioned below time */}
                <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                  <div
                    className="h-full bg-green-500 transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min(item.progress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
