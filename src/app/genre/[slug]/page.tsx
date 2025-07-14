"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { mockAnime } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Grid, List, Tags } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const sortOptions = [
  { key: "popularity", label: "Most Popular" },
  { key: "rating", label: "Highest Rated" },
  { key: "latest", label: "Latest Release" },
  { key: "title", label: "Alphabetical" },
];

const statusFilters = [
  { key: "all", label: "All Status" },
  { key: "ongoing", label: "Ongoing" },
  { key: "completed", label: "Completed" },
  { key: "upcoming", label: "Upcoming" },
];

const typeFilters = [
  { key: "all", label: "All Types" },
  { key: "series", label: "Series" },
  { key: "movie", label: "Movies" },
  { key: "ova", label: "OVAs" },
];

interface GenrePageProps {
  params: {
    slug: string;
  };
}

export default function GenrePage({ params }: GenrePageProps) {
  const [sortBy, setSortBy] = useState("popularity");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAll, setShowAll] = useState(false);

  const genre = params.slug.replace(/-/g, " ");
  const genreTitle = genre.charAt(0).toUpperCase() + genre.slice(1);

  // Filter anime by genre and apply other filters
  const filteredAnime = mockAnime
    .filter((anime) => {
      const hasGenre = anime.genres.some(
        (g) =>
          g.toLowerCase().includes(genre.toLowerCase()) ||
          genre.toLowerCase().includes(g.toLowerCase())
      );
      if (!hasGenre) return false;

      if (statusFilter !== "all" && anime.status !== statusFilter) return false;
      if (typeFilter !== "all" && anime.type !== typeFilter) return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "latest":
          return b.releaseYear - a.releaseYear;
        case "title":
          return a.title.localeCompare(b.title);
        case "popularity":
        default:
          return b.popularity - a.popularity;
      }
    });

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1
              className={`text-4xl font-bold text-white mb-4 flex items-center`}>
              {genreTitle} Anime
            </h1>
          </div>

          {/* Genre Stats */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {filteredAnime.length}
              </div>
              <div className="text-gray-400 text-sm">Total Anime</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {filteredAnime.filter((a) => a.status === "ongoing").length}
              </div>
              <div className="text-gray-400 text-sm">Currently Airing</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {(
                  filteredAnime.reduce((sum, a) => sum + a.rating, 0) /
                  filteredAnime.length
                ).toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {filteredAnime.filter((a) => a.type === "movie").length}
              </div>
              <div className="text-gray-400 text-sm">Movies</div>
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
                          ? `bg-red-600 text-white`
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      )}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2 flex-wrap gap-2.5">
                <span className="text-gray-300 text-sm font-medium">
                  Status:
                </span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 flex-wrap">
                  {statusFilters.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setStatusFilter(option.key)}
                      className={cn(
                        "px-3 py-1 rounded-md text-sm font-medium transition-colors",
                        statusFilter === option.key
                          ? "bg-blue-600 text-white"
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
                          ? "bg-purple-600 text-white"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      )}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 ml-auto mt-7 mb-3">
                <span className="text-gray-300 text-sm font-medium">View:</span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === "grid"
                        ? "bg-gray-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    )}>
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === "list"
                        ? "bg-gray-600 text-white"
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
                Showing {filteredAnime.length} {genre.toLowerCase()} anime
              </p>
            </div>
          </div>

          {/* Content Grid/List */}
          {filteredAnime.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {filteredAnime
                  .slice(0, showAll ? filteredAnime.length : 5)
                  .map((anime) => (
                    <div key={anime.id} className="relative">
                      <AnimeCard
                        anime={anime}
                        showPopup={true}
                        className="transform transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAnime.map((anime) => (
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
                        unoptimized
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {anime.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                          {anime.synopsis}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-blue-400">
                            {anime.releaseYear}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-400 capitalize">
                            {anime.type}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span
                            className={cn(
                              "font-medium capitalize",
                              anime.status === "ongoing"
                                ? "text-green-400"
                                : anime.status === "completed"
                                ? "text-blue-400"
                                : "text-yellow-400"
                            )}>
                            {anime.status}
                          </span>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">⭐</span>
                            <span className="text-white">{anime.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <Tags className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No {genre.toLowerCase()} anime found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or check back later for new releases.
              </p>
            </div>
          )}

          {/* View More/Less Button */}
          {filteredAnime.length > 5 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                {showAll ? "View Less" : "View More"}
              </button>
            </div>
          )}
        </div>
      </main>
      <FooterSection/>
    </div>
  );
}
