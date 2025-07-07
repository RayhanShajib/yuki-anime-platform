'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { 
  Play, 
  Clock, 
  Filter, 
  Grid3X3, 
  List,
  Search,
  Calendar,
  TrendingUp,
  Bookmark,
  MoreVertical,
  X
} from 'lucide-react';
import { mockAnime } from '@/lib/mockData';

// Mock data for continue watching with progress
const continueWatchingData = mockAnime.slice(0, 12).map((anime, index) => ({
  ...anime,
  currentEpisode: Math.floor(Math.random() * (anime.episodes || 24)) + 1,
  totalEpisodes: anime.episodes || 24,
  lastWatched: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  progress: Math.random() * 100,
  timeLeft: Math.floor(Math.random() * 25) + 5, // minutes left in current episode
  isNewEpisode: Math.random() > 0.7
}));

type ViewMode = 'grid' | 'list';
type SortBy = 'lastWatched' | 'progress' | 'alphabetical' | 'rating';

export default function ContinueWatchingPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('lastWatched');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredData, setFilteredData] = useState(continueWatchingData);

  // Filter and sort data
  useEffect(() => {
    let filtered = continueWatchingData.filter(anime =>
      anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'lastWatched':
          return new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime();
        case 'progress':
          return b.progress - a.progress;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredData(filtered);
  }, [searchQuery, sortBy]);

  const formatLastWatched = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center">
              <Play className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 mr-3" />
              Continue Watching
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Pick up where you left off</p>
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
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
                />
              </div>

              {/* Controls Row */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Sort By */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 text-sm font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="lastWatched">Last Watched</option>
                    <option value="progress">Progress</option>
                    <option value="alphabetical">A-Z</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2 bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[40px] ${
                      viewMode === 'grid'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-600'
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[40px] ${
                      viewMode === 'list'
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-600'
                    }`}
                  >
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
              {filteredData.length} {filteredData.length === 1 ? 'anime' : 'anime'} in your list
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
              >
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
                {searchQuery ? 'No results found' : 'No anime in progress'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Start watching some anime to see them here!'
                }
              </p>
              {!searchQuery && (
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                  Browse Anime
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                  {filteredData.map(anime => (
                    <div key={anime.id} className="relative group">
                      {/* New Episode Badge */}
                      {anime.isNewEpisode && (
                        <div className="absolute top-2 left-2 z-10 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                          NEW
                        </div>
                      )}
                      
                      <AnimeCard anime={anime} showPopup={true} />
                      
                      {/* Progress Info */}
                      <div className="mt-2 bg-gray-800/50 rounded-lg p-2 sm:p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs sm:text-sm text-gray-300">
                            Ep {anime.currentEpisode}/{anime.totalEpisodes}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatLastWatched(anime.lastWatched)}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(anime.progress)}`}
                            style={{ width: `${anime.progress}%` }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{Math.round(anime.progress)}% complete</span>
                          {anime.timeLeft && (
                            <span>{anime.timeLeft}m left</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-3 sm:space-y-4">
                  {filteredData.map(anime => (
                    <div key={anime.id} className="bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 space-y-3 sm:space-y-0 sm:space-x-4">
                        {/* Poster */}
                        <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                          <img
                            src={anime.poster}
                            alt={anime.title}
                            className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-lg"
                          />
                          {anime.isNewEpisode && (
                            <div className="absolute -top-1 -right-1 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                              NEW
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <h3 className="text-white font-semibold text-sm sm:text-base truncate mb-1">
                            {anime.title}
                          </h3>
                          <p className="text-gray-400 text-xs sm:text-sm mb-2">
                            Episode {anime.currentEpisode} of {anime.totalEpisodes} • {anime.genre}
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(anime.progress)}`}
                              style={{ width: `${anime.progress}%` }}
                            />
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-center sm:justify-between text-xs text-gray-400 space-y-1 sm:space-y-0">
                            <span>{Math.round(anime.progress)}% complete</span>
                            <span>Last watched {formatLastWatched(anime.lastWatched)}</span>
                            {anime.timeLeft && (
                              <span>{anime.timeLeft} minutes left</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
                          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[40px] flex items-center space-x-2">
                            <Play className="h-4 w-4" />
                            <span>Continue</span>
                          </button>
                          <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center">
                            <MoreVertical className="h-4 w-4" />
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
    </div>
  );
}
