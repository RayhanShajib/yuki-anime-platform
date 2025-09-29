import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { pageApi } from "@/lib/api/pageApi";
import { cn } from "@/lib/utils";
import { Grid, List } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const filterOptions = [
  { key: "all", label: "All" },
  { key: "sub", label: "Subtitled" },
  { key: "dub", label: "Dubbed" },
];

const timeFilters = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
];

const typeFilters = [
  { key: "all", label: "All Types" },
  { key: "series", label: "Series" },
  { key: "movie", label: "Movies" },
];

export default function LatestPage() {

  const latestAnimeFromAPI =  pageApi.getLatestPageData(20, 0);

  let latestAnime = [
    {
      id: "1",
      title: "Attack on Titan: Final Season",
      alternativeTitles: ["Shingeki no Kyojin", "AOT"],
      synopsis:
        "The final battle for humanity begins as Eren Yeager leads the Survey Corps in their ultimate mission to save what remains of mankind.",
      poster:
        "https://via.placeholder.com/300x450/1a1a1a/white?text=Attack+on+Titan",
      banner:
        "https://via.placeholder.com/1920x1080/1a1a1a/white?text=AOT+Banner",
      trailer: "https://www.w3schools.com/html/mov_bbb.mp4",
      genres: ["Action", "Drama", "Fantasy", "Military"],
      subEpisodes: 20,
      dubEpisodes: 12,
      studio: "Studio Mappa",
      releaseYear: 2023,
      status: "completed",
      type: "series",
      totalEpisodes: 87,
      rating: 9.0,
      popularity: 95000,
      language: ["sub", "dub"],
      malId: "16498",
      anilistId: "16498",
    },
  ]

  const [languageFilter, setLanguageFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("week");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter anime based on selected filters
  const filteredAnime = latestAnime.filter((anime) => {
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

  // Pagination logic
  const totalPages = Math.ceil(filteredAnime.length / itemsPerPage);
  const paginatedAnime = filteredAnime.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

          {/* Filters */}
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

              {/* Time Filter */}
              <div className="flex items-center space-x-2 flex-wrap gap-2.5">
                <span className="text-gray-300 text-sm font-medium">Time:</span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                  {timeFilters.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setTimeFilter(option.key)}
                      className={cn(
                        "px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer",
                        timeFilter === option.key
                          ? "btn-purple text-white/90"
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
              {/* Pagination - always visible */}
              <div className="flex justify-center items-center mt-8 gap-2">
                {/* Double Previous Arrow */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-2 rounded-md btn-purple text-white hover:bg-blue-600 transition-colors"
                    aria-label="First Page">
                    &#171;
                  </button>
                )}
                {/* Previous Arrow */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3 py-2 rounded-md btn-purple text-white hover:bg-blue-600 transition-colors"
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
                          ? "btn-purple text-white/90"
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
                    className="px-3 py-2 rounded-md btn-purple text-white hover:bg-blue-600 transition-colors"
                    aria-label="Next Page">
                    &gt;
                  </button>
                )}
                {/* Double Next Arrow */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-2 rounded-md btn-purple text-white hover:bg-blue-600 transition-colors"
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
              {/* Pagination - always visible */}
              <div className="flex justify-center items-center mt-8 gap-2">
                {/* Double Previous Arrow */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-3 py-2 rounded-md btn-purple text-white hover:bg-blue-600 transition-colors"
                    aria-label="First Page">
                    &#171;
                  </button>
                )}
                {/* Previous Arrow */}
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3 py-2 rounded-md btn-purple text-white hover:bg-blue-600 transition-colors"
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
                          ? "btn-purple text-white/90"
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
                    className="px-3 py-2 rounded-md btn-purple text-white hover:bg-blue-600 transition-colors"
                    aria-label="Next Page">
                    &gt;
                  </button>
                )}
                {/* Double Next Arrow */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-2 rounded-md btn-purple text-white hover:bg-blue-600 transition-colors"
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
