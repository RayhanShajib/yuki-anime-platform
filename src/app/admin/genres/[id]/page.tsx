"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const mockGenre = { id: 1, name: "Action", count: 12, popularity: 95000 };

export default function AdminViewGenrePage() {
  const router = useRouter();
  function handleBack() {
    router.push("/admin/genres");
  }
  return (
    <div className="max-w-md mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{mockGenre.name}</h2>
        <div className="text-gray-400 text-sm mb-2">Anime Count: {mockGenre.count}</div>
        <div className="text-gray-400 text-sm mb-4">Popularity: {mockGenre.popularity.toLocaleString()}</div>
        <div className="flex gap-2 mt-6">
          <Link href={`/admin/genres/${mockGenre.id}/edit`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm">Edit</Link>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-sm">Delete</button>
          <button type="button" onClick={handleBack} className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded font-semibold text-sm">Back</button>
        </div>
      </div>
    </div>
  );
} 