import { cache } from 'react';

// TypeScript interfaces for API data
export interface UpdateAnimeData {
  title?: string;
  title_japanese?: string;
  trailer_yt_id?: string;
  genre?: Array<{ name: string }>;
  theme?: Array<{ name: string }>;
  titles?: Array<{ title: string }>;
  producer?: Array<{ name: string }>;
  studio?: Array<{ name: string }>;
  synopsis?: string;
  background_history?: string;
  anime_type?: string;
  source?: string;
  number_of_episodes?: number;
  status?: string;
  airing?: boolean;
  released_date?: string;
  aired?: string;
  score?: number;
  user_score?: number;
  scored_by?: number;
  rank?: number;
  rating?: string;
  popularity?: number;
  members?: number;
  favourites?: number;
  image?: string;
  background_banner?: string;
}

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

    // Update anime info
    updateAnime: async (animeId: string, data: UpdateAnimeData) => {
        const endpoint = `/anime/${animeId}/`;
        
        // Don't use cache for update operations
        const baseUrl = process.env.API_BASE_URL || 'https://serverloader1.yukiwatch.fr/api/v1';
        const url = `${baseUrl}${endpoint}`;
        
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Failed to update anime: ${response.statusText}`);
        }

        return response.json();
    },
};