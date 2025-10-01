// Data transformation utilities for converting API responses to component interfaces

// API Response Interfaces
interface ApiSpotlightItem {
  id: number;
  title?: {
    romaji?: string;
    english?: string;
  } | string;
  description?: string;
  banner?: string;
  trailer?: string | null;
  genre?: string[];
  released_date?: string;
  type?: string;
  [key: string]: unknown;
}

interface ApiAnimeItem {
  id: number;
  title?: string;
  synopsis?: string;
  image?: string;
  background_banner?: string;
  trailer_yt_id?: string;
  genre?: string[];
  airing?: boolean;
  anime_type?: string;
  number_of_episodes?: number;
  [key: string]: unknown;
}

interface ApiTrendingData {
  now?: ApiAnimeItem[];
  [key: string]: unknown;
}

interface ApiLatestData {
  sub?: ApiAnimeItem[];
  dub?: ApiAnimeItem[];
  [key: string]: unknown;
}

// Helper function to transform API spotlight data to expected Anime interface
export const transformSpotlightData = (spotlightData: ApiSpotlightItem[]) => {
  return spotlightData.map((item: ApiSpotlightItem) => ({
    id: item.id.toString(),
    title: typeof item.title === 'object' && item.title !== null 
      ? (item.title.romaji || item.title.english || 'Unknown Title')
      : (item.title || 'Unknown Title'),
    synopsis: item.description || '',
    poster: item.banner || '/placeholder-anime.jpg',
    banner: item.banner || '/placeholder-anime.jpg',
    trailer: item.trailer && item.trailer !== null ? item.trailer : undefined, // YouTube video ID
    genres: item.genre || [],
    studio: 'Unknown Studio',
    releaseYear: item.released_date ? new Date(item.released_date).getFullYear() : new Date().getFullYear(),
    status: 'ongoing' as const,
    type: item.type === 'ANIME' ? 'series' as const : 'series' as const,
    totalEpisodes: 0,
    rating: 8.5, // Default rating for display
    popularity: 95, // Default popularity for display
    language: ['sub' as const],
  }));
};

// Helper function to transform trending data structure
export const transformTrendingData = (trendingData: ApiTrendingData) => {
  // For now, just use the 'now' data as the trending anime
  // In a real implementation, you'd want to modify TrendingSection to handle all time periods
  return transformAnimeListData(trendingData.now || []);
};

// Helper function to transform anime list data
export const transformAnimeListData = (animeList: ApiAnimeItem[]) => {
  return animeList.map((item: ApiAnimeItem) => ({
    id: item.id.toString(),
    title: item.title || 'Unknown Title',
    synopsis: item.synopsis || '',
    poster: item.image || '/placeholder-anime.jpg',
    banner: item.background_banner || item.image || '/placeholder-anime.jpg',
    trailer: item.trailer_yt_id || '',
    genres: item.genre || [],
    studio: 'Unknown Studio',
    releaseYear: new Date().getFullYear(),
    status: item.airing ? 'ongoing' as const : 'completed' as const,
    type: item.anime_type === 'Movie' ? 'movie' as const : 'series' as const,
    totalEpisodes: item.number_of_episodes || 0,
    rating: 0,
    popularity: 0,
    language: ['sub' as const],
  }));
};

// Helper function to transform latest data structure
export const transformLatestData = (latestData: ApiLatestData) => {
  // Combine sub and dub data with appropriate language tags
  const subAnime = transformAnimeListData(latestData.sub || []).map((anime) => ({
    ...anime,
    language: ['sub' as const],
  }));
  
  const dubAnime = transformAnimeListData(latestData.dub || []).map((anime) => ({
    ...anime,
    language: ['dub' as const],
  }));
  
  return [...subAnime, ...dubAnime];
};