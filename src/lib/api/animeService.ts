import { apiClient } from './client';
import {
  AnimeBase,
  AnimeDetailed,
  ApiResponse,
  Episode,
  Genre,
  PaginatedResponse,
  SearchFilters,
} from '@/types/api';

export const animeService = {
  // Get popular anime with pagination
  getPopular: async (page = 1, limit = 20) => {
    return apiClient.get<ApiResponse<PaginatedResponse<AnimeBase>>>('/popular', {
      page: page.toString(),
      limit: limit.toString(),
    });
  },

  // Get recently updated anime
  getRecent: async (page = 1, limit = 20) => {
    return apiClient.get<ApiResponse<PaginatedResponse<AnimeBase>>>('/recent', {
      page: page.toString(),
      limit: limit.toString(),
    });
  },

  // Get anime details by ID
  getAnimeById: async (id: string) => {
    return apiClient.get<ApiResponse<AnimeDetailed>>(`/anime/${id}`);
  },

  // Search anime with filters
  searchAnime: async (filters: SearchFilters) => {
    return apiClient.get<ApiResponse<PaginatedResponse<AnimeBase>>>('/search', filters as Record<string, string>);
  },

  // Get episode details
  getEpisode: async (animeId: string, episodeNumber: number) => {
    return apiClient.get<ApiResponse<Episode>>(`/anime/${animeId}/episodes/${episodeNumber}`);
  },

  // Get all genres
  getGenres: async () => {
    return apiClient.get<ApiResponse<Genre[]>>('/genres');
  },

  // Get anime by genre
  getAnimeByGenre: async (genreId: string, page = 1, limit = 20) => {
    return apiClient.get<ApiResponse<PaginatedResponse<AnimeBase>>>(`/genres/${genreId}/anime`, {
      page: page.toString(),
      limit: limit.toString(),
    });
  },

  // Get seasonal anime
  getSeasonal: async (year: number, season: string) => {
    return apiClient.get<ApiResponse<PaginatedResponse<AnimeBase>>>('/seasonal', {
      year: year.toString(),
      season,
    });
  },
};
