import { cache } from 'react';

// Base fetch function
const fetchFromApi = cache(async (endpoint: string, init?: RequestInit) => {
  const baseUrl = process.env.API_BASE_URL || 'https://serverloader1.yukiwatch.fr/api/v1';
  const url = `${baseUrl}${endpoint}`;
  
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    next: {
      revalidate: 60, // Default cache time: 1 minute
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
});

export const adminApi = {
    // Get Anime List - Paginated
    getAnimeList: cache(async (limit = 20, offset = 0) => {
        const endpoint = `/anime/?limit=${limit}&offset=${offset}`;
        return fetchFromApi(endpoint);
    }),

    // Get single anime details
    getSingleAnimeDetails: cache(async (animeId: string) => {
        const endpoint = `/anime/${animeId}/`;
        return fetchFromApi(endpoint);
    }),
};