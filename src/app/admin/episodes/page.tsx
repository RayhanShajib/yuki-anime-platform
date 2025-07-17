"use client";

const mockEpisodes = [
  { id: 1, anime: "Attack on Titan", number: 1, title: "To You, in 2000 Years", video: "https://video.com/ep1.mp4", audio: "sub", quality: "1080p" },
  { id: 2, anime: "Attack on Titan", number: 2, title: "That Day", video: "https://video.com/ep2.mp4", audio: "dub", quality: "720p" },
  { id: 3, anime: "Demon Slayer", number: 1, title: "Cruelty", video: "https://video.com/ep1.mp4", audio: "sub", quality: "1080p" },
];

import Link from "next/link";

export default function AdminEpisodesPage() {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Episode Management</h2>
        <Link href="/admin/episodes/add" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-sm">Add Episode</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden text-left text-sm md:text-base">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-3">Anime</th>
              <th className="p-3">Ep #</th>
              <th className="p-3">Title</th>
              <th className="p-3">Video Link</th>
              <th className="p-3">Audio</th>
              <th className="p-3">Quality</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockEpisodes.map((ep) => (
              <tr key={ep.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors">
                <td className="p-3">{ep.anime}</td>
                <td className="p-3">{ep.number}</td>
                <td className="p-3 max-w-[180px] truncate">{ep.title}</td>
                <td className="p-3 max-w-[120px] truncate text-blue-400 underline cursor-pointer">{ep.video}</td>
                <td className="p-3 capitalize">{ep.audio}</td>
                <td className="p-3">{ep.quality}</td>
                <td className="p-3 flex gap-2 flex-wrap">
                  <Link href={`/admin/episodes/${ep.id}`} className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs">View</Link>
                  <Link href={`/admin/episodes/${ep.id}/edit`} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</Link>
                  <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mobile card layout */}
        <div className="md:hidden flex flex-col gap-4 mt-4">
          {mockEpisodes.map((ep) => (
            <div key={ep.id} className="bg-gray-900 rounded-xl p-4 flex flex-col gap-2 shadow">
              <div className="font-bold text-white text-lg">{ep.anime} - Ep {ep.number}</div>
              <div className="text-gray-400 text-xs mb-1">{ep.title}</div>
              <div className="text-blue-400 text-xs truncate">{ep.video}</div>
              <div className="flex gap-2 text-xs mt-1">
                <span className="capitalize px-2 py-1 rounded bg-gray-800 text-gray-200">{ep.audio}</span>
                <span className="px-2 py-1 rounded bg-gray-800 text-gray-200">{ep.quality}</span>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Link href={`/admin/episodes/${ep.id}`} className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs">View</Link>
                <Link href={`/admin/episodes/${ep.id}/edit`} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</Link>
                <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 