"use client";

import { AnimeCard } from "@/components/ui/AnimeCard";
import { pageApi } from "@/lib/api/pageApi";
import { Tags } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const typeFilters = [
  { key: "all", label: "All Types" },
  { key: "TV", label: "TV" },
  { key: "Movie", label: "Movie" },
  { key: "OVA", label: "OVA" },
  { key: "Special", label: "Special" },
];

const genreOptions = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Thriller",
  "Mystery",
  "Supernatural",
];

const ratingOptions = [
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "1",
];

const yearOptions = [
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
];

const ratedOptions = [
  { key: "G", label: "G" },
  { key: "PG", label: "PG" },
  { key: "PG-13 - Teens 13 or older", label: "PG-13" },
  { key: "R - 17+ (violence & profanity)", label: "R" },
  { key: "R+ - Mild Nudity", label: "R+" },
  { key: "Rx - Hentai", label: "Rx" },
];

const seasonOptions = ["Spring", "Summer", "Fall", "Winter"];

const srcTypeOptions = [
  { key: "sub", label: "Subtitle" },
  { key: "dub", label: "Dubbed" },
];

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { useRouter, useSearchParams } from "next/navigation";

import { Suspense } from "react";

// Multi-Select Component
interface MultiSelectProps {
  options: string[] | { key: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Normalize options to have consistent structure
  const normalizedOptions = options.map((option) =>
    typeof option === "string"
      ? { key: option, label: option.charAt(0).toUpperCase() + option.slice(1) }
      : option
  );

  const handleToggleOption = (optionKey: string) => {
    if (optionKey === "all") {
      // If "all" is selected, clear all other selections
      onChange(["all"]);
    } else {
      // Remove "all" if present and toggle the option
      const filteredValues = selectedValues.filter((val) => val !== "all");

      if (filteredValues.includes(optionKey)) {
        // Remove the option
        const newValues = filteredValues.filter((val) => val !== optionKey);
        onChange(newValues.length === 0 ? ["all"] : newValues);
      } else {
        // Add the option
        onChange([...filteredValues, optionKey]);
      }
    }
  };

  const getDisplayText = () => {
    if (selectedValues.includes("all") || selectedValues.length === 0) {
      return "All Types";
    }

    if (selectedValues.length === 1) {
      const option = normalizedOptions.find(
        (opt) => opt.key === selectedValues[0]
      );
      return option?.label || selectedValues[0];
    }

    const firstOption = normalizedOptions.find(
      (opt) => opt.key === selectedValues[0]
    );
    return `${firstOption?.label || selectedValues[0]} + [${
      selectedValues.length - 1
    }]`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 rounded-lg bg-purple text-white border border-gray-700 text-left flex items-center justify-between hover:bg-gray-700 focus:outline-none">
        <span>{getDisplayText()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {normalizedOptions.map((option) => (
            <label
              key={option.key}
              className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors">
              <span className="relative mr-3 inline-block w-4 h-4 align-middle">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.key)}
                  onChange={() => handleToggleOption(option.key)}
                  className="w-4 h-4 rounded focus:outline-none appearance-none border border-gray-400"
                  style={
                    selectedValues.includes(option.key)
                      ? { backgroundColor: "#7760a9", borderColor: "#7760a9" }
                      : { backgroundColor: "#1f2937", borderColor: "#6b7280" }
                  }
                />
                {selectedValues.includes(option.key) && (
                  <span
                    className="absolute left-0 top-0 w-4 h-4 flex items-center justify-center text-white text-base pointer-events-none select-none"
                    style={{ lineHeight: "1rem", fontWeight: 700 }}>
                    +
                  </span>
                )}
              </span>
              <span className="text-white">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // API State
  const [results, setResults] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  // Pending filter states (controlled by UI)
  const [pendingSearchTerm, setPendingSearchTerm] = useState("");
  const [pendingType, setPendingType] = useState<string[]>(["all"]);
  const [pendingGenre, setPendingGenre] = useState<string[]>(["all"]);
  const [pendingRating, setPendingRating] = useState<string[]>(["all"]);
  const [pendingYear, setPendingYear] = useState<string[]>(["all"]);
  const [pendingSeason, setPendingSeason] = useState<string[]>(["all"]);
  const [pendingRated, setPendingRated] = useState<string[]>(["all"]);
  const [pendingStudio, setPendingStudio] = useState("");
  const [pendingProducers, setPendingProducers] = useState("");
  const [pendingSrcType, setPendingSrcType] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const advancedFilterRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Close advanced filter when clicking outside
  useEffect(() => {
    if (!showAdvanced) return;
    function handleClickOutside(event: MouseEvent) {
      const dropdown = advancedFilterRef.current;
      const toggleBtn = toggleButtonRef.current;
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        (!toggleBtn || !toggleBtn.contains(event.target as Node))
      ) {
        setShowAdvanced(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAdvanced]);

  // Sync filters from URL on mount
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setPendingSearchTerm(params.search || "");
    setPendingType(params.anime_type ? params.anime_type.split(",") : ["all"]);
    setPendingGenre(params.genres ? params.genres.split(",") : ["all"]);
    setPendingRating(params.rating ? [params.rating] : ["all"]);
    setPendingYear(params.released_year ? [params.released_year] : ["all"]);
    setPendingSeason(params.season ? [params.season] : ["all"]);
    setPendingRated(params.rated ? [params.rated] : ["all"]);
    setPendingStudio(params.studio || "");
    setPendingProducers(params.producers || "");
    setPendingSrcType(params.srctype ? [params.srctype] : []);
    setCurrentPage(1);
  }, [searchParams]);

  // Handle Filter button click
  const handleApplyFilters = async () => {
    const params = new URLSearchParams();
    
    if (pendingSearchTerm) params.set("search", pendingSearchTerm);
    if (pendingType.length > 0 && !pendingType.includes("all"))
      params.set("anime_type", pendingType.join(","));
    if (pendingGenre.length > 0 && !pendingGenre.includes("all"))
      params.set("genres", pendingGenre.join(","));
    if (pendingRating.length > 0 && !pendingRating.includes("all"))
      params.set("rating", pendingRating[0]);
    if (pendingYear.length > 0 && !pendingYear.includes("all"))
      params.set("released_year", pendingYear[0]);
    if (pendingSeason.length > 0 && !pendingSeason.includes("all"))
      params.set("season", pendingSeason[0]);
    if (pendingRated.length > 0 && !pendingRated.includes("all"))
      params.set("rated", pendingRated[0]);
    if (pendingStudio) params.set("studio", pendingStudio);
    if (pendingProducers.trim())
      params.set("producers", pendingProducers.trim().split(" ").join(","));
    if (pendingSrcType.length > 0)
      params.set("srctype", pendingSrcType[0]);

    setCurrentPage(1);
    router.replace(`/search?${params.toString()}`);
  };

  // Fetch data when URL changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = Object.fromEntries(searchParams.entries());
        const offset = (currentPage - 1) * itemsPerPage;

        const filters: any = {};
        if (params.genres) filters.genres = params.genres.split(",");
        if (params.anime_type) filters.anime_type = params.anime_type.split(",");
        if (params.rating) filters.rating = parseFloat(params.rating);
        if (params.rated) filters.rated = params.rated;
        if (params.season) filters.season = params.season;
        if (params.released_year) filters.released_year = parseInt(params.released_year);
        if (params.studio) filters.studio = params.studio;
        if (params.producers) filters.producers = params.producers.split(",").filter((p: string) => p.trim());
        if (params.srctype) filters.srctype = params.srctype;

        const data = await pageApi.getSearchPageData(
          params.search,
          filters,
          itemsPerPage,
          offset
        );

        setResults(data.results || []);
        setTotalCount(data.count || 0);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch results");
        setResults([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams, currentPage]);

  // Pagination calculations
  const totalPages = Math.ceil(totalCount / itemsPerPage);

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
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-17">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-white mb-8 txt-heading">
            Search
          </h1>
          <div className="mb-8">
            <div
              className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-4 relative"
              ref={advancedFilterRef}>
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search anime..."
                value={pendingSearchTerm}
                onChange={(e) => setPendingSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg bg-purple text-white border border-gray-700 focus:outline-none w-full"
              />
              {/* Type Multi-Select */}
              <MultiSelect
                options={typeFilters}
                selectedValues={pendingType}
                onChange={setPendingType}
                className="w-full"
              />
              {/* Genre Multi-Select */}
              <MultiSelect
                options={genreOptions}
                selectedValues={pendingGenre}
                onChange={setPendingGenre}
                className="w-full"
              />
              {/* Rating Multi-Select */}
              <MultiSelect
                options={ratingOptions}
                selectedValues={pendingRating}
                onChange={setPendingRating}
                className="w-full"
              />
              {/* Filter Icon & Button (relative container) */}
              <div className="flex items-center gap-2 relative">
                <button
                  type="button"
                  ref={toggleButtonRef}
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="p-2 rounded-lg btn-pink text-white cursor-pointer flex justify-center w-full"
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
                  className="px-6 py-2 rounded-lg btn-purple text-white/90 font-medium hover:bg-purple-700 cursor-pointer w-full"
                  onClick={handleApplyFilters}>
                  Filter
                </button>
                {/* Advanced Dropdown - position absolute */}
                {showAdvanced && (
                  <div className="bg-purple border border-gray-700 rounded-lg p-4 mt-2 absolute top-full right-0 z-50 w-[min(90vw,600px)] shadow-xl">
                    <div className="flex justify-between items-center gap-4 flex-wrap">
                      {/* Year Multi-Select */}
                      <div className="w-full md:w-auto flex-1">
                        <label className="block text-gray-300 text-sm mb-1">
                          Year
                        </label>
                        <MultiSelect
                          options={yearOptions}
                          selectedValues={pendingYear}
                          onChange={setPendingYear}
                          className="w-full"
                        />
                      </div>
                      {/* Season Multi-Select */}
                      <div className="w-full md:w-auto flex-1">
                        <label className="block text-gray-300 text-sm mb-1">
                          Season
                        </label>
                        <MultiSelect
                          options={seasonOptions}
                          selectedValues={pendingSeason}
                          onChange={setPendingSeason}
                          className="w-full"
                        />
                      </div>
                      {/* Rated Multi-Select */}
                      <div className="w-full md:w-auto flex-1">
                        <label className="block text-gray-300 text-sm mb-1">
                          Rating
                        </label>
                        <MultiSelect
                          options={ratedOptions}
                          selectedValues={pendingRated}
                          onChange={setPendingRated}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-4 mt-4">
                      {/* Studio Input Field */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-gray-300 text-md mb-1">
                          Studio
                        </label>
                        <input
                          type="text"
                          value={pendingStudio}
                          onChange={(e) => setPendingStudio(e.target.value)}
                          placeholder="Enter studio name"
                          className="w-full px-4 py-2 rounded-lg bg-purple text-white border border-gray-700"
                        />
                      </div>
                      {/* Producers Input Field */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-gray-300 text-md mb-1">
                          Producers
                        </label>
                        <input
                          type="text"
                          value={pendingProducers}
                          onChange={(e) => setPendingProducers(e.target.value)}
                          placeholder="Space-separated producers"
                          className="w-full px-4 py-2 rounded-lg bg-purple text-white border border-gray-700"
                        />
                      </div>
                    </div>
                    {/* Source Type & Producers */}
                    <div className="mt-4 gap-4 flex items-end flex-wrap">
                      {/* Source Type */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-gray-300 text-md mb-1">
                          Source Type
                        </label>
                        <MultiSelect
                          options={srcTypeOptions}
                          selectedValues={pendingSrcType}
                          onChange={setPendingSrcType}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Content Grid/List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
              </div>
              <p className="text-gray-400 mt-4">Loading results...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 inline-block">
                <p className="text-red-400">Error: {error}</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <>
              {/* Always show grid view */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-5">
                {results.map((anime: any) => (
                  <div key={anime.id} className="relative">
                    <AnimeCard 
                      anime={{
                        id: anime.id.toString(),
                        title: anime.title,
                        poster: anime.image,
                        synopsis: anime.synopsis || '',
                        genres: anime.genres || [],
                        studio: '',
                        releaseYear: 2024,
                        status: 'ongoing',
                        type: anime.number_of_episodes ? 'series' : 'movie',
                        rating: anime.score || 0,
                        popularity: 0,
                        language: ['sub'],
                      }}
                      showPopup={true}
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
                        ? "btn-purple text-gray-500 cursor-not-allowed"
                        : "bg-gray-700 text-white hover:btn-purple"
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
                          ? "btn-purple text-white"
                          : "bg-gray-700 text-white hover:btn-purple"
                      }`}>
                      {pageNum}
                    </button>
                  ))}

                  {/* Next Arrow */}
                  {currentPage < totalPages && (
                    <button
                      onClick={handleNextPage}
                      className="p-2 rounded-lg btn-purple text-white hover:btn-purple"
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
                        ? "btn-purple text-gray-500 cursor-not-allowed"
                        : "bg-gray-700 text-white hover:btn-purple"
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
