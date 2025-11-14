import { cache } from "react";

// Interface for updateWatchlist request body
interface UpdateWatchlistBody {
  status: "watching" | "completed" | "drop" | "on_hold" | "plan_to_watch";
  anime_id?: number;
  episode_id?: number;
}

// Base fetch function
const fetchFromApi = cache(async (endpoint: string, init?: RequestInit) => {
  const baseUrl =
    process.env.API_BASE_URL || "https://serverloader1.yukiwatch.fr/api/v1";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    next: {
      revalidate: 60, // Default cache time: 1 minute
    },
  });

  if (!response.ok) {
    // Try to parse error body (validation errors or details) and attach to the thrown error
    let errorBody: unknown = null;
    try {
      // Some error responses include JSON payloads with validation messages
      errorBody = await response.json();
    } catch (e) {
      // ignore JSON parse errors
    }

    const err: any = new Error(response.statusText || "API error");
    err.status = response.status;
    err.data = errorBody;
    throw err;
  }

  return response.json();
});

// Helper to fetch text responses (CSV/Plain text). Similar error handling to fetchFromApi
const fetchTextFromApi = async (endpoint: string, init?: RequestInit) => {
  const baseUrl =
    process.env.API_BASE_URL || "https://serverloader1.yukiwatch.fr/api/v1";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    next: {
      revalidate: 60,
    },
  });

  if (!response.ok) {
    let errorBody: unknown = null;
    try {
      errorBody = await response.json();
    } catch (e) {
      // ignore
    }
    const err: any = new Error(response.statusText || "API error");
    err.status = response.status;
    err.data = errorBody;
    throw err;
  }

  return response.text();
};

// Helper to submit FormData (file uploads) and return parsed JSON.
// It preserves error parsing similar to other helpers.
const fetchFormDataFromApi = async (endpoint: string, init?: RequestInit) => {
  const baseUrl =
    process.env.API_BASE_URL || "https://serverloader1.yukiwatch.fr/api/v1";
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    // DO NOT set Content-Type header for FormData; browser will set the boundary
    ...init,
    // ensure headers passed (Authorization) are preserved
    headers: {
      ...(init?.headers || {}),
    },
    next: init?.next ?? { revalidate: 60 },
  });

  if (!response.ok) {
    let errorBody: unknown = null;
    try {
      errorBody = await response.json();
    } catch (e) {
      // ignore
    }
    const err: any = new Error(response.statusText || "API error");
    err.status = response.status;
    err.data = errorBody;
    throw err;
  }

  return response.json();
};

// Page-specific data fetchers
export const pageApi = {
  // Home Page - Featured, Trending, Latest, Schedule
  getHomePageData: cache(async () => {
    const homeData = await fetchFromApi("/home-agg/")
      .then((data) => {
        // Ensure all required fields are present
        if (
          !data ||
          !data.airing ||
          !data.trending ||
          !data.latest ||
          !data.completed ||
          !data.spotlight ||
          !data.favourite ||
          !data.popular
        ) {
          throw new Error("Invalid home page data structure");
        }
        return data;
      })
      .catch((error) => {
        console.error("Error fetching home page data:", error);
        throw new Error("Failed to fetch home page data");
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
  getMoviesPageData: cache(async (page = 1, sort = "popularity") => {
    return fetchFromApi(`/movies?page=${page}&sort=${sort}`);
  }),

  // Ongoing Page
  getOngoingPageData: cache(async (page = 1) => {
    return fetchFromApi(`/ongoing?page=${page}`);
  }),

  // Schedule Page
  getSchedulePageData: cache(async () => {
    const endpoint = "/schedule/";
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
  getSearchPageData: async (
    query?: string,
    filters?: {
      title?: string;
      genres?: string | string[];
      anime_type?: string | string[];
      rating?: number | string;
      srctype?: string;
      rated?: string;
      season?: string;
      producers?: string | string[];
      studio?: string | string[];
      released_year?: number | string;
    },
    limit: number = 20,
    offset: number = 0
  ) => {
    const params = new URLSearchParams();

    // Add pagination parameters
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());

    // Add title if provided (either from query or filters.title, filters.title takes priority)
    const titleParam = filters?.title || query;
    if (titleParam) {
      params.append("title", titleParam);
    }

    if (filters) {
      // Handle genres (can be array or single value)
      if (filters.genres) {
        const genres = Array.isArray(filters.genres)
          ? filters.genres
          : [filters.genres];
        genres.forEach((genre) => {
          if (genre) params.append("genres", genre);
        });
      }

      // Handle anime_type (can be array or single value)
      if (filters.anime_type) {
        const types = Array.isArray(filters.anime_type)
          ? filters.anime_type
          : [filters.anime_type];
        types.forEach((t) => {
          if (t) params.append("anime_type", t);
        });
      }

      // Handle rating (minimum score/rating)
      if (filters.rating) {
        params.append("rating", filters.rating.toString());
      }

      // Handle srctype (source type: sub, dub, etc)
      if (filters.srctype) {
        params.append("srctype", filters.srctype);
      }

      // Handle rated (content rating)
      if (filters.rated) {
        params.append("rated", filters.rated);
      }

      // Handle season
      if (filters.season) {
        params.append("season", filters.season);
      }

      // Handle producers (can be array or single value)
      if (filters.producers) {
        const producers = Array.isArray(filters.producers)
          ? filters.producers
          : [filters.producers];
        producers.forEach((producer) => {
          if (producer) params.append("producers", producer);
        });
      }

      // Handle studio (can be array or single value)
      if (filters.studio) {
        const studios = Array.isArray(filters.studio)
          ? filters.studio
          : [filters.studio];
        studios.forEach((studio) => {
          if (studio) params.append("studio", studio);
        });
      }

      // Handle released_year
      if (filters.released_year) {
        params.append("released_year", filters.released_year.toString());
      }
    }

    return fetchFromApi(`/search?${params.toString()}`, {
      next: { revalidate: 0 }, // Don't cache search results
    });
  },

  // Anime Info Page
  getAnimeInfoPageData: cache(async (id: string) => {
    const [details] = await Promise.all([fetchFromApi(`/anime/${id}/`)]);

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
    return fetchFromApi("/user/continue-watching", {
      headers: {
        // Add auth header here when implemented
      },
    });
  }),

  // Auth Token
  getAuthToken: async (username: string, password: string) => {
    const endpoint = "/account/token/";
    return fetchFromApi(endpoint, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      next: { revalidate: 0 }, // Don't cache auth requests
    });
  },

  // Register Account
  registerAccount: async (
    username: string,
    email: string,
    password: string,
    password2: string
  ) => {
    const endpoint = "/account/register/";
    return fetchFromApi(endpoint, {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
        password2,
      }),
      next: { revalidate: 0 }, // Don't cache registration requests
    });
  },

  // Profile Page - Requires authentication
  getProfilePageData: cache(async (token: string) => {
    const endpoint = "/account/profile/";
    return fetchFromApi(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 }, // Don't cache profile data for security
    });
  }),
  // Update profile info - Requires authentication
  updateProfileInfo: async (
    token: string,
    profileData: {
      username?: string;
      email?: string;
      watchlist?: {
        watching?: number[];
        on_hold?: number[];
        plan_to_watch?: number[];
        completed?: number[];
      };
    }
  ) => {
    const endpoint = "/account/profile/";
    return fetchFromApi(endpoint, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
      next: { revalidate: 0 }, // Don't cache profile modifications
    });
  },
  // Add to watchlist - Requires authentication
  addToWatchlist: async (
    token: string,
    animeId: number,
    status: "watching" | "completed" | "drop" | "on_hold" | "plan_to_watch",
    episodeId?: number | null
  ) => {
    const endpoint = `/account/watch-status/`;
    const body = {
      status,
      anime_id: animeId,
      episode_id: episodeId,
    };

    return fetchFromApi(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      next: { revalidate: 0 }, // Don't cache watchlist modifications
    });
  },

  // Update watchlist - Requires authentication
  updateWatchlist: async (
    token: string,
    watchStatusId: number,
    status: "watching" | "completed" | "drop" | "on_hold" | "plan_to_watch",
    animeId?: number | null,
    episodeId?: number | null
  ) => {
    const endpoint = `/account/watch-status/${watchStatusId}/`;
    const body: UpdateWatchlistBody = {
      status,
    };

    if (animeId) {
      body.anime_id = animeId;
    }
    if (episodeId) {
      body.episode_id = episodeId;
    }

    return fetchFromApi(endpoint, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      next: { revalidate: 0 }, // Don't cache watchlist modifications
    });
  },

  // Get Watchlist - Requires authentication
  getWatchlist: cache(async (token: string) => {
    const endpoint = "/account/watch-status/";
    return fetchFromApi(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 }, // Cache watchlist for 1 minute
    });
  }),
  // Remove from watchlist - Requires authentication
  removeFromWatchlist: async (token: string, id: number) => {
    const endpoint = `/account/watch-status/${id}/`;
    return fetchFromApi(endpoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 }, // Don't cache watchlist modifications
    });
  },

  // Get Random Anime ID
  getRandomAnimeId: async () => {
    const endpoint = "/random/";
    return fetchFromApi(endpoint);
  },

  // Update profile settings
  updateProfileSettings: async (
    token: string,
    settingsData: {
      username?: string;
      email?: string;
      role?: string;
      preferred_title_lang?: string;
      preferred_video_lang?: string;
      skip_seconds?: number;
      bookmarks_per_page?: number;
      hide_bookmarks?: boolean;
      hide_profile_activities?: boolean;
      dark_mode?: boolean;
      notifications_enabled?: boolean;
      [key: string]: unknown;
    }
  ) => {
    const endpoint = "/account/profile/";

    try {
      // Forward settings payload to server
      const res = await fetchFromApi(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsData),
        next: { revalidate: 0 }, // Don't cache settings modifications
      });

      // Return server response (example includes updated profile object)
      return res;
    } catch (error: unknown) {
      // If this is a validation error (fetchFromApi attaches .data), don't noisy-log it.
      const isValidationError =
        error && typeof error === "object" && (error as any).data;
      if (!isValidationError) {
        // Only log unexpected errors
        // eslint-disable-next-line no-console
        console.error("Failed to update profile settings:", error, settingsData);
      }
      throw error;
    }
  },

  // Export watchlist - returns raw CSV or JSON text
  exportWatchlist: async (
    token: string,
    fileType: "text" | "json" = "text"
  ) => {
    const endpoint = `/account/export-watchlist/?file_type=${encodeURIComponent(
      fileType
    )}`;
    // If JSON requested, use fetchFromApi to return parsed JSON
    if (fileType === "json") {
      return fetchFromApi(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 0 }, // Don't cache watchlist export
      });
    }

    // Default: return CSV/text
    return fetchTextFromApi(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 }, // Don't cache watchlist export
    });
  },

  // Import watchlist - accepts file uploads (mal_file/al_file) or usernames and mode
  importWatchlist: async (
    token: string,
    options: {
      mal_file?: File | null;
      al_file?: File | null;
      mode?: "replace" | "merge" | string;
      mal_username?: string | null;
      al_username?: string | null;
    }
  ) => {
    const endpoint = `/account/import-watchlist/`;

    // Build FormData payload
    const form = new FormData();
    if (options.mal_file) form.append("mal_file", options.mal_file);
    if (options.al_file) form.append("al_file", options.al_file);
    if (options.mode) form.append("mode", options.mode);
    if (options.mal_username) form.append("mal_username", options.mal_username);
    if (options.al_username) form.append("al_username", options.al_username);

    // Use fetchFormDataFromApi which doesn't set Content-Type so boundary is handled
    return fetchFormDataFromApi(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form as unknown as BodyInit,
      next: { revalidate: 0 },
    });
  },
};