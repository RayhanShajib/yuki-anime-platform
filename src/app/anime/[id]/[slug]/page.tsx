import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import InfoComponent from "@/components/ui/InfoComponent";
import { pageApi } from "@/lib/api/pageApi";
import { notFound } from "next/navigation";

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
const transformApiDataToComponent = (
  apiData: ApiAnimeInfoResponse
): TransformedAnimeData => {
  return {
    id: apiData.id,
    title: apiData.title,
    poster: apiData.image,
    trailer: apiData.trailer_yt_id
      ? `https://www.youtube.com/embed/${apiData.trailer_yt_id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${apiData.trailer_yt_id}`
      : null,
    trailerReleaseDate: apiData.released_date
      ? apiData.released_date.split("T")[0]
      : "2024-01-01",
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
    characters: apiData.characters.map((char) => ({
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
      ...apiData.episodes.sub.map((episode) => ({
        id: episode.id.toString(),
        ep_no: episode.ep_no,
        title: episode.title,
        type: "sub" as const,
        image: episode.image,
        aired_date: episode.aired_date,
        description: episode.description,
      })),
      ...(apiData.episodes.dub || []).map((episode) => ({
        id: episode.id.toString(),
        ep_no: episode.ep_no,
        title: episode.title,
        type: "dub" as const,
        image: episode.image,
        aired_date: episode.aired_date,
        description: episode.description,
      })),
    ],
    similarAnime: apiData.similar_animes.map((anime) => ({
      id: anime.id.toString(),
      title: anime.title,
      synopsis: anime.synopsis,
      poster: anime.image,
      genres: anime.genre,
      studio: "Unknown Studio",
      releaseYear: new Date().getFullYear(),
      status: anime.airing ? ("ongoing" as const) : ("completed" as const),
      type:
        anime.anime_type === "Movie" ? ("movie" as const) : ("series" as const),
      totalEpisodes: anime.number_of_episodes,
      rating: anime.rating,
      popularity: 0,
      language: anime.sub_total > 0 ? ["sub"] : ([] as ("sub" | "dub")[]),
    })),
    relatedAnime: apiData.related_animes.map((anime) => ({
      id: anime.id.toString(),
      title: anime.title,
      synopsis: anime.synopsis,
      poster: anime.image,
      genres: anime.genre,
      studio: "Unknown Studio",
      releaseYear: new Date().getFullYear(),
      status: anime.airing ? ("ongoing" as const) : ("completed" as const),
      type:
        anime.anime_type === "Movie" ? ("movie" as const) : ("series" as const),
      totalEpisodes: anime.number_of_episodes,
      rating: anime.rating,
      popularity: 0,
      language: anime.sub_total > 0 ? ["sub"] : ([] as ("sub" | "dub")[]),
    })),
    subTotal: apiData.sub_total,
    dubTotal: apiData.dub_total,
    reviews: [],
  };
};

interface PageProps {
  params: Promise<{
    id: string;
    slug: string;
  }>;
}

export default async function AnimeInfoPage({ params }: PageProps) {
  try {
    // Await params in Next.js 15
    const resolvedParams = await params;
    // Fetch anime data on the server
    const apiResponse: ApiAnimeInfoResponse =
      await pageApi.getAnimeInfoPageData(resolvedParams.id);
    const animeData = transformApiDataToComponent(apiResponse);

    return (
      <div className="relative overflow-hidden">
        <Navigation />
        <InfoComponent animeData={animeData} />
        <FooterSection />
      </div>
    );
  } catch (error) {
    console.error("Error fetching anime data:", error);
    notFound();
  }
}
