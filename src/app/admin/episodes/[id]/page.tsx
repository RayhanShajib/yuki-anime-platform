"use client";

import Image from "next/image";
import Link from "next/link";

const mockEpisode = {
  id: 1,
  anime: "Attack on Titan",
  number: 1,
  title: "To You, in 2000 Years",
  video: "https://video.com/ep1.mp4",
  audio: "sub",
  quality: "1080p",
  thumbnail: "https://via.placeholder.com/300x180/1a1a1a/white?text=Ep+1",
};

export default function AdminViewEpisodePage() {
  const ep = mockEpisode;
  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{ep.anime} - Ep {ep.number}</h2>
        <div className="text-gray-400 text-sm mb-2">{ep.title}</div>
        <div className="flex gap-4 mb-4 flex-col md:flex-row">
          <div className="w-40 h-24 relative rounded overflow-hidden bg-gray-700 flex-shrink-0">
            <Image src={ep.thumbnail} alt={ep.title} fill className="object-cover" sizes="160px" />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="text-gray-300 text-sm"><span className="font-semibold">Video Link:</span> <span className="text-blue-400 underline break-all">{ep.video}</span></div>
            <div className="text-gray-300 text-sm"><span className="font-semibold">Audio:</span> <span className="capitalize px-2 py-1 rounded bg-gray-800 text-gray-200">{ep.audio}</span></div>
            <div className="text-gray-300 text-sm"><span className="font-semibold">Quality:</span> <span className="px-2 py-1 rounded bg-gray-800 text-gray-200">{ep.quality}</span></div>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Link href={`/admin/episodes/${ep.id}/edit`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm">Edit</Link>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
} 