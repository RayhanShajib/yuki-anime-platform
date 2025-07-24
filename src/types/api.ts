export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AnimeBase {
  id: string;
  title: string;
  altTitles?: string[];
  synopsis?: string;
  type: 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special';
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  releaseYear: number;
  genres: string[];
  rating?: number;
  popularity: number;
  episodeCount?: number;
  duration?: string;
  poster?: string;
  banner?: string;
}

export interface AnimeDetailed extends AnimeBase {
  episodes: Episode[];
  characters: Character[];
  recommendations: AnimeBase[];
  studios: string[];
}

export interface Episode {
  id: string;
  animeId: string;
  number: number;
  title?: string;
  thumbnail?: string;
  duration?: string;
  aired?: string;
  sources: VideoSource[];
}

export interface VideoSource {
  url: string;
  quality: string;
  type: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  image?: string;
}

export interface Genre {
  id: string;
  name: string;
  description?: string;
  animeCount: number;
}

export interface SearchFilters {
  type?: string;
  status?: string;
  genres?: string[];
  year?: number;
  season?: string;
  sort?: string;
  page?: number;
  limit?: number;
}