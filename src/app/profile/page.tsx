"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { NotificationDropdown } from "@/components/ui/NotificationDropdown";

import { pageApi } from "@/lib/api/pageApi";
import { mockAnime } from "@/lib/mockData";
import { getWatchHistory, type WatchHistoryItem } from "@/lib/watchHistory";
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
  username: string;
  email: string;
  avatar: string;
  joinDate: string;
  totalWatched: number;
  totalHours: number;
  favoriteGenres: string[];
  exp: number;
  role?: string;
  notifications?: Array<{
    id: number;
    text?: string;
    message?: string;
    date?: string;
    time?: string;
    created_at?: string;
    type?: "Anime" | "Community";
  }>;
  watchlist?: Record<string, unknown>;
  nextLevelExp: 10000;
  stats: {
    episodesWatched: 3247;
    minutesWatched: 233640;
    averageRating: 8.4;
    droppedSeries: 12;
    onHoldSeries: 8;
    planToWatch: 45;
  };
}

// Mock user's anime lists
const userLists = {
  recentlyWatched: mockAnime.slice(0, 8),
  favorites: mockAnime.slice(6, 12),
  bookmark: mockAnime.slice(12, 18),
};

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [watchlistData, setWatchlistData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({
    watching: 0,
    plan_to_watch: 0,
    on_hold: 0,
    completed: 0,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; animeId: number | null; animeTitle: string }>({
    show: false,
    animeId: null,
    animeTitle: "",
  });
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);

  type Notification = {
    id: number;
    text: string;
    date: string;
    time: string;
    type: "Anime" | "Community";
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

  // Initialize notifications from API data when profileData is loaded
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (profileData?.notifications) {
      const formattedNotifications = profileData.notifications.map(
        (notif, index: number) => ({
          id: index + 1,
          text: notif.message || notif.text || "New notification",
          date: new Date(notif.created_at || Date.now()).toLocaleDateString(),
          time: new Date(notif.created_at || Date.now()).toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
          type: notif.type || ("Anime" as "Anime" | "Community"),
        })
      );
      setNotifications(formattedNotifications);
    }
  }, [profileData]);

  const handleRemoveNotif = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // State for Hide your profile activities
  const [hideActivities, setHideActivities] = useState<"yes" | "no">("no");
  // State for Hide your bookmarks
  const [hideBookmarks, setHideBookmarks] = useState<"yes" | "no">("no");

  const [exportFormat, setExportFormat] = useState("text");
  const [importExportMode, setImportExportMode] = useState<
    "import" | "export" | "autosync"
  >("import");

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
  const getPaginatedData = (status: string) => {
    if (!watchlistData?.results?.[status]) return [];
    const items = watchlistData.results[status];
    const page = currentPages[status] || 0;
    const start = page * 10;
    return items.slice(start, start + 10);
  };

  // Helper function to get total pages
  const getTotalPages = (status: string) => {
    if (!watchlistData?.results?.[status]) return 0;
    return Math.ceil(watchlistData.results[status].length / 10);
  };

  // Handle delete anime from watchlist
  const handleDeleteFromWatchlist = async (animeId: number) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      await pageApi.removeFromWatchlist(token, animeId);
      // Refresh watchlist
      const updatedWatchlist = await pageApi.getWatchlist(token);
      setWatchlistData(updatedWatchlist);
      setDeleteConfirm({ show: false, animeId: null, animeTitle: "" });
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
  const renderWatchlistSection = (status: string, title: string) => {
    const paginatedData = getPaginatedData(status);
    const totalPages = getTotalPages(status);
    const currentPage = currentPages[status] || 0;

    if (!watchlistData?.results?.[status] || watchlistData.results[status].length === 0) {
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
          {paginatedData.map((anime: any) => (
            <div
              key={anime.id}
              className="bg-[#1c243b] p-4 rounded-md flex items-center gap-4 justify-between hover:bg-[#2a3450] transition-colors"
            >
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
                    className="text-white font-semibold hover:text-purple-400 transition-colors block truncate"
                  >
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
              <button
                onClick={() => setDeleteConfirm({ show: true, animeId: anime.id, animeTitle: anime.title })}
                className="text-red-500 hover:text-red-400 transition-colors flex-shrink-0"
                title="Delete from watchlist"
              >
                <Trash2 className="h-5 w-5" />
              </button>
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
                  [status]: Math.max(0, currentPage - 1),
                }))
              }
              disabled={currentPage === 0}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() =>
                  setCurrentPages((prev) => ({
                    ...prev,
                    [status]: i,
                  }))
                }
                className={`px-3 py-1 rounded transition-colors ${
                  currentPage === i
                    ? "btn-purple text-white"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPages((prev) => ({
                  ...prev,
                  [status]: Math.min(totalPages - 1, currentPage + 1),
                }))
              }
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
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
                        {/* ...existing import content... */}
                        <div className="bg-[#2b354a] p-4 rounded-md text-sm text-gray-400 mb-6">
                          <p>
                            Import your anime list from MAL (MyAnimeList) or AL
                            (Anilist):
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
                            placeholder="AL username"
                            className="w-full bg-[#2b354a] text-white p-3 rounded-md placeholder-gray-400 focus:outline-none"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium mb-1">
                            File
                          </label>
                          <input
                            type="file"
                            className="block w-full text-sm text-gray-400 file:bg-[#3c4a63] file:text-white file:rounded-md file:px-4 file:py-2 file:border-0"
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          You can upload a XML file that uses MAL format, or a
                          text file (TXT) that contains a list of MAL/AL urls
                          that you want to import.
                        </p>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              From
                            </label>
                            <div className="flex items-center gap-3">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  checked
                                  name="source"
                                  className="text-orange-500"
                                />
                                <span className="ml-2">MAL</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="source"
                                  className="text-orange-500"
                                />
                                <span className="ml-2">AL</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Mode
                            </label>
                            <div className="flex items-center gap-3">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  checked
                                  name="mode"
                                  className="text-orange-500"
                                />
                                <span className="ml-2">Merge</span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name="mode"
                                  className="text-orange-500"
                                />
                                <span className="ml-2">Replace</span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <button className="btn-purple text-white/90 px-6 py-2 rounded-md font-medium w-full mt-7">
                          Import
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
                        <button className="btn-purple text-white px-6 py-2 rounded-md font-medium mt-4">
                          Download Export
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
                    onClose={() => {}}
                  />
                </div>
              )}
              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div className="flex gap-8 flex-wrap justify-center">
                    {/* <!-- Activities Card --> */}
                    <div className="bg-purple p-5 rounded-lg w-full max-w-3xl border border-[#1d2a47]">
                      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">🕒</span> ACTIVITIES
                      </h2>

                      {/* <!-- Activity Items --> */}
                      <div className="space-y-3">
                        <div className="bg-[#1c243b] p-4 rounded-md flex items-center gap-2 flex-wrap">
                          <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                          <span className="text-sm text-gray-400">
                            3 minutes ago
                          </span>
                          <span className="font-semibold text-white/90">
                            xs9yj7to4
                          </span>
                          <span className="text-sm text-gray-400">watched</span>
                          <a href="#" className="text-pink hover:underline">
                            EP 1134
                          </a>
                          <span className="text-sm text-white/90">
                            of One Piece
                          </span>
                        </div>

                        <div className="bg-[#1c243b] p-4 rounded-md flex items-center gap-2 flex-wrap">
                          <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                          <span className="text-sm text-gray-400">
                            26 minutes ago
                          </span>
                          <span className="font-semibold text-white/90">
                            xs9yj7to4
                          </span>
                          <span className="text-sm text-gray-400">watched</span>
                          <a href="#" className="text-pink hover:underline">
                            EP 13
                          </a>
                          <span className="text-sm text-white/90">
                            of LAZARUS
                          </span>
                        </div>

                        <div className="bg-[#1c243b] p-4 rounded-md flex items-center gap-2 flex-wrap">
                          <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                          <span className="text-sm text-gray-400">
                            26 minutes ago
                          </span>
                          <span className="font-semibold text-white/90">
                            xs9yj7to4
                          </span>
                          <span className="text-sm text-gray-400">watched</span>
                          <a href="#" className="text-pink hover:underline">
                            EP 12
                          </a>
                          <span className="text-sm text-white/90">
                            of Shirohiyo - Reincarnated as a Neglected Noble:
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

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
                            className="relative group"
                          >
                            {/* Poster */}
                            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                              <Image
                                src={item.poster || '/placeholder-anime.jpg'}
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
                              <p className="text-gray-400 text-xs">Ep {item.episodeNumber}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-800/30 rounded-lg border border-gray-700">
                        <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No anime in progress yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "watching" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <PlayCircle className="h-6 w-6 text-pink mr-3" />
                    Currently Watching ({watchlistData?.results?.watching?.length || 0})
                  </h2>
                  {renderWatchlistSection("watching", "Currently Watching")}
                </div>
              )}

              {activeTab === "bookmark" && (
                <div className="space-y-12">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Bookmark className="h-6 w-6 text-pink mr-3" />
                      Plan to Watch ({watchlistData?.results?.plan_to_watch?.length || 0})
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
            <h3 className="text-xl font-bold text-white mb-4">Remove from Watchlist?</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to remove <span className="font-semibold text-pink">{deleteConfirm.animeTitle}</span> from your watchlist?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm({ show: false, animeId: null, animeTitle: "" })}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteFromWatchlist(deleteConfirm.animeId!)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
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
