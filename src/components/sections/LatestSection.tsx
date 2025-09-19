"use client";
import { latestAnime } from "@/lib/mockData";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation as SwiperNavigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { AnimeCard } from "../ui/AnimeCard";

export function LatestSection() {
  const [selectedLanguage, setSelectedLanguage] = useState<
    "sub" | "dub" | "all"
  >("all");
  // Filter anime based on selected language
  const filteredAnime = latestAnime.filter((anime) => {
    if (selectedLanguage === "all") return true;
    return anime.language.includes(selectedLanguage);
  });

  return (
    <section className="py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10 text-3xl font-bold text-white flex-wrap gap-5">
          <h2 className="text-3xl font-bold text-white flex items-center txt-heading">
            <Calendar className="h-8 w-8 text-[#F5B9D4] mr-3" />
            Latest Releases
          </h2>

          {/* Sub/Dub Filter */}
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setSelectedLanguage("sub")}
              className={`px-2 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                selectedLanguage === "sub"
                  ? "btn-purple text-white/90"
                  : "text-gray-300 hover:text-white"
              }`}>
              SUB
            </button>
            <button
              onClick={() => setSelectedLanguage("dub")}
              className={`px-2 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                selectedLanguage === "dub"
                  ? "btn-purple text-white/90"
                  : "text-gray-300 hover:text-white"
              }`}>
              DUB
            </button>
            <button
              onClick={() => setSelectedLanguage("all")}
              className={`px-2 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                selectedLanguage === "all"
                  ? "btn-purple text-white/90"
                  : "text-gray-300 hover:text-white"
              }`}>
              ALL
            </button>
          </div>
        </div>

        {/* Latest Releases Slider */}
        <Swiper
          modules={[SwiperNavigation]}
          navigation={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 6,
              spaceBetween: 25,
            },
            1280: {
              slidesPerView: 8,
              spaceBetween: 30,
            },
            1536: {
              slidesPerView: 8,
              spaceBetween: 30,
            },
          }}
          className="!pb-10 relations-swiper">
          {filteredAnime.map((anime) => (
            <SwiperSlide key={anime.id}>
              <div className="relative">
                <AnimeCard anime={anime} showPopup={true} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex justify-center mt-5">
          <Link
            href={"/latest"}
            className="px-4 py-2 text-white/90 rounded-lg font-medium transition-colors btn-purple">
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}
