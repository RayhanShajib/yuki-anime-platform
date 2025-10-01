"use client";

import { AnimeCard } from "@/components/ui/AnimeCard";
import { mockAnime } from "@/lib/mockData";
import { Tags } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

  // Pending filter states (controlled by UI)
  const [pendingSearchTerm, setPendingSearchTerm] = useState("");
  const [pendingType, setPendingType] = useState<string[]>(["all"]);
  const [pendingStatus, setPendingStatus] = useState<string[]>(["all"]);
  const [pendingGenre, setPendingGenre] = useState<string[]>(["all"]);
  const [pendingRating, setPendingRating] = useState<string[]>(["all"]);
  const [pendingYear, setPendingYear] = useState<string[]>(["all"]);
  const [pendingCountry, setPendingCountry] = useState<string[]>([]);
  const [pendingLanguage, setPendingLanguage] = useState<string[]>([]);
  const [pendingSeason, setPendingSeason] = useState<string[]>(["all"]);
  const [pendingSort, setPendingSort] = useState("popularity");
  const [pendingStudio, setPendingStudio] = useState("");
  const [pendingProducer, setPendingProducer] = useState("");
  const [pendingAudio, setPendingAudio] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const advancedFilterRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Close advanced filter when clicking outside (notification style)
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Applied filter states (from URL)
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    type: [] as string[],
    status: [] as string[],
    genre: [] as string[],
    rating: [] as string[],
    year: [] as string[],
    country: [] as string[],
    language: [] as string[],
    season: [] as string[],
    sort: "popularity",
    studio: "",
    alpha: "",
  });

  // Sync applied filters from URL on mount or URL change
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setAppliedFilters({
      search: params.search || "",
      type: params.type ? params.type.split(",") : ["all"],
      status: params.status ? params.status.split(",") : ["all"],
      genre: params.genre ? params.genre.split(",") : ["all"],
      rating: params.rating ? params.rating.split(",") : ["all"],
      year: params.year ? params.year.split(",") : ["all"],
      country: params.country ? (params.country.split(",") as string[]) : [],
      language: params.language ? (params.language.split(",") as string[]) : [],
      season: params.season ? params.season.split(",") : ["all"],
      sort: params.sort || "popularity",
      studio: params.studio || "",
      alpha: params.alpha || "",
    });
    // Also update pending states so UI reflects URL
    setPendingSearchTerm(params.search || "");
    setPendingType(params.type ? params.type.split(",") : ["all"]);
    setPendingStatus(params.status ? params.status.split(",") : ["all"]);
    setPendingGenre(params.genre ? params.genre.split(",") : ["all"]);
    setPendingRating(params.rating ? params.rating.split(",") : ["all"]);
    setPendingYear(params.year ? params.year.split(",") : ["all"]);
    setPendingCountry(params.country ? params.country.split(",") : []);
    setPendingLanguage(params.language ? params.language.split(",") : []);
    setPendingSeason(params.season ? params.season.split(",") : ["all"]);
    setPendingSort(params.sort || "popularity");
    setPendingStudio(params.studio || "");
    setPendingProducer(params.producer || "");
    setPendingAudio(params.audio || "");

    // Reset to page 1 when URL changes (filters change)
    setCurrentPage(1);
  }, [searchParams]);

  // Handle Filter button click
  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (pendingSearchTerm) params.set("search", pendingSearchTerm);
    if (pendingType.length > 0 && !pendingType.includes("all"))
      params.set("type", pendingType.join(","));
    if (pendingStatus.length > 0 && !pendingStatus.includes("all"))
      params.set("status", pendingStatus.join(","));
    if (pendingGenre.length > 0 && !pendingGenre.includes("all"))
      params.set("genre", pendingGenre.join(","));
    if (pendingRating.length > 0 && !pendingRating.includes("all"))
      params.set("rating", pendingRating.join(","));
    if (pendingYear.length > 0 && !pendingYear.includes("all"))
      params.set("year", pendingYear.join(","));
    if (pendingCountry.length > 0 && !pendingCountry.includes("all"))
      params.set("country", pendingCountry.join(","));
    if (pendingLanguage.length > 0 && !pendingLanguage.includes("all"))
      params.set("language", pendingLanguage.join(","));
    if (pendingSeason.length > 0 && !pendingSeason.includes("all"))
      params.set("season", pendingSeason.join(","));
    if (pendingSort !== "popularity") params.set("sort", pendingSort);
    if (pendingStudio) params.set("studio", pendingStudio);
    if (pendingProducer) params.set("producer", pendingProducer);
    if (pendingAudio) params.set("audio", pendingAudio);

    // Reset to page 1 when applying new filters
    setCurrentPage(1);

    router.replace(`/search?${params.toString()}`);
  };

  // Filtering logic (use appliedFilters)
  const filteredAnime = mockAnime
    .filter((anime) => {
      // Alphabet filter
      if (appliedFilters.alpha && appliedFilters.alpha !== "") {
        if (appliedFilters.alpha === "0-9") {
          if (!anime.title || !/^[0-9]/.test(anime.title)) return false;
        } else {
          if (
            !anime.title ||
            anime.title[0].toUpperCase() !== appliedFilters.alpha.toUpperCase()
          )
            return false;
        }
      }
      if (
        appliedFilters.search &&
        !anime.title.toLowerCase().includes(appliedFilters.search.toLowerCase())
      )
        return false;
      if (
        appliedFilters.genre.length > 0 &&
        !appliedFilters.genre.includes("all") &&
        !anime.genres.some((g) =>
          appliedFilters.genre.some((selectedGenre) =>
            g.toLowerCase().includes(selectedGenre.toLowerCase())
          )
        )
      )
        return false;
      if (
        appliedFilters.type.length > 0 &&
        !appliedFilters.type.includes("all") &&
        !appliedFilters.type.includes(anime.type)
      )
        return false;
      if (
        appliedFilters.status.length > 0 &&
        !appliedFilters.status.includes("all") &&
        !appliedFilters.status.includes(anime.status)
      )
        return false;
      if (
        appliedFilters.rating.length > 0 &&
        !appliedFilters.rating.includes("all") &&
        !appliedFilters.rating.some((ratingFilter) => {
          const ratingValue = parseInt(ratingFilter);
          return anime.rating >= ratingValue;
        })
      )
        return false;
      if (
        appliedFilters.year.length > 0 &&
        !appliedFilters.year.includes("all") &&
        !appliedFilters.year.some((yearFilter) => {
          if (yearFilter.includes("-")) {
            const [startYear, endYear] = yearFilter.split("-");
            return (
              anime.releaseYear >= parseInt(startYear) &&
              anime.releaseYear <= parseInt(endYear)
            );
          }
          return anime.releaseYear.toString() === yearFilter;
        })
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
              {/* Status Multi-Select */}
              <MultiSelect
                options={statusFilters}
                selectedValues={pendingStatus}
                onChange={setPendingStatus}
                className="w-full"
              />
              {/* Sort Dropdown */}
              <select
                value={pendingSort}
                onChange={(e) => setPendingSort(e.target.value)}
                className="px-4 py-2 rounded-lg bg-purple text-white border border-gray-700 w-full">
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
                    <div className="flex justify-between items-center gap-4">
                      {/* Rating Multi-Select */}
                      <div className="w-full">
                        <label className="block text-gray-300 text-sm mb-1">
                          Rating
                        </label>
                        <MultiSelect
                          options={ratingOptions}
                          selectedValues={pendingRating}
                          onChange={setPendingRating}
                          className="w-full"
                        />
                      </div>
                      {/* Year Multi-Select */}
                      <div className="w-full">
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
                      <div className="w-full">
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
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-4">
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
                          className="w-full px-4 py-2 rounded-lg bg-purple text-white border border-gray-700"
                        />
                      </div>
                      {/* Producer Input Field */}
                      <div className="mt-4">
                        <label className="block text-gray-300 text-md mb-1">
                          Producer
                        </label>
                        <input
                          type="text"
                          value={pendingProducer}
                          onChange={(e) => setPendingProducer(e.target.value)}
                          placeholder="Enter producer name"
                          className="w-full px-4 py-2 rounded-lg bg-purple text-white border border-gray-700"
                        />
                      </div>
                    </div>
                    {/* Sub/Dub Toggle Buttons */}
                    <div className="mt-4 flex gap-4 items-center flex-wrap">
                      <button
                        type="button"
                        className={`px-6 py-2 rounded-lg font-medium border border-gray-700 ${
                          pendingAudio === "sub"
                            ? "btn-purple text-white"
                            : "bg-purple text-gray-300"
                        }`}
                        onClick={() => setPendingAudio("sub")}>
                        Sub
                      </button>
                      <button
                        type="button"
                        className={`px-6 py-2 rounded-lg font-medium border border-gray-700 ${
                          pendingAudio === "dub"
                            ? "btn-purple text-white"
                            : "bg-purple text-gray-300"
                        }`}
                        onClick={() => setPendingAudio("dub")}>
                        Dub
                      </button>
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
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-5">
                {currentAnime.map((anime) => (
                  <div key={anime.id} className="relative">
                    <AnimeCard anime={anime} showPopup={true} />
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
