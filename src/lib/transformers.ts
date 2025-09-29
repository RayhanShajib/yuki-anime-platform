// Data transformation utilities for converting API responses to component interfaces

// Helper function to transform API spotlight data to expected Anime interface
export const transformSpotlightData = (spotlightData: any[]) => {
  return spotlightData.map((item: any) => ({
    id: item.id.toString(),
    title: item.title?.romaji || item.title?.english || item.title || 'Unknown Title',
    synopsis: item.description || '',
    poster: item.banner || '/placeholder-anime.jpg',
    banner: item.banner || '/placeholder-anime.jpg',
    trailer: item.trailer && item.trailer !== null ? item.trailer : null, // YouTube video ID
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
export const transformTrendingData = (trendingData: any) => {
  // For now, just use the 'now' data as the trending anime
  // In a real implementation, you'd want to modify TrendingSection to handle all time periods
  return transformAnimeListData(trendingData.now || []);
};

// Helper function to transform anime list data
export const transformAnimeListData = (animeList: any[]) => {
  return animeList.map((item: any) => ({
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
export const transformLatestData = (latestData: any) => {
  // Combine sub and dub data with appropriate language tags
  const subAnime = transformAnimeListData(latestData.sub || []).map((anime: any) => ({
    ...anime,
    language: ['sub' as const],
  }));
  
  const dubAnime = transformAnimeListData(latestData.dub || []).map((anime: any) => ({
    ...anime,
    language: ['dub' as const],
  }));
  
  return [...subAnime, ...dubAnime];
};