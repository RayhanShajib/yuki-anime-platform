"use client";

import { useState } from "react";
import { safeLocalStorage } from "@/lib/safeLocalStorage";
import { useRouter } from "next/navigation";
import { pageApi } from "@/lib/api/pageApi";

export default function AdminAddGenrePage() {
  const router = useRouter();
  
  // State management
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication helper
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return safeLocalStorage.getItem('access_token');
    }
    return null;
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Genre name is required');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.error("❌ Genre Add - No authentication token");
      alert('Authentication required. Please login again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Genre Add - Creating genre:", {
        name: trimmedName,
        hasToken: !!token
      });
      
      // Call the create API
      const newGenre = await pageApi.createGenre(token, trimmedName);
      
      console.log("✅ Genre Add - Creation successful:", newGenre);
      
      // Show success message and redirect
      alert(`Genre "${trimmedName}" created successfully!`);
      router.push('/admin/genres');
      
    } catch (err) {
      console.error('❌ Genre Add - Creation failed:', err);
      
      // Extract error message
      const errorMessage = err instanceof Error ? err.message : 'Failed to create genre';
      
      console.log("💥 Genre Add - Error details:", {
        message: errorMessage,
        fullError: err
      });
      
      // Handle specific error cases
      if (errorMessage.includes('401') || errorMessage.includes('token')) {
        setError('Authentication failed. Please login again.');
      } else if (errorMessage.includes('400')) {
        setError('Invalid genre name. Please check your input and try again.');
      } else if (errorMessage.includes('409') || errorMessage.includes('exists')) {
        setError('A genre with this name already exists. Please choose a different name.');
      } else {
        setError(errorMessage);
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    if (name.trim() !== '') {
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
        <h2 className="text-2xl md:text-3xl font-bold text-white">Add New Genre</h2>
        <p className="text-gray-400 mt-1">
          Create a new genre category for anime classification
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-900/20 border border-red-600 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-red-400 text-xl">❌</div>
            <div>
              <h3 className="text-red-400 font-semibold">Creation Failed</h3>
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
            placeholder="Enter unique genre name (e.g., Action, Romance, Fantasy)"
            className={`w-full px-3 py-2 rounded bg-gray-800 text-white border transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
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

        {/* Guidelines */}
        <div className="mb-6 bg-gray-800 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Genre Naming Guidelines</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Use clear, descriptive names (e.g., &ldquo;Science Fiction&rdquo; not &ldquo;Sci-Fi&rdquo;)</li>
            <li>• Avoid abbreviations when possible</li>
            <li>• Use title case (e.g., &ldquo;Slice of Life&rdquo;)</li>
            <li>• Ensure the genre doesn&apos;t already exist</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={loading || !name.trim()}
            className="flex-1 py-2 px-4 rounded bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold text-lg transition-colors"
          >
            {loading ? 'Creating...' : 'Create Genre'}
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
          <p>💡 <strong>Tip:</strong> Once created, genres can be edited but deletion should be done carefully as it affects all associated anime.</p>
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