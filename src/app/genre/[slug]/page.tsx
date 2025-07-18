"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { mockAnime } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Tags } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  const seasonOptions = ["Summer", "Spring", "Winter", "Fall"];
  // Temporary filter states for UI
  const [tempGenre, setTempGenre] = useState("all");
  const [tempType, setTempType] = useState("all");
  const [tempStatus, setTempStatus] = useState("all");
  // Actual filter states used for filtering
  const [selectedSeason, setSelectedSeason] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const router = useRouter();

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

      <main className="pt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            {/* Genre Title */}
            <h1
              className={`text-4xl font-bold text-white mb-4 flex items-center`}>
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 relative">
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search anime..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-64 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchTerm.trim() !== "") {
                    const params = new URLSearchParams();
                    if (tempGenre !== "all") params.append("genre", tempGenre);
                    if (selectedRating !== "all")
                      params.append("rating", selectedRating);
                    if (selectedYear !== "all")
                      params.append("year", selectedYear);
                    if (selectedSeason !== "all")
                      params.append("season", selectedSeason);
                    if (
                      selectedCountry.length > 0 &&
                      !selectedCountry.includes("all")
                    )
                      params.append("country", selectedCountry.join(","));
                    if (
                      selectedLanguage.length > 0 &&
                      !selectedLanguage.includes("all")
                    )
                      params.append("language", selectedLanguage.join(","));
                    if (tempStatus !== "all")
                      params.append("status", tempStatus);
                    if (tempType !== "all") params.append("type", tempType);
                    params.append("search", searchTerm);
                    router.push(`/search?${params.toString()}`);
                  }
                }}
              />
              {/* Type Dropdown */}
              <select
                value={tempType}
                onChange={(e) => setTempType(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 w-full">
                {typeFilters.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
              {/* Genre Dropdown */}
              <select
                value={tempGenre}
                onChange={(e) => setTempGenre(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 w-full">
                {genreOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              {/* Status Dropdown */}
              <select
                value={tempStatus}
                onChange={(e) => setTempStatus(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 w-full">
                {statusFilters.map((option) => (
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
                  className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 w-full cursor-pointer"
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
                  className="px-10 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 cursor-pointer"
                  onClick={() => {
                    setSelectedGenre(tempGenre);
                    setTypeFilter(tempType);
                    setStatusFilter(tempStatus);
                    const params = new URLSearchParams();
                    if (tempGenre !== "all") params.append("genre", tempGenre);
                    if (selectedRating !== "all")
                      params.append("rating", selectedRating);
                    if (selectedYear !== "all")
                      params.append("year", selectedYear);
                    if (selectedSeason !== "all")
                      params.append("season", selectedSeason);
                    if (
                      selectedCountry.length > 0 &&
                      !selectedCountry.includes("all")
                    )
                      params.append("country", selectedCountry.join(","));
                    if (
                      selectedLanguage.length > 0 &&
                      !selectedLanguage.includes("all")
                    )
                      params.append("language", selectedLanguage.join(","));
                    if (tempStatus !== "all")
                      params.append("status", tempStatus);
                    if (tempType !== "all") params.append("type", tempType);
                    if (searchTerm.trim() !== "")
                      params.append("search", searchTerm);
                    router.push(`/search?${params.toString()}`);
                  }}>
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
                          value={selectedRating}
                          onChange={(e) => setSelectedRating(e.target.value)}
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
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
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
                          value={selectedSeason}
                          onChange={(e) => setSelectedSeason(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700">
                          {seasonOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
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
                              checked={selectedCountry.includes(option)}
                              onChange={() => {
                                setSelectedCountry((prev) =>
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
                              checked={selectedLanguage.includes(option)}
                              onChange={() => {
                                setSelectedLanguage((prev) =>
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
            {/* Advanced Dropdown moved to absolute position above */}
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
      <FooterSection />
    </div>
  );
}
