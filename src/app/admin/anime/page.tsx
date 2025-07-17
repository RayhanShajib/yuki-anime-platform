"use client";

import { mockAnime } from "@/lib/mockData";
import Image from "next/image";
import Link from "next/link";

export default function AdminAnimePage() {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Anime Management</h2>
        <Link href="/admin/anime/add" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-sm whitespace-nowrap">+ Add Anime</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden text-left text-sm md:text-base">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-3">Poster</th>
              <th className="p-3">Title</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Studio</th>
              <th className="p-3">Year</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockAnime.map((anime) => (
              <tr key={anime.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors">
                <td className="p-3">
                  <div className="w-12 h-16 relative rounded overflow-hidden bg-gray-700">
                    <Image src={anime.poster} alt={anime.title} fill className="object-cover" sizes="48px" />
                  </div>
                </td>
                <td className="p-3 font-semibold text-white max-w-[180px] truncate">{anime.title}</td>
                <td className="p-3 capitalize">{anime.type}</td>
                <td className="p-3 capitalize">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${anime.status === "completed" ? "bg-green-700 text-green-200" : "bg-yellow-700 text-yellow-200"}`}>{anime.status}</span>
                </td>
                <td className="p-3">{anime.studio}</td>
                <td className="p-3">{anime.releaseYear}</td>
                <td className="p-3">{anime.rating}</td>
                <td className="p-3 flex gap-2 flex-wrap">
                  <Link href={`/admin/anime/${anime.id}`} className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs">View</Link>
                  <Link href={`/admin/anime/${anime.id}/edit`} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</Link>
                  <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mobile card layout */}
        <div className="md:hidden flex flex-col gap-4 mt-4">
          {mockAnime.map((anime) => (
            <div key={anime.id} className="bg-gray-900 rounded-xl p-4 flex gap-4 shadow">
              <div className="w-20 h-28 relative rounded overflow-hidden bg-gray-700 flex-shrink-0">
                <Image src={anime.poster} alt={anime.title} fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="font-bold text-white text-lg">{anime.title}</div>
                <div className="text-gray-400 text-xs mb-1">{anime.studio} • {anime.releaseYear}</div>
                <div className="flex gap-2 text-xs mb-1">
                  <span className="capitalize px-2 py-1 rounded bg-gray-800 text-gray-200">{anime.type}</span>
                  <span className={`capitalize px-2 py-1 rounded font-bold ${anime.status === "completed" ? "bg-green-700 text-green-200" : "bg-yellow-700 text-yellow-200"}`}>{anime.status}</span>
                </div>
                <div className="text-yellow-400 font-bold">⭐ {anime.rating}</div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <Link href={`/admin/anime/${anime.id}`} className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs">View</Link>
                  <Link href={`/admin/anime/${anime.id}/edit`} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</Link>
                  <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 