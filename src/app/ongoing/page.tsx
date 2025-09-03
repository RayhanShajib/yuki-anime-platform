"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { mockAnime } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Grid, List } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const sortOptions = [
  { key: "latest", label: "Latest Episode" },
  { key: "popularity", label: "Most Popular" },
  { key: "rating", label: "Highest Rated" },
  { key: "title", label: "Alphabetical" },
];

const typeFilters = [
  { key: "all", label: "All Types" },
  { key: "series", label: "TV Series" },
  { key: "ova", label: "OVAs" },
];

const genreFilters = [
  { key: "all", label: "All Genres" },
  { key: "action", label: "Action" },
  { key: "adventure", label: "Adventure" },
  { key: "comedy", label: "Comedy" },
  { key: "drama", label: "Drama" },
  { key: "fantasy", label: "Fantasy" },
];

export default function OngoingPage() {
  const [sortBy, setSortBy] = useState("latest");
  const [typeFilter, setTypeFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter only ongoing anime
  const ongoingAnime = mockAnime.filter((anime) => anime.status === "ongoing");

  const filteredAnime = ongoingAnime
    .filter((anime) => {
      if (typeFilter !== "all" && anime.type !== typeFilter) return false;
      if (
        genreFilter !== "all" &&
        !anime.genres.some((g) => g.toLowerCase().includes(genreFilter))
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity - a.popularity;
        case "rating":
          return b.rating - a.rating;
        case "title":
          return a.title.localeCompare(b.title);
        case "latest":
        default:
          return b.releaseYear - a.releaseYear;
      }
    });

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
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center txt-heading">
              Currently Airing
            </h1>
          </div>

          {/* Live Status Banner */}
          <div className="mb-8 bg-gradient-to-r from-blue-900/20 to-blue-900/20 rounded-lg p-6 border border-green-800/30">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-400 font-semibold">LIVE</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {filteredAnime.length} Currently Airing Series
                </h3>
                <p className="text-white text-sm">
                  New episodes releasing weekly • Updated in real-time
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {filteredAnime.length}
              </div>
              <div className="text-gray-400 text-sm">Ongoing Series</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {filteredAnime.filter((a) => a.type === "series").length}
              </div>
              <div className="text-gray-400 text-sm">TV Series</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {(
                  filteredAnime.reduce((sum, a) => sum + a.rating, 0) /
                  filteredAnime.length
                ).toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">Avg Rating</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">7</div>
              <div className="text-gray-400 text-sm">Days/Week</div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Sort Options */}
              <div className="flex items-center space-x-2 flex-wrap gap-2.5">
                <span className="text-gray-300 text-sm font-medium">
                  Sort by:
                </span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 flex-wrap">
                  {sortOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setSortBy(option.key)}
                      className={cn(
                        "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                        sortBy === option.key
                          ? "bg-blue-600 text-white/90"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      )}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-2 flex-wrap gap-2.5">
                <span className="text-gray-300 text-sm font-medium">Type:</span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 flex-wrap">
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

              {/* Genre Filter */}
              <div className="flex items-center space-x-2 flex-wrap gap-2.5">
                <span className="text-gray-300 text-sm font-medium">
                  Genre:
                </span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 flex-wrap">
                  {genreFilters.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setGenreFilter(option.key)}
                      className={cn(
                        "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                        genreFilter === option.key
                          ? "bg-blue-600 text-white/90"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      )}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 ml-auto mt-8 mb-3">
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
                Showing {filteredAnime.length} currently airing anime
              </p>
            </div>
          </div>

          {/* Content Grid/List */}
          {viewMode === "grid" ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-5">
                {paginatedAnime.map((anime) => (
                  <div key={anime.id} className="relative">
                    <AnimeCard anime={anime} showPopup={true} />
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
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:bg-gray-800/70 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={anime.poster}
                        alt={anime.title}
                        width={64}
                        height={96}
                        className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                        style={{ width: "64px", height: "96px" }}
                        unoptimized={true}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between flex-wrap gap-2.5">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-semibold text-white">
                                {anime.title}
                              </h3>
                              <div className="flex items-center space-x-1 bg-green-600 px-2 py-1 rounded text-xs font-bold">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <span className="text-white/90">LIVE</span>
                              </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                              {anime.synopsis}
                            </p>
                            <div className="flex items-center space-x-3 text-sm flex-wrap">
                              <span className="text-blue-400">
                                {anime.releaseYear}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-400 capitalize">
                                {anime.type}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-green-400 font-medium">
                                Episode {Math.floor(Math.random() * 20) + 1}
                              </span>
                              <span className="text-gray-400">•</span>
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-400">⭐</span>
                                <span className="text-white">
                                  {anime.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white/90 px-4 py-2 rounded text-sm transition-colors">
                              Watch
                            </button>
                            <button className="bg-gray-700 hover:bg-gray-600 text-white/90 px-4 py-2 rounded text-sm transition-colors">
                              Info
                            </button>
                          </div>
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
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
