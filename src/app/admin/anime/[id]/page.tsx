"use client";

import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { adminApi } from "@/lib/api/adminApi";
import { Loader2 } from "lucide-react";

interface AnimeDetails {
  id: number;
  title: string;
  title_japanese: string;
  synopsis: string;
  background_history: string;
  genre: string[];
  theme: string[];
  producer: string[];
  studio: string[];
  released_date: string;
  status: string;
  anime_type: string;
  image: string;
  background_banner: string;
  number_of_episodes: number;
  score: number;
  rating: string;
  popularity: number;
  members: number;
  favourites: number;
  sub_total: number;
  dub_total: number;
  raw_total: number;
  episodes: {
    sub?: Array<{
      id: number;
      ep_no: number;
      title: string;
      image: string;
      description: string;
      aired_date: string;
    }>;
  };
  characters: Array<{
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
  }>;
}

export default function AdminViewAnimePage() {
  const params = useParams();
  const animeId = params.id as string;
  
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await adminApi.getSingleAnimeDetails(animeId);
        setAnime(data);
      } catch (err) {
        console.error('Error fetching anime details:', err);
        setError('Failed to load anime details');
      } finally {
        setLoading(false);
      }
    };

    if (animeId) {
      fetchAnimeDetails();
    }
  }, [animeId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <span className="ml-2 text-gray-400">Loading anime details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-center">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="max-w-3xl mx-auto w-full">
        <div className="text-center text-gray-400 py-12">
          <p>Anime not found</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{anime.title}</h2>
        {anime.title_japanese && (
          <div className="text-gray-400 text-sm mb-2">Japanese: {anime.title_japanese}</div>
        )}
        
        {/* Genres, Themes, Studios, Producers */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {anime.genre.map((g: string) => (
            <span key={g} className="bg-green-800 text-green-300 px-3 py-1 rounded-full text-xs font-semibold">Genre: {g}</span>
          ))}
          {anime.theme.map((t: string) => (
            <span key={t} className="bg-blue-800 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">Theme: {t}</span>
          ))}
          {anime.studio.map((s: string) => (
            <span key={s} className="bg-purple-800 text-purple-300 px-3 py-1 rounded-full text-xs font-semibold">Studio: {s}</span>
          ))}
          {anime.producer.map((p: string) => (
            <span key={p} className="bg-orange-800 text-orange-300 px-3 py-1 rounded-full text-xs font-semibold">Producer: {p}</span>
          ))}
        </div>

        <div className="flex gap-4 mb-4 flex-col md:flex-row">
          <div className="w-32 h-48 relative rounded overflow-hidden bg-gray-700 flex-shrink-0">
            <Image src={anime.image || "/placeholder.png"} alt={anime.title} fill className="object-cover" sizes="128px" />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-gray-300 text-sm"><span className="font-semibold">Release Date:</span> {new Date(anime.released_date).getFullYear()}</div>
            <div className="text-gray-300 text-sm"><span className="font-semibold">Status:</span> <span className={`capitalize px-2 py-1 rounded text-xs font-bold ${anime.status.toLowerCase().includes("finished") ? "bg-green-700 text-green-200" : "bg-yellow-700 text-yellow-200"}`}>{anime.status}</span></div>
            <div className="text-gray-300 text-sm"><span className="font-semibold">Type:</span> <span className="capitalize px-2 py-1 rounded bg-gray-800 text-gray-200">{anime.anime_type}</span></div>
            <div className="text-gray-300 text-sm"><span className="font-semibold">Episodes:</span> {anime.number_of_episodes}</div>
            <div className="text-gray-300 text-sm"><span className="font-semibold">Rating:</span> {anime.rating}</div>
            <div className="text-gray-300 text-sm"><span className="font-semibold">Score:</span> {anime.score}/10</div>
            <div className="text-gray-300 text-sm"><span className="font-semibold">Popularity:</span> #{anime.popularity}</div>
            <div className="text-gray-300 text-sm"><span className="font-semibold">Members:</span> {anime.members.toLocaleString()}</div>
            <div className="text-gray-300 text-sm"><span className="font-semibold">Favourites:</span> {anime.favourites.toLocaleString()}</div>
          </div>
        </div>

        {/* Episode Counts */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-400">{anime.sub_total}</div>
            <div className="text-xs text-gray-400">SUB Episodes</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{anime.dub_total}</div>
            <div className="text-xs text-gray-400">DUB Episodes</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-400">{anime.raw_total}</div>
            <div className="text-xs text-gray-400">RAW Episodes</div>
          </div>
        </div>

        {/* Detailed Statistics */}
        <div className="mb-4 bg-gray-800 rounded-lg p-4">
          <div className="font-semibold text-white mb-3">Detailed Statistics</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Release Date</div>
              <div className="text-white">{new Date(anime.released_date).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-gray-400">Type</div>
              <div className="text-white capitalize">{anime.anime_type}</div>
            </div>
            <div>
              <div className="text-gray-400">Status</div>
              <div className="text-white">{anime.status}</div>
            </div>
            <div>
              <div className="text-gray-400">Rating</div>
              <div className="text-white">{anime.rating}</div>
            </div>
            <div>
              <div className="text-gray-400">Score</div>
              <div className="text-white">{anime.score}/10</div>
            </div>
            <div>
              <div className="text-gray-400">Popularity Rank</div>
              <div className="text-white">#{anime.popularity}</div>
            </div>
            <div>
              <div className="text-gray-400">Members</div>
              <div className="text-white">{anime.members.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400">Favourites</div>
              <div className="text-white">{anime.favourites.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="font-semibold text-white mb-1">Synopsis</div>
          <div className="text-gray-300 text-sm leading-relaxed">{anime.synopsis}</div>
        </div>

        {anime.background_history && (
          <div className="mb-4">
            <div className="font-semibold text-white mb-1">Background History</div>
            <div className="text-gray-300 text-sm leading-relaxed">{anime.background_history}</div>
          </div>
        )}
        
        {anime.background_banner && (
          <div className="mb-4">
            <div className="font-semibold text-white mb-1">Banner</div>
            <div className="w-full h-40 relative rounded overflow-hidden bg-gray-700">
              <Image src={anime.background_banner} alt={anime.title + " banner"} fill className="object-cover" sizes="100vw" />
            </div>
          </div>
        )}

        {/* Episodes Section */}
        {anime.episodes?.sub && anime.episodes.sub.length > 0 && (
          <div className="mb-6">
            <div className="font-semibold text-white mb-3">Episodes ({anime.episodes.sub.length})</div>
            <div className="max-h-80 overflow-y-auto bg-gray-800 rounded-lg">
              {anime.episodes.sub.slice(0, 10).map((episode) => (
                <div key={episode.id} className="border-b border-gray-700 last:border-b-0 p-4 hover:bg-gray-750">
                  <div className="flex gap-3">
                    <div className="w-16 h-12 relative rounded overflow-hidden bg-gray-700 flex-shrink-0">
                      <Image src={episode.image || "/placeholder.png"} alt={episode.title} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm">Episode {episode.ep_no}: {episode.title}</div>
                      <div className="text-gray-400 text-xs mt-1 line-clamp-2">{episode.description}</div>
                      <div className="text-gray-500 text-xs mt-1">Aired: {new Date(episode.aired_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))}
              {anime.episodes.sub.length > 10 && (
                <div className="p-3 text-center text-gray-400 text-sm">
                  And {anime.episodes.sub.length - 10} more episodes...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Characters Section */}
        {anime.characters.length > 0 && (
          <div className="mb-6">
            <div className="font-semibold text-white mb-3">Main Characters</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anime.characters.slice(0, 6).map((char, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-3 flex gap-3">
                  <div className="w-12 h-16 relative rounded overflow-hidden bg-gray-700 flex-shrink-0">
                    <Image src={char.character.image || "/placeholder.png"} alt={char.character.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{char.character.name}</div>
                    <div className="text-gray-400 text-xs">{char.character.role}</div>
                    <div className="text-gray-500 text-xs truncate">CV: {char.voiceactor.name}</div>
                    <div className="text-gray-500 text-xs">Language: {char.voiceactor.language}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-6">
          <Link href={`/admin/anime/${anime.id}/edit`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm">Edit</Link>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
} 