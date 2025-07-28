"use client";

import { useState } from "react";

export default function AdminAddAnimePage() {
  const [form, setForm] = useState({
    title: "",
    alternativeTitles: "",
    synopsis: "",
    genres: "",
    studio: "",
    releaseYear: "",
    status: "ongoing",
    type: "series",
    poster: "",
    banner: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No real API yet
    alert("Anime added! (mock)");
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Add New Anime</h2>
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 text-gray-300 shadow flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Title</label>
          <input name="title" value={form.title} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Alternative Titles (comma separated)</label>
          <input name="alternativeTitles" value={form.alternativeTitles} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Synopsis</label>
          <textarea name="synopsis" value={form.synopsis} onChange={handleChange} rows={3} className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Genres (comma separated)</label>
          <input name="genres" value={form.genres} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-200">Studio</label>
            <input name="studio" value={form.studio} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-200">Release Year</label>
            <input name="releaseYear" value={form.releaseYear} onChange={handleChange} type="number" className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-200">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-200">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="series">Series</option>
              <option value="movie">Movie</option>
              <option value="ova">OVA</option>
              <option value="special">Special</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-200">Poster URL</label>
            <input name="poster" value={form.poster} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-200">Banner URL</label>
            <input name="banner" value={form.banner} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
        <button type="submit" className="w-full py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold text-lg transition-colors">Add Anime</button>
      </form>
    </div>
  );
} 