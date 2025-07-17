"use client";

const mockSections = [
  { key: "featured", label: "Featured Carousel", anime: ["Attack on Titan", "Demon Slayer", "Jujutsu Kaisen"] },
  { key: "trending", label: "Trending", anime: ["Jujutsu Kaisen", "Spirited Away", "Your Name"] },
  { key: "latest", label: "Latest Releases", anime: ["Weathering with You", "Howl's Moving Castle"] },
  { key: "top", label: "Top Rated", anime: ["Spirited Away", "Princess Mononoke"] },
  { key: "upcoming", label: "Upcoming", anime: ["Chainsaw Man", "Blue Lock"] },
];

import Link from "next/link";

export default function AdminGridPage() {
  return (
    <div className="max-w-4xl mx-auto w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Content Grid Management</h2>
      <div className="flex flex-col gap-6">
        {mockSections.map((section) => (
          <div key={section.key} className="bg-gray-900 rounded-xl p-6 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="font-bold text-lg text-white mb-2">{section.label}</div>
              <div className="flex flex-wrap gap-2">
                {section.anime.map((title, i) => (
                  <span key={i} className="bg-gray-800 text-green-300 px-3 py-1 rounded-full text-xs font-semibold">{title}</span>
                ))}
              </div>
            </div>
            <Link href={`/admin/grid/${section.key}/edit`} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm self-start md:self-auto">Edit Section</Link>
          </div>
        ))}
      </div>
    </div>
  );
} 