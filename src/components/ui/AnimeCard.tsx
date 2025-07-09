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
  const [justOpened, setJustOpened] = useState(false);
  const [popupPosition, setPopupPosition] = useState<
    "right" | "left" | "center"
  >("right");
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  // Handle card click for touch devices
  const handleCardClick = (e: React.MouseEvent) => {
    // Check if it's a touch device or mobile/tablet
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isMobileOrTablet = window.innerWidth <= 1024; // Include tablets

    if ((isTouchDevice || isMobileOrTablet) && !showPopup) {
      e.preventDefault();
      e.stopPropagation();

      // Calculate positioning before showing popup
      calculatePopupPosition();

      setShowPopup(true);
      setJustOpened(true);

      setTimeout(() => {
        setIsAnimating(true);
      }, 10);

      // Clear the "just opened" flag after a delay to prevent immediate closing
      setTimeout(() => {
        setJustOpened(false);
      }, 500);
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Calculate smart positioning
    calculatePopupPosition();

    setShowPopup(true);
    setJustOpened(true);

    // Small delay to ensure DOM is ready for animation
    setTimeout(() => {
      setIsAnimating(true);
    }, 10);

    // Clear the "just opened" flag after a delay to prevent immediate closing
    setTimeout(() => {
      setJustOpened(false);
    }, 500);
  };

  // Calculate smart positioning for popup
  const calculatePopupPosition = () => {
    if (!cardRef.current) return;

    const cardRect = cardRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const popupWidth = 400; // Approximate popup width

    // For mobile devices (< 768px), always use center positioning
    if (viewportWidth < 768) {
      setPopupPosition("center");
      return;
    }

    // For tablet devices (768px - 1024px), prefer center for better UX
    if (viewportWidth < 1024) {
      setPopupPosition("center");
      return;
    }

    // For desktop, use smart positioning
    // Check if there's enough space on the right
    if (cardRect.right + popupWidth <= viewportWidth - 20) {
      setPopupPosition("right");
    }
    // Check if there's enough space on the left
    else if (cardRect.left - popupWidth >= 20) {
      setPopupPosition("left");
    }
    // Default to center/floating modal for small screens
    else {
      setPopupPosition("center");
    }
  };

  const handleClosePopup = () => {
    setIsAnimating(false);

    // Clear hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Re-enable body scroll when popup closes (for mobile)
    document.body.style.overflow = "";

    // Wait for animation to complete before hiding
    setTimeout(() => {
      setShowPopup(false);
    }, 300);
  };

  const animeSlug = generateSlug(anime.title);

  // Handle popup opening/closing effects
  useEffect(() => {
    if (showPopup) {
      // Prevent body scroll on mobile/tablet when popup is open
      if (window.innerWidth < 1024) {
        document.body.style.overflow = "hidden";
      }
    } else {
      // Re-enable body scroll
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPopup]);

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
      const target = event.target as Node;

      // Don't close if popup was just opened
      if (justOpened) return;

      // Don't close if clicking on the card itself (allow for touch devices)
      if (cardRef.current && cardRef.current.contains(target)) {
        return;
      }

      // Check if click is outside popup
      if (popupRef.current && !popupRef.current.contains(target) && showPopup) {
        handleClosePopup();
      }
    };

    const handleTouchOutside = (event: TouchEvent) => {
      const target = event.target as Node;

      // Don't close if popup was just opened
      if (justOpened) return;

      // Don't close if touching the card itself
      if (cardRef.current && cardRef.current.contains(target)) {
        return;
      }

      // Handle touch events for mobile devices
      if (popupRef.current && !popupRef.current.contains(target) && showPopup) {
        handleClosePopup();
      }
    };

    if (showPopup) {
      document.addEventListener("keydown", handleEscapeKey);
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleTouchOutside);

      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleTouchOutside);
      };
    }
  }, [showPopup, justOpened]);

  // Handle window resize to recalculate popup position
  useEffect(() => {
    const handleResize = () => {
      if (showPopup) {
        calculatePopupPosition();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showPopup]);

  return (
    <>
      <div
        ref={cardRef}
        className={cn("relative group", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}>
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

                {/* Info button - Always visible on mobile/tablet, hover on desktop */}
                <div className="relative">
                  <button
                    className={cn(
                      "bg-black/70 p-2 rounded-full hover:bg-black/90 transition-all duration-300",
                      // Show on mobile/tablet (< lg) or when hovered on desktop (>= lg)
                      "opacity-100 lg:opacity-0 lg:scale-90",
                      isHovered && "lg:opacity-100 lg:scale-100"
                    )}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={handleInfoClick}>
                    <Info className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                  </button>

                  {showTooltip && (
                    <div className="absolute top-full right-0 mt-1 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      More info
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <>
          {/* Backdrop for center positioning */}
          {popupPosition === "center" && (
            <div
              className={cn(
                "fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 backdrop-blur-sm",
                isAnimating ? "opacity-100" : "opacity-0"
              )}
              onClick={handleClosePopup}
            />
          )}

          <div
            ref={popupRef}
            className={cn(
              "bg-transparent rounded-xl shadow-2xl overflow-hidden z-50",
              "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              // Smart positioning based on available space
              popupPosition === "right" &&
                "absolute left-full top-0 ml-4 w-[400px]",
              popupPosition === "left" &&
                "absolute right-full top-0 mr-4 w-[400px]",
              popupPosition === "center" &&
                "fixed top-[25%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[400px] max-w-[400px] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto sm:m-4",
              // Animation states
              isAnimating
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-90 translate-y-4"
            )}
            onClick={popupPosition === "center" ? undefined : handleClosePopup}>
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
              <div
                className="relative w-full"
                style={{ aspectRatio: "16/9", minHeight: "200px" }}>
                <div className="absolute inset-0 bg-black rounded-t-2xl overflow-hidden">
                  {anime.trailer ? (
                    <iframe
                      src={anime.trailer}
                      title={`${anime.title} Trailer`}
                      className="w-full h-full absolute inset-0 border-0"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <div className="text-center p-4">
                        <Play className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-2 sm:mb-4" />
                        <p className="text-gray-400 text-sm sm:text-base">
                          No trailer available
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={handleClosePopup}
                    className="absolute top-2 right-2 sm:bottom-4 sm:right-4 sm:top-auto bg-black/70 hover:bg-black/90 p-2 rounded-full transition-colors z-10"
                    aria-label="Close">
                    <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 sm:p-6">
                {/* Title and Rating */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                      {anime.title}
                    </h2>
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1">
                          <span>SUB</span>
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1">
                          <span>DUB</span>
                        </button>
                        <div className="space-y-1 text-xs sm:text-sm text-gray-400">
                          <p>
                            <span className="text-white">Episodes:</span>{" "}
                            {anime.totalEpisodes || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
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
                <div className="mb-4 sm:mb-6">
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    {anime.synopsis ||
                      "No description available for this anime."}
                  </p>
                </div>

                {/* Watch Now Button */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Link
                    href={`/anime/${anime.id}/${animeSlug}`}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 sm:p-3 rounded-full font-semibold flex items-center space-x-2 transition-colors"
                    onClick={handleClosePopup}>
                    <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>

                  <button
                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 sm:p-3 rounded-full transition-colors"
                    title="Add to Bookmarks"
                    onClick={(e) => e.stopPropagation()}>
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
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
                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 sm:p-3 rounded-full transition-colors"
                    title="More Info"
                    onClick={(e) => e.stopPropagation()}>
                    <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
