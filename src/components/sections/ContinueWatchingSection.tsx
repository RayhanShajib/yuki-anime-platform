"use client";

import { Play, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  getContinueWatchingItems, 
  removeFromHistory, 
  formatTime,
  type WatchHistoryItem 
} from "@/lib/watchHistory";

export function ContinueWatchingSection() {
  const [continueWatchingItems, setContinueWatchingItems] = useState<WatchHistoryItem[]>([]);
  
  // Load watch history on component mount
  useEffect(() => {
    const loadWatchHistory = () => {
      const items = getContinueWatchingItems();
      setContinueWatchingItems(items);
    };
    
    loadWatchHistory();
    
    // Set up an interval to refresh the data periodically
    const interval = setInterval(loadWatchHistory, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Handle removing an item from watch history
  const handleRemoveItem = (episodeId: string, audioType: 'sub' | 'dub') => {
    removeFromHistory(episodeId, audioType);
    // Update the local state immediately
    setContinueWatchingItems(prev => 
      prev.filter(item => !(item.episodeId === episodeId && item.audioType === audioType))
    );
  };

  // Don't render if no items
  if (continueWatchingItems.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Play className="h-8 w-8 text-[#F5B9D4] mr-3" />
            Continue Watching
          </h2>

          <Link
            href="/continue-watching"
            className="text-pink hover:text-blue-300 transition-colors font-medium">
            View All ({continueWatchingItems.length})
          </Link>
        </div>

        {/* Continue Watching Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-7 gap-2 sm:gap-3 lg:gap-7">
          {continueWatchingItems.map((item) => (
            <div key={`${item.episodeId}-${item.audioType}`} className="relative group">
              <div className="relative overflow-hidden rounded-xl bg-gray-800 transition-all duration-300 group-hover:scale-95">
                <Link href={`/watch/${item.episodeId}`}>
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={item.poster || "https://picsum.photos/340/510?random=1"}
                      alt={item.animeTitle}
                      width={340}
                      height={510}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button 
                      className="absolute top-2 right-2 z-20 p-1 bg-black/70 hover:bg-black/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveItem(item.episodeId, item.audioType);
                      }}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>

                    {/* Episode Info and Audio Type */}
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      <div className="bg-black/70 px-2 py-1 rounded text-xs text-white font-semibold">
                        EP {item.episodeNumber}
                      </div>
                      <div className="bg-purple-600/70 px-2 py-1 rounded text-xs text-white font-semibold uppercase">
                        {item.audioType}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Bottom info bar: like AnimeCard */}
              <div className="w-full py-1 flex flex-col gap-1 mt-1">
                <h3 className="text-white font-bold text-base leading-tight">
                  {item.animeTitle.length > 40
                    ? item.animeTitle.substring(0, 40) + "..."
                    : item.animeTitle}
                </h3>

                {/* Time Progress */}
                <div className="flex items-center justify-between text-xs text-gray-300 mt-1">
                  <span>
                    {formatTime(item.currentTime)}/{formatTime(item.totalTime)}
                  </span>
                  <span className="text-green-400 font-medium">
                    {Math.round(item.progress)}%
                  </span>
                </div>

                {/* Progress Bar - positioned below time */}
                <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300 rounded-full"
                    style={{ width: `${Math.min(item.progress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
