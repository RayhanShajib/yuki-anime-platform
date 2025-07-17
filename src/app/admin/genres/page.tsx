"use client";

const mockGenres = [
  { id: 1, name: "Action", count: 12, popularity: 95000 },
  { id: 2, name: "Romance", count: 8, popularity: 70000 },
  { id: 3, name: "Fantasy", count: 10, popularity: 85000 },
  { id: 4, name: "Drama", count: 7, popularity: 60000 },
];

import Link from "next/link";

export default function AdminGenresPage() {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Genre Management</h2>
        <Link href="/admin/genres/add" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-sm">Add Genre</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-xl overflow-hidden text-left text-sm md:text-base">
          <thead className="bg-gray-800 text-gray-200">
            <tr>
              <th className="p-3">Genre</th>
              <th className="p-3">Anime Count</th>
              <th className="p-3">Popularity</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockGenres.map((genre) => (
              <tr key={genre.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors">
                <td className="p-3 font-semibold text-white">{genre.name}</td>
                <td className="p-3">{genre.count}</td>
                <td className="p-3">{genre.popularity.toLocaleString()}</td>
                <td className="p-3 flex gap-2 flex-wrap">
                  <Link href={`/admin/genres/${genre.id}`} className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs">View</Link>
                  <Link href={`/admin/genres/${genre.id}/edit`} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</Link>
                  <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Mobile card layout */}
        <div className="md:hidden flex flex-col gap-4 mt-4">
          {mockGenres.map((genre) => (
            <div key={genre.id} className="bg-gray-900 rounded-xl p-4 flex flex-col gap-2 shadow">
              <div className="font-bold text-white text-lg">{genre.name}</div>
              <div className="text-gray-400 text-xs mb-1">Anime Count: {genre.count}</div>
              <div className="text-gray-400 text-xs mb-1">Popularity: {genre.popularity.toLocaleString()}</div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Link href={`/admin/genres/${genre.id}`} className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs">View</Link>
                <Link href={`/admin/genres/${genre.id}/edit`} className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</Link>
                <button className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 