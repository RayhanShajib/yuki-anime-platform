'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { pageApi } from '@/lib/api/pageApi';
import { Navigation } from '@/components/layout/Navigation';

export default function RandomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomAnime = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch random anime ID from API
        const response = await pageApi.getRandomAnimeId();
        
        if (response && response.anime_id) {
          // Redirect to anime info page with default slug
          router.push(`/anime/${response.anime_id}/info`);
        } else {
          setError('Unable to fetch random anime');
        }
      } catch (err) {
        console.error('Error fetching random anime:', err);
        setError('Failed to load random anime. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomAnime();
  }, [router]);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="text-center">
          {loading && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
              <h1 className="text-2xl font-bold text-white">Finding a Random Anime...</h1>
              <p className="text-gray-400">Please wait while we discover something amazing for you!</p>
            </div>
          )}

          {error && (
            <div className="space-y-6">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-white">Oops! Something went wrong</h1>
              <p className="text-gray-400 max-w-md mx-auto">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition duration-200">
                Try Again
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
                        