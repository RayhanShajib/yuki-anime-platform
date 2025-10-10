"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { getWatchHistory, formatTime, type WatchHistoryItem } from "@/lib/watchHistory";
import {
  Clock,
  Grid3X3,
  List,
  MoreVertical,
  Play,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type ViewMode = "grid" | "list";
type SortBy = "lastWatched" | "progress" | "alphabetical" | "title";

export default function ContinueWatchingPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("lastWatched");
  const [searchQuery, setSearchQuery] = useState("");
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const [filteredData, setFilteredData] = useState<WatchHistoryItem[]>([]);

  // Load watch history on component mount
  useEffect(() => {
    const history = getWatchHistory();
    setWatchHistory(history);
  }, []);

  // Filter and sort data
  useEffect(() => {
    const filtered = watchHistory.filter((item) =>
      item.animeTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "lastWatched":
          return (
            new Date(b.lastWatched).getTime() -
            new Date(a.lastWatched).getTime()
          );
        case "progress":
          return b.progress - a.progress;
        case "title":
          return a.animeTitle.localeCompare(b.animeTitle);
        default:
          return 0;
      }
    });

    setFilteredData(filtered);
  }, [watchHistory, searchQuery, sortBy]);

  // Remove item from watch history
  const removeFromHistory = (episodeId: string, audioType: 'sub' | 'dub') => {
    const updatedHistory = watchHistory.filter(
      item => !(item.episodeId === episodeId && item.audioType === audioType)
    );
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('yukiwatch_history', JSON.stringify(updatedHistory));
    }
    
    setWatchHistory(updatedHistory);
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center">
              Continue Watching
            </h1>
          </div>

          {/* Search and Controls */}
          <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-700 mb-6 sm:mb-8">
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your watching list..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white/90 placeholder-gray-400 focus:outline-none text-sm sm:text-base"
                />
              </div>

              {/* Controls Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Sort By */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 text-sm font-medium">
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white/90 text-sm focus:outline-none">
                    <option value="lastWatched">Last Watched</option>
                    <option value="progress">Progress</option>
                    <option value="title">A-Z</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[40px] ${
                      viewMode === "grid"
                        ? "btn-purple text-white/90"
                        : "text-gray-300 hover:text-white hover:bg-gray-600"
                    }`}>
                    <Grid3X3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[40px] ${
                      viewMode === "list"
                        ? "btn-purple text-white/90"
                        : "text-gray-300 hover:text-white hover:bg-gray-600"
                    }`}>
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline">List</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400 text-sm sm:text-base">
              {filteredData.length}{" "}
              {filteredData.length === 1 ? "anime" : "anime"} in your list
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors text-sm">
                <X className="h-4 w-4" />
                <span>Clear search</span>
              </button>
            )}
          </div>

          {/* Content */}
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery ? "No results found" : "No anime in progress"}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Start watching some anime to see them here!"}
              </p>
              {!searchQuery && (
                <Link 
                  href="/"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors inline-block"
                >
                  Browse Anime
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 lg:gap-7">
                  {filteredData.map((item) => (
                    <div key={`${item.episodeId}-${item.audioType}`} className="relative group">
                      <Link 
                        href={`/watch/${item.episodeId}`}
                        className="block relative"
                      >
                        {/* Poster */}
                        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                          <Image
                            src={item.poster || '/placeholder-anime.jpg'}
                            alt={item.animeTitle}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          
                          {/* Play Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                            <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          {/* Progress Badge */}
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {Math.round(item.progress)}%
                          </div>

                          {/* Audio Type Badge */}
                          <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded uppercase font-medium">
                            {item.audioType}
                          </div>
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="mt-2">
                        <h3 className="text-white text-sm font-medium truncate mb-1">
                          {item.animeTitle}
                        </h3>
                        <p className="text-gray-400 text-xs mb-2">
                          Ep {item.episodeNumber}
                        </p>

                        {/* Progress Info */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-300">
                            {formatTime(item.currentTime)}/{formatTime(item.totalTime)}
                          </span>
                          <button
                            onClick={() => removeFromHistory(item.episodeId, item.audioType)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                            title="Remove from history"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-700 rounded-full h-1 mb-2">
                          <div
                            className="h-1 rounded-full transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-3 sm:space-y-4">
                  {filteredData.map((item) => (
                    <div
                      key={`${item.episodeId}-${item.audioType}`}
                      className="bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 space-y-3 sm:space-y-0 sm:space-x-4 gap-3.5">
                        {/* Poster */}
                        <Link 
                          href={`/watch/${item.episodeId}`}
                          className="relative flex-shrink-0 mx-auto sm:mx-0 group"
                        >
                          <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden">
                            <Image
                              src={item.poster || '/placeholder-anime.jpg'}
                              alt={item.animeTitle}
                              width={80}
                              height={96}
                              className="object-cover w-full h-full group-hover:brightness-75 transition-all duration-300"
                              priority
                            />
                          </div>
                          {/* Audio Type Badge */}
                          <div className="absolute top-1 left-1 bg-purple-600 text-white text-xs px-1 py-0.5 rounded uppercase font-medium">
                            {item.audioType}
                          </div>
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0 text-center sm:text-left w-full">
                          <Link href={`/watch/${item.episodeId}`}>
                            <h3 className="text-white font-semibold text-sm sm:text-base truncate mb-1 hover:text-purple-400 transition-colors">
                              {item.animeTitle}
                            </h3>
                          </Link>
                          
                          <p className="text-gray-400 text-xs sm:text-sm mb-2">
                            Episode {item.episodeNumber} • {Math.round(item.progress)}% complete
                          </p>

                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs sm:text-sm text-gray-300">
                              {formatTime(item.currentTime)}/{formatTime(item.totalTime)}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(item.lastWatched).toLocaleDateString()}
                            </span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                            <div
                              className="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 mx-auto sm:mx-0 flex-wrap gap-2.5">
                          <Link 
                            href={`/watch/${item.episodeId}`}
                            className="btn-purple px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[40px] flex items-center space-x-2"
                          >
                            <Play className="h-4 w-4" />
                            <span>Continue</span>
                          </Link>
                          <button 
                            onClick={() => removeFromHistory(item.episodeId, item.audioType)}
                            className="bg-gray-700 hover:bg-red-600 text-white/90 p-2 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                            title="Remove from history"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
