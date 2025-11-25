"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { useGenres } from "@/lib/GenresContext";
import type { Genre } from "@/types/api";
import { Search, Tags, TrendingUp, Hash, SortAsc } from "lucide-react";

// Sort options for genres
type SortOption = "popularity" | "alphabetical" | "anime_count";

interface SortOptionType {
  key: SortOption;
  label: string;
  icon: React.ReactNode;
}

const sortOptions: SortOptionType[] = [
  { 
    key: "popularity", 
    label: "Most Popular", 
    icon: <TrendingUp className="h-4 w-4" />
  },
  { 
    key: "anime_count", 
    label: "Most Anime", 
    icon: <Hash className="h-4 w-4" />
  },
  { 
    key: "alphabetical", 
    label: "A to Z", 
    icon: <SortAsc className="h-4 w-4" />
  },
];

// Genre Card Component
interface GenreCardProps {
  genre: Genre;
}

const GenreCard: React.FC<GenreCardProps> = ({ genre }) => {
  // Convert genre name to slug format
  const slug = genre.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  // Format popularity number
  const formatPopularity = (popularity: number | null) => {
    if (!popularity) return "—";
    if (popularity >= 1000000) {
      return `${(popularity / 1000000).toFixed(1)}M`;
    }
    if (popularity >= 1000) {
      return `${(popularity / 1000).toFixed(1)}K`;
    }
    return popularity.toString();
  };

  return (
    <Link href={`/genre/${slug}`}>
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:bg-gray-700 transition-all duration-300 cursor-pointer group">
        {/* Genre Icon/Background */}
        <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-purple-600/20 group-hover:bg-purple-500/30 transition-all duration-300">
          <Tags className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
        </div>
        
        {/* Genre Name */}
        <h3 className="text-xl font-bold text-white text-center mb-3">
          {genre.name}
        </h3>
        
        {/* Stats */}
        <div className="space-y-2">
          {/* Anime Count */}
          <div className="flex items-center justify-center space-x-2">
            <Hash className="h-4 w-4 text-gray-400" />
            <span className="text-gray-300 text-sm">
              {genre.anime_count.toLocaleString()} anime
            </span>
          </div>
          
          {/* Popularity */}
          {genre.popularity && (
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span className="text-gray-300 text-sm">
                {formatPopularity(genre.popularity)} views
              </span>
            </div>
          )}
        </div>
        
        {/* Hover indicator */}
        <div className="mt-4 text-center">
          <span className="text-purple-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Browse {genre.name} →
          </span>
        </div>
      </div>
    </Link>
  );
};

// Main Genres Page Component
export default function GenresPage() {
  const { genres, loading, error } = useGenres();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popularity");

  // Filter and sort genres
  const filteredAndSortedGenres = useMemo(() => {
    let filtered = genres.filter(genre =>
      genre.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort based on selected option
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          // Primary: anime_count, Secondary: popularity, Fallback: alphabetical
          if (a.anime_count !== b.anime_count) {
            return b.anime_count - a.anime_count;
          }
          if (a.popularity !== b.popularity) {
            return (b.popularity || 0) - (a.popularity || 0);
          }
          return a.name.localeCompare(b.name);
        
        case "anime_count":
          if (a.anime_count !== b.anime_count) {
            return b.anime_count - a.anime_count;
          }
          return a.name.localeCompare(b.name);
        
        case "alphabetical":
          return a.name.localeCompare(b.name);
        
        default:
          return 0;
      }
    });

    return filtered;
  }, [genres, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-700 rounded-lg w-64 mx-auto mb-8"></div>
              <div className="h-12 bg-gray-700 rounded-lg w-80 mx-auto mb-12"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array(20).fill(0).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-700 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <FooterSection />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <Tags className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">Failed to Load Genres</h1>
              <p className="text-gray-400 mb-8">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Browse All Genres
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover anime across {genres.length} different genres. Find your next favorite series by exploring popular categories.
            </p>
          </div>

          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search genres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-purple text-white border border-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-purple border border-gray-700 rounded-lg text-white px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.key} value={option.key} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                {sortOptions.find(opt => opt.key === sortBy)?.icon}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-center mb-8">
            <p className="text-gray-400">
              {searchTerm ? (
                <>
                  Showing {filteredAndSortedGenres.length} of {genres.length} genres 
                  {filteredAndSortedGenres.length > 0 ? (
                    <> matching &ldquo;<span className="text-purple-400">{searchTerm}</span>&rdquo;</>
                  ) : (
                    <> for &ldquo;<span className="text-red-400">{searchTerm}</span>&rdquo;</>
                  )}
                </>
              ) : (
                <>Showing all {genres.length} available genres</>
              )}
            </p>
          </div>

          {/* Genres Grid */}
          {filteredAndSortedGenres.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredAndSortedGenres.map((genre) => (
                <GenreCard key={genre.id} genre={genre} />
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No genres found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search term or{" "}
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-purple-400 hover:text-purple-300 transition-colors underline"
                >
                  clear the search
                </button>
              </p>
            </div>
          )}

          {/* Popular Genres Quick Links */}
          {!searchTerm && (
            <div className="mt-16 pt-12 border-t border-gray-700">
              <h2 className="text-2xl font-bold text-white text-center mb-8">
                Popular Genres
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {filteredAndSortedGenres.slice(0, 10).map((genre) => {
                  const slug = genre.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  return (
                    <Link
                      key={genre.id}
                      href={`/genre/${slug}`}
                      className="px-4 py-2 bg-purple-600/20 text-purple-300 rounded-full border border-purple-500/30 hover:bg-purple-600/30 hover:text-purple-200 transition-all duration-300 text-sm"
                    >
                      {genre.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>
      
      <FooterSection />
    </div>
  );
}