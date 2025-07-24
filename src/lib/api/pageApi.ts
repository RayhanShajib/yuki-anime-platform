import { ApiResponse, PaginatedResponse, AnimeBase, AnimeDetailed } from '@/types/api';
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

// Page-specific data fetchers
export const pageApi = {
  // Home Page - Featured, Trending, Latest, Schedule
  getHomePageData: cache(async () => {
    const [spotlight, trending, latest, schedule] = await Promise.all([
      fetchFromApi('/spotlight/'),
      fetchFromApi('/trending/'),
      fetchFromApi('/latest/'),
      fetchFromApi('/schedule/'),
    ]);

    return {
      spotlight,
      trending,
      latest,
      schedule,
    };
  }),

  // Popular Page - with filters
  getPopularPageData: cache(async () => {

    return fetchFromApi(`/popular/`);
  }),

  // Latest Page
  getLatestPageData: cache(async (page = 1) => {
    return fetchFromApi(`/recent?page=${page}`);
  }),

  // Movies Page
  getMoviesPageData: cache(async (page = 1, sort = 'popularity') => {
    return fetchFromApi(`/movies?page=${page}&sort=${sort}`);
  }),

  // Ongoing Page
  getOngoingPageData: cache(async (page = 1) => {
    return fetchFromApi(`/ongoing?page=${page}`);
  }),

  // Schedule Page
  getSchedulePageData: cache(async (weekday?: string) => {
    const endpoint = weekday ? `/schedule/${weekday}` : '/schedule/week';
    return fetchFromApi(endpoint);
  }),

  // Genre Page
  getGenrePageData: cache(async (slug: string, page = 1) => {
    const [genre, animeList] = await Promise.all([
      fetchFromApi(`/genres/${slug}`),
      fetchFromApi(`/genres/${slug}/anime?page=${page}`),
    ]);

    return {
      genre,
      animeList,
    };
  }),

  // Search Page - No cache for search results
  getSearchPageData: async (query: string, filters?: Record<string, string>) => {
    const params = new URLSearchParams({
      q: query,
      ...filters,
    });
    
    return fetchFromApi(`/search?${params.toString()}`, {
      next: { revalidate: 0 }, // Don't cache search results
    });
  },

  // Anime Info Page
  getAnimeInfoPageData: cache(async (id: string) => {
    const [details, recommendations] = await Promise.all([
      fetchFromApi(`/anime/${id}`),
      fetchFromApi(`/anime/${id}/recommendations`),
    ]);

    return {
      details,
      recommendations,
    };
  }),

  // Watch Page
  getWatchPageData: cache(async (animeId: string, episodeNumber: number) => {
    const [anime, episode, nextEpisode] = await Promise.all([
      fetchFromApi(`/anime/${animeId}`),
      fetchFromApi(`/anime/${animeId}/episodes/${episodeNumber}`),
      fetchFromApi(`/anime/${animeId}/episodes/${episodeNumber + 1}`).catch(() => null),
    ]);

    return {
      anime,
      episode,
      nextEpisode,
    };
  }),

  // Continue Watching Page - Requires authentication
  getContinueWatchingPageData: cache(async () => {
    return fetchFromApi('/user/continue-watching', {
      headers: {
        // Add auth header here when implemented
      },
    });
  }),

  // Profile Page - Requires authentication
  getProfilePageData: cache(async (userId: string) => {
    const [profile, watchlist, history] = await Promise.all([
      fetchFromApi(`/users/${userId}`),
      fetchFromApi(`/users/${userId}/watchlist`),
      fetchFromApi(`/users/${userId}/history`),
    ]);

    return {
      profile,
      watchlist,
      history,
    };
  }),
};
