"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { pageApi } from "@/lib/api/pageApi";
import type { Genre, GenreListResponse } from "@/types/api";

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-gray-800 animate-pulse">
          <td className="p-3">
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </td>
          <td className="p-3">
            <div className="h-4 bg-gray-700 rounded w-16"></div>
          </td>
          <td className="p-3">
            <div className="h-4 bg-gray-700 rounded w-20"></div>
          </td>
          <td className="p-3">
            <div className="flex gap-2">
              <div className="h-6 bg-gray-700 rounded w-12"></div>
              <div className="h-6 bg-gray-700 rounded w-12"></div>
              <div className="h-6 bg-gray-700 rounded w-16"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

// Mobile loading skeleton
function MobileLoadingSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-900 rounded-xl p-4 animate-pulse">
          <div className="h-5 bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-24 mb-1"></div>
          <div className="h-3 bg-gray-700 rounded w-28 mb-2"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-700 rounded w-12"></div>
            <div className="h-6 bg-gray-700 rounded w-12"></div>
            <div className="h-6 bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      ))}
    </>
  );
}

export default function AdminGenresPage() {
  // State management
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit] = useState(20); // Items per page
  const [offset, setOffset] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Authentication helper
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  };

  // Fetch genres from API
  const fetchGenres = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🎬 Genre Admin - Fetching genres:", {
        limit,
        offset,
        searchName: searchName.trim() || undefined
      });
      
      const response: GenreListResponse = await pageApi.getGenres(
        limit,
        offset,
        searchName.trim() || undefined
      );
      
      console.log("📋 Genre Admin - Response received:", response);
      
      // Handle paginated response structure
      if (response && typeof response === 'object' && 'results' in response) {
        setGenres(response.results);
        setTotalCount(response.count);
        console.log("✅ Genre Admin - Data processed:", {
          genreCount: response.results.length,
          totalCount: response.count
        });
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (err) {
      console.error('❌ Genre Admin - Error fetching genres:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch genres');
    } finally {
      setLoading(false);
    }
  }, [limit, offset, searchName]);

  // Initial load and refresh when dependencies change
  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  // Handle genre deletion
  const handleDeleteGenre = async (id: number, name: string) => {
    const token = getAuthToken();
    
    console.log("🗑️ Genre Admin - Delete operation:", {
      genreId: id,
      genreName: name,
      hasToken: !!token,
      tokenLength: token?.length || 0
    });
    
    if (!token) {
      console.log("❌ Genre Admin - No token for delete operation");
      alert('Authentication required. Please login again.');
      return;
    }

    if (!confirm(`Are you sure you want to delete the genre "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      console.log("🔄 Genre Admin - Calling deleteGenre API...");
      await pageApi.deleteGenre(token, id);
      console.log("✅ Genre Admin - Delete successful, refreshing list...");
      
      // Refresh the list after successful deletion
      await fetchGenres();
      
      // Show success notification
      alert(`Genre "${name}" has been deleted successfully.`);
      console.log("🎉 Genre Admin - Delete operation completed successfully");
    } catch (err) {
      console.error('❌ Genre Admin - Error deleting genre:', err);
      
      // Extract detailed error information
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const errorData = (err as { data?: unknown })?.data;
      
      console.log("💥 Genre Admin - Delete error details:", {
        message: errorMessage,
        data: errorData,
        fullError: err
      });
      
      alert(`Failed to delete genre: ${errorMessage}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Handle search with debouncing
  const handleSearch = useCallback((value: string) => {
    setSearchName(value);
    setOffset(0); // Reset to first page when searching
  }, []);

  // Handle pagination
  const handlePagination = (newOffset: number) => {
    setOffset(newOffset);
  };

  // Calculate pagination info
  const hasNext = offset + limit < totalCount;
  const hasPrevious = offset > 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Genre Management</h2>
        <Link 
          href="/admin/genres/add" 
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-sm transition-colors"
        >
          Add Genre
        </Link>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search genres by name..."
            value={searchName}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        
        {/* Results info */}
        <div className="text-sm text-gray-400">
          {!loading && (
            <span>
              Showing {Math.min(limit, genres.length)} of {totalCount} genres
              {searchName && ` for "${searchName}"`}
            </span>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-400 font-semibold">Error Loading Genres</h3>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={fetchGenres}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden text-left text-sm">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-4 font-semibold">Genre</th>
              <th className="p-4 font-semibold">Anime Count</th>
              <th className="p-4 font-semibold">Popularity</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <LoadingSkeleton />
            ) : genres.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400">
                  {searchName ? 
                    `No genres found for "${searchName}"` : 
                    'No genres available'
                  }
                </td>
              </tr>
            ) : (
              genres.map((genre) => (
                <tr key={genre.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors">
                  <td className="p-4 font-semibold text-white">{genre.name}</td>
                  <td className="p-4 text-gray-300">{genre.anime_count.toLocaleString()}</td>
                   <td className="p-4 text-gray-300">{genre.popularity !== null ? genre.popularity.toLocaleString() : 'N/A'}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link 
                         href={`/admin/genres/${genre.id}?name=${encodeURIComponent(genre.name)}&count=${genre.anime_count}&popularity=${genre.popularity ?? 0}`}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors"
                      >
                        View
                      </Link>
                      <Link 
                        href={`/admin/genres/${genre.id}/edit?name=${encodeURIComponent(genre.name)}`}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteGenre(genre.id, genre.name)}
                        disabled={deletingId === genre.id}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded text-xs transition-colors"
                      >
                        {deletingId === genre.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden flex flex-col gap-4">
        {loading ? (
          <MobileLoadingSkeleton />
        ) : genres.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-6 text-center text-gray-400">
            {searchName ? 
              `No genres found for "${searchName}"` : 
              'No genres available'
            }
          </div>
        ) : (
          genres.map((genre) => (
            <div key={genre.id} className="bg-gray-900 rounded-xl p-4 shadow">
              <div className="font-bold text-white text-lg mb-2">{genre.name}</div>
              <div className="text-gray-400 text-sm mb-1">
                Anime Count: {genre.anime_count.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm mb-3">
                Popularity: {genre.popularity !== null ? genre.popularity.toLocaleString() : 'N/A'}
              </div>
              <div className="flex gap-2 flex-wrap">
                <Link 
                  href={`/admin/genres/${genre.id}?name=${encodeURIComponent(genre.name)}&count=${genre.anime_count}&popularity=${genre.popularity ?? 0}`}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors"
                >
                  View
                </Link>
                <Link 
                  href={`/admin/genres/${genre.id}/edit?name=${encodeURIComponent(genre.name)}`}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDeleteGenre(genre.id, genre.name)}
                  disabled={deletingId === genre.id}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded text-xs transition-colors"
                >
                  {deletingId === genre.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && totalCount > limit && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePagination(Math.max(0, offset - limit))}
              disabled={!hasPrevious}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded text-sm transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => handlePagination(offset + limit)}
              disabled={!hasNext}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded text-sm transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}