"use client";

import Image from "next/image";
import Link from "next/link";

const mockAnime = {
  id: "1",
  title: "Attack on Titan",
  alternativeTitles: ["Shingeki no Kyojin", "AOT"],
  synopsis: "The final battle for humanity begins as Eren Yeager leads the Survey Corps in their ultimate mission to save what remains of mankind.",
  genres: ["Action", "Drama", "Fantasy", "Military"],
  studio: "Studio Mappa",
  releaseYear: 2023,
  status: "completed",
  type: "series",
  poster: "https://via.placeholder.com/300x450/1a1a1a/white?text=Attack+on+Titan",
  banner: "https://via.placeholder.com/1920x1080/1a1a1a/white?text=AOT+Banner",
};

export default function AdminViewAnimePage() {
  const anime = mockAnime;
  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{anime.title}</h2>
        <div className="text-gray-400 text-sm mb-2">{anime.alternativeTitles.join(", ")}</div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {anime.genres.map((g) => (
            <span key={g} className="bg-gray-800 text-green-300 px-3 py-1 rounded-full text-xs font-semibold">{g}</span>
          ))}
        </div>
        <div className="flex gap-4 mb-4 flex-col md:flex-row">
          <div className="w-32 h-48 relative rounded overflow-hidden bg-gray-700 flex-shrink-0">
            <Image src={anime.poster} alt={anime.title} fill className="object-cover" sizes="128px" />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-gray-300 text-sm"><span className="font-semibold">Studio:</span> {anime.studio}</div>
            <div className="text-gray-300 text-sm"><span className="font-semibold">Release Year:</span> {anime.releaseYear}</div>
            <div className="text-gray-300 text-sm"><span className="font-semibold">Status:</span> <span className={`capitalize px-2 py-1 rounded text-xs font-bold ${anime.status === "completed" ? "bg-green-700 text-green-200" : "bg-yellow-700 text-yellow-200"}`}>{anime.status}</span></div>
            <div className="text-gray-300 text-sm"><span className="font-semibold">Type:</span> <span className="capitalize px-2 py-1 rounded bg-gray-800 text-gray-200">{anime.type}</span></div>
          </div>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-white mb-1">Synopsis</div>
          <div className="text-gray-300 text-sm">{anime.synopsis}</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold text-white mb-1">Banner</div>
          <div className="w-full h-40 relative rounded overflow-hidden bg-gray-700">
            <Image src={anime.banner} alt={anime.title + " banner"} fill className="object-cover" sizes="100vw" />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Link href={`/admin/anime/${anime.id}/edit`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm">Edit</Link>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
} 