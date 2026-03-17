"use client";

import { useState, useEffect } from "react";
import { safeLocalStorage } from "@/lib/safeLocalStorage";
import { adminApi } from "@/lib/api/adminApi";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface AnimeData {
  id: number;
  title: string;
  title_japanese: string;
  synopsis: string;
  trailer_yt_id: string | null;
  rating: string;
  image: string;
  background_banner: string;
  number_of_episodes: number;
  genre: Array<{ name: string }>;
  sub_total: number;
  dub_total: number;
  raw_total: number;
  ep_id: number | null;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AnimeData[];
}

export default function AdminAnimePage() {
  const [animeData, setAnimeData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Calculate offset based on current page and items per page
  const offset = (currentPage - 1) * itemsPerPage;
  const totalPages = animeData ? Math.ceil(animeData.count / itemsPerPage) : 0;

  // Fetch anime data
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminApi.getAnimeList(itemsPerPage, offset);
        setAnimeData(response);
      } catch (err) {
        console.error('Error fetching anime:', err);
        setError('Failed to load anime data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [currentPage, itemsPerPage, offset]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle delete anime
  const handleDeleteAnime = async (animeId: number, animeTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${animeTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(animeId);
      
      // Get token from localStorage 
      const token = safeLocalStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      await adminApi.deleteAnime(animeId.toString(), token);
      
      // Refresh the data after successful deletion
      const response = await adminApi.getAnimeList(itemsPerPage, offset);
      setAnimeData(response);
      
      // If current page is empty and we're not on page 1, go to previous page
      if (response.results.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error('Error deleting anime:', err);
      alert('Failed to delete anime. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Anime Management</h2>
        <Link href="/admin/anime/add" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-sm whitespace-nowrap">+ Add Anime</Link>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label htmlFor="itemsPerPage" className="text-white text-sm">Items per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1 text-sm">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        
        {animeData && (
          <div className="text-gray-400 text-sm">
            Showing {offset + 1}-{Math.min(offset + itemsPerPage, animeData.count)} of {animeData.count} anime
          </div>
        )}
      </div>
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span className="ml-2 text-white">Loading anime data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && animeData && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden text-left text-sm md:text-base">
            <thead className="bg-gray-800 text-gray-200">
              <tr>
                <th className="p-3">Poster</th>
                <th className="p-3">Title</th>
                <th className="p-3">Episodes</th>
                <th className="p-3">Genres</th>
                <th className="p-3">Sub/Dub</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {animeData.results.map((anime) => (
                <tr key={anime.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors">
                  <td className="p-3">
                    <div className="w-12 h-16 relative rounded overflow-hidden bg-gray-700">
                      <Image src={anime.image} alt={anime.title} fill className="object-cover" sizes="48px" />
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-white max-w-[200px]">
                    <div className="truncate">{anime.title}</div>
                    {anime.title_japanese && (
                      <div className="text-xs text-gray-400 truncate">{anime.title_japanese}</div>
                    )}
                  </td>
                  <td className="p-3 text-center">{anime.number_of_episodes}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {anime.genre.slice(0, 2).map((g, index) => (
                        <span key={index} className="text-xs bg-purple-700 text-purple-200 px-2 py-1 rounded">
                          {g.name}
                        </span>
                      ))}
                      {anime.genre.length > 2 && (
                        <span className="text-xs text-gray-400">+{anime.genre.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-xs">
                      <div>SUB: {anime.sub_total}</div>
                      <div>DUB: {anime.dub_total}</div>
                    </div>
                  </td>
                  <td className="p-3 text-xs">{anime.rating}</td>
                  <td className="p-3 flex gap-2 flex-wrap">
                    <Link href={`/admin/anime/${anime.id}`} className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs">View</Link>
                    <Link href={`/admin/anime/${anime.id}/edit`} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</Link>
                    <button 
                      onClick={() => handleDeleteAnime(anime.id, anime.title)}
                      disabled={deletingId === anime.id}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded text-xs flex items-center gap-1">
                      {deletingId === anime.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Deleting
                        </>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
          {/* Mobile card layout */}
          <div className="md:hidden flex flex-col gap-4 mt-4">
            {animeData.results.map((anime) => (
              <div key={anime.id} className="bg-gray-900 rounded-xl p-4 flex gap-4 shadow">
                <div className="w-20 h-28 relative rounded overflow-hidden bg-gray-700 flex-shrink-0">
                  <Image src={anime.image} alt={anime.title} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="font-bold text-white text-lg truncate">{anime.title}</div>
                  {anime.title_japanese && (
                    <div className="text-gray-400 text-xs truncate">{anime.title_japanese}</div>
                  )}
                  <div className="text-gray-400 text-xs mb-1">Episodes: {anime.number_of_episodes}</div>
                  <div className="flex gap-1 text-xs mb-1 flex-wrap">
                    {anime.genre.slice(0, 3).map((g, index) => (
                      <span key={index} className="bg-purple-700 text-purple-200 px-2 py-1 rounded">
                        {g.name}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400">
                    SUB: {anime.sub_total} • DUB: {anime.dub_total}
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Link href={`/admin/anime/${anime.id}`} className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs">View</Link>
                    <Link href={`/admin/anime/${anime.id}/edit`} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</Link>
                    <button 
                      onClick={() => handleDeleteAnime(anime.id, anime.title)}
                      disabled={deletingId === anime.id}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded text-xs flex items-center gap-1">
                      {deletingId === anime.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Deleting
                        </>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded text-sm transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {/* Show first page */}
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                      1
                    </button>
                    {currentPage > 4 && <span className="px-2 text-gray-400">...</span>}
                  </>
                )}

                {/* Show current page and neighbors */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        pageNum === currentPage
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}>
                      {pageNum}
                    </button>
                  );
                })}

                {/* Show last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && <span className="px-2 text-gray-400">...</span>}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded text-sm transition-colors">
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 