'use client';

import { Play, X } from 'lucide-react';
import Link from 'next/link';
import { Anime, UserProgress } from '@/types/anime';
import { truncateText } from '@/lib/utils';

interface ContinueWatchingItem extends Anime {
  progress: UserProgress;
}

interface ContinueWatchingSectionProps {
  continueWatching: ContinueWatchingItem[];
  onRemove?: (animeId: string) => void;
}

export function ContinueWatchingSection({ 
  continueWatching, 
  onRemove 
}: ContinueWatchingSectionProps) {
  if (continueWatching.length === 0) {
    return null; // Don't render section if no continue watching items
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Play className="h-8 w-8 text-green-500 mr-3" />
            Continue Watching
          </h2>
          
          <Link 
            href="/continue-watching"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            View All
          </Link>
        </div>

        {/* Continue Watching Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {continueWatching.map((item) => {
            const progressPercentage = (item.progress.timestamp / 1500) * 100; // Assuming 25min episodes
            
            return (
              <div 
                key={item.id} 
                className="relative group bg-gray-800 rounded-lg overflow-hidden hover-scale"
              >
                {/* Remove Button */}
                {onRemove && (
                  <button
                    onClick={() => onRemove(item.id)}
                    className="absolute top-2 right-2 z-20 p-1 bg-black/70 hover:bg-black/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                )}

                <Link href={`/watch/${item.id}?ep=${item.progress.episodeNumber}&t=${item.progress.timestamp}`}>
                  <div className="relative aspect-video">
                    <img
                      src={item.banner || item.poster}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>

                    {/* Episode Info */}
                    <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-semibold">
                      EP {item.progress.episodeNumber}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 leading-tight">
                      {truncateText(item.title, 50)}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Episode {item.progress.episodeNumber}</span>
                      <span>{Math.round(progressPercentage)}% watched</span>
                    </div>
                    
                    {/* Time Remaining */}
                    <div className="mt-2 text-xs text-gray-500">
                      {progressPercentage < 90 ? (
                        <span>Continue watching</span>
                      ) : (
                        <span>Almost finished</span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Show placeholder for better UX */}
        {continueWatching.length < 4 && (
          <div className="mt-6 p-8 border-2 border-dashed border-gray-700 rounded-lg text-center">
            <Play className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-gray-400 font-medium mb-2">Start watching anime</h3>
            <p className="text-gray-500 text-sm">
              Your progress will appear here so you can easily continue where you left off
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
