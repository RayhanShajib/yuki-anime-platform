'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { Film, Filter, Grid, List, Calendar, Star, Clock } from 'lucide-react';
import { mockAnime } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const sortOptions = [
  { key: 'latest', label: 'Latest Release' },
  { key: 'rating', label: 'Highest Rated' },
  { key: 'popularity', label: 'Most Popular' },
  { key: 'title', label: 'Alphabetical' },
];

const genreFilters = [
  { key: 'all', label: 'All Genres' },
  { key: 'action', label: 'Action' },
  { key: 'adventure', label: 'Adventure' },
  { key: 'drama', label: 'Drama' },
  { key: 'fantasy', label: 'Fantasy' },
  { key: 'romance', label: 'Romance' },
];

export default function MoviesPage() {
  const [sortBy, setSortBy] = useState('latest');
  const [genreFilter, setGenreFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter only movies and apply sorting
  const movieAnime = mockAnime.filter(anime => anime.type === 'movie');
  
  const filteredMovies = movieAnime
    .filter(anime => {
      if (genreFilter === 'all') return true;
      return anime.genres.some(genre => genre.toLowerCase().includes(genreFilter));
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return b.popularity - a.popularity;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'latest':
        default:
          return b.releaseYear - a.releaseYear;
      }
    });

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center">
              <Film className="h-10 w-10 text-purple-500 mr-4" />
              Anime Movies
            </h1>
            <p className="text-gray-400 text-lg">
              Discover amazing anime films and cinematic experiences
            </p>
          </div>

          {/* Featured Movie Banner */}
          <div className="mb-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg overflow-hidden border border-purple-800/30">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img
                  src={filteredMovies[0]?.banner || filteredMovies[0]?.poster}
                  alt={filteredMovies[0]?.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-bold">FEATURED</span>
                  <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs">MOVIE</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  {filteredMovies[0]?.title}
                </h2>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {filteredMovies[0]?.synopsis}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{filteredMovies[0]?.releaseYear}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{filteredMovies[0]?.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>2h 15m</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold">
                    Watch Now
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
                    More Info
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300 text-sm font-medium">Sort by:</span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                  {sortOptions.map(option => (
                    <button
                      key={option.key}
                      onClick={() => setSortBy(option.key)}
                      className={cn(
                        'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                        sortBy === option.key
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm font-medium">Genre:</span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                  {genreFilters.map(option => (
                    <button
                      key={option.key}
                      onClick={() => setGenreFilter(option.key)}
                      className={cn(
                        'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                        genreFilter === option.key
                          ? 'bg-pink-600 text-white'
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
                Showing {filteredMovies.length} anime movies
              </p>
            </div>
          </div>

          {/* Movies Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMovies.map(movie => (
                <AnimeCard key={movie.id} anime={movie} showPopup={true} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMovies.map(movie => (
                <div 
                  key={movie.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700 hover:bg-gray-800/70 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {movie.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                            {movie.synopsis}
                          </p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-blue-400">
                              {movie.releaseYear}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-purple-400 font-medium">
                              {movie.studio}
                            </span>
                            <span className="text-gray-400">•</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">⭐</span>
                              <span className="text-white">{movie.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm transition-colors">
                            Watch
                          </button>
                          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition-colors">
                            Info
                          </button>
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
              Load More Movies
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
