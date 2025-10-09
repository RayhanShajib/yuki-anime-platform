"use client";

import { useState, useEffect } from "react";
import { adminApi, type EpisodeApiResponse } from "@/lib/api/adminApi";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function AdminEpisodesPage() {
  const [episodeData, setEpisodeData] = useState<EpisodeApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Calculate offset based on current page and items per page
  const offset = (currentPage - 1) * itemsPerPage;
  const totalPages = episodeData ? Math.ceil(episodeData.count / itemsPerPage) : 0;

  // Fetch episode data
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get token from localStorage 
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('Authentication required. Please log in.');
        }

        const response = await adminApi.getEpisodeList(itemsPerPage, offset, token);
        setEpisodeData(response);
      } catch (err) {
        console.error('Error fetching episodes:', err);
        if (err instanceof Error) {
          if (err.message.includes('permission') || err.message.includes('401') || err.message.includes('403')) {
            setError('Access denied. Admin privileges required.');
          } else {
            setError('Failed to load episode data');
          }
        } else {
          setError('Failed to load episode data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
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

  // Handle delete episode
  const handleDeleteEpisode = async (episodeId: number, episodeTitle: string) => {
    if (!confirm(`Are you sure you want to delete "Episode ${episodeTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(episodeId);
      
      // Get token from localStorage 
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      await adminApi.deleteEpisode(episodeId.toString(), token);
      
      // Refresh the data after successful deletion
      const response = await adminApi.getEpisodeList(itemsPerPage, offset, token);
      setEpisodeData(response);
      
      // If current page is empty and we're not on page 1, go to previous page
      if (response.results.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error('Error deleting episode:', err);
      if (err instanceof Error) {
        if (err.message.includes('permission') || err.message.includes('401') || err.message.includes('403')) {
          alert('Access denied. Admin privileges required.');
        } else {
          alert('Failed to delete episode. Please try again.');
        }
      } else {
        alert('Failed to delete episode. Please try again.');
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Episode Management</h2>
        <Link href="/admin/episodes/add" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-sm whitespace-nowrap">+ Add Episode</Link>
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
        
        {episodeData && (
          <div className="text-gray-400 text-sm">
            Showing {offset + 1}-{Math.min(offset + itemsPerPage, episodeData.count)} of {episodeData.count} episodes
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span className="ml-2 text-white">Loading episodes...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && episodeData && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden text-left text-sm md:text-base">
              <thead className="bg-gray-800 text-gray-200">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Ep #</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Aired Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {episodeData.results.map((episode) => (
                  <tr key={episode.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors">
                    <td className="p-3 font-mono text-gray-400">#{episode.id}</td>
                    <td className="p-3 font-semibold">{episode.ep_no}</td>
                    <td className="p-3 max-w-[200px] truncate text-white">{episode.title}</td>
                    <td className="p-3 max-w-[150px] truncate text-gray-400 text-sm">
                      {episode.description || 'No description'}
                    </td>
                    <td className="p-3 text-sm text-gray-300">{episode.aired_date}</td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      <Link href={`/admin/episodes/${episode.id}`} className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs">View</Link>
                      <Link href={`/admin/episodes/${episode.id}/edit`} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</Link>
                      <button 
                        onClick={() => handleDeleteEpisode(episode.id, episode.title)}
                        disabled={deletingId === episode.id}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded text-xs flex items-center gap-1">
                        {deletingId === episode.id ? (
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
              {episodeData.results.map((episode) => (
                <div key={episode.id} className="bg-gray-900 rounded-xl p-4 flex flex-col gap-2 shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-white text-lg">Episode {episode.ep_no}</div>
                    <span className="text-xs text-gray-400">#{episode.id}</span>
                  </div>
                  <div className="text-white font-medium mb-1">{episode.title}</div>
                  <div className="text-gray-400 text-sm mb-2">
                    {episode.description || 'No description available'}
                  </div>
                  <div className="text-xs text-gray-500 mb-3">Aired: {episode.aired_date}</div>
                  <div className="flex gap-2 flex-wrap">
                    <Link href={`/admin/episodes/${episode.id}`} className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs">View</Link>
                    <Link href={`/admin/episodes/${episode.id}/edit`} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</Link>
                    <button 
                      onClick={() => handleDeleteEpisode(episode.id, episode.title)}
                      disabled={deletingId === episode.id}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded text-xs flex items-center gap-1">
                      {deletingId === episode.id ? (
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
              ))}
            </div>
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
        </>
      )}
    </div>
  );
} 