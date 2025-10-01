"use client";

import { Anime } from "@/types/anime";
import { useEffect, useRef, useState } from "react";

interface AnimeTooltipProps {
  anime: Anime;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export function AnimeTooltip({
  anime,
  children,
  position = "right",
}: AnimeTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && containerRef.current && tooltipRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = 0;
      let left = 0;

      // Calculate position based on available space
      switch (position) {
        case "right":
          left = containerRect.right + 10;
          top =
            containerRect.top + (containerRect.height - tooltipRect.height) / 2;

          // Adjust if tooltip goes off-screen
          if (left + tooltipRect.width > viewportWidth) {
            left = containerRect.left - tooltipRect.width - 10;
          }
          break;
        case "left":
          left = containerRect.left - tooltipRect.width - 10;
          top =
            containerRect.top + (containerRect.height - tooltipRect.height) / 2;

          if (left < 0) {
            left = containerRect.right + 10;
          }
          break;
        case "top":
          left =
            containerRect.left + (containerRect.width - tooltipRect.width) / 2;
          top = containerRect.top - tooltipRect.height - 10;

          if (top < 0) {
            top = containerRect.bottom + 10;
          }
          break;
        case "bottom":
          left =
            containerRect.left + (containerRect.width - tooltipRect.width) / 2;
          top = containerRect.bottom + 10;

          if (top + tooltipRect.height > viewportHeight) {
            top = containerRect.top - tooltipRect.height - 10;
          }
          break;
      }

      // Final boundary checks
      if (left < 10) left = 10;
      if (left + tooltipRect.width > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width - 10;
      }
      if (top < 10) top = 10;
      if (top + tooltipRect.height > viewportHeight - 10) {
        top = viewportHeight - tooltipRect.height - 10;
      }

      setTooltipStyle({
        position: "fixed",
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 1000,
      });
    }
  }, [isVisible, position]);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative inline-block">
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          style={tooltipStyle}
          className="bg-purple border border-gray-700 rounded-lg p-4 shadow-xl max-w-sm z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          <div className="space-y-2">
            <h4 className="font-semibold text-white text-sm">{anime.title}</h4>

            <div className="text-xs text-gray-300 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">⭐</span>
                <span>{anime.rating}/10</span>
                <span className="text-gray-500">•</span>
                <span>{anime.releaseYear}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-blue-400">📺</span>
                <span className="capitalize">{anime.type}</span>
                {anime.totalEpisodes && (
                  <>
                    <span className="text-gray-500">•</span>
                    <span>{anime.totalEpisodes} eps</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-green-400">🎬</span>
                <span>{anime.studio}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-purple-400">📊</span>
                <span className="capitalize">{anime.status}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {anime.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-gray-700 text-xs rounded-full text-gray-300">
                  {genre}
                </span>
              ))}
              {anime.genres.length > 3 && (
                <span className="px-2 py-1 bg-gray-700 text-xs rounded-full text-gray-300">
                  +{anime.genres.length - 3}
                </span>
              )}
            </div>

            {anime.synopsis && (
              <p className="text-xs text-gray-400 mt-2 line-clamp-3">
                {anime.synopsis.length > 150
                  ? `${anime.synopsis.substring(0, 150)}...`
                  : anime.synopsis}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
