"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { pageApi } from "@/lib/api/pageApi";
import { cn } from "@/lib/utils";
import { Anime } from "@/types/anime";
import { Grid, List, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

// API Response Types
interface ApiLatestResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiAnimeLatest[];
}

interface ApiAnimeLatest {
  id: number;
  title: string;
  title_japanese: string;
  anime_type: string;
  number_of_episodes: number;
  airing: boolean;
  synopsis: string;
  trailer_yt_id: string | null;
  image: string;
  background_banner: string;
  sub_total: number;
  dub_total: number;
  raw_total: number;
  genre: string[];
  ep_id: number;
}

const filterOptions = [
  { key: "all", label: "All" },
  { key: "sub", label: "Subtitled" },
  { key: "dub", label: "Dubbed" },
];

// Removed timeFilters as API doesn't support time-based filtering

const typeFilters = [
  { key: "all", label: "All Types" },
  { key: "series", label: "Series" },
  { key: "movie", label: "Movies" },
];

// Utility function to transform API data to Anime interface
const transformApiDataToAnime = (apiAnime: ApiAnimeLatest): Anime => {
  return {
    id: apiAnime.id.toString(),
    title: apiAnime.title,
    alternativeTitles: apiAnime.title_japanese ? [apiAnime.title_japanese] : [],
    synopsis: apiAnime.synopsis,
    poster: apiAnime.image,
    banner: apiAnime.background_banner || undefined,
    trailer: apiAnime.trailer_yt_id ? `https://www.youtube.com/watch?v=${apiAnime.trailer_yt_id}` : undefined,
    genres: apiAnime.genre,
    studio: "Unknown", // Not provided by API
    releaseYear: new Date().getFullYear(), // Not provided by API, using current year
    status: apiAnime.airing ? "ongoing" : "completed",
    type: mapAnimeType(apiAnime.anime_type),
    totalEpisodes: apiAnime.number_of_episodes || undefined,
    subEpisodes: apiAnime.sub_total,
    dubEpisodes: apiAnime.dub_total,
    rating: 8.0, // Not provided by API, using default
    popularity: 1000, // Not provided by API, using default
    language: getLanguageArray(apiAnime.sub_total, apiAnime.dub_total),
  };
};

const mapAnimeType = (apiType: string): "series" | "movie" | "ova" | "special" => {
  const type = apiType.toLowerCase();
  if (type.includes("movie") || type.includes("film")) return "movie";
  if (type.includes("ova")) return "ova";
  if (type.includes("special")) return "special";
  return "series";
};

const getLanguageArray = (subTotal: number, dubTotal: number): ("sub" | "dub")[] => {
  const languages: ("sub" | "dub")[] = [];
  if (subTotal > 0) languages.push("sub");
  if (dubTotal > 0) languages.push("dub");
  return languages.length > 0 ? languages : ["sub"];
};

// Smart pagination utility to calculate which page numbers to show
const getVisiblePages = (currentPage: number, totalPages: number, maxVisible: number = 5): number[] => {
  if (totalPages <= maxVisible) {
    // If total pages is less than max visible, show all pages
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const halfVisible = Math.floor(maxVisible / 2);
  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
};

export default function LatestPage() {
  const [languageFilter, setLanguageFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // API State
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state from API
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const itemsPerPage = 20;

  // Fetch data from API
  useEffect(() => {
    const fetchLatestAnime = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const offset = (currentPage - 1) * itemsPerPage;
        const apiResponse: ApiLatestResponse = await pageApi.getLatestPageData(itemsPerPage, offset);
        
        const transformedAnime = apiResponse.results.map(transformApiDataToAnime);
        
        setAnimeList(transformedAnime);
        setTotalCount(apiResponse.count);
        setHasNext(!!apiResponse.next);
        setHasPrevious(!!apiResponse.previous);
        
      } catch (err) {
        console.error('Error fetching latest anime:', err);
        setError('Failed to load latest anime data');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAnime();
  }, [currentPage]);

  // Filter anime based on selected filters (client-side filtering)
  const filteredAnime = animeList.filter((anime) => {
    if (
      languageFilter !== "all" &&
      !anime.language.includes(languageFilter as "sub" | "dub")
    ) {
      return false;
    }
    if (typeFilter !== "all" && anime.type !== typeFilter) {
      return false;
    }
    return true;
  });

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
              Latest Releases
            </h1>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Loading Latest Releases...
              </h3>
              <p className="text-gray-500">
                Please wait while we fetch the latest anime releases.
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
                Error Loading Latest Releases
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

          {/* Filters */}
          {!loading && !error && (
            <>
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Language Filter */}
              <div className="flex items-center space-x-2 flex-wrap gap-2.5">
                <span className="text-gray-300 text-sm font-medium">
                  Language:
                </span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                  {filterOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setLanguageFilter(option.key)}
                      className={cn(
                        "px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer",
                        languageFilter === option.key
                          ? "btn-purple text-white/90"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      )}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Filter removed - API doesn't support time-based filtering */}

              {/* Type Filter */}
              <div className="flex items-center space-x-2 flex-wrap gap-2.5">
                <span className="text-gray-300 text-sm font-medium">Type:</span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 flex-wrap">
                  {typeFilters.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setTypeFilter(option.key)}
                      className={cn(
                        "px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer",
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
              <div className="flex items-center space-x-2 ml-auto">
                <span className="text-gray-300 text-sm font-medium">View:</span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-md transition-colors cursor-pointer",
                      viewMode === "grid"
                        ? "btn-purple text-white/90"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    )}>
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-md transition-colors cursor-pointer",
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
                Showing {filteredAnime.length} results
              </p>
            </div>
          </div>

          {/* Content Grid/List */}
          {viewMode === "grid" ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-5">
                {paginatedAnime.map((anime) => (
                  <div key={anime.id} className="relative">
                    <AnimeCard
                      anime={anime}
                      showPopup={true}
                    />
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
          ) : (
            <>
              <div className="space-y-4">
                {paginatedAnime.map((anime) => (
                  <div
                    key={anime.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={anime.poster || "/fallback-poster.png"}
                        alt={anime.title}
                        width={64}
                        height={96}
                        className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/fallback-poster.png";
                        }}
                        unoptimized
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {anime.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                          {anime.synopsis}
                        </p>
                        <div className="flex items-center gap-3 text-sm flex-wrap">
                          <span className="text-[#F5B9D4]">
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
                          <div className="flex space-x-1">
                            {anime.language.includes("sub") && (
                              <span className="px-2 py-1 bg-pink-400 text-white/90 text-xs font-bold rounded">
                                SUB
                              </span>
                            )}
                            {anime.language.includes("dub") && (
                              <span className="px-2 py-1 bg-purple-600 text-white/90 text-xs font-bold rounded">
                                DUB
                              </span>
                            )}
                          </div>
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
