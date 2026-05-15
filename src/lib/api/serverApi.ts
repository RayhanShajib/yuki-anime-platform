// import { ApiResponse, PaginatedResponse } from '@/types/api';
import { cache } from 'react';
import { API_CONFIG } from '@/lib/config';

// Base fetch function with caching
const fetchFromApi = cache(async (endpoint: string, init?: RequestInit) => {
  const baseUrl = API_CONFIG.BASE_URL;
  const url = `${baseUrl}${endpoint}`;
  
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    next: {
      // Configure revalidation time (in seconds)
      revalidate: 60, // Cache for 1 minute
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
});

// Cached server-side API functions
export const serverApi = {
  // Fetch with automatic caching using React cache()
  getPopularAnime: cache(async (page = 1, limit = 20) => {
    return fetchFromApi(`/popular?page=${page}&limit=${limit}`);
  }),

  getRecentAnime: cache(async (page = 1, limit = 20) => {
    return fetchFromApi(`/recent?page=${page}&limit=${limit}`);
  }),

  getAnimeById: cache(async (id: string) => {
    return fetchFromApi(`/anime/${id}`);
  }),

  getEpisode: cache(async (animeId: string, episodeNumber: number) => {
    return fetchFromApi(`/anime/${animeId}/episodes/${episodeNumber}`);
  }),

  getGenres: cache(async () => {
    return fetchFromApi('/genres');
  }),

  getAnimeByGenre: cache(async (genreId: string, page = 1, limit = 20) => {
    return fetchFromApi(`/genres/${genreId}/anime?page=${page}&limit=${limit}`);
  }),

  // Dynamic data that shouldn't be cached as long
  searchAnime: async (query: string, filters: Record<string, string> = {}) => {
    const searchParams = new URLSearchParams({
      q: query,
      ...filters,
    });
    return fetchFromApi(`/search?${searchParams.toString()}`, {
      next: {
        revalidate: 0, // Don't cache search results
      },
    });
  },
};
