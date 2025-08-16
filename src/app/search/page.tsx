"use client";

import { AnimeCard } from "@/components/ui/AnimeCard";
import { mockAnime } from "@/lib/mockData";
import { Tags } from "lucide-react";
import { useEffect, useState } from "react";

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

const genreOptions = [
  "all",
  "action",
  "adventure",
  "comedy",
  "drama",
  "fantasy",
  "horror",
  "romance",
  "sci-fi",
];
const ratingOptions = [
  "all",
  "9+",
  "8+",
  "7+",
  "6+",
  "5+",
  "4+",
  "3+",
  "2+",
  "1+",
];
const yearOptions = [
  "all",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2010-2019",
  "2000-2009",
  "1990-1999",
];
const countryOptions = ["all", "Japan", "Korea", "China", "USA", "Other"];
const languageOptions = [
  "all",
  "Japanese",
  "English",
  "Korean",
  "Chinese",
  "Other",
];
const seasonOptions = ["all", "Summer", "Spring", "Winter", "Fall"];
const sortOptions = [
  { key: "popularity", label: "Trending" },
  { key: "updated", label: "Updated Date" },
  { key: "release", label: "Release Date" },
  { key: "title", label: "A to Z" },
  { key: "end", label: "End Date" },
  { key: "views", label: "Total Views" },
];

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { useRouter, useSearchParams } from "next/navigation";

import { Suspense } from "react";

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pending filter states (controlled by UI)
  const [pendingSearchTerm, setPendingSearchTerm] = useState("");
  const [pendingType, setPendingType] = useState("all");
  const [pendingStatus, setPendingStatus] = useState("all");
  const [pendingGenre, setPendingGenre] = useState("all");
  const [pendingRating, setPendingRating] = useState("all");
  const [pendingYear, setPendingYear] = useState("all");
  const [pendingCountry, setPendingCountry] = useState<string[]>([]);
  const [pendingLanguage, setPendingLanguage] = useState<string[]>([]);
  const [pendingSeason, setPendingSeason] = useState("all");
  const [pendingSort, setPendingSort] = useState("popularity");
  const [pendingStudio, setPendingStudio] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Applied filter states (from URL)
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    type: "all",
    status: "all",
    genre: "all",
    rating: "all",
    year: "all",
    country: [] as string[],
    language: [] as string[],
    season: "all",
    sort: "popularity",
    studio: "",
  });

  // Sync applied filters from URL on mount or URL change
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setAppliedFilters({
      search: params.search || "",
      type: params.type || "all",
      status: params.status || "all",
      genre: params.genre || "all",
      rating: params.rating || "all",
      year: params.year || "all",
      country: params.country ? (params.country.split(",") as string[]) : [],
      language: params.language ? (params.language.split(",") as string[]) : [],
      season: params.season || "all",
      sort: params.sort || "popularity",
      studio: params.studio || "",
    });
    // Also update pending states so UI reflects URL
    setPendingSearchTerm(params.search || "");
    setPendingType(params.type || "all");
    setPendingStatus(params.status || "all");
    setPendingGenre(params.genre || "all");
    setPendingRating(params.rating || "all");
    setPendingYear(params.year || "all");
    setPendingCountry(params.country ? params.country.split(",") : []);
    setPendingLanguage(params.language ? params.language.split(",") : []);
    setPendingSeason(params.season || "all");
    setPendingSort(params.sort || "popularity");
    setPendingStudio(params.studio || "");

    // Reset to page 1 when URL changes (filters change)
    setCurrentPage(1);
  }, [searchParams]);

  // Handle Filter button click
  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (pendingSearchTerm) params.set("search", pendingSearchTerm);
    if (pendingType !== "all") params.set("type", pendingType);
    if (pendingStatus !== "all") params.set("status", pendingStatus);
    if (pendingGenre !== "all") params.set("genre", pendingGenre);
    if (pendingRating !== "all") params.set("rating", pendingRating);
    if (pendingYear !== "all") params.set("year", pendingYear);
    if (pendingCountry.length > 0 && !pendingCountry.includes("all"))
      params.set("country", pendingCountry.join(","));
    if (pendingLanguage.length > 0 && !pendingLanguage.includes("all"))
      params.set("language", pendingLanguage.join(","));
    if (pendingSeason !== "all") params.set("season", pendingSeason);
    if (pendingSort !== "popularity") params.set("sort", pendingSort);
    if (pendingStudio) params.set("studio", pendingStudio);

    // Reset to page 1 when applying new filters
    setCurrentPage(1);

    router.replace(`/search?${params.toString()}`);
  };

  // Filtering logic (use appliedFilters)
  const filteredAnime = mockAnime
    .filter((anime) => {
      if (
        appliedFilters.search &&
        !anime.title.toLowerCase().includes(appliedFilters.search.toLowerCase())
      )
        return false;
      if (
        appliedFilters.genre !== "all" &&
        !anime.genres.some((g) =>
          g.toLowerCase().includes(appliedFilters.genre.toLowerCase())
        )
      )
        return false;
      if (appliedFilters.type !== "all" && anime.type !== appliedFilters.type)
        return false;
      if (
        appliedFilters.status !== "all" &&
        anime.status !== appliedFilters.status
      )
        return false;
      if (
        appliedFilters.rating !== "all" &&
        anime.rating < parseInt(appliedFilters.rating)
      )
        return false;
      if (
        appliedFilters.year !== "all" &&
        anime.releaseYear.toString() !== appliedFilters.year &&
        !(
          appliedFilters.year.includes("-") &&
          anime.releaseYear >= parseInt(appliedFilters.year.split("-")[0]) &&
          anime.releaseYear <= parseInt(appliedFilters.year.split("-")[1])
        )
      )
        return false;
      if (
        appliedFilters.studio &&
        (!anime.studio ||
          !anime.studio
            .toLowerCase()
            .includes(appliedFilters.studio.toLowerCase()))
      )
        return false;
      // Remove country, language, and season filter logic since mockAnime does not have these properties
      return true;
    })
    .sort((a, b) => {
      switch (appliedFilters.sort) {
        case "title":
          return a.title.localeCompare(b.title);
        case "release":
          return b.releaseYear - a.releaseYear;
        case "updated":
          // Assuming we have an updatedAt field, fallback to popularity for now
          return b.popularity - a.popularity;
        case "end":
          // Assuming we have an endDate field, fallback to popularity for now
          return b.popularity - a.popularity;
        case "views":
          // Assuming we have a views field, fallback to popularity for now
          return b.popularity - a.popularity;
        case "popularity":
        default:
          return b.popularity - a.popularity;
      }
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAnime.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnime = filteredAnime.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    handlePageChange(1);
  };

  const handleLastPage = () => {
    handlePageChange(totalPages);
  };

  // Generate pagination numbers
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 6;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-white mb-8 txt-heading">
            Search
          </h1>
          <div className="mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-4 relative">
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search anime..."
                value={pendingSearchTerm}
                onChange={(e) => setPendingSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none w-full"
              />
              {/* Type Dropdown */}
              <select
                value={pendingType}
                onChange={(e) => setPendingType(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 w-full">
                {typeFilters.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              {/* Genre Dropdown */}
              <select
                value={pendingGenre}
                onChange={(e) => setPendingGenre(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 w-full">
                {genreOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              {/* Status Dropdown */}
              <select
                value={pendingStatus}
                onChange={(e) => setPendingStatus(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 w-full">
                {statusFilters.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              {/* Sort Dropdown */}
              <select
                value={pendingSort}
                onChange={(e) => setPendingSort(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 w-full">
                {sortOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              {/* Filter Icon & Button (relative container) */}
              <div className="flex items-center gap-2 relative">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 cursor-pointer flex justify-center"
                  aria-label="Show advanced filters">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 14.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-3.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white/90 font-medium hover:bg-blue-700 cursor-pointer"
                  onClick={handleApplyFilters}>
                  Filter
                </button>
                {/* Advanced Dropdown - position absolute */}
                {showAdvanced && (
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mt-2 absolute top-full right-0 z-50 w-[min(90vw,600px)] shadow-xl">
                    <div className="flex justify-between items-center gap-4">
                      {/* Rating Dropdown */}
                      <div className="w-full">
                        <label className="block text-gray-300 text-sm mb-1">
                          Rating
                        </label>
                        <select
                          value={pendingRating}
                          onChange={(e) => setPendingRating(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700">
                          {ratingOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Year Dropdown */}
                      <div className="w-full">
                        <label className="block text-gray-300 text-sm mb-1">
                          Year
                        </label>
                        <select
                          value={pendingYear}
                          onChange={(e) => setPendingYear(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700">
                          {yearOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Season Dropdown */}
                      <div className="w-full">
                        <label className="block text-gray-300 text-sm mb-1">
                          Season
                        </label>
                        <select
                          value={pendingSeason}
                          onChange={(e) => setPendingSeason(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700">
                          {seasonOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Studio Input Field */}
                    <div className="mt-4">
                      <label className="block text-gray-300 text-md mb-1">
                        Studio
                      </label>
                      <input
                        type="text"
                        value={pendingStudio}
                        onChange={(e) => setPendingStudio(e.target.value)}
                        placeholder="Enter studio name"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
                      />
                    </div>
                    {/* Country Checkbox */}
                    <div className="mt-4">
                      <label className="block text-gray-300 text-md mb-1">
                        Country
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {countryOptions.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-1 text-gray-300 text-sm">
                            <input
                              type="checkbox"
                              name="country"
                              value={option}
                              checked={pendingCountry.includes(option)}
                              onChange={() => {
                                setPendingCountry((prev) =>
                                  prev.includes(option)
                                    ? prev.filter((c) => c !== option)
                                    : [...prev, option]
                                );
                              }}
                              className="accent-green-600"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* Language Checkbox */}
                    <div className="mt-4">
                      <label className="block text-gray-300 text-md mb-1">
                        Language
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {languageOptions.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-1 text-gray-300 text-sm">
                            <input
                              type="checkbox"
                              name="language"
                              value={option}
                              checked={pendingLanguage.includes(option)}
                              onChange={() => {
                                setPendingLanguage((prev) =>
                                  prev.includes(option)
                                    ? prev.filter((l) => l !== option)
                                    : [...prev, option]
                                );
                              }}
                              className="accent-blue-600"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Content Grid/List */}
          {filteredAnime.length > 0 ? (
            <>
              {/* Always show grid view, since viewMode is removed */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {currentAnime.map((anime) => (
                  <div key={anime.id} className="relative">
                    <AnimeCard
                      anime={anime}
                      showPopup={true}
                      className="transform transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-8 gap-2">
                  {/* Double Previous Arrow */}
                  <button
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${
                      currentPage === 1
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                    aria-label="First page">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {/* Previous Arrow */}
                  {currentPage > 1 && (
                    <button
                      onClick={handlePreviousPage}
                      className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
                      aria-label="Previous page">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Page Numbers */}
                  {pageNumbers.map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-white hover:bg-gray-600"
                      }`}>
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Arrow */}
                  {currentPage < totalPages && (
                    <button
                      onClick={handleNextPage}
                      className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
                      aria-label="Next page">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Double Next Arrow */}
                  <button
                    onClick={handleLastPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${
                      currentPage === totalPages
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                    aria-label="Last page">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Tags className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No anime found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or check back later for new releases.
              </p>
            </div>
          )}
          {/* ...existing code... */}
        </div>
      </main>
      <FooterSection />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
