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
    const homeData = await fetchFromApi('/home-agg/')
        .then(data => {
          // Ensure all required fields are present
          if (!data || !data.airing || !data.trending || !data.latest || !data.completed || !data.spotlight || !data.favourite || !data.popular) {
            throw new Error('Invalid home page data structure');
          }
          return data;
        })
        .catch(error => {
          console.error('Error fetching home page data:', error);
          throw new Error('Failed to fetch home page data');
        });
    return homeData;
  }),

  // Popular Page - with filters
  getPopularPageData: cache(async (limit = 20, offset = 0) => {

    return fetchFromApi(`/popular/?limit=${limit}&offset=${offset}`);
  }),

  // Latest Page
  getLatestPageData: cache(async (limit = 20, offset = 0) => {
    return fetchFromApi(`/latest/?limit=${limit}&offset=${offset}`);
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
  getSchedulePageData: cache(async () => {
    const endpoint = '/schedule/';
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
    const [details] = await Promise.all([
      fetchFromApi(`/anime/${id}/`)
    ]);

    return details;
  }),

  // Watch Page
   getWatchPageData: cache(async (episodeId: string) => {
    const endpoint = `/episode/${episodeId}`;
    return fetchFromApi(endpoint);
  }),

  // Get Real video source
  getPrivateVideoSource: cache(async (privateId: string) => {
    const endpoint = `/m3u8?id=${privateId}`;
    return fetchFromApi(endpoint);
  }),

  // getWatchPageData: cache(async (animeId: string, episodeId: string) => {
  //   const [anime, episode] = await Promise.all([
  //     fetchFromApi(`/anime/${animeId}/`),
  //     fetchFromApi(`/episode/${episodeId}/`),
  //   ]);

  //   return {
  //     anime,
  //     episode,
  //   };
  // }),

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
