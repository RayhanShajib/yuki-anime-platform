"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { pageApi } from "@/lib/api/pageApi";
import { cn } from "@/lib/utils";
import { Anime } from "@/types/anime";
import { Calendar, Clock, Grid, List, Loader2, Timer, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

// API Response Types
interface ApiPopularResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiAnimePopular[];
}

interface ApiAnimePopular {
  id: number;
  title: string;
  title_japanese: string;
  image: string;
  rating: string;
  number_of_episodes: number;
  synopsis: string;
  trailer_yt_id: string | null;
  genre: string[];
  background_banner: string;
  sub_total: number;
  dub_total: number;
  raw_total: number;
  ep_id: number;
}

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

// Utility function to transform API data to Anime interface
const transformApiDataToAnime = (apiAnime: ApiAnimePopular): Anime => {
  return {
    id: apiAnime.id.toString(),
    title: apiAnime.title,
    title_japanese: apiAnime.title_japanese,
    alternativeTitles: apiAnime.title_japanese ? [apiAnime.title_japanese] : [],
    synopsis: apiAnime.synopsis,
    poster: apiAnime.image,
    banner: apiAnime.background_banner || undefined,
    trailer: apiAnime.trailer_yt_id ? `https://www.youtube.com/watch?v=${apiAnime.trailer_yt_id}` : undefined,
    genres: apiAnime.genre,
    studio: "Unknown", // Not provided by API
    releaseYear: new Date().getFullYear(), // Not provided by API, using current year
    status: "completed", // Default status
    type: mapAnimeType(apiAnime.number_of_episodes),
    totalEpisodes: apiAnime.number_of_episodes || undefined,
    subEpisodes: apiAnime.sub_total,
    dubEpisodes: apiAnime.dub_total,
    // Preserve episode id from API when available
    episodeId: apiAnime.ep_id,
    rating: 8.5, // Not provided by API, using default high rating for popular anime
    popularity: Math.floor(Math.random() * 50000) + 10000, // Generate random popularity for sorting
    language: getLanguageArray(apiAnime.sub_total, apiAnime.dub_total),
  };
};

const mapAnimeType = (episodes: number): "series" | "movie" | "ova" | "special" => {
  if (episodes === 1) return "movie";
  if (episodes <= 3) return "ova";
  return "series";
};

const getLanguageArray = (subTotal: number, dubTotal: number): ("sub" | "dub")[] => {
  const languages: ("sub" | "dub")[] = [];
  if (subTotal > 0) languages.push("sub");
  if (dubTotal > 0) languages.push("dub");
  return languages.length > 0 ? languages : ["sub"];
};

// Smart pagination utility (same as Latest page)
const getVisiblePages = (currentPage: number, totalPages: number, maxVisible: number = 5): number[] => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const halfVisible = Math.floor(maxVisible / 2);
  let startPage = Math.max(1, currentPage - halfVisible);
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
};

export default function PopularPage() {
  const [timeFilter, setTimeFilter] = useState("week");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // API State
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state from API
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  // Fetch data from API
  useEffect(() => {
    const fetchPopularAnime = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiResponse: ApiPopularResponse = await pageApi.getPopularPageData();
        const transformedAnime = apiResponse.results.map(transformApiDataToAnime);
        
        setAnimeList(transformedAnime);
        setTotalCount(apiResponse.count);
        
      } catch (err) {
        console.error('Error fetching popular anime:', err);
        setError('Failed to load popular anime data');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularAnime();
  }, [currentPage]);

  // Filter anime based on selected filters (client-side filtering)
  const filteredAnime = animeList
    .filter((anime) => typeFilter === "all" || anime.type === typeFilter)
    .sort((a, b) => b.popularity - a.popularity);

  // Calculate pagination based on API response
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  // Since we're getting paginated data from API, we don't slice here
  const paginatedAnime = filteredAnime;

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center txt-heading">
              Popular Anime
            </h1>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Loading Popular Anime...
              </h3>
              <p className="text-gray-500">
                Please wait while we fetch the most popular anime.
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="h-16 w-16 text-red-500 mx-auto mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-400 mb-2">
                Error Loading Popular Anime
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

          {/* Trending Banner */}
          {!loading && !error && paginatedAnime.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-purple-900/20 to-purple-900/20 rounded-lg p-3 border border-purple-800/30">
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
                  <span className="text-pink font-semibold">
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
          )}

          {/* Filters */}
          {!loading && !error && (
            <>
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
                          ? "btn-purple text-white/90"
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
                          ? "btn-purple text-white/90"
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
                        ? "btn-purple text-white/90"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    )}>
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === "list"
                        ? "btn-purple text-white/90"
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
                    className="px-3 py-2 rounded-md btn-purple text-white transition-colors"
                    aria-label="First Page">
                    &#171;
                  </button>
                )}
                {/* Previous Arrow */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3 py-2 rounded-md btn-purple text-white transition-colors"
                    aria-label="Previous Page">
                    &lt;
                  </button>
                )}
                
                {/* Page Numbers (Smart pagination - max 5 visible) */}
                {getVisiblePages(currentPage, totalPages).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer min-w-[40px]",
                      currentPage === pageNum
                        ? "btn-purple text-white/90"
                        : "bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                    )}>
                    {pageNum}
                  </button>
                ))}
                
                {/* Next Arrow */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3 py-2 rounded-md btn-purple text-white hover:bg-purple-600 transition-colors"
                    aria-label="Next Page">
                    &#8250;
                  </button>
                )}
                
                {/* Last Page Button */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-2 rounded-md btn-purple text-white hover:bg-purple-600 transition-colors"
                    aria-label="Last Page">
                    &#187;&#187;
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
                          <span className="text-pink">
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
                          <span className="text-pink">
                            {anime.popularity.toLocaleString()} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination - Smart pagination */}
              <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
                {/* First Page Button */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-2 rounded-md btn-purple text-white hover:bg-purple-600 transition-colors"
                    aria-label="First Page">
                    &#171;&#171;
                  </button>
                )}
                
                {/* Previous Button */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3 py-2 rounded-md btn-purple text-white hover:bg-purple-600 transition-colors"
                    aria-label="Previous Page">
                    &#8249;
                  </button>
                )}
                
                {/* Page Numbers (Smart pagination - max 5 visible) */}
                {getVisiblePages(currentPage, totalPages).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer min-w-[40px]",
                      currentPage === pageNum
                        ? "btn-purple text-white/90"
                        : "bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                    )}>
                    {pageNum}
                  </button>
                ))}
                
                {/* Next Button */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3 py-2 rounded-md btn-purple text-white hover:bg-purple-600 transition-colors"
                    aria-label="Next Page">
                    &#8250;
                  </button>
                )}
                
                {/* Last Page Button */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-2 rounded-md btn-purple text-white hover:bg-purple-600 transition-colors"
                    aria-label="Last Page">
                    &#187;&#187;
                  </button>
                )}
              </div>
            </>
          )}

          {/* View More/Less Button */}
          {/* ...pagination replaces view more/less... */}
            </>
          )}
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
