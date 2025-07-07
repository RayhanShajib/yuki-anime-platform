'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { Calendar, Filter, Grid, List } from 'lucide-react';
import { latestAnime } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const filterOptions = [
  { key: 'all', label: 'All' },
  { key: 'sub', label: 'Subtitled' },
  { key: 'dub', label: 'Dubbed' },
];

const timeFilters = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

const typeFilters = [
  { key: 'all', label: 'All Types' },
  { key: 'series', label: 'Series' },
  { key: 'movie', label: 'Movies' },
  { key: 'ova', label: 'OVAs' },
];

export default function LatestPage() {
  const [languageFilter, setLanguageFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('week');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter anime based on selected filters
  const filteredAnime = latestAnime.filter(anime => {
    if (languageFilter !== 'all' && !anime.language.includes(languageFilter as 'sub' | 'dub')) {
      return false;
    }
    if (typeFilter !== 'all' && anime.type !== typeFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
              <Calendar className="h-10 w-10 text-green-500 mr-4" />
              Latest Releases
            </h1>
            <p className="text-gray-400 text-lg">
              Discover the newest anime episodes and series
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Language Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300 text-sm font-medium">Language:</span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                  {filterOptions.map(option => (
                    <button
                      key={option.key}
                      onClick={() => setLanguageFilter(option.key)}
                      className={cn(
                        'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                        languageFilter === option.key
                          ? 'bg-green-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm font-medium">Time:</span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                  {timeFilters.map(option => (
                    <button
                      key={option.key}
                      onClick={() => setTimeFilter(option.key)}
                      className={cn(
                        'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                        timeFilter === option.key
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm font-medium">Type:</span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                  {typeFilters.map(option => (
                    <button
                      key={option.key}
                      onClick={() => setTypeFilter(option.key)}
                      className={cn(
                        'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                        typeFilter === option.key
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      )}
                    >
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
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 rounded-md transition-colors',
                      viewMode === 'grid'
                        ? 'bg-gray-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    )}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded-md transition-colors',
                      viewMode === 'list'
                        ? 'bg-gray-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    )}
                  >
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
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {filteredAnime.map(anime => (
                <AnimeCard key={anime.id} anime={anime} showPopup={true} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAnime.map(anime => (
                <div 
                  key={anime.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={anime.poster}
                      alt={anime.title}
                      className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
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
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-white">{anime.rating}</span>
                        </div>
                        <div className="flex space-x-1">
                          {anime.language.includes('sub') && (
                            <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
                              SUB
                            </span>
                          )}
                          {anime.language.includes('dub') && (
                            <span className="px-2 py-1 bg-orange-600 text-white text-xs font-bold rounded">
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
          )}

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-colors font-medium">
              Load More Anime
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
