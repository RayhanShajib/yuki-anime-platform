"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { mockAnime } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Tags } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const typeFilters = [
  { key: "all", label: "All Types" },
  { key: "series", label: "Series" },
  { key: "movie", label: "Movies" },
  { key: "ova", label: "OVAs" },
];

const srcTypeOptions = [
  { key: "sub", label: "Subtitle" },
  { key: "dub", label: "Dubbed" },
];

// Multi-Select Component
interface MultiSelectProps {
  options: string[] | { key: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  className?: string;
  allLabel?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  className = "",
  allLabel,
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
      const firstOption = normalizedOptions.find((opt) => opt.key === "all");
      return firstOption?.label || allLabel || "All";
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
    return `${firstOption?.label || selectedValues[0]} + ${
      selectedValues.length - 1
    } more`;
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
                    className="absolute left-0 top-0 w-4 h-4 flex items-center justify-center text-white text-xs pointer-events-none select-none"
                    style={{ lineHeight: "1rem", fontWeight: 700 }}>
                    ✓
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

export default function GenrePage() {
  const seasonOptions = ["all", "Summer", "Spring", "Winter", "Fall"];
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  // Temporary filter states for UI (now arrays for multi-selection)
  const [tempGenre, setTempGenre] = useState<string[]>(["all"]);
  const [tempType, setTempType] = useState<string[]>(["all"]);
  const [pendingRating, setPendingRating] = useState<string[]>([]);
  // Actual filter states used for filtering
  const [selectedSeason, setSelectedSeason] = useState<string[]>(["all"]);
  const [sortBy] = useState("popularity");
  const [typeFilter, setTypeFilter] = useState<string[]>(["all"]);
  const [viewMode] = useState<"grid" | "list">("grid");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [searchTerm, setSearchTerm] = useState("");
  // Removed unused selectedGenre state
  const [selectedRating, setSelectedRating] = useState<string[]>(["all"]);
  const [selectedYear, setSelectedYear] = useState<string[]>(["all"]);
  const [pendingStudio, setPendingStudio] = useState("");
  const [pendingProducers, setPendingProducers] = useState("");
  const [pendingSrcType, setPendingSrcType] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const router = useRouter();
  const advancedFilterRef = useRef<HTMLDivElement>(null);

  // Close advanced filter when clicking outside
  useEffect(() => {
    if (!showAdvanced) return;
    function handleClickOutside(event: MouseEvent) {
      const dropdown = advancedFilterRef.current;
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setShowAdvanced(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAdvanced]);

  // Example genre, rating, year, country, language options
  const genreOptions = [
    "action",
    "adventure",
    "comedy",
    "drama",
    "fantasy",
    "horror",
    "romance",
    "sci-fi",
  ];
  const ratingOptions = ["9+", "8+", "7+", "6+", "5+", "4+", "3+", "2+", "1+"];
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

  const genre = slug ? slug.replace(/-/g, " ") : "";
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

      // Multi-selection type filter
      if (
        typeFilter.length > 0 &&
        !typeFilter.includes("all") &&
        !typeFilter.includes(anime.type)
      )
        return false;

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
        case "updated":
          // Assuming we have an updatedAt field, fallback to popularity for now
          return b.popularity - a.popularity;
        case "popularity":
        default:
          return b.popularity - a.popularity;
      }
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

      <main className="pt-17">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap justify-between items-center">
            {/* Genre Title */}
            <h1
              className={`text-4xl font-bold text-white mb-4 flex items-center txt-heading`}>
              {genreTitle} Anime
            </h1>
            {/* Filters */}
            <div className="mb-8 space-y-4">
              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">
                  Showing {filteredAnime.length} {genre.toLowerCase()} anime
                </p>
              </div>
            </div>
          </div>
          {/* Advanced Filter Section */}
          <div className="mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4 relative">
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search anime..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 rounded-lg bg-purple text-white border border-gray-700 focus:outline-none w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchTerm.trim() !== "") {
                    const params = new URLSearchParams();
                    if (tempGenre.length > 0 && !tempGenre.includes("all"))
                      params.append("genre", tempGenre.join(","));
                    if (
                      selectedRating.length > 0 &&
                      !selectedRating.includes("all")
                    )
                      params.append("rating", selectedRating.join(","));
                    if (
                      selectedYear.length > 0 &&
                      !selectedYear.includes("all")
                    )
                      params.append("year", selectedYear.join(","));
                    if (
                      selectedSeason.length > 0 &&
                      !selectedSeason.includes("all")
                    )
                      params.append("season", selectedSeason.join(","));
                    if (
                      pendingRating.length > 0 &&
                      !pendingRating.includes("all")
                    )
                      params.append("rating", pendingRating.join(","));
                    if (tempType.length > 0 && !tempType.includes("all"))
                      params.append("type", tempType.join(","));
                    params.append("search", searchTerm);
                    if (pendingStudio.trim() !== "")
                      params.append("studio", pendingStudio.trim());
                    if (pendingProducers.trim() !== "")
                      params.append(
                        "producers",
                        pendingProducers.trim().split(" ").join(",")
                      );
                    if (pendingSrcType.length > 0)
                      params.append("srctype", pendingSrcType[0]);
                    router.push(`/search?${params.toString()}`);
                  }
                }}
              />
              {/* Type Multi-Select */}
              <MultiSelect
                options={typeFilters}
                selectedValues={tempType}
                onChange={setTempType}
                className="w-full"
              />
              {/* Genre Multi-Select */}
              <MultiSelect
                options={genreOptions}
                selectedValues={tempGenre}
                onChange={setTempGenre}
                className="w-full"
                allLabel="All Genres"
              />
              {/* Rating Multi-Select */}
              <MultiSelect
                options={ratingOptions}
                selectedValues={pendingRating}
                onChange={setPendingRating}
                className="w-full"
                allLabel="Ratings"
              />
              {/* Filter Icon & Button (relative container) */}
              <div className="flex items-center gap-2 relative">
                <button
                  type="button"
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
                  className="px-6 py-2 rounded-lg btn-purple text-white/90 font-medium cursor-pointer w-full"
                  onClick={() => {
                    setTypeFilter(tempType);
                    const params = new URLSearchParams();
                    if (tempGenre.length > 0 && !tempGenre.includes("all"))
                      params.append("genre", tempGenre.join(","));
                    if (
                      selectedRating.length > 0 &&
                      !selectedRating.includes("all")
                    )
                      params.append("rating", selectedRating.join(","));
                    if (
                      selectedYear.length > 0 &&
                      !selectedYear.includes("all")
                    )
                      params.append("year", selectedYear.join(","));
                    if (
                      selectedSeason.length > 0 &&
                      !selectedSeason.includes("all")
                    )
                      params.append("season", selectedSeason.join(","));
                    if (
                      pendingRating.length > 0 &&
                      !pendingRating.includes("all")
                    )
                      params.append("rating", pendingRating.join(","));
                    if (tempType.length > 0 && !tempType.includes("all"))
                      params.append("type", tempType.join(","));
                    if (searchTerm.trim() !== "")
                      params.append("search", searchTerm);
                    if (pendingStudio.trim() !== "")
                      params.append("studio", pendingStudio.trim());
                    if (pendingProducers.trim() !== "")
                      params.append(
                        "producers",
                        pendingProducers.trim().split(" ").join(",")
                      );
                    if (pendingSrcType.length > 0)
                      params.append("srctype", pendingSrcType[0]);
                    router.push(`/search?${params.toString()}`);
                  }}>
                  Filter
                </button>
                {/* Advanced Dropdown - position absolute */}
                {showAdvanced && (
                  <div
                    className="bg-gray-900 border border-gray-700 rounded-lg p-4 mt-2 absolute top-full right-0 z-50 w-[min(90vw,600px)] shadow-xl"
                    ref={advancedFilterRef}>
                    <div className="flex justify-between items-center gap-4">
                      {/* Rating Multi-Select */}
                      <div className="w-full">
                        <label className="block text-gray-300 text-sm mb-1">
                          Rating
                        </label>
                        <MultiSelect
                          options={ratingOptions}
                          selectedValues={selectedRating}
                          onChange={setSelectedRating}
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
                          selectedValues={selectedYear}
                          onChange={setSelectedYear}
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
                          selectedValues={selectedSeason}
                          onChange={setSelectedSeason}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      {/* Studio Input Field */}
                      <div className="mt-4 w-full">
                        <label className="block text-gray-300 text-md mb-1">
                          Studio
                        </label>
                        <input
                          type="text"
                          value={pendingStudio}
                          onChange={(e) => setPendingStudio(e.target.value)}
                          placeholder="Enter studio name"
                          className="w-full px-4 py-2 rounded-lg bg-purple text-white border border-gray-700 outline-none"
                        />
                      </div>
                      {/* Producers Input Field */}
                      <div className="mt-4 w-full">
                        <label className="block text-gray-300 text-md mb-1">
                          Producers
                        </label>
                        <input
                          type="text"
                          value={pendingProducers}
                          onChange={(e) => setPendingProducers(e.target.value)}
                          placeholder="Space-separated producers"
                          className="w-full px-4 py-2 rounded-lg bg-purple text-white border border-gray-700 outline-none"
                        />
                      </div>
                    </div>
                    {/* Source Type Multi-Select */}
                    <div className="mt-4">
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
                )}
              </div>
            </div>
            {/* Advanced Dropdown moved to absolute position above */}
          </div>

          {/* Content Grid/List */}
          {filteredAnime.length > 0 ? (
            viewMode === "grid" ? (
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
                            : "bg-gray-800 text-gray-300 hover:text-white hover:bg-[#7760A9]"
                        )}>
                        {pageNum}
                      </button>
                    );
                  })}
                  {/* Next Arrow */}
                  {currentPage < totalPages && (
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-[#7760A9] transition-colors"
                      aria-label="Next Page">
                      &gt;
                    </button>
                  )}
                  {/* Double Next Arrow */}
                  {currentPage < totalPages && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-[#7760A9] transition-colors"
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
          {/* ...pagination replaces view more/less... */}
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
