"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { trendingAnime } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Grid, List, Timer, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const timeFilters = [
  { key: "now", label: "Now", icon: <TrendingUp className="h-4 w-4" /> },
  { key: "day", label: "Today", icon: <Clock className="h-4 w-4" /> },
  { key: "week", label: "This Week", icon: <Calendar className="h-4 w-4" /> },
  { key: "month", label: "This Month", icon: <Timer className="h-4 w-4" /> },
];

const typeFilters = [
  { key: "all", label: "All Types" },
  { key: "series", label: "Series" },
  { key: "movie", label: "Movies" },
];

export default function PopularPage() {
  const [timeFilter, setTimeFilter] = useState("week");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  // Sort anime by popularity and filter
  const filteredAnime = trendingAnime
    .filter((anime) => typeFilter === "all" || anime.type === typeFilter)
    .sort((a, b) => b.popularity - a.popularity);

  // Pagination logic
  const totalPages = Math.ceil(filteredAnime.length / itemsPerPage);
  const paginatedAnime = filteredAnime.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
              Popular Anime
            </h1>
          </div>

          {/* Trending Banner */}
          <div className="mb-8 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-lg p-3 border border-red-800/30">
            <div className="flex items-center space-x-4 flex-wrap gap-2.5">
              <div className="flex-shrink-0 anime-img">
                {filteredAnime[0]?.poster && (
                  <Image
                    src={filteredAnime[0].poster}
                    alt={filteredAnime[0].title}
                    width={110}
                    height={150}
                    className="object-cover rounded-lg"
                  />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2 flex-wrap">
                  <span className="text-red-400 font-semibold">
                    TRENDING NOW
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {filteredAnime[0]?.title}
                </h3>
                <p className="text-white text-sm">
                  {filteredAnime[0]?.popularity.toLocaleString()} views this
                  week
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Time Filter */}
              <div className="flex items-center space-x-2 flex-wrap gap-2.5">
                <span className="text-gray-300 text-sm font-medium">
                  Time Period:
                </span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 flex-wrap">
                  {timeFilters.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setTimeFilter(option.key)}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors",
                        timeFilter === option.key
                          ? "bg-blue-600 text-white/90"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      )}>
                      {option.icon}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-2 flex-wrap gap-2.5">
                <span className="text-gray-300 text-sm font-medium">Type:</span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                  {typeFilters.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setTypeFilter(option.key)}
                      className={cn(
                        "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                        typeFilter === option.key
                          ? "bg-blue-600 text-white/90"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      )}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 ml-auto mt-6">
                <span className="text-gray-300 text-sm font-medium">View:</span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === "grid"
                        ? "bg-gray-600 text-white/90"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    )}>
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === "list"
                        ? "bg-gray-600 text-white/90"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    )}>
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Showing {filteredAnime.length} popular anime
              </p>
            </div>
          </div>

          {/* Popular Rankings */}
          {viewMode === "grid" ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {paginatedAnime.map((anime) => (
                  <div key={anime.id} className="relative">
                    <AnimeCard
                      anime={anime}
                      showPopup={true}
                      className="transform transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>
              {/* Pagination - always visible */}
              <div className="flex justify-center items-center mt-8 gap-2">
                {/* Double Previous Arrow */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-blue-600 transition-colors"
                    aria-label="First Page">
                    &#171;
                  </button>
                )}
                {/* Previous Arrow */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-blue-600 transition-colors"
                    aria-label="Previous Page">
                    &lt;
                  </button>
                )}
                {/* Dynamic Page Numbers */}
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                        currentPage === pageNum
                          ? "bg-blue-600 text-white/90"
                          : "bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                      )}>
                      {pageNum}
                    </button>
                  );
                })}
                {/* Next Arrow */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-blue-600 transition-colors"
                    aria-label="Next Page">
                    &gt;
                  </button>
                )}
                {/* Double Next Arrow */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-blue-600 transition-colors"
                    aria-label="Last Page">
                    &#187;
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedAnime.map((anime) => (
                  <div
                    key={anime.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      {anime.poster && (
                        <Image
                          src={anime.poster}
                          alt={anime.title}
                          width={64}
                          height={96}
                          className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                          style={{ width: "64px", height: "96px" }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {anime.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                          {anime.synopsis}
                        </p>
                        <div className="flex items-center gap-3 text-sm flex-wrap">
                          <span className="text-blue-400">
                            {anime.releaseYear}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400 capitalize">
                            {anime.type}
                          </span>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-white">{anime.rating}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className="text-red-400">
                            {anime.popularity.toLocaleString()} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination - always visible */}
              <div className="flex justify-center items-center mt-8 gap-2">
                {/* Double Previous Arrow */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-blue-600 transition-colors"
                    aria-label="First Page">
                    &#171;
                  </button>
                )}
                {/* Previous Arrow */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-blue-600 transition-colors"
                    aria-label="Previous Page">
                    &lt;
                  </button>
                )}
                {/* Dynamic Page Numbers */}
                {[...Array(totalPages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                        currentPage === pageNum
                          ? "bg-blue-600 text-white/90"
                          : "bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                      )}>
                      {pageNum}
                    </button>
                  );
                })}
                {/* Next Arrow */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-blue-600 transition-colors"
                    aria-label="Next Page">
                    &gt;
                  </button>
                )}
                {/* Double Next Arrow */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-blue-600 transition-colors"
                    aria-label="Last Page">
                    &#187;
                  </button>
                )}
              </div>
            </>
          )}

          {/* View More/Less Button */}
          {/* ...pagination replaces view more/less... */}
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
