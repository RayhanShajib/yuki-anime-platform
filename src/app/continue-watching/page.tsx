"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { mockAnime } from "@/lib/mockData";
import {
  Clock,
  Grid3X3,
  List,
  MoreVertical,
  Play,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

// Mock data for continue watching with progress
const continueWatchingData = mockAnime.slice(0, 12).map((anime) => ({
  ...anime,
  currentEpisode:
    Math.floor(Math.random() * (Number(anime.episodes) || 24)) + 1,
  totalEpisodes:
    typeof anime.episodes === "number"
      ? anime.episodes
      : Array.isArray(anime.episodes)
      ? anime.episodes.length
      : 24,
  lastWatched: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  progress: Math.random() * 100,
  timeLeft: Math.floor(Math.random() * 25) + 5, // minutes left in current episode
  isNewEpisode: Math.random() > 0.7,
}));

type ViewMode = "grid" | "list";
type SortBy = "lastWatched" | "progress" | "alphabetical" | "rating";

export default function ContinueWatchingPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("lastWatched");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(continueWatchingData);

  // Filter and sort data
  useEffect(() => {
    const filtered = continueWatchingData.filter((anime) =>
      anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "lastWatched":
          return (
            new Date(b.lastWatched).getTime() -
            new Date(a.lastWatched).getTime()
          );
        case "progress":
          return b.progress - a.progress;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredData(filtered);
  }, [searchQuery, sortBy]);

  const getProgressColor = (progress: number) => {
    // if (progress < 30) return "bg-red-500";
    // if (progress < 70) return "bg-yellow-500";
    return "bg-blue-600";
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center">
              Continue Watching
            </h1>
          </div>

          {/* Search and Controls */}
          <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-700 mb-6 sm:mb-8">
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your watching list..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white/90 placeholder-gray-400 focus:outline-none text-sm sm:text-base"
                />
              </div>

              {/* Controls Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Sort By */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 text-sm font-medium">
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white/90 text-sm focus:outline-none">
                    <option value="lastWatched">Last Watched</option>
                    <option value="progress">Progress</option>
                    <option value="alphabetical">A-Z</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[40px] ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white/90"
                        : "text-gray-300 hover:text-white hover:bg-gray-600"
                    }`}>
                    <Grid3X3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[40px] ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white/90"
                        : "text-gray-300 hover:text-white hover:bg-gray-600"
                    }`}>
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400 text-sm sm:text-base">
              {filteredData.length}{" "}
              {filteredData.length === 1 ? "anime" : "anime"} in your list
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors text-sm">
                <X className="h-4 w-4" />
                <span>Clear search</span>
              </button>
            )}
          </div>

          {/* Content */}
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery ? "No results found" : "No anime in progress"}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Start watching some anime to see them here!"}
              </p>
              {!searchQuery && (
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Browse Anime
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 lg:gap-7">
                  {filteredData.map((anime) => (
                    <div key={anime.id} className="relative group">
                      <AnimeCard anime={anime} showPopup={true} />

                      {/* Progress Info */}
                      <div className="mt-2 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs sm:text-sm text-gray-300">
                            20:00/50:00
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-700 rounded-full h-1 mb-2">
                          <div
                            className={`h-1 rounded-full transition-all duration-300 ${getProgressColor(
                              anime.progress
                            )}`}
                            style={{ width: `${anime.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-3 sm:space-y-4">
                  {filteredData.map((anime) => (
                    <div
                      key={anime.id}
                      className="bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 space-y-3 sm:space-y-0 sm:space-x-4 gap-3.5 cursor-pointer">
                        {/* Poster */}
                        <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                          <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden">
                            <Image
                              src={anime.poster}
                              alt={anime.title}
                              width={80}
                              height={96}
                              className="object-cover w-full h-full"
                              priority
                            />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 text-center sm:text-left w-full">
                          <h3 className="text-white font-semibold text-sm sm:text-base truncate mb-1">
                            {anime.title}
                          </h3>

                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs sm:text-sm text-gray-300">
                              20:00/50:00
                            </span>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-700 rounded-full h-1 mb-2">
                            <div
                              className={`h-1 rounded-full transition-all duration-300 ${getProgressColor(
                                anime.progress
                              )}`}
                              style={{ width: `${anime.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 mx-auto sm:mx-0 flex-wrap gap-2.5">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[40px] flex items-center space-x-2">
                            <Play className="h-4 w-4" />
                            <span>Continue</span>
                          </button>
                          <button className="bg-gray-700 hover:bg-gray-600 text-white/90 p-2 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
