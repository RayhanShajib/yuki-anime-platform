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
  type: "TV" | "Movie" | "OVA" | "ONA" | "Special";
  status: "Ongoing" | "Completed" | "Upcoming";
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

// Watch Page API Interfaces
export interface ApiWatchPageResponse {
  view_count: number;
  anime: number;
  related_animes: ApiRelatedAnime[];
  similar_animes: ApiRelatedAnime[];
  vidsrces: ApiVideoSources;
  episodes: ApiEpisodes;
  skip_time: ApiSkipTime;
}

export interface ApiRelatedAnime {
  id: number;
  title: string;
  title_japanese: string | null;
  anime_type: string;
  number_of_episodes: number;
  airing: boolean;
  synopsis: string;
  trailer_yt_id: string | null;
  image: string;
  background_banner: string;
  sub_total: number;
  dub_total: number;
  raw_total: number;
  genre: string[];
  ep_id: number | null;
  rating?: number;
}

export interface ApiVideoSources {
  sub?: ApiVideoSourceGroup[];
  dub?: ApiVideoSourceGroup[];
}

export interface ApiVideoSourceGroup {
  iframe: string[];
  m3u8: string[];
  private: string;
}

export interface ApiEpisodes {
  sub?: ApiEpisodeData[];
  dub?: ApiEpisodeData[];
}

export interface ApiEpisodeData {
  id: number;
  ep_no: number;
  image: string;
  description: string;
  aired_date: string;
  title: string;
}

export interface ApiSkipTime {
  intro_skip: string;
  outro_skip: string;
}

// Transformed Watch Page Interfaces
export interface TransformedWatchPageData {
  viewCount: number;
  animeId: number;
  relatedAnime: TransformedAnimeData[];
  similarAnime: TransformedAnimeData[];
  episodes: {
    sub: TransformedEpisodeData[];
    dub: TransformedEpisodeData[];
  };
  videoSources: {
    sub: TransformedVideoSource[];
    dub: TransformedVideoSource[];
  };
  skipTimes: {
    introSkip: number;
    outroSkip: number;
  };
}

export interface TransformedEpisodeData {
  id: number;
  episodeNumber: number;
  title: string;
  description: string;
  thumbnail: string;
  airedDate: string;
}

export interface TransformedVideoSource {
  iframeUrls: string[];
  m3u8Urls: string[];
  privateKey: string;
}

export interface PrivateVideoSourceResponse {
  m3u8: Array<{
    quality: string;
    url: string;
    isM3U8: boolean;
  }>;
  intro_skip: string;
  outro_skip: string;
}

export interface TransformedAnimeData {
  id: string;
  title: string;
  titleJapanese: string | null;
  type: string;
  episodeCount: number;
  isAiring: boolean;
  synopsis: string;
  trailerId: string | null;
  poster: string;
  banner: string;
  episodeCounts: {
    sub: number;
    dub: number;
    raw: number;
  };
  genres: string[];
  rating: number;
}

// Profile and User Data Types
export interface ApiProfileData {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  role?: string;
  joinDate?: string;
  totalWatched?: number;
  totalHours?: number;
  favoriteGenres?: string[];
  exp?: number;
  nextLevelExp?: number;
  preferred_title_lang?: string;
  preferred_video_lang?: string;
  skip_seconds?: number;
  bookmarks_per_page?: number;
  hide_bookmarks?: boolean;
  hide_profile_activities?: boolean;
  notifications?: ApiNotification[];
  user_notifications?: ApiNotification[];
  alerts?: ApiNotification[];
  watchlist?: Record<string, unknown>;
  stats?: {
    episodesWatched: number;
    minutesWatched: number;
    averageRating: number;
    droppedSeries: number;
    onHoldSeries: number;
    planToWatch: number;
  };
  [key: string]: unknown; // Allow additional API fields
}

export interface ApiNotification {
  id: number;
  source?: string;
  content?: string;
  created_at?: string;
  is_read?: boolean;
  text?: string;
  message?: string;
  date?: string;
  time?: string;
  type?: "Anime" | "Community";
}

export interface ApiWatchlistResponse {
  results: {
    watching: ApiWatchlistItem[];
    plan_to_watch: ApiWatchlistItem[];
    on_hold: ApiWatchlistItem[];
    completed: ApiWatchlistItem[];
    dropped?: ApiWatchlistItem[];
  };
}

export interface ApiWatchlistItem {
  id: number;
  anime_id: number;
  title: string;
  image: string;
  sub_total: number;
  dub_total: number;
  status: "watching" | "completed" | "drop" | "on_hold" | "plan_to_watch";
}

// Comment System Types
export interface ApiComment {
  id: number;
  episode: number;
  user: string;
  content: string;
  reply_to: number | null;
  upvotes: number;
  downvotes: number;
  created_at: string;
  replies: ApiComment[];
}

export interface ApiCommentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiComment[];
}

export interface ApiVoteResponse {
  upvotes: number;
  downvotes: number;
  user_vote: "upvote" | "downvote" | null;
}

export interface ApiUserVotesResponse {
  [commentId: string]: "upvote" | "downvote" | null;
}
