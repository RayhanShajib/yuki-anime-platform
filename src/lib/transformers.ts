// Data transformation utilities for converting API responses to component interfaces

// API Response Interfaces
interface ApiSpotlightItem {
  id: number | null;
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
  sub_total?: number;
  dub_total?: number;
  [key: string]: unknown;
}

interface ApiAnimeItem {
  id: number | null;
  title?: string;
  synopsis?: string;
  image?: string;
  background_banner?: string;
  trailer_yt_id?: string;
  genre?: string[];
  airing?: boolean;
  anime_type?: string;
  number_of_episodes?: number;
  sub_total?: number;
  dub_total?: number;
  [key: string]: unknown;
}

interface ApiTrendingData {
  now?: ApiAnimeItem[];
  day?: ApiAnimeItem[];
  week?: ApiAnimeItem[];
  month?: ApiAnimeItem[];
  [key: string]: unknown;
}

interface ApiLatestData {
  sub?: ApiAnimeItem[];
  dub?: ApiAnimeItem[];
  [key: string]: unknown;
}

// Helper function to transform API spotlight data to expected Anime interface
export const transformSpotlightData = (spotlightData: ApiSpotlightItem[]) => {
  return spotlightData
    .filter((item: ApiSpotlightItem): item is ApiSpotlightItem & { id: number } => item.id != null)
    .map((item: ApiSpotlightItem & { id: number }) => ({
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
    subEpisodes: item.sub_total || 0,
    dubEpisodes: item.dub_total || 0,
  }));
};

// Helper function to transform trending data structure
export const transformTrendingData = (trendingData: ApiTrendingData) => {
  return {
    now: transformAnimeListData(trendingData.now || []),
    day: transformAnimeListData(trendingData.day || []),
    week: transformAnimeListData(trendingData.week || []),
    month: transformAnimeListData(trendingData.month || []),
  };
};

// Helper function to transform anime list data
export const transformAnimeListData = (animeList: ApiAnimeItem[]) => {
  return animeList
    .filter((item: ApiAnimeItem): item is ApiAnimeItem & { id: number } => item.id != null)
    .map((item: ApiAnimeItem & { id: number }) => ({
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
    subEpisodes: item.sub_total || 0,
    dubEpisodes: item.dub_total || 0,
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

// Watch Page Transformers
import type { 
  ApiWatchPageResponse, 
  TransformedWatchPageData, 
  ApiRelatedAnime, 
  TransformedAnimeData as WatchTransformedAnimeData,
  ApiEpisodeData,
  TransformedEpisodeData,
  ApiVideoSourceGroup,
  TransformedVideoSource
} from '@/types/api';

// Transform watch page API response to component interface
export const transformWatchPageData = (apiData: ApiWatchPageResponse): TransformedWatchPageData => {
  return {
    viewCount: apiData.view_count,
    animeId: apiData.anime,
    relatedAnime: apiData.related_animes.filter(anime => anime.id != null).map(transformRelatedAnime),
    similarAnime: apiData.similar_animes.filter(anime => anime.id != null).map(transformRelatedAnime),
    episodes: {
      sub: apiData.episodes.sub?.map(transformEpisodeData) || [],
      dub: apiData.episodes.dub?.map(transformEpisodeData) || [],
    },
    videoSources: {
      sub: apiData.vidsrces.sub?.map(transformVideoSource) || [],
      dub: apiData.vidsrces.dub?.map(transformVideoSource) || [],
    },
    skipTimes: {
      introSkip: parseFloat(apiData.skip_time.intro_skip),
      outroSkip: parseFloat(apiData.skip_time.outro_skip),
    },
  };
};

// Transform related/similar anime data
const transformRelatedAnime = (anime: ApiRelatedAnime): WatchTransformedAnimeData => {
  return {
    id: anime.id?.toString() || '0',
    title: anime.title,
    titleJapanese: anime.title_japanese,
    type: anime.anime_type,
    episodeCount: anime.number_of_episodes,
    isAiring: anime.airing,
    synopsis: anime.synopsis,
    trailerId: anime.trailer_yt_id,
    poster: anime.image,
    banner: anime.background_banner,
    episodeCounts: {
      sub: anime.sub_total,
      dub: anime.dub_total,
      raw: anime.raw_total,
    },
    genres: anime.genre,
  };
};

// Transform episode data
const transformEpisodeData = (episode: ApiEpisodeData): TransformedEpisodeData => {
  return {
    id: episode.id,
    episodeNumber: episode.ep_no,
    title: episode.title,
    description: episode.description,
    thumbnail: episode.image,
    airedDate: episode.aired_date,
  };
};

// Transform video source data
const transformVideoSource = (source: ApiVideoSourceGroup): TransformedVideoSource => {
  return {
    iframeUrls: source.iframe,
    m3u8Urls: source.m3u8,
    privateKey: source.private,
  };
};