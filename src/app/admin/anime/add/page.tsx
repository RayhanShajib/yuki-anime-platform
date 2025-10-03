"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { adminApi, CreateAnimeData } from "@/lib/api/adminApi";
import { Loader2 } from "lucide-react";

interface CreateForm {
  title: string;
  title_japanese: string;
  synopsis: string;
  background_history: string;
  genre: string;
  theme: string;
  producer: string;
  studio: string;
  titles: string;
  mal_id: string;
  anime_type: string;
  source: string;
  number_of_episodes: string;
  status: string;
  airing: string;
  aired: string;
  score: string;
  scored_by: string;
  rank: string;
  rating: string;
  popularity: string;
  members: string;
  favourites: string;
  trailer_yt_id: string;
  image: string;
  background_banner: string;
  related_animes: string;
}

export default function AdminAddAnimePage() {
  const router = useRouter();
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState<CreateForm>({
    title: "",
    title_japanese: "",
    synopsis: "",
    background_history: "",
    genre: "",
    theme: "",
    producer: "",
    studio: "",
    titles: "",
    mal_id: "",
    anime_type: "",
    source: "",
    number_of_episodes: "",
    status: "",
    airing: "",
    aired: "",
    score: "",
    scored_by: "",
    rank: "",
    rating: "",
    popularity: "",
    members: "",
    favourites: "",
    trailer_yt_id: "",
    image: "",
    background_banner: "",
    related_animes: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Transform form data to match API format
      const createData: CreateAnimeData = {
        title: form.title, // Required field
        title_japanese: form.title_japanese || null,
        synopsis: form.synopsis || null,
        // Convert comma-separated strings to array format with objects
        genre: form.genre ? form.genre.split(',').map(name => ({ name: name.trim() })) : [],
        theme: form.theme ? form.theme.split(',').map(name => ({ name: name.trim() })) : [],
        producer: form.producer ? form.producer.split(',').map(name => ({ name: name.trim() })) : [],
        studio: form.studio ? form.studio.split(',').map(name => ({ name: name.trim() })) : [],
        titles: form.titles ? form.titles.split(',').map(title => ({ title: title.trim() })) : [],
        related_animes: form.related_animes ? form.related_animes.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [],
        mal_id: form.mal_id ? parseInt(form.mal_id) : undefined,
        anime_type: form.anime_type || null,
        source: form.source || null,
        number_of_episodes: form.number_of_episodes ? parseInt(form.number_of_episodes) : null,
        status: form.status || null,
        airing: form.airing ? form.airing === 'true' : null,
        aired: form.aired || null,
        score: form.score ? parseFloat(form.score) : 0,
        scored_by: form.scored_by ? parseInt(form.scored_by) : 0,
        rank: form.rank ? parseInt(form.rank) : null,
        rating: form.rating || null,
        popularity: form.popularity ? parseInt(form.popularity) : null,
        members: form.members ? parseInt(form.members) : null,
        favourites: form.favourites ? parseInt(form.favourites) : null,
        trailer_yt_id: form.trailer_yt_id || null,
        image: form.image || null,
        background_banner: form.background_banner || null,
      };

      // Remove undefined fields
      Object.keys(createData).forEach(key => {
        const value = createData[key as keyof CreateAnimeData];
        if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
          delete createData[key as keyof CreateAnimeData];
        }
      });

      const newAnime = await adminApi.createAnime(createData);
      
      // Redirect to the newly created anime's view page
      router.push(`/admin/anime/${newAnime.id}`);
    } catch (err) {
      console.error('Error creating anime:', err);
      setError('Failed to create anime. Please check your input and try again.');
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-center mb-6">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Add New Anime</h2>
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 text-gray-300 shadow flex flex-col gap-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Title *</label>
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
            placeholder="Additional background information or history..."
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Genres (comma separated)</label>
            <input 
              name="genre" 
              value={form.genre} 
              onChange={handleChange} 
              placeholder="Action, Drama, Fantasy"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Themes (comma separated)</label>
            <input 
              name="theme" 
              value={form.theme} 
              onChange={handleChange} 
              placeholder="School, Supernatural, Romance"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Producers (comma separated)</label>
            <input 
              name="producer" 
              value={form.producer} 
              onChange={handleChange} 
              placeholder="Producer 1, Producer 2"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Studios (comma separated)</label>
            <input 
              name="studio" 
              value={form.studio} 
              onChange={handleChange} 
              placeholder="Studio Mappa, Wit Studio"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Alternative Titles (comma separated)</label>
            <input 
              name="titles" 
              value={form.titles} 
              onChange={handleChange} 
              placeholder="Title 1, Title 2"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">MyAnimeList ID</label>
            <input 
              name="mal_id" 
              value={form.mal_id} 
              onChange={handleChange} 
              type="number"
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Status</label>
            <select 
              name="status" 
              value={form.status} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Status</option>
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
              <option value="">Select Type</option>
              <option value="TV">TV Series</option>
              <option value="Movie">Movie</option>
              <option value="OVA">OVA</option>
              <option value="ONA">ONA</option>
              <option value="Special">Special</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Source</label>
            <input 
              name="source" 
              value={form.source} 
              onChange={handleChange} 
              placeholder="Manga, Light Novel, Original"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Rating</label>
            <input 
              name="rating" 
              value={form.rating} 
              onChange={handleChange} 
              placeholder="PG-13, R+"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
        </div>

        {/* Statistics */}
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
            <label className="block text-sm font-medium mb-2 text-gray-200">Scored By</label>
            <input 
              name="scored_by" 
              value={form.scored_by} 
              onChange={handleChange} 
              type="number"
              min="0"
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

        {/* Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Trailer YouTube ID</label>
            <input 
              name="trailer_yt_id" 
              value={form.trailer_yt_id} 
              onChange={handleChange} 
              placeholder="dQw4w9WgXcQ"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Related Anime IDs (comma separated)</label>
            <input 
              name="related_animes" 
              value={form.related_animes} 
              onChange={handleChange} 
              placeholder="123, 456, 789"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Poster Image URL</label>
            <input 
              name="image" 
              value={form.image} 
              onChange={handleChange} 
              placeholder="https://example.com/poster.jpg"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Background Banner URL</label>
            <input 
              name="background_banner" 
              value={form.background_banner} 
              onChange={handleChange} 
              placeholder="https://example.com/banner.jpg"
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={saving || !form.title}
            className="flex-1 py-2 rounded bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? 'Creating...' : 'Create Anime'}
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