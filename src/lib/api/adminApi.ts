import { cache } from 'react';
import { UpdateAnimeRequestPayload } from '@/types/anime';

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

export interface UpdateEpisodeData {
  ep_no?: number;
  view_count?: number;
  image?: string | null;
  aired_date?: string;
  title?: string;
  description?: string | null;
  vidsrces?: {
    sub?: Array<{
      iframe: string[];
      m3u8: string[];
      private: string;
    }>;
    dub?: Array<{
      iframe: string[];
      m3u8: string[];
      private: string;
    }>;
  };
}

export interface EpisodeDetailData {
  id: number;
  anime: number;
  ep_no: number;
  view_count: number;
  image: string | null;
  aired_date: string;
  title: string;
  description: string | null;
  vidsrces: {
    sub?: Array<{
      iframe: string[];
      m3u8: string[];
      private: string;
    }>;
    dub?: Array<{
      iframe: string[];
      m3u8: string[];
      private: string;
    }>;
  };
  related_animes: Array<{
    id: number;
    title: string;
    image: string;
    rating: string;
    number_of_episodes: number;
    title_japanese: string;
    synopsis: string;
    trailer_yt_id: string;
    genre: Array<{ name: string }>;
    background_banner: string;
    sub_total: number;
    dub_total: number;
    raw_total: number;
  }>;
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

// User Management Interfaces
export interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar: string | null;
  preferred_title_lang: string;
  preferred_video_lang: string;
  skip_seconds: number;
  bookmarks_per_page: number;
  hide_bookmarks: boolean;
  hide_profile_activities: boolean;
  is_banned?: boolean;
  ban_expires?: string;
  ban_type?: 'temporary' | 'permanent';
}

export interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserData[];
}

export interface UpdateUserData {
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  avatar?: string | null;
  preferred_title_lang?: string;
  preferred_video_lang?: string;
  skip_seconds?: number;
  bookmarks_per_page?: number;
  hide_bookmarks?: boolean;
  hide_profile_activities?: boolean;
}

export interface DeleteUserCredentials {
  username: string;
  password: string;
}

// Ban User Interfaces
export interface BanUserData {
  user: string;              // username (required)
  days?: 7 | 30;            // optional: 7 or 30 days only
  permanent_ban?: boolean;   // optional: default false
}

export interface BanResponse {
  success: boolean;
  message: string;
  ban_expires?: string;     // ISO date string for temporary bans
}

// Base fetch function
const fetchFromApi = cache(async (endpoint: string, init?: RequestInit) => {
  const baseUrl = process.env.API_BASE_URL || 'http://api.yukiwatch.fr:8003/api/v1';
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

  // Handle empty responses specifically for DELETE operations
  if (init?.method === 'DELETE') {
    // For DELETE operations, check if response has content
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  // For all other operations, parse as JSON normally
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

    // Get single episode details - Requires admin authorization
    getSingleEpisodeDetails: async (episodeId: string, token: string) => {
        const endpoint = `/episode/${episodeId}`;
        return fetchFromApi(endpoint, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    // Update episode data - Requires admin authorization
    updateEpisode: async (episodeId: string, data: UpdateEpisodeData, token: string) => {
        const endpoint = `/episode/${episodeId}`;
        return fetchFromApi(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            next: { revalidate: 0 }, // Don't cache update operations
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

    // Create new episode - Requires admin authorization
    createEpisode: async (data: UpdateEpisodeData, token: string) => {
        const endpoint = `/episode/`;
        return fetchFromApi(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            next: { revalidate: 0 }, // Don't cache create operations
        });
    },

  // Push notifications to users - Requires admin authorization
  pushNotification: async (
    source: string,
    content: string,
    users: string[],
    token: string
  ) => {
    const endpoint = `/notification/`;
    return fetchFromApi(endpoint, {
      method: 'POST',
      body: JSON.stringify({ source, content, users }),
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      next: { revalidate: 0 }, // Don't cache notification operations
    });
  },

  // Update anime Request status
  updateAnimeRequest: async (
    token: string,
    id: string | number,
    payload: UpdateAnimeRequestPayload,
  ) => {
    const endpoint = `/anime-requests/${id}/`;
    return fetchFromApi(endpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      next: { revalidate: 60 },
    });
  },

  // Get all anime requests
  getAnimeRequests: async (
    token: string,
  ) => {
    const endpoint = `/anime-requests/`;
    return fetchFromApi(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    });
  },

  // Get single anime request
  getAnimeRequestDetails: async (
    token: string,
    id: number,
  ) => {
    const endpoint = `/anime-requests/${id}/`;
    return fetchFromApi(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    });
  },

  // Get all episode reports
  getAllEpisodeReports: async (
    token: string,
    severity: string,
    limit: string,
    offset: string
  ) => {
    const endpoint = `/reports/?severity=${severity}&limit=${limit}&offset=${offset}`;
    return fetchFromApi(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    });
  },

  // Get single episode report details
  getEpisodeReportDetails: async (
    token: string,
    id: number,
  ) => {
    const endpoint = `/reports/${id}/`;
    return fetchFromApi(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    });
  },

  // Bulk update anime requests
  bulkUpdateAnimeRequests: async (
    token: string,
    ids: number[],
    action: 'approved' | 'rejected' | 'pending' | 'under_review'
  ) => {
    const endpoint = `/anime-requests/bulk-action/`;
    return fetchFromApi(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids, action }),
      next: { revalidate: 0 }, // Don't cache bulk update operations
    });
  },

  // User Management Functions

  // Get user list - Requires admin authorization
  getUserList: async (limit = 20, offset = 0, token: string): Promise<UserListResponse> => {
    const endpoint = `/user-management/users/?limit=${limit}&offset=${offset}`;
    return fetchFromApi(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });
  },

  // Update user - Requires admin authorization
  updateUser: async (userId: number, data: UpdateUserData, token: string): Promise<UserData> => {
    const endpoint = `/user-management/users/${userId}/`;
    return fetchFromApi(endpoint, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      next: { revalidate: 0 }, // Don't cache update operations
    });
  },

  // Delete user - Requires admin authorization and credentials
  deleteUser: async (userId: number, credentials: DeleteUserCredentials, token: string): Promise<void> => {
    const endpoint = `/user-management/users/${userId}/`;
    return fetchFromApi(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(credentials),
      next: { revalidate: 0 }, // Don't cache delete operations
    });
  },

  // Ban user - Requires admin authorization
  banUser: async (banData: BanUserData, token: string): Promise<BanResponse> => {
    const endpoint = `/ban-user/`;
    return fetchFromApi(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(banData),
      next: { revalidate: 0 }, // Don't cache ban operations
    });
  },


};
