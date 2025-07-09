"use client";
import { latestAnime } from "@/lib/mockData";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { AnimeCard } from "../ui/AnimeCard";

export function LatestSection() {
  const [selectedLanguage, setSelectedLanguage] = useState<
    "sub" | "dub" | "all"
  >("all");
  const [showAll, setShowAll] = useState(false);

  // Filter anime based on selected language
  const filteredAnime = latestAnime.filter((anime) => {
    if (selectedLanguage === "all") return true;
    return anime.language.includes(selectedLanguage);
  });

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 text-3xl font-bold text-white flex-wrap gap-5">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Calendar className="h-8 w-8 text-green-500 mr-3" />
            Latest Releases
          </h2>

          {/* Sub/Dub Filter */}
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setSelectedLanguage("sub")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedLanguage === "sub"
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}>
              SUB
            </button>
            <button
              onClick={() => setSelectedLanguage("dub")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedLanguage === "dub"
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}>
              DUB
            </button>
            <button
              onClick={() => setSelectedLanguage("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedLanguage === "all"
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:text-white"
              }`}>
              ALL
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredAnime
            .slice(0, showAll ? filteredAnime.length : 5)
            .map((anime) => (
            <div key={anime.id} className="relative">
              <AnimeCard
                anime={anime}
                showPopup={true}
                className="transform transition-transform hover:scale-105"
              />
            </div>
            ))}
        </div>

        {/* View More/Less Button */}
        {filteredAnime.length > 5 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              {showAll ? "View Less" : "View More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
