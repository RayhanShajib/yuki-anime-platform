"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { mockAnime } from "@/lib/mockData";
import type { Anime } from "@/types/anime";
import "plyr-react/plyr.css";

const Plyr = dynamic(() => import("plyr-react"), { ssr: false });

export default function WatchPage() {
  const params = useParams();
  const animeId = params?.id as string;
  const anime: Anime | undefined = useMemo(() => mockAnime.find(a => a.id === animeId), [animeId]);

  // For demo, use the trailer as the video source
  const videoSrc = anime?.trailer || "https://www.w3schools.com/html/mov_bbb.mp4";

  const plyrSource = {
    type: "video" as const,
    sources: [
      {
        src: videoSrc,
        type: "video/mp4",
        size: 720,
      },
    ],
    poster: anime?.banner || anime?.poster,
    title: anime?.title,
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation />
      <main className="flex-1 flex flex-col items-center justify-center px-2 py-8">
        <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-lg p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
            {anime?.title || "Anime Player"}
          </h1>
          <div className="aspect-video w-full rounded-lg overflow-hidden mb-6">
            <Plyr source={plyrSource} options={{ controls: ["play", "progress", "current-time", "mute", "volume", "settings", "fullscreen"] }} />
          </div>
          {anime && (
            <div className="text-gray-300 text-center">
              <p className="mb-2">{anime.synopsis}</p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                {anime.genres?.map((g) => (
                  <span key={g} className="bg-gray-800 px-3 py-1 rounded-full text-green-400">{g}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <FooterSection />
    </div>
  );
} 