"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const mockSectionAnime = [
  "Attack on Titan",
  "Demon Slayer",
  "Jujutsu Kaisen",
];

export default function AdminEditGridSectionPage() {
  const params = useParams();
  const router = useRouter();
  const section = params?.section || "section";
  const [animeList, setAnimeList] = useState(mockSectionAnime.join("\n"));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No real API yet
    alert("Section updated! (mock)");
  }

  function handleCancel() {
    router.push("/admin/grid");
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Edit {section.toString().replace(/\b\w/g, c => c.toUpperCase())} Section</h2>
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 text-gray-300 shadow flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Anime Titles (one per line)</label>
          <textarea
            value={animeList}
            onChange={e => setAnimeList(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="flex-1 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold text-lg transition-colors">Save</button>
          <button type="button" onClick={handleCancel} className="flex-1 py-2 rounded bg-gray-700 hover:bg-gray-800 text-white font-semibold text-lg transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
} 