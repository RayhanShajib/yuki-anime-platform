"use client";
import { latestAnime } from "@/lib/mockData";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimeCard } from "../ui/AnimeCard";
import Link from "next/link";

export function LatestSection() {
  const [selectedLanguage, setSelectedLanguage] = useState<
    "sub" | "dub" | "all"
  >("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardsPerView, setCardsPerView] = useState(4);

  // Filter anime based on selected language
  const filteredAnime = latestAnime.filter((anime) => {
    if (selectedLanguage === "all") return true;
    return anime.language.includes(selectedLanguage);
  });

  useEffect(() => {
    const updateCardsPerView = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const cardWidth = 170;
        const gap = 25;
        const buttonSpace = window.innerWidth >= 768 ? 80 : 64;
        const availableWidth = containerWidth - buttonSpace;
        const maxCards = Math.floor((availableWidth + gap) / (cardWidth + gap));
        setCardsPerView(Math.min(maxCards, filteredAnime.length));
      }
    };
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, [filteredAnime.length]);

  const maxIndex = Math.max(0, filteredAnime.length - cardsPerView);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < maxIndex;

  const goToPrev = () => {
    if (canGoPrev) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const goToNext = () => {
    if (canGoNext) {
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    }
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 text-3xl font-bold text-white flex-wrap gap-5">
          <h2 className="text-3xl font-bold text-white flex items-center txt-heading">
            <Calendar className="h-8 w-8 text-blue-600 mr-3" />
            Latest Releases
          </h2>

          {/* Sub/Dub Filter */}
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setSelectedLanguage("sub")}
              className={`px-2 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                selectedLanguage === "sub"
                  ? "bg-blue-600 text-white/90"
                  : "text-gray-300 hover:text-white"
              }`}>
              SUB
            </button>
            <button
              onClick={() => setSelectedLanguage("dub")}
              className={`px-2 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                selectedLanguage === "dub"
                  ? "bg-blue-600 text-white/90"
                  : "text-gray-300 hover:text-white"
              }`}>
              DUB
            </button>
            <button
              onClick={() => setSelectedLanguage("all")}
              className={`px-2 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                selectedLanguage === "all"
                  ? "bg-blue-600 text-white/90"
                  : "text-gray-300 hover:text-white"
              }`}>
              ALL
            </button>
          </div>
        </div>

        {/* Latest Releases Slider */}
        <div className="relative" ref={containerRef}>
          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            disabled={!canGoPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all duration-200 group w-8 h-full md:w-15 md:h-full ${
              canGoPrev
                ? "text-white hover:text-blue-600"
                : "text-gray-500 cursor-not-allowed"
            }`}>
            <ChevronLeft className="h-30 w-40 md:h-30 md:w-40 group-hover:text-blue-600" />
          </button>
          <button
            onClick={goToNext}
            disabled={!canGoNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all duration-200 group w-8 h-full md:w-15 md:h-full ${
              canGoNext
                ? "text-white hover:text-blue-600"
                : "text-gray-500 cursor-not-allowed"
            }`}>
            <ChevronRight className="h-30 w-40 md:h-30 md:w-40 group-hover:text-blue-600" />
          </button>
          {/* Cards Container */}
          <div className="overflow-x-clip">
            <div
              className="flex transition-transform duration-300 ease-in-out h-auto"
              style={{
                transform: `translateX(-${currentIndex * 150}px)`,
                gap: "20px",
                height: "auto",
              }}>
              {filteredAnime.map((anime) => (
                <div
                  key={anime.id}
                  className="flex-shrink-0 overflow-visible relative"
                  style={{ width: "170px" }}>
                  <AnimeCard
                    anime={anime}
                    showPopup={true}
                    className="h-auto overflow-visible"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Link
            href={"/latest"}
            className="px-4 py-2 bg-blue-600 text-white/90 rounded-lg font-medium hover:bg-green-700 transition-colors">
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}
