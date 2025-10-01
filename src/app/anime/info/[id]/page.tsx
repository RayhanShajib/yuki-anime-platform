"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { pageApi } from "@/lib/api/pageApi";
import { cn } from "@/lib/utils";
import { Bookmark, Grid, List, PlayCircle, User, Loader2, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation as SwiperNavigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// API Response Types
interface ApiAnimeInfoResponse {
  id: number;
  title: string;
  title_japanese: string;
  background_history: string | null;
  anime_type: string;
  source: string;
  number_of_episodes: number;
  status: string;
  released_date: string;
  anime_source: string[];
  characters: ApiCharacter[];
  airing: boolean;
  aired: string;
  score: number;
  scored_by: number;
  rank: number;
  rating: string;
  popularity: number;
  members: number;
  favourites: number;
  synopsis: string;
  trailer_yt_id: string | null;
  image: string;
  background_banner: string;
  sub_total: number;
  dub_total: number;
  raw_total: number;
  genre: string[];
  theme: string[];
  producer: string[];
  studio: string[];
  titles: string[];
  similar_animes: ApiSimilarAnime[];
  related_animes: ApiSimilarAnime[];
  episodes: {
    sub: ApiEpisode[];
    dub?: ApiEpisode[];
  };
}

interface ApiCharacter {
  character: {
    name: string;
    role: string;
    image: string;
  };
  voiceactor: {
    name: string;
    image: string;
    language: string;
  };
}

interface ApiSimilarAnime {
  id: number;
  title: string;
  title_japanese: string;
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
  ep_id: number;
}

interface ApiEpisode {
  id: number;
  ep_no: number;
  image: string;
  title: string;
  aired_date: string;
  description: string | null;
}



const tabs = [
  { key: "Overview", label: "Overview", icon: User },
  { key: "episodes", label: "Episodes", icon: List },
];

// Type for transformed data
interface TransformedAnimeData {
  id: number;
  title: string;
  poster: string;
  trailer: string | null;
  trailerReleaseDate: string;
  type: string;
  description: string;
  background: string | null;
  episodes: number;
  score: number;
  rank: number;
  popularity: number;
  status: string;
  aired: string;
  rating: string;
  genres: string[];
  themes: string[];
  studios: string[];
  producers: string[];
  characters: Array<{
    name: string;
    image: string;
    role: string;
    voiceActor: {
      name: string;
      image: string;
      language: string;
    };
  }>;
  episodesData: Array<{
    id: string;
    ep_no: number;
    title: string;
    type: "sub" | "dub";
    image: string;
    aired_date: string;
    description: string | null;
  }>;
  subTotal: number;
  dubTotal: number;
  reviews: never[];
  similarAnime: Array<{
    id: string;
    title: string;
    synopsis: string;
    poster: string;
    genres: string[];
    studio: string;
    releaseYear: number;
    status: "ongoing" | "completed" | "upcoming";
    type: "series" | "movie" | "ova" | "special";
    totalEpisodes?: number;
    rating: number;
    popularity: number;
    language: ("sub" | "dub")[];
  }>;
  relatedAnime: Array<{
    id: string;
    title: string;
    synopsis: string;
    poster: string;
    genres: string[];
    studio: string;
    releaseYear: number;
    status: "ongoing" | "completed" | "upcoming";
    type: "series" | "movie" | "ova" | "special";
    totalEpisodes?: number;
    rating: number;
    popularity: number;
    language: ("sub" | "dub")[];
  }>;
}

// Transform API response to component format
const transformApiDataToComponent = (apiData: ApiAnimeInfoResponse): TransformedAnimeData => {
  return {
    id: apiData.id,
    title: apiData.title,
    poster: apiData.image,
    trailer: apiData.trailer_yt_id 
      ? `https://www.youtube.com/embed/${apiData.trailer_yt_id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${apiData.trailer_yt_id}`
      : null,
    trailerReleaseDate: apiData.released_date ? apiData.released_date.split('T')[0] : "2024-01-01",
    type: `${apiData.anime_type} Series`,
    description: apiData.synopsis,
    background: apiData.background_history,
    episodes: apiData.number_of_episodes,
    score: apiData.score,
    rank: apiData.rank,
    popularity: apiData.popularity,
    status: apiData.status,
    aired: apiData.aired,
    rating: apiData.rating,
    genres: apiData.genre,
    themes: apiData.theme,
    studios: apiData.studio,
    producers: apiData.producer,
    characters: apiData.characters.map(char => ({
      name: char.character.name,
      image: char.character.image,
      role: char.character.role,
      voiceActor: {
        name: char.voiceactor.name,
        image: char.voiceactor.image,
        language: char.voiceactor.language,
      },
    })),
    episodesData: [
      ...apiData.episodes.sub.map(episode => ({
        id: episode.id.toString(),
        ep_no: episode.ep_no,
        title: episode.title,
        type: "sub" as const,
        image: episode.image,
        aired_date: episode.aired_date,
        description: episode.description,
      })),
      ...(apiData.episodes.dub || []).map(episode => ({
        id: episode.id.toString(),
        ep_no: episode.ep_no,
        title: episode.title,
        type: "dub" as const,
        image: episode.image,
        aired_date: episode.aired_date,
        description: episode.description,
      }))
    ],
    similarAnime: apiData.similar_animes.map(anime => ({
      id: anime.id.toString(),
      title: anime.title,
      synopsis: anime.synopsis,
      poster: anime.image,
      genres: anime.genre,
      studio: 'Unknown Studio',
      releaseYear: new Date().getFullYear(),
      status: anime.airing ? 'ongoing' as const : 'completed' as const,
      type: anime.anime_type === 'Movie' ? 'movie' as const : 'series' as const,
      totalEpisodes: anime.number_of_episodes,
      rating: 8.0, // Default rating
      popularity: 0,
      language: anime.sub_total > 0 ? ["sub"] : [] as ("sub" | "dub")[],
    })),
    relatedAnime: apiData.related_animes.map(anime => ({
      id: anime.id.toString(),
      title: anime.title,
      synopsis: anime.synopsis,
      poster: anime.image,
      genres: anime.genre,
      studio: 'Unknown Studio',
      releaseYear: new Date().getFullYear(),
      status: anime.airing ? 'ongoing' as const : 'completed' as const,
      type: anime.anime_type === 'Movie' ? 'movie' as const : 'series' as const,
      totalEpisodes: anime.number_of_episodes,
      rating: 8.0, // Default rating
      popularity: 0,
      language: anime.sub_total > 0 ? ["sub"] : [] as ("sub" | "dub")[],
    })),
    subTotal: apiData.sub_total,
    dubTotal: apiData.dub_total,
    reviews: [], // Add empty reviews array since API doesn't provide reviews
  };
};

export default function AnimeInfoPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [episodeLayout, setEpisodeLayout] = useState("flex"); // "flex" or "grid"
  const [audioType, setAudioType] = useState("sub"); // "sub" or "dub"
  
  // API State
  const [animeData, setAnimeData] = useState<TransformedAnimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get dynamic ID from URL params
  const params = useParams();
  const animeId = params.id as string;

  // Fetch anime data
  useEffect(() => {
    const fetchAnimeData = async () => {
      // Validate anime ID
      if (!animeId) {
        setError('Invalid anime ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const apiResponse: ApiAnimeInfoResponse = await pageApi.getAnimeInfoPageData(animeId);
        const transformedData = transformApiDataToComponent(apiResponse);
        
        setAnimeData(transformedData);
        
      } catch (err) {
        console.error('Error fetching anime info:', err);
        setError('Failed to load anime information');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, [animeId]);

  // Use API data or fallback to loading placeholders
  const anime = animeData || {
    id: 1,
    title: "Loading...",
    poster: "https://via.placeholder.com/200x350/333/white?text=Loading",
    trailer: null,
    trailerReleaseDate: "2024-01-01",
    type: "TV Series",
    description: "Loading anime information...",
    background: "Loading background information...",
    episodes: 0,
    genres: [],
    studios: [],
    producers: [],
    rating: "N/A",
    status: "Loading",
    aired: "Loading",
    characters: [],
    episodesData: [],
    similarAnime: [],
    relatedAnime: [],
    subTotal: 0,
    dubTotal: 0,
    reviews: [],
    score: 0,
    rank: 0,
    popularity: 0,
    themes: [],
  };

  // Calculate counts for sub and dub
  const subCount = anime.subTotal || anime.episodesData.filter((ep) => ep.type === "sub").length;
  const dubCount = anime.dubTotal || anime.episodesData.filter((ep) => ep.type === "dub").length;

  return (
    <div className="relative overflow-hidden">
      <Navigation />
      
      {/* Loading State */}
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <Loader2 className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Loading Anime Information...
            </h3>
            <p className="text-gray-500">
              Please wait while we fetch the anime details.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <div className="h-16 w-16 text-red-500 mx-auto mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-400 mb-2">
              Error Loading Anime Information
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-purple text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
      {/* Trailer Background */}
      <div className="h-[20rem] relative overflow-hidden min-w-full info-page-trailer md:h-[23rem] lg:h-[30rem]">
        {/* Trailer background with blur for mobile */}
        <div className="absolute top-0 h-full trailer size-full object-cover pointer-events-none object-center trailer-blur-bg">
          <div className="w-full h-full info-trailer">
            {anime.trailer ? (
              <iframe
                src={anime.trailer}
                title="Anime Trailer"
                allow="autoplay; encrypted-media"
                frameBorder="0"
                className="w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center text-white/60">
                  <PlayCircle className="h-16 w-16 mx-auto mb-4" />
                  <p>No trailer available</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="info-grad z-0"></div>
        <div className="absolute inset-0 hero-gradient" />
        {/* Left blur gradient */}
        <div className="absolute left-0 top-0 bottom-0 hero-left-gradient w-110 bg-gradient-to-r from-brand-primary/80 via-brand-primary/50 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 xl:-mt-[200px] w-full info-page-main-content">
        <div className="flex flex-col md:flex-row md:items-end items-start gap-8 w-full info-poster-content info-blur-bg ">
          {/* Poster */}
          <div className="flex justify-start">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={anime.poster}
                alt={anime.title}
                width={200}
                height={350}
                className="object-cover"
                priority
              />
            </div>
          </div>
          {/* Title & Actions */}
          <div className="w-full">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 mt-2 drop-shadow-lg">
              {anime.title}
            </h1>
            <span className="text-white font-normal mb-4">{anime.type}</span>
            <div className="flex gap-4 mt-4 mb-4 flex-wrap info-buttons">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg btn-purple text-white/90 font-semibold text-md shadow-lg transition">
                <PlayCircle className="h-5 w-5" /> Watch Now
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg btn-pink text-white font-semibold text-md shadow-lg transition">
                <Bookmark className="h-5 w-5" /> Add to List
              </button>
            </div>
          </div>
        </div>
        {/* Bottom blur gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-70 bg-gradient-to-t from-brand-primary/80 via-brand-primary/50 to-transparent z-0 pointer-events-none" />
        {/* Info & Tabs */}
        <div className="flex-1 w-full mt-12">
          {/* Tabs */}
          <div className="mb-6 info-tabs">
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 flex-wrap w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    activeTab === tab.key
                      ? "btn-purple text-white/90"
                      : "text-gray-300 hover:text-white hover:bg-[#7760A9]"
                  )}>
                  <span className="text-white">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content (no animation) */}
          {activeTab === "Overview" && (
            <div className="space-y-6 md:space-y-0 md:flex md:gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">Synopsis</h2>
                <p className="text-gray-300 text-lg mb-4">
                  {anime.description}
                </p>
                <h2 className="text-2xl font-bold text-white mb-2">Background</h2>
                <p className="text-gray-300 text-lg mb-4">
                  {anime.background || "No background information available."}
                </p>
                <div className="flex gap-8">
                  <div>
                    <span className="text-gray-300">Episodes:</span>
                    <span className="text-white font-bold ml-2">
                      {anime.episodes}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-300">Reviews:</span>
                    <span className="text-white font-bold ml-2">
                      {anime.reviews.length}
                    </span>
                  </div>
                </div>
                {/* Anime Info Section */}
                <div className="w-full flex flex-wrap h-auto !tracking-wider mt-5">
                  <div className="w-full sm:w-1/2 shrink-0 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2 text-nowrap">
                    <span className="font-medium shrink-0 text-gray-300">
                      Episodes
                    </span>
                    <span className="text-sm font-light text-gray-300">{anime.episodes || 'N/A'}</span>
                  </div>
                  <div className="w-full sm:w-1/2 shrink-0 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2 text-nowrap">
                    <span className="font-medium shrink-0 text-gray-300">
                      Aired
                    </span>
                    <span className="text-sm font-light text-gray-300">
                      {anime.aired || 'N/A'}
                    </span>
                  </div>
                  <div className="w-full sm:w-1/2 shrink-0 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2 text-nowrap">
                    <span className="font-medium shrink-0 text-gray-300">
                      Rating
                    </span>
                    <span className="text-sm text-end font-light text-gray-300">
                      {anime.rating || 'N/A'}
                    </span>
                  </div>
                  <div className="w-full sm:w-1/2 shrink-0 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2 text-nowrap">
                    <span className="font-medium shrink-0 text-gray-300">
                      Status
                    </span>
                    <span className="text-sm text-end font-light text-gray-300">
                      {anime.status || 'N/A'}
                    </span>
                  </div>
                  <div className="w-full sm:w-1/2 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2">
                    <span className="font-medium text-gray-300">Format</span>
                    <span className="text-sm text-end font-light text-gray-300">
                      {anime.type || 'N/A'}
                    </span>
                  </div>
                  <div className="w-full sm:w-1/2 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2">
                    <span className="font-medium text-gray-300">Genres</span>
                    <span className="text-sm text-end font-light">
                      {anime.genres && anime.genres.length > 0 ? (
                        anime.genres.map((genre: string, index: number) => (
                          <Link
                            key={genre}
                            href={`/search?genre=${genre}`}
                            className="hover:text-white text-gray-300 tracking-wide !leading-normal">
                            {index > 0 && ', '}{genre}
                          </Link>
                        ))
                      ) : (
                        <span className="text-gray-300">N/A</span>
                      )}
                    </span>
                  </div>
                  <div className="w-full sm:w-1/2 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2">
                    <span className="font-medium text-gray-300">Studios</span>
                    <span className="text-sm text-end font-light">
                      {anime.studios && anime.studios.length > 0 ? (
                        anime.studios.map((studio: string, index: number) => (
                          <Link
                            key={studio}
                            href={`/search?studio=${studio}`}
                            className="hover:text-white text-gray-300 tracking-wide !leading-normal">
                            {index > 0 && ', '}{studio}
                          </Link>
                        ))
                      ) : (
                        <span className="text-gray-300">N/A</span>
                      )}
                    </span>
                  </div>
                  <div className="w-full sm:w-1/2 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2">
                    <span className="font-medium text-gray-300">Producer</span>
                    <span className="text-sm text-end font-light">
                      {anime.producers && anime.producers.length > 0 ? (
                        anime.producers.map((producer: string, index: number) => (
                          <Link
                            key={producer}
                            href={`/search?producer=${producer}`}
                            className="hover:text-white text-gray-300 tracking-wide !leading-normal">
                            {index > 0 && ', '}{producer}
                          </Link>
                        ))
                      ) : (
                        <span className="text-gray-300">N/A</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              {/* Characters on the right */}
              <div className="w-full md:w-80 xl:w-96 mt-8 md:mt-0 md:ml-4 flex-shrink-0">
                <h3 className="text-xl font-bold text-white mb-3">
                  Characters
                </h3>
                <div className="flex flex-col w-full max-h-[21.6rem] sm:max-h-[23rem] lg:max-h-[31rem] overflow-auto gap-2 sm:gap-3 lg:gap-4 px-1">
                  {anime.characters.map((char, idx: number) => (
                    <div
                      key={char.name + idx}
                      className="flex items-center gap-3 bg-[#282831] rounded-lg p-2 shadow">
                      <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={char.image}
                          alt={char.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium truncate">
                          {char.name}
                        </div>
                        <div className="text-xs text-gray-300 truncate">
                          {char.voiceActor.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-md text-gray-200 font-medium whitespace-nowrap">
                          {char.voiceActor.name}
                        </div>
                        <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={char.voiceActor.image}
                            alt={char.voiceActor.name}
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "episodes" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Episodes
                  </h2>
                  <p className="text-gray-300">
                    Total Episodes: {anime.episodes}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                      audioType === "sub"
                        ? "bg-blue-600 text-white/90"
                        : "bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                    onClick={() => setAudioType("sub")}>
                    <span>Sub</span>
                    <span className="rounded text-md font-semibold text-white/80">
                      ({subCount})
                    </span>
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                      audioType === "dub"
                        ? "bg-blue-600 text-white/90"
                        : "bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                    onClick={() => setAudioType("dub")}>
                    <span>Dub</span>
                    <span className="font-semibold text-white/80">
                      ({dubCount})
                    </span>
                  </button>
                  <div className="hidden sm:flex gap-2 items-center ml-4">
                    <button
                      className={`overflow-hidden smoothie bg-gray-600 text-white/90 p-1 rounded cursor-pointer ${
                        episodeLayout === "grid" ? "bg-[#1e1e24]" : ""
                      }`}
                      onClick={() => setEpisodeLayout("grid")}>
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      className={`flex flex-col justify-center items-center gap-[2px] group cursor-pointer bg-gray-600 text-white/90 p-1 rounded ${
                        episodeLayout === "flex" ? "bg-[#1e1e24]" : ""
                      }`}
                      onClick={() => setEpisodeLayout("flex")}>
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              {/* Episode Cards */}
              <div
                className={
                  episodeLayout === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 w-full max-h-[32rem] sm:max-h-[36rem] lg:max-h-[44rem] overflow-auto gap-3 sm:gap-4 lg:gap-6 px-1"
                    : "flex flex-wrap w-full max-h-[21.6rem] sm:max-h-[23rem] lg:max-h-[31rem] overflow-auto gap-2 sm:gap-3 lg:gap-4 px-1"
                }>
                {anime.episodesData
                  .filter((episode) => episode.type === audioType)
                  .length > 0 ? (
                    anime.episodesData
                      .filter((episode) => episode.type === audioType)
                      .map((episode) => (
                    <div
                      key={episode.id}
                      title={episode.title}
                      className={
                        episodeLayout === "grid"
                          ? "flex-shrink-0 smoothie w-full aspect-[16/9] hover:brightness-90 hover:scale-[.98]"
                          : "flex-shrink-0 smoothie w-full h-20 lg:h-28 hover:brightness-90 hover:scale-[.98]"
                      }>
                      <Link
                        className={
                          episodeLayout === "grid"
                            ? "group size-full z-0 flex relative smoothie rounded-lg xl:rounded-2xl"
                            : "group size-full z-0 flex bg-[#1e1e24] xl:bg-[#1e1e24] shadow-xl gap-1 md:gap-2 relative smoothie rounded-lg xl:rounded-2xl overflow-hidden"
                        }
                        href={`/watch/${anime.id}/?ep=${episode.id}`}>
                        <div
                          className={
                            episodeLayout === "grid"
                              ? "w-full h-full relative rounded-lg xl:rounded-2xl overflow-hidden shadow-[4px_0px_5px_0px_rgba(0,0,0,0.3)]"
                              : "h-full aspect-[15/9] relative flex-shrink-0 bg-white/5 rounded-lg xl:rounded-2xl overflow-hidden shadow-[4px_0px_5px_0px_rgba(0,0,0,0.3)]"
                          }>
                          <Image
                            src={episode.image || `https://via.placeholder.com/400x225/333/white?text=Episode+${episode.ep_no || episode.id}`}
                            alt={`${episode.title} screencap`}
                            fill
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x225/333/white?text=Episode+${episode.ep_no || episode.id}`;
                            }}
                            className={
                              episodeLayout === "grid"
                                ? "brightness-95 w-full h-full object-cover smoothie rounded-lg xl:rounded-2xl"
                                : "brightness-95 aspect-video h-full w-full object-cover smoothie"
                            }
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            priority
                          />
                          <span className="px-[.4rem] py-[.15rem] max-w-full text-xs xl:text-sm flex-grow text-white/90 bg-black/60 rounded-md font-medium tracking-wide absolute bottom-1 left-1 sm:left-[.4rem] smoothie">
                            Ep {episode.ep_no || episode.id}
                          </span>
                          {episodeLayout === "grid" && (
                            <div className="flex !italic z-10 text-white/90 !tracking-wide py-1 px-2 flex-col bg-black/70 opacity-0 group-hover:opacity-100 absolute size-full smoothie">
                              <div className="brightness-110 text-xs sm:text-sm !leading-snug line-clamp-3 lg:line-clamp-4 w-full">
                                {episode.title}
                              </div>
                              <div className="ml-auto mt-auto font-medium hover:underline brightness-125 hover:text-[var(--pinkk)] text-sm lg:text-base">
                                Watch Now
                              </div>
                            </div>
                          )}
                        </div>
                        {episodeLayout !== "grid" && (
                          <div className="mobile !italic flex-grow flex flex-col gap-1 lg:gap-2 p-2 py-3 lg:my-auto">
                            <span className="tracking-wider !leading-tight line-clamp-1 text-sm sm:text-base text-gray-100 font-medium">
                              {episode.title}
                            </span>
                          </div>
                        )}
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-gray-500 mb-4">
                      <Play className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">
                      No {audioType.toUpperCase()} episodes available
                    </h3>
                    <p className="text-gray-500">
                      Try switching to {audioType === "sub" ? "DUB" : "SUB"} episodes or check back later.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full max-w-7xl mx-auto">
          <div className="relative flex flex-col gap-4 md:gap-5 w-full z-20 mx-auto mt-8 lg:my-8 lg:mb-12 md:px-2 xl:px-0 !select-none">
            <div className="text-lg sm:text-xl lg:text-2xl font-medium lg:font-normal tracking-[0.015em] lg:tracking-normal 2xl:text-[1.6rem] font-popin items-center gap-2 flex px-2">
              <a className="flex gap-2 items-center" href="/search">
                <div className="h-6 md:h-8 rounded-md w-[.38rem] btn-pink"></div>
                <span className="text-white">You may also like</span>
                <span className="ml-auto md:m-0 text-white">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </span>
              </a>
            </div>

            <div className="w-full max-w-7xl mx-auto mt-3 pb-10">
              <Swiper
                modules={[SwiperNavigation]}
                spaceBetween={20}
                slidesPerView={2}
                navigation={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 4,
                    spaceBetween: 25,
                  },
                  1024: {
                    slidesPerView: 5,
                    spaceBetween: 25,
                  },
                  1280: {
                    slidesPerView: 8,
                    spaceBetween: 30,
                  },
                  1536: {
                    slidesPerView: 8,
                    spaceBetween: 30,
                  },
                }}
                className="relations-swiper">
                {anime.similarAnime.slice(0, 10).map((animeItem) => (
                  <SwiperSlide key={animeItem.id}>
                    <div className="relative">
                      <AnimeCard anime={animeItem} showPopup={true} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
        {/* Relations Section */}
        <div className="w-full max-w-7xl mx-auto mt-3 pb-10 sm:pb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Relations</h2>
          <Swiper
            modules={[SwiperNavigation]}
            spaceBetween={20}
            slidesPerView={2}
            navigation={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 25,
              },
              1280: {
                slidesPerView: 8,
                spaceBetween: 30,
              },
              1536: {
                slidesPerView: 8,
                spaceBetween: 30,
              },
            }}
            className="relations-swiper">
            {anime.relatedAnime.slice(0, 10).map((animeItem) => (
              <SwiperSlide key={animeItem.id}>
                <div className="relative">
                  <AnimeCard anime={animeItem} showPopup={true} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </main>
        </>
      )}
      <FooterSection />
    </div>
  );
}
