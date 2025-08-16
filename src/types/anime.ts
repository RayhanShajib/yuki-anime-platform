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
  status: "ongoing" | "completed" | "upcoming";
  type: "series" | "movie" | "ova" | "special";
  totalEpisodes?: number;
  subEpisodes?: number;
  dubEpisodes?: number;
  rating: number;
  popularity: number;
  language: ("sub" | "dub")[];
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
  type: "hls" | "mp4";
}

export interface Character {
  id: string;
  name: string;
  image: string;
  role: "main" | "supporting" | "background";
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
  relation: "sequel" | "prequel" | "side_story" | "alternative" | "spin_off";
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
  theme: "dark" | "light";
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
  status: "pending" | "under_review" | "approved" | "completed" | "rejected";
  submittedAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "anime" | "community";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface SearchFilters {
  genres?: string[];
  type?: "series" | "movie" | "ova" | "special";
  status?: "ongoing" | "completed" | "upcoming";
  year?: number;
  language?: "sub" | "dub";
  rating?: [number, number];
  sortBy?: "popularity" | "rating" | "release_date" | "title";
  sortOrder?: "asc" | "desc";
}

// Core reusable types
export interface Title {
  romaji: string;
  english: string;
}

export type AnimeStatus = "Ongoing" | "Completed";
export type AnimeType = "TV Series" | "Movie" | "OVA" | "Special";

export interface AnimeEpisodes {
  sub: number;
  dub: number;
}

// Anime card
export interface AnimeCard {
  id: number;
  title: string;
  title_japanese: string;
  background_banner: string;
  sub_total: number;
  dub_total: number;
  raw_total: number;
  ep_id: number;
  number_of_episodes: number;
  synopsis: string;
  image: string;
  genre: string[];
  airing: boolean;
  anime_type: string;
  trailer_yt_id: string;
}

// Spotlight anime
export interface SpotlightAnime {
  id: number;
  title: Title;
  description: string;
  banner: string;
  trailer: string;
  genre: string[];
  released_date: string;
  type: AnimeType;
}
// Trending anime
export type TrendingAnime = AnimeCard;

// Latest anime
export type LatestAnime = Anime;

// Popular anime
export type PopularAnime = AnimeCard;

// Favorites anime
export type FavoritesAnime = AnimeCard;

// Completed anime
export type CompletedAnime = AnimeCard;

// Schedule
export type ScheduleAnime = AnimeCard;

// Airing anime
export type AiringAnime = AnimeCard;

// Home Page
export interface HomePageResponse {
  spotlight: SpotlightAnime[];
  trending: {
    day: TrendingAnime[];
    week: TrendingAnime[];
    month: TrendingAnime[];
  };
  latest: {
    sub: LatestAnime[];
    dub: LatestAnime[];
  };
  schedule: ScheduleAnime[];
  popular: PopularAnime[];
  favorites: FavoritesAnime[];
  airing: AiringAnime[];
  completed: CompletedAnime[];
}

// Anime Info Page
export interface AnimeInfoPage {
  id: number;
  title: Title;
  releaseDate: string;
  type: AnimeType;
  thumbnail: string;
  trailer: string;
  overview: {
    description: string;
    episodes: number;
    reviews: number;
    rating: number;
    status: AnimeStatus;
    genres: string[];
    duration: number;
    synonyms: string[];
  };
  episodes: {
    sub: {
      count: number;
      data: EpisodeSummary[];
    };
    dub: {
      count: number;
      data: EpisodeSummary[];
    };
  };
  characters: CharacterWithVoice[];
  relations: {
    related: RelatedAnime[];
    adaptations: RelatedAnime[];
  };
  recommandations: AnimeCard[];
}

// Episode summary used in info page
export interface EpisodeSummary {
  id: number;
  title: Title;
  description: string;
  thumbnail: string;
  duration: number;
  episodeNumber: number;
}

// Character & voice actor
export interface CharacterWithVoice {
  id: number;
  character: {
    name: string;
    image: string;
  };
  voiceactor: {
    name: string;
    image: string;
  };
}

// Relations (related/anime adaptations)
export interface RelatedAnime {
  id: number;
  title: Title;
  type: string;
  thumbnail: string;
}

// Used for Random Page
export interface RandomAnime {
  id: number;
  title: Title;
}

// Shared type for pages like Latest, Popular, Trending, Ongoing
export type AnimeListResponse = AnimeCard[];

// Shared type for schedule page
export type SchedulePageResponse = ScheduleAnime[];
