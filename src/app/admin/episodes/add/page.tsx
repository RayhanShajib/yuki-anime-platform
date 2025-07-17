"use client";

import { useState } from "react";

export default function AdminAddEpisodePage() {
  const [form, setForm] = useState({
    anime: "",
    number: "",
    title: "",
    video: "",
    audio: "sub",
    quality: "1080p",
    thumbnail: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No real API yet
    alert("Episode added! (mock)");
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Add New Episode</h2>
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 text-gray-300 shadow flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Anime Title</label>
          <input name="anime" value={form.anime} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-200">Episode Number</label>
            <input name="number" value={form.number} onChange={handleChange} type="number" required className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-200">Episode Title</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Video Link</label>
          <input name="video" value={form.video} onChange={handleChange} required className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-200">Audio Type</label>
            <select name="audio" value={form.audio} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="sub">Subtitled</option>
              <option value="dub">Dubbed</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-200">Quality</label>
            <input name="quality" value={form.quality} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Thumbnail URL</label>
          <input name="thumbnail" value={form.thumbnail} onChange={handleChange} className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <button type="submit" className="w-full py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold text-lg transition-colors">Add Episode</button>
      </form>
    </div>
  );
} 