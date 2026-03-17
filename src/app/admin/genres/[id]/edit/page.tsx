"use client";

import { useState, useEffect } from "react";
import { safeLocalStorage } from "@/lib/safeLocalStorage";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { pageApi } from "@/lib/api/pageApi";

export default function AdminEditGenrePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Extract genre ID and initial name from URL
  const genreId = parseInt(params.id as string);
  const initialName = searchParams.get('name') || '';
  
  // State management
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication helper
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return safeLocalStorage.getItem('access_token');
    }
    return null;
  };

  // Validate ID and redirect if invalid
  useEffect(() => {
    if (isNaN(genreId) || genreId <= 0) {
      console.error("❌ Genre Edit - Invalid genre ID:", genreId);
      alert('Invalid genre ID');
      router.push('/admin/genres');
    }
  }, [genreId, router]);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Genre name is required');
      return;
    }

    if (trimmedName === initialName) {
      // No changes made
      router.push('/admin/genres');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.error("❌ Genre Edit - No authentication token");
      alert('Authentication required. Please login again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Genre Edit - Updating genre:", {
        genreId,
        originalName: initialName,
        newName: trimmedName,
        hasToken: !!token
      });
      
      // Call the update API
      const updatedGenre = await pageApi.updateGenre(token, genreId, trimmedName);
      
      console.log("✅ Genre Edit - Update successful:", updatedGenre);
      
      // Show success message and redirect
      alert(`Genre successfully updated to "${updatedGenre.name}"`);
      router.push('/admin/genres');
      
    } catch (err) {
      console.error('❌ Genre Edit - Update failed:', err);
      
      // Extract error message
      const errorMessage = err instanceof Error ? err.message : 'Failed to update genre';
      const errorData = (err as { data?: unknown })?.data;
      
      console.log("💥 Genre Edit - Error details:", {
        message: errorMessage,
        data: errorData,
        fullError: err
      });
      
      // Handle specific error cases
      if (errorMessage.includes('401') || errorMessage.includes('token')) {
        setError('Authentication failed. Please login again.');
        // Optional: redirect to login
        // router.push('/login');
      } else if (errorMessage.includes('400') || errorData) {
        const validationData = errorData as { detail?: string; name?: string[] };
        setError(validationData?.detail || validationData?.name?.[0] || 'Invalid genre name');
      } else if (errorMessage.includes('404')) {
        setError('Genre not found. It may have been deleted.');
      } else {
        setError(errorMessage);
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    if (name.trim() !== initialName && name.trim() !== '') {
      if (!confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        return;
      }
    }
    router.push('/admin/genres');
  };

  // Input change handler
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error) setError(null); // Clear error when user starts typing
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Edit Genre</h2>
        <p className="text-gray-400 mt-1">
          Editing: <span className="text-white font-medium">{initialName}</span>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-red-400 text-xl">⚠️</div>
            <div>
              <h3 className="text-red-400 font-semibold">Update Failed</h3>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 shadow">
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-200">
            Genre Name <span className="text-red-400">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            required
            maxLength={100}
            placeholder="Enter genre name"
            className={`w-full px-3 py-2 rounded bg-gray-800 text-white border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-500' : 'border-gray-700'
            }`}
            disabled={loading}
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500">
              This name will be visible to all users
            </p>
            <p className="text-xs text-gray-500">
              {name.length}/100
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={loading || !name.trim() || name.trim() === initialName}
            className="flex-1 py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold text-lg transition-colors"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 py-2 px-4 rounded bg-gray-700 hover:bg-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold text-lg transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-4 text-xs text-gray-500">
          <p>💡 <strong>Tip:</strong> Make sure the genre name is descriptive and follows your naming conventions.</p>
        </div>
      </form>

      {/* Navigation Helper */}
      <div className="mt-4 text-center">
        <button
          onClick={() => router.push('/admin/genres')}
          className="text-sm text-gray-400 hover:text-white underline transition-colors"
        >
          ← Back to Genre List
        </button>
      </div>
    </div>
  );
}