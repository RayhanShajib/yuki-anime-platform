"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { pageApi } from "@/lib/api/pageApi";

interface GenreData {
  id: number;
  name: string;
  anime_count: number;
  popularity: number | null;
}

export default function AdminViewGenrePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Extract genre data from URL parameters (passed from list page)
  const genreId = parseInt(params.id as string);
  const [genreData] = useState<GenreData | null>({
    id: genreId,
    name: searchParams.get('name') || '',
    anime_count: parseInt(searchParams.get('count') || '0'),
    popularity: searchParams.get('popularity') === '0' ? null : (searchParams.get('popularity') ? parseInt(searchParams.get('popularity')!) : null),
  });
  
  const [deleting, setDeleting] = useState(false);

  // Authentication helper
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  };

  // Validate ID and data
  useEffect(() => {
    if (isNaN(genreId) || genreId <= 0 || !genreData?.name) {
      console.error("❌ Genre View - Invalid genre data:", { genreId, genreData });
      alert('Invalid genre data. Redirecting to genre list.');
      router.push('/admin/genres');
    }
  }, [genreId, genreData, router]);

  // Handle genre deletion
  const handleDelete = async () => {
    if (!genreData) return;
    
    const token = getAuthToken();
    if (!token) {
      alert('Authentication required. Please login again.');
      return;
    }

    if (!confirm(`Are you sure you want to delete the genre "${genreData.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      console.log("🗑️ Genre View - Deleting genre:", genreData);
      
      await pageApi.deleteGenre(token, genreData.id);
      
      console.log("✅ Genre View - Delete successful");
      alert(`Genre "${genreData.name}" has been deleted successfully.`);
      
      // Redirect to list page
      router.push('/admin/genres');
      
    } catch (err) {
      console.error('❌ Genre View - Delete failed:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete genre';
      alert(`Failed to delete genre: ${errorMessage}`);
      
    } finally {
      setDeleting(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    router.push('/admin/genres');
  };

  // If no valid data, don't render
  if (!genreData || !genreData.name) {
    return (
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-4">
          <p className="text-red-300">Loading genre data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Genre Details</h2>
          <button
            onClick={handleBack}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to List
          </button>
        </div>
      </div>

      {/* Genre Information Card */}
      <div className="bg-gray-900 rounded-xl p-6 shadow mb-6">
        {/* Genre Name */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">{genreData.name}</h3>
          <p className="text-gray-400 text-sm">Genre ID: {genreData.id}</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Anime Count */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📺</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Anime Count</p>
                <p className="text-white text-xl font-bold">
                  {genreData.anime_count.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Popularity */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">⭐</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Popularity Score</p>
                <p className="text-white text-xl font-bold">
                  {genreData.popularity !== null ? genreData.popularity.toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="border-t border-gray-700 pt-4">
          <h4 className="text-white font-semibold mb-3">Additional Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400 font-medium">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Type:</span>
              <span className="text-white">Genre Category</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Rank by Popularity:</span>
              <span className="text-white">
                {genreData.popularity !== null ? (
                  genreData.popularity > 10000000 ? 'High' : 
                  genreData.popularity > 1000000 ? 'Medium' : 'Low'
                ) : 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-900 rounded-xl p-6 shadow">
        <h4 className="text-white font-semibold mb-4">Actions</h4>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href={`/admin/genres/${genreData.id}/edit?name=${encodeURIComponent(genreData.name)}`}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm text-center transition-colors"
          >
            ✏️ Edit Genre
          </Link>
          
          <button 
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded font-semibold text-sm transition-colors"
          >
            {deleting ? '🗑️ Deleting...' : '🗑️ Delete Genre'}
          </button>
          
          <button 
            onClick={handleBack}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded font-semibold text-sm transition-colors"
          >
            📋 Back to List
          </button>
        </div>

        {/* Warning */}
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg">
          <p className="text-yellow-300 text-xs">
            ⚠️ <strong>Note:</strong> Deleting a genre will remove it from all associated anime. This action cannot be undone.
          </p>
        </div>
      </div>
    </div>
  );
}