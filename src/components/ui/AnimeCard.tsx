"use client";

import { cn, formatRating, generateSlug, truncateText } from "@/lib/utils";
import { Anime } from "@/types/anime";
import { Info, Play, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface AnimeCardProps {
  anime: Anime;
  showPopup?: boolean;
  className?: string;
}

export function AnimeCard({ anime, className }: AnimeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Auto-close popup when mouse leaves the card area
    if (showPopup) {
      hoverTimeoutRef.current = setTimeout(() => {
        handleClosePopup();
      }, 500); // 500ms delay before auto-close
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPopup(true);
    // Small delay to ensure DOM is ready for animation
    setTimeout(() => {
      setIsAnimating(true);
    }, 10);

    // Set auto-close timeout (optional - 10 seconds of inactivity)
    autoCloseTimeoutRef.current = setTimeout(() => {
      handleClosePopup();
    }, 10000); // 10 seconds auto-close
  };

  const handleClosePopup = () => {
    setIsAnimating(false);

    // Clear all timeouts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
      autoCloseTimeoutRef.current = null;
    }

    // Wait for animation to complete before hiding
    setTimeout(() => {
      setShowPopup(false);
    }, 300);
  };

  const animeSlug = generateSlug(anime.title);

  // Reset animation state when popup closes
  useEffect(() => {
    if (!showPopup) {
      setIsAnimating(false);
    }
  }, [showPopup]);

  // Handle escape key and click outside
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showPopup) {
        handleClosePopup();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        showPopup
      ) {
        handleClosePopup();
      }
    };

    if (showPopup) {
      document.addEventListener("keydown", handleEscapeKey);
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showPopup]);

  // Reset auto-close timeout on popup interaction
  const handlePopupInteraction = () => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
      autoCloseTimeoutRef.current = setTimeout(() => {
        handleClosePopup();
      }, 10000); // Reset 10 seconds timer
    }
  };

  // Prevent auto-close when hovering over popup
  const handlePopupMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  return (
    <>
      <div
        className={cn("relative group", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <div className="relative overflow-hidden rounded-xl bg-gray-800 transition-all duration-300 hover-scale slider">
          <Link href={`/anime/${anime.id}/${animeSlug}`}>
            <div className="relative aspect-[2/3]">
              <Image
                src={anime.poster}
                alt={anime.title}
                width={340}
                height={240}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              <div
                className={cn(
                  "absolute inset-0 bg-black/60 flex flex-col items-center justify-end transition-opacity duration-300 p-3",
                  isHovered ? "opacity-100" : "opacity-0"
                )}>
                <div className="text-center mb-4">
                  <p className="text-gray-200 text-sm">
                    {anime.type} • {anime.releaseYear}
                  </p>
                  <h3 className="text-white font-bold text-lg leading-tight mb-2">
                    {truncateText(anime.title, 50)}
                  </h3>
                </div>
                {/* <Play className="h-8 w-8 text-white" /> */}
              </div>

              <div className="absolute top-2 right-2 flex items-center space-x-1 justify-between w-[90%]">
                <div className="flex items-center space-x-1 bg-black/70 px-2 py-1 rounded">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-white text-xs font-semibold">
                    {formatRating(anime.rating)}
                  </span>
                </div>

                {isHovered && (
                  <div className="relative">
                    <button
                      className="bg-black/70 p-1 rounded-full hover:bg-black/90 transition-colors"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      onClick={handleInfoClick}>
                      <Info className="h-5 w-5 text-white" />
                    </button>

                    {showTooltip && (
                      <div className="absolute top-full right-0 mt-1 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                        More info
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div
          ref={popupRef}
          className={cn(
            "absolute top-0 left-10 md:left-0 w-[80vw] md:w-[400px] bg-transparent rounded-xl shadow-2xl overflow-hidden z-50",
            "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            isAnimating
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-90 translate-y-4"
          )}
          onMouseEnter={handlePopupMouseEnter}
          onMouseMove={handlePopupInteraction}
          onClick={handleClosePopup}>
          <div
            className={cn(
              "bg-gray-900 rounded-2xl w-full overflow-y-auto transform",
              "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              isAnimating
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-95 opacity-0 translate-y-2"
            )}
            onClick={(e) => e.stopPropagation()}>
            {/* Trailer Section */}
            <div className="relative aspect-video bg-black rounded-t-2xl overflow-hidden">
              {anime.trailer ? (
                <iframe
                  src={anime.trailer}
                  title={`${anime.title} Trailer`}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No trailer available</p>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={handleClosePopup}
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 p-2 rounded-full transition-colors"
                aria-label="Close">
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Content Section */}
            <div className="p-6">
              {/* Title and Rating */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {anime.title}
                  </h2>
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1">
                        <span>SUB</span>
                      </button>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1">
                        <span>DUB</span>
                      </button>
                      <div className="space-y-1 text-sm text-gray-400">
                        <p>
                          <span className="text-white">Episodes:</span>{" "}
                          {anime.totalEpisodes || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {anime.genres && anime.genres.length > 0 ? (
                        anime.genres.map((genre, index) => (
                          <span
                            key={index}
                            className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                            {genre}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No genres available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-300 leading-relaxed">
                  {anime.synopsis || "No description available for this anime."}
                </p>
              </div>

              {/* Watch Now Button */}
              <div className="flex items-center space-x-3">
                <Link
                  href={`/anime/${anime.id}/${animeSlug}`}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full font-semibold flex items-center space-x-2 transition-colors"
                  onClick={handleClosePopup}>
                  <Play className="h-5 w-5" />
                </Link>

                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors"
                  title="Add to Bookmarks"
                  onClick={(e) => e.stopPropagation()}>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>

                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition-colors"
                  title="More Info"
                  onClick={(e) => e.stopPropagation()}>
                  <Info className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
