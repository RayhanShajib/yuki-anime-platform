"use client";

import { pageApi } from "@/lib/api/pageApi";
import { safeLocalStorage } from "@/lib/safeLocalStorage";
import { Bookmark, CheckCircle, Clock, Play, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface WatchlistDropdownProps {
  animeId: string | number;
  episodeId?: string | number | null;
  iconOnly?: boolean;
}

type WatchStatus =
  | "watching"
  | "completed"
  | "drop"
  | "on_hold"
  | "plan_to_watch";

interface StatusOption {
  value: WatchStatus;
  label: string;
  icon: React.ReactNode;
}

const statusOptions: StatusOption[] = [
  {
    value: "watching",
    label: "Watching",
    icon: <Play className="h-4 w-4" />,
  },
  {
    value: "completed",
    label: "Completed",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  {
    value: "plan_to_watch",
    label: "Plan to Watch",
    icon: <Bookmark className="h-4 w-4" />,
  },
  {
    value: "on_hold",
    label: "On Hold",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    value: "drop",
    label: "Dropped",
    icon: <X className="h-4 w-4" />,
  },
];

export function WatchlistDropdown({
  animeId,
  episodeId,
  iconOnly = false,
}: WatchlistDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<WatchStatus | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Mount state for portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update button position when dropdown opens
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + window.scrollY + 8, // 8px gap between button and dropdown
        left: rect.right - 192 + window.scrollX, // 192px is the dropdown width (w-48)
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Clear feedback after 3 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleAddToList = () => {
    // Check for authentication token
    const token = safeLocalStorage.getItem("access_token");

    if (!token) {
      // Redirect to login if not authenticated
      router.push("/login");
      return;
    }

    // Toggle dropdown if already authenticated
    setIsOpen(!isOpen);
  };

  const handleStatusSelect = async (status: WatchStatus) => {
    const token = safeLocalStorage.getItem("access_token");

    if (!token) {
      setFeedback({ type: "error", message: "Please login first" });
      setIsOpen(false);
      return;
    }

    try {
      setLoadingStatus(status);

      // Convert animeId to number if it's a string
      const numericAnimeId =
        typeof animeId === "string" ? parseInt(animeId) : animeId;
      const numericEpisodeId = episodeId
        ? typeof episodeId === "string"
          ? parseInt(episodeId)
          : episodeId
        : null;

      await pageApi.addToWatchlist(
        token,
        numericAnimeId,
        status,
        numericEpisodeId
      );

      setFeedback({
        type: "success",
        message: `Added to ${status.replace("_", " ")}!`,
      });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to add to watchlist",
      });
    } finally {
      setLoadingStatus(null);
      setIsOpen(false);
    }
  };

  // Render dropdown as portal outside of overflow containers
  const dropdownPortal =
    isMounted && isOpen
      ? createPortal(
          <div
            ref={dropdownRef}
            className="absolute w-48 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700/50 z-40 overflow-hidden animate-in fade-in-0 zoom-in-95"
            style={{
              top: `${buttonPosition.top}px`,
              left: `${buttonPosition.left}px`,
            }}>
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusSelect(option.value)}
                disabled={loadingStatus !== null}
                className="w-full px-4 py-3 flex items-center space-x-3 text-left text-white/90 hover:bg-[#7760A9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-700/30 last:border-b-0">
                <div className="text-pink flex-shrink-0">{option.icon}</div>
                <span className="text-sm font-medium">{option.label}</span>
                {loadingStatus === option.value && (
                  <div className="ml-auto animate-spin">
                    <svg
                      className="h-4 w-4 text-pink"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {/* Feedback Message */}
      {feedback && (
        <div
          className={`absolute bottom-full left-0 mb-2 px-3 py-2 rounded-lg text-sm font-medium text-white whitespace-nowrap z-50 ${
            feedback.type === "success"
              ? "bg-green-600/80 backdrop-blur-sm"
              : "bg-red-600/80 backdrop-blur-sm"
          }`}>
          {feedback.message}
        </div>
      )}

      {/* Add to List Button */}
      {iconOnly ? (
        <button
          ref={buttonRef}
          onClick={handleAddToList}
          disabled={loadingStatus !== null}
          title="Add to Bookmarks"
          className="bg-gray-700 hover:bg-gray-600 text-white/90 p-2 sm:p-3 rounded-full transition-colors"
        >
          <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      ) : (
        <button
          ref={buttonRef}
          onClick={handleAddToList}
          disabled={loadingStatus !== null}
          className="flex items-center space-x-1 sm:space-x-2 bg-gray-700/80 backdrop-blur-sm text-white/90 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600/80 transition-colors font-semibold cursor-pointer text-sm sm:text-base btn-pink disabled:opacity-50 disabled:cursor-not-allowed">
          <svg
            className="h-3 w-3 sm:h-4 sm:w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="hidden sm:inline">Add to List</span>
          <span className="sm:hidden">Add List</span>
        </button>
      )}

      {/* Dropdown rendered as portal */}
      {dropdownPortal}
    </>
  );
}
