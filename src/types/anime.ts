export interface Anime {
  id: string;
  title: string;
  alternativeTitles?: string[];
  synopsis: string;
  poster: string;
  banner?: string;
  trailer?: string;
  genres: string[];
  studio: string;
  releaseYear: number;
  status: 'ongoing' | 'completed' | 'upcoming';
  type: 'series' | 'movie' | 'ova' | 'special';
  totalEpisodes?: number;
  rating: number;
  popularity: number;
  language: ('sub' | 'dub')[];
  malId?: string;
  anilistId?: string;
  episodes?: Episode[];
  characters?: Character[];
  relations?: AnimeRelation[];
}

export interface Episode {
  id: string;
  animeId: string;
  number: number;
  title: string;
  synopsis?: string;
  thumbnail?: string;
  duration?: number;
  airDate?: string;
  sources: VideoSource[];
}

export interface VideoSource {
  quality: string;
  url: string;
  type: 'hls' | 'mp4';
}

export interface Character {
  id: string;
  name: string;
  image: string;
  role: 'main' | 'supporting' | 'background';
  voiceActors?: VoiceActor[];
}

export interface VoiceActor {
  id: string;
  name: string;
  image: string;
  language: string;
}

export interface AnimeRelation {
  id: string;
  title: string;
  poster: string;
  relation: 'sequel' | 'prequel' | 'side_story' | 'alternative' | 'spin_off';
}

export interface UserProgress {
  animeId: string;
  episodeNumber: number;
  timestamp: number;
  completed: boolean;
  watchedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  joinDate: string;
  watchlist: string[];
  favorites: string[];
  watchHistory: UserProgress[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  language: string;
  autoplay: boolean;
  quality: string;
  notifications: {
    newEpisodes: boolean;
    announcements: boolean;
  };
}

export interface AnimeRequest {
  id: string;
  userId: string;
  animeName: string;
  malLink?: string;
  additionalDetails?: string;
  status: 'pending' | 'under_review' | 'approved' | 'completed' | 'rejected';
  submittedAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'anime' | 'community';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface SearchFilters {
  genres?: string[];
  type?: 'series' | 'movie' | 'ova' | 'special';
  status?: 'ongoing' | 'completed' | 'upcoming';
  year?: number;
  language?: 'sub' | 'dub';
  rating?: [number, number];
  sortBy?: 'popularity' | 'rating' | 'release_date' | 'title';
  sortOrder?: 'asc' | 'desc';
}
