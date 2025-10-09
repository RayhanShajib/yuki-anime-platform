import { cache } from 'react';

// TypeScript interfaces for API data
export interface EpisodeData {
  id: number;
  ep_no: number;
  image: string | null;
  description: string | null;
  aired_date: string;
  title: string;
}

export interface EpisodeApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EpisodeData[];
}

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

export interface CreateAnimeData {
  genre?: Array<{ name: string }>;
  theme?: Array<{ name: string }>;
  studio?: Array<{ name: string }>;
  producer?: Array<{ name: string }>;
  titles?: Array<{ title: string }>;
  related_animes?: number[];
  mal_id?: number;
  title: string; // Required field
  title_japanese?: string | null;
  anime_type?: string | null;
  source?: string | null;
  number_of_episodes?: number | null;
  status?: string | null;
  airing?: boolean | null;
  aired?: string | null;
  score?: number;
  scored_by?: number;
  rank?: number | null;
  rating?: string | null;
  popularity?: number | null;
  members?: number | null;
  favourites?: number | null;
  synopsis?: string | null;
  trailer_yt_id?: string | null;
  image?: string | null;
  background_banner?: string | null;
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
        return fetchFromApi(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
            next: { revalidate: 0 }, // Don't cache update operations
        });
    },
    
    // Add new anime
    createAnime: async (data: CreateAnimeData) => {
        const endpoint = `/anime/`;
        return fetchFromApi(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            next: { revalidate: 0 }, // Don't cache create operations
        });
    },

    // Delete anime - Requires admin authorization
    deleteAnime: async (animeId: string, token: string) => {
        const endpoint = `/anime/${animeId}/`;
        return fetchFromApi(endpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            next: { revalidate: 0 }, // Don't cache delete operations
        });
    },

    // Get episode list - Requires admin authorization
    getEpisodeList: async (limit = 20, offset = 0, token: string) => {
        const endpoint = `/episode/?limit=${limit}&offset=${offset}`;
        return fetchFromApi(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    // Delete episode - Requires admin authorization
    deleteEpisode: async (episodeId: string, token: string) => {
        const endpoint = `/episode/${episodeId}/`;
        return fetchFromApi(endpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            next: { revalidate: 0 }, // Don't cache delete operations
        });
    },
};