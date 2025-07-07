'use client';

import { useState } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { Tags, Filter, Grid, List, Star, Calendar } from 'lucide-react';
import { mockAnime } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const sortOptions = [
  { key: 'popularity', label: 'Most Popular' },
  { key: 'rating', label: 'Highest Rated' },
  { key: 'latest', label: 'Latest Release' },
  { key: 'title', label: 'Alphabetical' },
];

const statusFilters = [
  { key: 'all', label: 'All Status' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'completed', label: 'Completed' },
  { key: 'upcoming', label: 'Upcoming' },
];

const typeFilters = [
  { key: 'all', label: 'All Types' },
  { key: 'series', label: 'Series' },
  { key: 'movie', label: 'Movies' },
  { key: 'ova', label: 'OVAs' },
];

const genreColors: { [key: string]: string } = {
  action: 'text-red-500',
  adventure: 'text-green-500',
  comedy: 'text-yellow-500',
  drama: 'text-purple-500',
  fantasy: 'text-pink-500',
  horror: 'text-gray-500',
  mystery: 'text-indigo-500',
  romance: 'text-rose-500',
  'sci-fi': 'text-blue-500',
  'slice of life': 'text-orange-500',
};

interface GenrePageProps {
  params: {
    slug: string;
  };
}

export default function GenrePage({ params }: GenrePageProps) {
  const [sortBy, setSortBy] = useState('popularity');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const genre = params.slug.replace(/-/g, ' ');
  const genreTitle = genre.charAt(0).toUpperCase() + genre.slice(1);
  const genreColor = genreColors[genre.toLowerCase()] || 'text-blue-500';

  // Filter anime by genre and apply other filters
  const filteredAnime = mockAnime
    .filter(anime => {
      const hasGenre = anime.genres.some(g => 
        g.toLowerCase().includes(genre.toLowerCase()) || 
        genre.toLowerCase().includes(g.toLowerCase())
      );
      if (!hasGenre) return false;

      if (statusFilter !== 'all' && anime.status !== statusFilter) return false;
      if (typeFilter !== 'all' && anime.type !== typeFilter) return false;

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'latest':
          return b.releaseYear - a.releaseYear;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-4xl font-bold text-white mb-4 flex items-center`}>
              <Tags className={`h-10 w-10 ${genreColor} mr-4`} />
              {genreTitle} Anime
            </h1>
            <p className="text-gray-400 text-lg">
              Explore the best {genre.toLowerCase()} anime series and movies
            </p>
          </div>

          {/* Genre Stats */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">{filteredAnime.length}</div>
              <div className="text-gray-400 text-sm">Total Anime</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {filteredAnime.filter(a => a.status === 'ongoing').length}
              </div>
              <div className="text-gray-400 text-sm">Currently Airing</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {(filteredAnime.reduce((sum, a) => sum + a.rating, 0) / filteredAnime.length).toFixed(1)}
              </div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {filteredAnime.filter(a => a.type === 'movie').length}
              </div>
              <div className="text-gray-400 text-sm">Movies</div>
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
                          ? `bg-red-600 text-white`
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm font-medium">Status:</span>
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                  {statusFilters.map(option => (
                    <button
                      key={option.key}
                      onClick={() => setStatusFilter(option.key)}
                      className={cn(
                        'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                        statusFilter === option.key
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
                Showing {filteredAnime.length} {genre.toLowerCase()} anime
              </p>
            </div>
          </div>

          {/* Content Grid/List */}
          {filteredAnime.length > 0 ? (
            viewMode === 'grid' ? (
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
                          <span className={cn(
                            'font-medium capitalize',
                            anime.status === 'ongoing' ? 'text-green-400' :
                            anime.status === 'completed' ? 'text-blue-400' : 'text-yellow-400'
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

          {/* Load More */}
          {filteredAnime.length > 0 && (
            <div className="text-center mt-12">
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-colors font-medium">
                Load More {genreTitle} Anime
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
