"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { NotificationDropdown } from "@/components/ui/NotificationDropdown";

import { mockAnime } from "@/lib/mockData";
import {
  Bell,
  Bookmark,
  ChevronRight,
  Clock,
  Edit3,
  Import,
  PlayCircle,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Mock user data
const userData = {
  username: "AnimeExplorer",
  email: "user@example.com",
  avatar: "https://i.pravatar.cc/150?img=5",
  joinDate: "2023-01-15",
  totalWatched: 156,
  totalHours: 3892,
  favoriteGenres: ["Action", "Adventure", "Drama"],
  exp: 8750,
  nextLevelExp: 10000,
  stats: {
    episodesWatched: 3247,
    minutesWatched: 233640,
    averageRating: 8.4,
    droppedSeries: 12,
    onHoldSeries: 8,
    planToWatch: 45,
  },
};

// Mock user's anime lists
const userLists = {
  recentlyWatched: mockAnime.slice(0, 8),
  favorites: mockAnime.slice(6, 12),
  bookmark: mockAnime.slice(12, 18),
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  type Notification = {
    id: number;
    text: string;
    date: string;
    time: string;
    type: "Anime" | "Community";
  };

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      text: "New episode released for One Piece!",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "Anime",
    },
    {
      id: 2,
      text: "Your post received a new comment.",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "Community",
    },
    {
      id: 3,
      text: "Attack on Titan finale airs this week!",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "Anime",
    },
    {
      id: 4,
      text: "You have a new follower in the community.",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "Community",
    },
  ]);
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

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-900/20 to-purple-900/20 rounded-lg p-4 sm:p-6 border border-purple-800/30 mb-6 sm:mb-8">
            <div className="flex flex-col items-center sm:items-start md:flex-row md:items-center space-y-4 sm:space-y-6 md:space-y-0 md:space-x-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-4 border-purple-500 overflow-hidden">
                  <Image
                    src={userData.avatar}
                    alt={userData.username}
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
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {userData.username}
                  </h1>
                  <Link
                    href="/profile/edit"
                    className="flex items-center justify-center space-x-2 btn-purple text-white/90 px-3 py-2 sm:py-2 rounded-lg transition-colors text-sm sm:text-base min-h-[44px] sm:min-h-0">
                    <Edit3 className="h-3 w-3" />
                    <span className="text-sm text-white/90">Edit Profile</span>
                  </Link>
                </div>
                <h3 className="text-sm font-normal text-white mt-1 mb-3">
                  Watching <b>One Piece</b>
                </h3>
                <div className="flex items-center text-white py-1 rounded-full text-sm font-medium">
                  <span className="mr-2">🌐</span>
                  <button
                    className="text-white hover:text-pink-400 focus:outline-none mr-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "http://localhost:3000/profile"
                      );
                    }}
                    title="Copy profile URL to clipboard">
                    URL
                  </button>
                  <span> - Joined Jun 29, 2025 (1 days old)</span>
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
            <div className="bg-[#0d1628] text-white/90 min-h-screen p-5 rounded-md sm:p-8">
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
                          Anime present in your list but not available in our
                          library will not be imported.
                        </li>
                        <li>
                          This process may take some time, so please be patient.
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
                      You can upload a XML file that uses MAL format, or a text
                      file (TXT) that contains a list of MAL/AL urls that you
                      want to import.
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
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium mt-4">
                      Download Export
                    </button>
                  </div>
                )}
                {importExportMode === "autosync" && (
                  <div>
                    {/* Only Auto Sync content and Grant Permission button */}
                    <div className="bg-[#2b354a] p-4 rounded-md text-sm text-gray-400">
                      <h3 className="text-lg font-semibold mb-2">Auto Sync</h3>
                      <p className="mb-4">
                        Automatically sync your anime list with supported
                        platforms.
                      </p>
                      <button className="bg-blue-600 text-white/90 px-6 py-2 rounded-md font-medium">
                        Grant Permission
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-[#1a2438] p-8 rounded-lg w-full border border-[#2b354a]">
              <h2 className="text-xl font-semibold mb-8">Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-10">
                <div>
                  <p className="font-medium">Title Language</p>
                  <p className="text-sm text-gray-400">
                    Preferred language for anime titles
                  </p>
                </div>
                <select className="bg-[#2e3a52] text-white/90 p-2 rounded-md w-full focus:outline-none">
                  <option>English</option>
                </select>

                <div>
                  <p className="font-medium">Video Language</p>
                  <p className="text-sm text-gray-400">
                    Preferred audio language
                  </p>
                </div>
                <select className="bg-[#2e3a52] text-white/90 p-2 rounded-md w-full focus:outline-none">
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
                  className="bg-[#2e3a52] text-white/90 p-2 rounded-md w-full focus:outline-none"
                />

                <div>
                  <p className="font-medium">Bookmarks per page</p>
                  <p className="text-sm text-gray-400">
                    Number of anime to show per page
                  </p>
                </div>
                <select className="bg-[#2e3a52] text-white/90 p-2 rounded-md w-full focus:outline-none">
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
                      hideBookmarks === "no" ? "btn-purple" : "bg-[#3b465b]"
                    }`}
                    onClick={() => setHideBookmarks("no")}>
                    No
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-white/90 ${
                      hideBookmarks === "yes" ? "btn-purple" : "bg-[#3b465b]"
                    }`}
                    onClick={() => setHideBookmarks("yes")}>
                    Yes
                  </button>
                </div>

                <div>
                  <p className="font-medium">Hide your profile activities</p>
                  <p className="text-sm text-gray-400">
                    Hide your recent activities from others
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`px-4 py-2 rounded-md text-white/90 ${
                      hideActivities === "no" ? "btn-purple" : "bg-[#3b465b]"
                    }`}
                    onClick={() => setHideActivities("no")}>
                    No
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-white/90 ${
                      hideActivities === "yes" ? "btn-purple" : "bg-[#3b465b]"
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
                <div className="bg-[#131c31] p-5 rounded-lg w-full max-w-3xl border border-[#1d2a47]">
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
                      <span className="text-sm text-white/90">of LAZARUS</span>
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

                {/* <!-- Watch List --> */}
                <div className="bg-[#131c31] p-5 rounded-lg w-full max-w-sm border border-[#1d2a47]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <span className="text-purple-400">📋</span> Watch List
                    </h2>
                    <a
                      href="#"
                      className="text-white hover:text-blue-400 text-sm">
                      🔗
                    </a>
                  </div>

                  <div className="bg-[#1c243b] rounded-md p-3 flex gap-3 items-center">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Koupenchan.png/220px-Koupenchan.png"
                      alt="Koupen-chan"
                      className="w-16 h-20 object-cover rounded-md"
                      width={16}
                      height={20}
                    />
                    <div>
                      <h3 className="font-semibold">Koupen-chan</h3>
                      <div className="mt-1">
                        <div className="flex flex-wrap gap-2">
                          <span className="btn-pink text-white/90 px-2 py-0.5 rounded-full text-xs font-medium">
                            SUB 23
                          </span>
                          <span className="btn-purple text-white/90 px-2 py-0.5 rounded-full text-xs font-medium">
                            DUB 12
                          </span>
                          <span className="text-sm text-gray-400">TV</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recently Watched */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Clock className="h-6 w-6 text-pink mr-3" />
                    Recently Watched
                  </h2>
                  <Link
                    href="/continue-watching"
                    className="flex items-center space-x-2 text-pink-400 hover:text-pink-300 transition-colors">
                    <span>View All</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3 sm:gap-4">
                  {userLists.recentlyWatched.map((anime) => (
                    <div key={anime.id} className="relative">
                      <AnimeCard anime={anime} showPopup={true} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "watching" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <PlayCircle className="h-6 w-6 text-pink mr-3" />
                Currently Watching ({userLists.recentlyWatched.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-4">
                {userLists.recentlyWatched.map((anime) => (
                  <div key={anime.id} className="relative">
                    <AnimeCard anime={anime} showPopup={true} />
                    <div className="mt-2 bg-gray-800/50 rounded p-2">
                      <div className="text-xs sm:text-sm text-gray-300 mb-1">
                        Episode {Math.floor(Math.random() * 20) + 1} /{" "}
                        {/* {anime.episodes || "?"} */}
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.random() * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "bookmark" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Bookmark className="h-6 w-6 text-pink mr-3" />
                Plan to Watch ({userData.stats.planToWatch})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-4">
                {userLists.bookmark.map((anime) => (
                  <div key={anime.id} className="relative">
                    <AnimeCard anime={anime} showPopup={true} />
                  </div>
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
