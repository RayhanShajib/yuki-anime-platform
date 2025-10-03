"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from 'next/navigation';
import { adminApi, UpdateAnimeData } from "@/lib/api/adminApi";
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
}

interface EditForm {
  title: string;
  title_japanese: string;
  synopsis: string;
  background_history: string;
  genre: string;
  theme: string;
  producer: string;
  studio: string;
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
}

export default function AdminEditAnimePage() {
  const params = useParams();
  const router = useRouter();
  const animeId = params.id as string;
  
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState<EditForm>({
    title: '',
    title_japanese: '',
    synopsis: '',
    background_history: '',
    genre: '',
    theme: '',
    producer: '',
    studio: '',
    released_date: '',
    status: '',
    anime_type: '',
    image: '',
    background_banner: '',
    number_of_episodes: 0,
    score: 0,
    rating: '',
    popularity: 0,
    members: 0,
    favourites: 0,
  });

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await adminApi.getSingleAnimeDetails(animeId);
        setAnime(data);
        
        // Populate form with fetched data
        setForm({
          title: data.title || '',
          title_japanese: data.title_japanese || '',
          synopsis: data.synopsis || '',
          background_history: data.background_history || '',
          genre: data.genre?.join(', ') || '',
          theme: data.theme?.join(', ') || '',
          producer: data.producer?.join(', ') || '',
          studio: data.studio?.join(', ') || '',
          released_date: data.released_date?.split('T')[0] || '', // Convert to YYYY-MM-DD format
          status: data.status || '',
          anime_type: data.anime_type || '',
          image: data.image || '',
          background_banner: data.background_banner || '',
          number_of_episodes: data.number_of_episodes || 0,
          score: data.score || 0,
          rating: data.rating || '',
          popularity: data.popularity || 0,
          members: data.members || 0,
          favourites: data.favourites || 0,
        });
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: name === 'number_of_episodes' || name === 'score' || name === 'popularity' || name === 'members' || name === 'favourites' 
        ? Number(value) 
        : value 
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Transform form data to match API format
      const updateData: UpdateAnimeData = {
        title: form.title,
        title_japanese: form.title_japanese,
        synopsis: form.synopsis,
        background_history: form.background_history,
        // Convert comma-separated strings back to array format with objects
        genre: form.genre ? form.genre.split(',').map(name => ({ name: name.trim() })) : [],
        theme: form.theme ? form.theme.split(',').map(name => ({ name: name.trim() })) : [],
        producer: form.producer ? form.producer.split(',').map(name => ({ name: name.trim() })) : [],
        studio: form.studio ? form.studio.split(',').map(name => ({ name: name.trim() })) : [],
        released_date: form.released_date,
        status: form.status,
        anime_type: form.anime_type,
        image: form.image,
        background_banner: form.background_banner,
        number_of_episodes: form.number_of_episodes,
        score: form.score,
        rating: form.rating,
        popularity: form.popularity,
        members: form.members,
        favourites: form.favourites,
      };

      // Remove empty fields to avoid overwriting with empty data
      Object.keys(updateData).forEach(key => {
        const value = updateData[key as keyof UpdateAnimeData];
        if (value === '' || value === 0 || (Array.isArray(value) && value.length === 0)) {
          delete updateData[key as keyof UpdateAnimeData];
        }
      });

      await adminApi.updateAnime(animeId, updateData);
      
      // Redirect to view page after successful update
      router.push(`/admin/anime/${animeId}`);
    } catch (err) {
      console.error('Error updating anime:', err);
      setError('Failed to update anime. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <span className="ml-2 text-gray-400">Loading anime details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto w-full">
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
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-center text-gray-400 py-12">
          <p>Anime not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Edit Anime: {anime.title}</h2>
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 text-gray-300 shadow flex flex-col gap-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Title</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Japanese Title</label>
            <input 
              name="title_japanese" 
              value={form.title_japanese} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Synopsis</label>
          <textarea 
            name="synopsis" 
            value={form.synopsis} 
            onChange={handleChange} 
            rows={4} 
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Background History</label>
          <textarea 
            name="background_history" 
            value={form.background_history} 
            onChange={handleChange} 
            rows={3} 
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            placeholder="Additional background information or history about the anime..."
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Genres (comma separated)</label>
            <input 
              name="genre" 
              value={form.genre} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Themes (comma separated)</label>
            <input 
              name="theme" 
              value={form.theme} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Producers (comma separated)</label>
            <input 
              name="producer" 
              value={form.producer} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
        </div>

        {/* Production Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Studios (comma separated)</label>
            <input 
              name="studio" 
              value={form.studio} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Release Date</label>
            <input 
              name="released_date" 
              value={form.released_date} 
              onChange={handleChange} 
              type="date" 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Number of Episodes</label>
            <input 
              name="number_of_episodes" 
              value={form.number_of_episodes} 
              onChange={handleChange} 
              type="number" 
              min="0"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
        </div>

        {/* Status and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Status</label>
            <select 
              name="status" 
              value={form.status} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Finished Airing">Finished Airing</option>
              <option value="Currently Airing">Currently Airing</option>
              <option value="Not yet aired">Not yet aired</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Type</label>
            <select 
              name="anime_type" 
              value={form.anime_type} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="TV">TV Series</option>
              <option value="Movie">Movie</option>
              <option value="OVA">OVA</option>
              <option value="ONA">ONA</option>
              <option value="Special">Special</option>
            </select>
          </div>
        </div>

        {/* Ratings and Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Score</label>
            <input 
              name="score" 
              value={form.score} 
              onChange={handleChange} 
              type="number" 
              step="0.01"
              min="0"
              max="10"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Rating</label>
            <input 
              name="rating" 
              value={form.rating} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Popularity</label>
            <input 
              name="popularity" 
              value={form.popularity} 
              onChange={handleChange} 
              type="number"
              min="0"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Members</label>
            <input 
              name="members" 
              value={form.members} 
              onChange={handleChange} 
              type="number"
              min="0"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Poster Image URL</label>
            <input 
              name="image" 
              value={form.image} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Background Banner URL</label>
            <input 
              name="background_banner" 
              value={form.background_banner} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={saving}
            className="flex-1 py-2 rounded bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            onClick={() => router.back()}
            className="flex-1 py-2 rounded bg-gray-700 hover:bg-gray-800 text-white font-semibold text-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 