"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { NotificationDropdown } from "@/components/ui/NotificationDropdown";
import { StatusChangeDropdown } from "@/components/ui/StatusChangeDropdown";

import { pageApi } from "@/lib/api/pageApi";
import { getWatchHistory, type WatchHistoryItem } from "@/lib/watchHistory";
import { type ApiWatchlistItem, type ApiWatchlistResponse } from "@/types/api";
import {
  Bell,
  Bookmark,
  ChevronRight,
  Clock,
  Copy,
  Edit3,
  Import,
  Play,
  PlayCircle,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Profile data interface
interface ProfileData {
  id?: number;
  username: string;
  email: string;
  avatar: string | null;
  role?: string;
  joinDate?: string;
  totalWatched?: number;
  totalHours?: number;
  favoriteGenres?: string[];
  exp?: number;
  // Notifications are now fetched from the notifications endpoint
  watchlist?: Record<string, unknown>;
  nextLevelExp?: number;
  preferred_title_lang?: string;
  preferred_video_lang?: string;
  skip_seconds?: number;
  bookmarks_per_page?: number;
  hide_bookmarks?: boolean;
  hide_profile_activities?: boolean;
  stats?: {
    episodesWatched: number;
    minutesWatched: number;
    averageRating: number;
    droppedSeries: number;
    onHoldSeries: number;
    planToWatch: number;
  };
  [key: string]: unknown; // Allow any additional fields from API
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [watchlistData, setWatchlistData] =
    useState<ApiWatchlistResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({
    watching: 0,
    plan_to_watch: 0,
    on_hold: 0,
    completed: 0,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    watchStatusId: number | null;
    animeTitle: string;
  }>({
    show: false,
    watchStatusId: null,
    animeTitle: "",
  });
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);

  type Notification = {
    id: number;
    text: string;
    date: string;
    time: string;
    type: "Anime" | "Community";
    source?: string; // Original source from API
    isRead?: boolean;
  };

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Get token from localStorage (set during login)
        const token = localStorage.getItem("access_token");
        if (!token) {
          setError("Please log in to view your profile");
          router.push("/login");
          return;
        }

        const [profileRes, watchlistRes] = await Promise.all([
          pageApi.getProfilePageData(token),
          pageApi.getWatchlist(token),
        ]);

        setProfileData(profileRes);
        setWatchlistData(watchlistRes);

        // Load watch history from localStorage
        const history = getWatchHistory();
        setWatchHistory(history);
      } catch (error: unknown) {
        console.error("Error fetching profile:", error);

        // Handle token validation errors
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        if (
          errorMessage.includes("token_not_valid") ||
          errorMessage.includes("401")
        ) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          router.push("/login");
        } else {
          setError("Failed to load profile data. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Notifications state (fetched from notifications endpoint)
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications from the dedicated notifications endpoint
  useEffect(() => {
    if (!profileData) return;

    const loadNotifications = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const res = await pageApi.getNotifications(token);

        const list: unknown[] = Array.isArray(res)
          ? res
          : Array.isArray((res as { results?: unknown[] }).results)
          ? (res as { results: unknown[] }).results
          : [];

        if (!list.length) {
          setNotifications([]);
          return;
        }

        const formattedNotifications = list.map((notif: unknown, index: number) => {
          const notification = notif as {
            source?: string;
            type?: string;
            content?: string;
            message?: string;
            text?: string;
            created_at?: string;
            id?: number;
          };
          
          const source = (notification.source || notification.type || "Anime") as string;
          let notificationType: "Anime" | "Community" = "Anime";

          if (
            typeof source === "string" &&
            ["admin", "community", "system"].includes(source.toLowerCase())
          ) {
            notificationType = "Community";
          } else if (
            typeof source === "string" &&
            ["anime", "episode"].includes(source.toLowerCase())
          ) {
            notificationType = "Anime";
          }

          // Use created_at as the canonical timestamp. If server returns an id, use it;
          // otherwise generate a stable-ish id from the timestamp (fallback to index).
          const createdAt = notification.created_at ? new Date(notification.created_at) : new Date();
          const id = notification.id ?? Number(createdAt?.getTime()) ?? index + 1;

          return {
            id,
            text: notification.content ?? notification.message ?? notification.text ?? "New notification",
            date: createdAt.toLocaleDateString(),
            time: createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: notificationType,
            source,
            isRead: !!(notification as { is_read?: boolean }).is_read,
          } as Notification;
        });

        setNotifications(formattedNotifications);
      } catch (err) {
         
        console.error("Failed to load notifications:", err);
        setNotifications([]);
      }
    };

    void loadNotifications();
  }, [profileData]);

  const handleRemoveNotif = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkReadNotif = async (id: number) => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));

    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      await pageApi.markNotificationAsRead(token, id);
    } catch (err) {
      // Rollback optimistic update on failure
       
      console.error("Failed to mark notification as read:", err);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)));
    }
  };
  // State for Hide your profile activities
  const [hideActivities, setHideActivities] = useState<"yes" | "no">("no");
  // State for Hide your bookmarks
  const [hideBookmarks, setHideBookmarks] = useState<"yes" | "no">("no");

  const [exportFormat, setExportFormat] = useState("text");
  const [importExportMode, setImportExportMode] = useState<
    "import" | "export" | "autosync"
  >("import");
  const [exportLoading, setExportLoading] = useState(false);
  // Import form state
  const [malUsername, setMalUsername] = useState<string>("");
  const [alUsername, setAlUsername] = useState<string>("");
  const [malFile, setMalFile] = useState<File | null>(null);
  const [alFile, setAlFile] = useState<File | null>(null);
  const [importModeOption, setImportModeOption] =
    useState<"merge" | "replace">("merge");
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // State for copy tooltip
  const [copyTooltips, setCopyTooltips] = useState<Record<string, boolean>>({});

  // Copy function with tooltip
  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyTooltips((prev) => ({ ...prev, [label]: true }));
      setTimeout(() => {
        setCopyTooltips((prev) => ({ ...prev, [label]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Helper function to get paginated data
  const getPaginatedData = (status: keyof ApiWatchlistResponse["results"]) => {
    if (!watchlistData?.results?.[status]) return [];
    const items = watchlistData.results[status];
    const page = currentPages[status as string] || 0;
    const start = page * 10;
    return items.slice(start, start + 10);
  };

  // Helper function to get total pages
  const getTotalPages = (status: keyof ApiWatchlistResponse["results"]) => {
    if (!watchlistData?.results?.[status]) return 0;
    return Math.ceil(watchlistData.results[status].length / 10);
  };

  // Handle delete anime from watchlist
  const handleDeleteFromWatchlist = async (watchStatusId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      await pageApi.removeFromWatchlist(token, watchStatusId);
      // Refresh watchlist
      const updatedWatchlist = await pageApi.getWatchlist(token);
      setWatchlistData(updatedWatchlist);
      setDeleteConfirm({ show: false, watchStatusId: null, animeTitle: "" });
    } catch (error) {
      console.error("Error deleting from watchlist:", error);
    }
  };

  // Get slug from title
  const getSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Render watchlist section with pagination
  const renderWatchlistSection = (
    status: keyof ApiWatchlistResponse["results"],
    title: string
  ) => {
    const paginatedData = getPaginatedData(status);
    const totalPages = getTotalPages(status);
    const currentPage = currentPages[status as string] || 0;

    if (
      !watchlistData?.results?.[status] ||
      watchlistData.results[status].length === 0
    ) {
      return (
        <div className="text-center py-8 text-gray-400">
          No items found in {title}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* List Items */}
        <div className="space-y-3">
          {paginatedData.map((anime: ApiWatchlistItem) => (
            <div
              key={anime.id}
              className="bg-[#1c243b] p-4 rounded-md flex items-center gap-4 justify-between hover:bg-[#2a3450] transition-colors">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Image
                  src={anime.image || "/placeholder-anime.jpg"}
                  alt={anime.title}
                  width={60}
                  height={80}
                  className="rounded-md object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/anime/${anime.id}/${getSlugFromTitle(anime.title)}`}
                    className="text-white font-semibold hover:text-purple-400 transition-colors block truncate">
                    {anime.title}
                  </Link>
                  <div className="flex gap-2 mt-2">
                    {anime.sub_total > 0 && (
                      <span className="btn-pink text-white/90 px-2 py-0.5 rounded text-xs font-medium">
                        SUB {anime.sub_total}
                      </span>
                    )}
                    {anime.dub_total > 0 && (
                      <span className="btn-purple text-white/90 px-2 py-0.5 rounded text-xs font-medium">
                        DUB {anime.dub_total}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusChangeDropdown
                  animeId={anime.anime_id || anime.id}
                  watchStatusId={anime.id}
                  animeTitle={anime.title}
                  currentStatus={status}
                  onStatusChanged={async () => {
                    const token = localStorage.getItem("access_token");
                    if (token) {
                      const updatedWatchlist = await pageApi.getWatchlist(
                        token
                      );
                      setWatchlistData(updatedWatchlist);
                    }
                  }}
                />
                <button
                  onClick={() =>
                    setDeleteConfirm({
                      show: true,
                      watchStatusId: anime.id,
                      animeTitle: anime.title,
                    })
                  }
                  className="text-red-500 hover:text-red-400 transition-colors"
                  title="Delete from watchlist">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() =>
                setCurrentPages((prev) => ({
                  ...prev,
                  [status as string]: Math.max(0, currentPage - 1),
                }))
              }
              disabled={currentPage === 0}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors">
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() =>
                  setCurrentPages((prev) => ({
                    ...prev,
                    [status as string]: i,
                  }))
                }
                className={`px-3 py-1 rounded transition-colors ${
                  currentPage === i
                    ? "btn-purple text-white"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}>
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPages((prev) => ({
                  ...prev,
                  [status as string]: Math.min(totalPages - 1, currentPage + 1),
                }))
              }
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors">
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p>Loading profile...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center max-w-md">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Profile Content - Only show when data is loaded */}
          {!isLoading && !error && profileData && (
            <>
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-purple-900/20 to-purple-900/20 rounded-lg p-4 sm:p-6 border border-purple-800/30 mb-6 sm:mb-8">
                <div className="flex flex-col items-center sm:items-start md:flex-row md:items-center space-y-4 sm:space-y-6 md:space-y-0 md:space-x-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-4 border-purple-500 overflow-hidden">
                      <Image
                        src={
                          profileData?.avatar ||
                          "https://i.pravatar.cc/150?img=5"
                        }
                        alt={profileData?.username || "User"}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        priority
                      />
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2 justify-center sm:justify-start">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">
                          {profileData?.username || "Loading..."}
                        </h1>
                      </div>
                      <Link
                        href="/profile/edit"
                        className="flex items-center justify-center space-x-2 btn-purple text-white/90 px-3 py-2 sm:py-2 rounded-lg transition-colors text-sm sm:text-base min-h-[44px] sm:min-h-0">
                        <Edit3 className="h-3 w-3" />
                        <span className="text-sm text-white/90">
                          Edit Profile
                        </span>
                      </Link>
                    </div>
                    <h3 className="text-sm font-normal text-white mt-1 mb-3">
                      Watching <b>One Piece</b>
                    </h3>
                    <div className="flex items-center text-white py-1 rounded-full text-sm font-medium">
                      <div className="relative">
                        <button
                          className="flex items-center space-x-1 text-white hover:text-pink-400 focus:outline-none transition-colors"
                          onClick={() =>
                            handleCopy(
                              "http://localhost:3000/profile",
                              "Profile URL"
                            )
                          }
                          title="Copy profile URL to clipboard">
                          <span>Profile URL</span>
                          <Copy className="h-3 w-3" />
                        </button>
                        {copyTooltips["Profile URL"] && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-purple text-white text-xs rounded shadow-lg z-10">
                            Copied!
                          </div>
                        )}
                      </div>
                      <span className="ml-2"> - </span>
                      {profileData?.email &&
                      profileData.email !== "No email" ? (
                        <div className="relative inline-flex items-center space-x-1">
                          <span>{profileData.email}</span>
                        </div>
                      ) : (
                        <span>No email</span>
                      )}
                      <span> ({profileData?.role || "user"})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="flex p-1 flex-wrap bg-gray-800 rounded-lg space-x-1 justify-center navigation-tabs">
                  {[
                    {
                      key: "overview",
                      label: "Overview",
                      shortLabel: "Overview",
                      icon: User,
                    },
                    {
                      key: "watching",
                      label: "Currently Watching",
                      shortLabel: "Watching",
                      icon: PlayCircle,
                    },
                    {
                      key: "bookmark",
                      label: "Bookmarks",
                      shortLabel: "bookmark",
                      icon: Bookmark,
                    },
                    {
                      key: "completed",
                      label: "Completed",
                      shortLabel: "Completed",
                      icon: PlayCircle,
                    },
                    {
                      key: "notifications",
                      label: "Notifications",
                      shortLabel: "notifications",
                      icon: Bell,
                    },
                    {
                      key: "settings",
                      label: "Settings",
                      shortLabel: "settings",
                      icon: Settings,
                    },
                    {
                      key: "importexport",
                      label: "Import/Export",
                      shortLabel: "importexport",
                      icon: Import,
                    },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-2 py-2 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-h-[44px] sm:min-h-0 ${
                          activeTab === tab.key
                            ? "btn-purple text-white/90"
                            : "text-gray-300 hover:text-white hover:bg-gray-700"
                        }`}>
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {activeTab === "importexport" && (
                <div className="bg-purple border border-gray-700 text-white/90 min-h-screen p-5 rounded-md sm:p-8">
                  <div className="mx-auto">
                    <h2 className="text-xl font-semibold mb-6 text-white/90">
                      Import/Export
                    </h2>
                    <div className="flex gap-3 mb-6 flex-wrap">
                      <button
                        className={`bg-[#2b354a] text-white/90 px-3 py-1 rounded-md font-medium ${
                          importExportMode === "import" ? "" : "opacity-60"
                        }`}
                        onClick={() => setImportExportMode("import")}>
                        Import
                      </button>
                      <button
                        className={`bg-[#1a2438] text-white/90 px-3 py-1 rounded-md font-medium ${
                          importExportMode === "export" ? "" : "opacity-60"
                        }`}
                        onClick={() => setImportExportMode("export")}>
                        Export
                      </button>
                      <button
                        className={`bg-[#1a2438] text-white/90 px-3 py-1 rounded-md font-medium ${
                          importExportMode === "autosync" ? "" : "opacity-60"
                        }`}
                        onClick={() => setImportExportMode("autosync")}>
                        Auto Sync
                      </button>
                    </div>
                    {importExportMode === "import" && (
                      <div>
                        {/* Import form wired to pageApi.importWatchlist */}
                        <div className="bg-[#2b354a] p-4 rounded-md text-sm text-gray-400 mb-6">
                          <p>
                            Import your anime list from MAL (MyAnimeList) or AL
                            (Anilist). You can provide a username or upload an
                            export file for each service.
                          </p>
                          <ul className="list-disc ml-5 mt-2 space-y-1">
                            <li>Ensure your list is set to public.</li>
                            <li>
                              Anime present in your list but not available in
                              our library will not be imported.
                            </li>
                            <li>
                              This process may take some time, so please be
                              patient.
                            </li>
                          </ul>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">
                            MAL username
                          </label>
                          <input
                            type="text"
                            value={malUsername}
                            onChange={(e) => setMalUsername(e.target.value)}
                            placeholder="MAL username"
                            className="w-full bg-[#2b354a] text-white p-3 rounded-md placeholder-gray-400 focus:outline-none"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">
                            AL username
                          </label>
                          <input
                            type="text"
                            value={alUsername}
                            onChange={(e) => setAlUsername(e.target.value)}
                            placeholder="AL username"
                            className="w-full bg-[#2b354a] text-white p-3 rounded-md placeholder-gray-400 focus:outline-none"
                          />
                        </div>

                        <div className="mb-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              MAL file (optional)
                            </label>
                            <input
                              type="file"
                              accept="application/xml,text/xml,.xml,.txt"
                              onChange={(e) =>
                                setMalFile(e.target.files?.[0] || null)
                              }
                              className="block w-full text-sm text-gray-400 file:bg-[#3c4a63] file:text-white file:rounded-md file:px-4 file:py-2 file:border-0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              AL file (optional)
                            </label>
                            <input
                              type="file"
                              accept="application/json,text/plain,.json,.txt"
                              onChange={(e) =>
                                setAlFile(e.target.files?.[0] || null)
                              }
                              className="block w-full text-sm text-gray-400 file:bg-[#3c4a63] file:text-white file:rounded-md file:px-4 file:py-2 file:border-0"
                            />
                          </div>
                        </div>

                        <p className="text-xs text-gray-400 mt-1">
                          You can upload a MAL XML export, an AL JSON/TXT export,
                          or provide usernames to import directly from the
                          services.
                        </p>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Source (optional)
                            </label>
                            <div className="flex items-center gap-3">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  checked
                                  readOnly
                                  name="source"
                                  className="text-orange-500"
                                />
                                <span className="ml-2">MAL</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="source"
                                  readOnly
                                  className="text-orange-500"
                                />
                                <span className="ml-2">AL</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="source"
                                  readOnly
                                  className="text-orange-500"
                                />
                                <span className="ml-2">Both</span>
                              </label>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              (Source selector is informational — we detect
                              provided files/usernames automatically.)
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Mode
                            </label>
                            <div className="flex items-center gap-3">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="mode"
                                  checked={importModeOption === "merge"}
                                  onChange={() => setImportModeOption("merge")}
                                  className="text-orange-500"
                                />
                                <span className="ml-2">Merge</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="mode"
                                  checked={importModeOption === "replace"}
                                  onChange={() => setImportModeOption("replace")}
                                  className="text-orange-500"
                                />
                                <span className="ml-2">Replace</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {importError && (
                          <div className="mt-4 text-sm text-red-400">
                            {importError}
                          </div>
                        )}
                        {importResult && (
                          <div className="mt-4 text-sm text-green-400">
                            {importResult}
                          </div>
                        )}

                        <button
                          onClick={async () => {
                            setImportError(null);
                            setImportResult(null);
                            setImportLoading(true);

                            try {
                              const token = localStorage.getItem("access_token");
                              if (!token) {
                                setImportError("Please log in to import your list");
                                setImportLoading(false);
                                return;
                              }

                              // Build options for API
                              const options: {
                                mal_file?: File | null;
                                al_file?: File | null;
                                mode?: string;
                                mal_username?: string | null;
                                al_username?: string | null;
                              } = {
                                mal_file: malFile || undefined,
                                al_file: alFile || undefined,
                                mode: importModeOption,
                                mal_username: malUsername || undefined,
                                al_username: alUsername || undefined,
                              };

                              const res = await pageApi.importWatchlist(token, options);

                              // Show a friendly result message if available
                              if (res && typeof res === "object") {
                                const msg =
                                  (res as { message?: string }).message ||
                                  "Import completed. Check your watchlist.";
                                setImportResult(String(msg));
                              } else if (typeof res === "string") {
                                setImportResult(res);
                              } else {
                                setImportResult("Import completed successfully.");
                              }

                              // Clear inputs on success
                              setMalFile(null);
                              setAlFile(null);
                              setMalUsername("");
                              setAlUsername("");
                            } catch (err: unknown) {
                              // If API returned structured error, surface details
                              if (err && typeof err === "object" && (err as { data?: unknown }).data) {
                                const data = (err as { data: unknown }).data;
                                // Try to extract a message or validation errors
                                if (typeof data === "string") {
                                  setImportError(data);
                                } else if (data && typeof data === "object") {
                                  // If server returns field-level errors, join them
                                  const parts: string[] = [];
                                  for (const k of Object.keys(data)) {
                                    const val = (data as Record<string, unknown>)[k];
                                    if (Array.isArray(val)) parts.push(`${k}: ${val.join(", ")}`);
                                    else parts.push(`${k}: ${String(val)}`);
                                  }
                                  setImportError(parts.join("; ") || "Import failed");
                                } else {
                                  setImportError("Import failed. Please try again.");
                                }
                              } else {
                                setImportError("Import failed. Please try again.");
                                console.error("Import failed:", err);
                              }
                            } finally {
                              setImportLoading(false);
                              // Refresh watchlist if import was likely successful
                              try {
                                const token = localStorage.getItem("access_token");
                                if (token) {
                                  const updated = await pageApi.getWatchlist(token);
                                  setWatchlistData(updated);
                                }
                              } catch {
                                // ignore refresh errors
                              }
                            }
                          }}
                          disabled={importLoading}
                          className="btn-purple text-white/90 px-6 py-2 rounded-md font-medium w-full mt-7">
                          {importLoading ? "Importing..." : "Import"}
                        </button>
                      </div>
                    )}
                    {importExportMode === "export" && (
                      <div>
                        {/* Export content */}
                        <div className="bg-[#2b354a] p-4 rounded-md text-sm text-gray-400 mb-6">
                          <p>
                            Export your anime list. Choose a format and download
                            your data.
                          </p>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">
                            Choose file location
                          </label>
                          <input
                            type="file"
                            className="block w-full text-sm text-gray-400 file:bg-[#3c4a63] file:text-white file:rounded-md file:px-4 file:py-2 file:border-0"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">
                            Format
                          </label>
                          <div className="flex items-center gap-4">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="exportFormat"
                                value="text"
                                checked={exportFormat === "text"}
                                onChange={() => setExportFormat("text")}
                              />
                              <span className="ml-2">Text file</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="exportFormat"
                                value="json"
                                checked={exportFormat === "json"}
                                onChange={() => setExportFormat("json")}
                              />
                              <span className="ml-2">JSON file</span>
                            </label>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            setError("");
                            setExportLoading(true);
                            try {
                              const token = localStorage.getItem("access_token");
                              if (!token) {
                                setError("Please log in to export your list");
                                setExportLoading(false);
                                return;
                              }

                              const result = await pageApi.exportWatchlist(
                                token,
                                exportFormat as "text" | "json"
                              );

                              // Prepare file content and mime
                              let blob: Blob;
                              let filename = `yuki-watchlist-${new Date()
                                .toISOString()
                                .slice(0, 10)}`;

                              if (exportFormat === "json") {
                                // result is parsed JSON
                                const jsonText = JSON.stringify(result, null, 2);
                                blob = new Blob([jsonText], {
                                  type: "application/json;charset=utf-8",
                                });
                                filename += ".json";
                              } else {
                                // text/CSV
                                const csvText = result as string;
                                blob = new Blob([csvText], {
                                  type: "text/csv;charset=utf-8",
                                });
                                filename += ".csv";
                              }

                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = filename;
                              document.body.appendChild(a);
                              a.click();
                              a.remove();
                              window.URL.revokeObjectURL(url);
                            } catch (err: unknown) {
                              // If API returned structured error, surface it; otherwise generic
                              if (
                                err &&
                                typeof err === "object" &&
                                (err as { data?: unknown }).data
                              ) {
                                setError("Failed to export: check your account");
                              } else {
                                setError("Failed to export watchlist. Please try again.");
                                 
                                console.error("Export failed:", err);
                              }
                            } finally {
                              setExportLoading(false);
                            }
                          }}
                          disabled={exportLoading}
                          className="btn-purple text-white px-6 py-2 rounded-md font-medium mt-4">
                          {exportLoading ? "Downloading..." : "Download Export"}
                        </button>
                      </div>
                    )}
                    {importExportMode === "autosync" && (
                      <div>
                        {/* Only Auto Sync content and Grant Permission button */}
                        <div className="bg-[#2b354a] p-4 rounded-md text-sm text-gray-400">
                          <h3 className="text-lg font-semibold mb-2">
                            Auto Sync
                          </h3>
                          <p className="mb-4">
                            Automatically sync your anime list with supported
                            platforms.
                          </p>
                          <button className="btn-purple text-white/90 px-6 py-2 rounded-md font-medium">
                            Grant Permission
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="bg-purple p-8 rounded-lg w-full border border-[#2b354a]">
                  <h2 className="text-xl font-semibold mb-8">Settings</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-10">
                    <div>
                      <p className="font-medium">Title Language</p>
                      <p className="text-sm text-gray-400">
                        Preferred language for anime titles
                      </p>
                    </div>
                    <select className="bg-purple text-white/90 p-2 rounded-md w-full border border-gray-700 focus:outline-none">
                      <option>English</option>
                    </select>

                    <div>
                      <p className="font-medium">Video Language</p>
                      <p className="text-sm text-gray-400">
                        Preferred audio language
                      </p>
                    </div>
                    <select className="bg-purple text-white/90 p-2 rounded-md w-full border border-gray-700 focus:outline-none">
                      <option>Sub</option>
                      <option>Dub</option>
                    </select>

                    <div>
                      <p className="font-medium">Skip Seconds</p>
                      <p className="text-sm text-gray-400">
                        Seconds to skip when using skip buttons
                      </p>
                    </div>
                    <input
                      type="number"
                      value="10"
                      className="bg-purple text-white/90 p-2 rounded-md w-full border border-gray-700 focus:outline-none"
                    />

                    <div>
                      <p className="font-medium">Bookmarks per page</p>
                      <p className="text-sm text-gray-400">
                        Number of anime to show per page
                      </p>
                    </div>
                    <select className="bg-purple text-white/90 p-2 rounded-md w-full border border-gray-700 focus:outline-none">
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
                    </select>

                    <div>
                      <p className="font-medium">Hide your bookmarks</p>
                      <p className="text-sm text-gray-400">
                        Make your anime list private
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className={`px-4 py-2 rounded-md text-white/90 ${
                          hideBookmarks === "no"
                            ? "btn-purple"
                            : "bg-purple border border-gray-700 "
                        }`}
                        onClick={() => setHideBookmarks("no")}>
                        No
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-white/90 ${
                          hideBookmarks === "yes"
                            ? "btn-purple"
                            : "bg-purple border border-gray-700 "
                        }`}
                        onClick={() => setHideBookmarks("yes")}>
                        Yes
                      </button>
                    </div>

                    <div>
                      <p className="font-medium">
                        Hide your profile activities
                      </p>
                      <p className="text-sm text-gray-400">
                        Hide your recent activities from others
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className={`px-4 py-2 rounded-md text-white/90 ${
                          hideActivities === "no"
                            ? "btn-purple"
                            : "bg-purple border border-gray-700 "
                        }`}
                        onClick={() => setHideActivities("no")}>
                        No
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-white/90 ${
                          hideActivities === "yes"
                            ? "btn-purple"
                            : "bg-purple border border-gray-700"
                        }`}
                        onClick={() => setHideActivities("yes")}>
                        Yes
                      </button>
                    </div>
                  </div>

                  <button className="w-full btn-purple text-white/90 font-semibold py-3 rounded-md text-center">
                    Save Changes
                  </button>
                </div>
              )}
              {activeTab === "notifications" && (
                <div className="relative flex items-start w-full">
                  <NotificationDropdown
                    notifications={notifications}
                    onRemove={handleRemoveNotif}
                    onMarkRead={handleMarkReadNotif}
                    onClose={() => {}}
                  />
                </div>
              )}
              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Recently Watched */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white flex items-center">
                        <Clock className="h-6 w-6 text-pink mr-3" />
                        Recently Watched ({watchHistory.slice(0, 8).length})
                      </h2>
                      <Link
                        href="/continue-watching"
                        className="flex items-center space-x-2 text-pink-400 hover:text-pink-300 transition-colors">
                        <span>View All</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                    {watchHistory.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3 sm:gap-4">
                        {watchHistory.slice(0, 8).map((item) => (
                          <Link
                            key={`${item.episodeId}-${item.audioType}`}
                            href={`/watch/${item.episodeId}`}
                            className="relative group">
                            {/* Poster */}
                            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                              <Image
                                src={item.poster || "/placeholder-anime.jpg"}
                                alt={item.animeTitle}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />

                              {/* Play Overlay */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>

                              {/* Progress Badge */}
                              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {Math.round(item.progress)}%
                              </div>

                              {/* Audio Type Badge */}
                              <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded uppercase font-medium">
                                {item.audioType}
                              </div>
                            </div>

                            {/* Info */}
                            <div className="mt-2">
                              <h3 className="text-white text-sm font-medium truncate mb-1">
                                {item.animeTitle}
                              </h3>
                              <p className="text-gray-400 text-xs">
                                Ep {item.episodeNumber}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-800/30 rounded-lg border border-gray-700">
                        <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">
                          No anime in progress yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "watching" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <PlayCircle className="h-6 w-6 text-pink mr-3" />
                    Currently Watching (
                    {watchlistData?.results?.watching?.length || 0})
                  </h2>
                  {renderWatchlistSection("watching", "Currently Watching")}
                </div>
              )}

              {activeTab === "bookmark" && (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Bookmark className="h-6 w-6 text-pink mr-3" />
                      Plan to Watch (
                      {watchlistData?.results?.plan_to_watch?.length || 0})
                    </h2>
                    {renderWatchlistSection("plan_to_watch", "Plan to Watch")}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Clock className="h-6 w-6 text-pink mr-3" />
                      On Hold ({watchlistData?.results?.on_hold?.length || 0})
                    </h2>
                    {renderWatchlistSection("on_hold", "On Hold")}
                  </div>
                </div>
              )}

              {activeTab === "completed" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <PlayCircle className="h-6 w-6 text-pink mr-3" />
                    Completed ({watchlistData?.results?.completed?.length || 0})
                  </h2>
                  {renderWatchlistSection("completed", "Completed")}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">
              Remove from Watchlist?
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-pink">
                {deleteConfirm.animeTitle}
              </span>{" "}
              from your watchlist?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() =>
                  setDeleteConfirm({
                    show: false,
                    watchStatusId: null,
                    animeTitle: "",
                  })
                }
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors">
                Cancel
              </button>
              <button
                onClick={() =>
                  handleDeleteFromWatchlist(deleteConfirm.watchStatusId!)
                }
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterSection />
    </div>
  );
}
