"use client";

import { Navigation } from "@/components/layout/Navigation";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { mockAnime } from "@/lib/mockData";
import {
  Activity,
  Bookmark,
  Calendar,
  ChevronRight,
  Clock,
  Edit3,
  Heart,
  PlayCircle,
  Star,
  Trophy,
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
  level: 42,
  exp: 8750,
  nextLevelExp: 10000,
  badges: [
    {
      id: 1,
      name: "Binge Watcher",
      icon: "🍿",
      description: "Watched 10 episodes in one day",
    },
    {
      id: 2,
      name: "Genre Explorer",
      icon: "🗺️",
      description: "Watched anime from 15+ genres",
    },
    {
      id: 3,
      name: "Early Bird",
      icon: "🌅",
      description: "Watched 50+ ongoing series",
    },
    {
      id: 4,
      name: "Completionist",
      icon: "✅",
      description: "Completed 100+ anime series",
    },
  ],
  stats: {
    episodesWatched: 3247,
    minutesWatched: 233640,
    averageRating: 8.4,
    completedSeries: 134,
    droppedSeries: 12,
    onHoldSeries: 8,
    planToWatch: 45,
  },
};

// Mock user's anime lists
const userLists = {
  recentlyWatched: mockAnime.slice(0, 6),
  favorites: mockAnime.slice(6, 12),
  watchlist: mockAnime.slice(12, 18),
  completed: mockAnime.slice(18, 24),
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  const levelProgress = (userData.exp / userData.nextLevelExp) * 100;

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-4 sm:p-6 lg:p-8 border border-purple-800/30 mb-6 sm:mb-8">
            <div className="flex flex-col items-center sm:items-start md:flex-row md:items-center space-y-4 sm:space-y-6 md:space-y-0 md:space-x-8">
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
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-purple-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-xs sm:text-sm">
                  {userData.level}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {userData.username}
                  </h1>
                  <Link
                    href="/profile/edit"
                    className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 sm:py-2 rounded-lg transition-colors text-sm sm:text-base min-h-[44px] sm:min-h-0">
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <div className="text-center bg-gray-800/30 rounded-lg p-3 sm:p-4">
                    <div className="text-xl sm:text-2xl font-bold text-purple-400">
                      {userData.totalWatched}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">
                      Anime Watched
                    </div>
                  </div>
                  <div className="text-center bg-gray-800/30 rounded-lg p-3 sm:p-4">
                    <div className="text-xl sm:text-2xl font-bold text-blue-400">
                      {userData.totalHours.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">
                      Hours Watched
                    </div>
                  </div>
                  <div className="text-center bg-gray-800/30 rounded-lg p-3 sm:p-4">
                    <div className="text-xl sm:text-2xl font-bold text-green-400">
                      {userData.stats.averageRating}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">
                      Avg Rating
                    </div>
                  </div>
                  <div className="text-center bg-gray-800/30 rounded-lg p-3 sm:p-4">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-400">
                      {userData.badges.length}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">
                      Badges
                    </div>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">
                      Level {userData.level}
                    </span>
                    <span className="text-gray-400">
                      {userData.exp} / {userData.nextLevelExp} XP
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${levelProgress}%` }}></div>
                  </div>
                </div>

                {/* Join Date */}
                <div className="flex items-center space-x-2 text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Member since{" "}
                    {new Date(userData.joinDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gray-800 rounded-lg p-1 mb-6 sm:mb-8">
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
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
                  key: "completed",
                  label: "Completed",
                  shortLabel: "Completed",
                  icon: Trophy,
                },
                {
                  key: "favorites",
                  label: "Favorites",
                  shortLabel: "Favorites",
                  icon: Heart,
                },
                {
                  key: "watchlist",
                  label: "Watchlist",
                  shortLabel: "Watchlist",
                  icon: Bookmark,
                },
                {
                  key: "stats",
                  label: "Statistics",
                  shortLabel: "Stats",
                  icon: Activity,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-h-[44px] sm:min-h-0 ${
                      activeTab === tab.key
                        ? "bg-purple-600 text-white"
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

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Badges */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Trophy className="h-6 w-6 text-yellow-500 mr-3" />
                  Achievements
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {userData.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-yellow-500/50 transition-colors min-h-[120px] flex flex-col">
                      <div className="text-3xl sm:text-4xl mb-2">
                        {badge.icon}
                      </div>
                      <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">
                        {badge.name}
                      </h3>
                      <p className="text-gray-400 text-xs sm:text-sm flex-1">
                        {badge.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recently Watched */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Clock className="h-6 w-6 text-blue-500 mr-3" />
                    Recently Watched
                  </h2>
                  <Link
                    href="/continue-watching"
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors">
                    <span>View All</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {userLists.recentlyWatched.map((anime) => (
                    <AnimeCard key={anime.id} anime={anime} showPopup={true} />
                  ))}
                </div>
              </div>

              {/* Favorites Preview */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Heart className="h-6 w-6 text-red-500 mr-3" />
                    Favorite Anime
                  </h2>
                  <button
                    onClick={() => setActiveTab("favorites")}
                    className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors">
                    <span>View All</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {userLists.favorites.map((anime) => (
                    <AnimeCard key={anime.id} anime={anime} showPopup={true} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "watching" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <PlayCircle className="h-6 w-6 text-green-500 mr-3" />
                Currently Watching ({userLists.recentlyWatched.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
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

          {activeTab === "completed" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Trophy className="h-6 w-6 text-yellow-500 mr-3" />
                Completed Anime ({userData.stats.completedSeries})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {userLists.completed.map((anime) => (
                  <div key={anime.id} className="relative">
                    <div className="absolute top-2 right-2 z-10 bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      ✓
                    </div>
                    <AnimeCard anime={anime} showPopup={true} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Heart className="h-6 w-6 text-red-500 mr-3" />
                Favorite Anime
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {userLists.favorites.map((anime) => (
                  <div key={anime.id} className="relative">
                    <div className="absolute top-2 right-2 z-10 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      ♥
                    </div>
                    <AnimeCard anime={anime} showPopup={true} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "watchlist" && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Bookmark className="h-6 w-6 text-blue-500 mr-3" />
                Plan to Watch ({userData.stats.planToWatch})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {userLists.watchlist.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} showPopup={true} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Activity className="h-6 w-6 text-purple-500 mr-3" />
                Statistics
              </h2>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-gray-800/50 rounded-lg p-4 sm:p-6 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <PlayCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-white">
                        {userData.stats.episodesWatched.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-xs sm:text-sm">
                        Episodes
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="h-8 w-8 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {Math.floor(
                          userData.stats.minutesWatched / 60
                        ).toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-sm">Hours</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Star className="h-8 w-8 text-yellow-500" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {userData.stats.averageRating}
                      </div>
                      <div className="text-gray-400 text-sm">Avg Rating</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-4">
                    <Trophy className="h-8 w-8 text-purple-500" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {userData.stats.completedSeries}
                      </div>
                      <div className="text-gray-400 text-sm">Completed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Watching Status */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Watching Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Completed</span>
                      <span className="text-green-400 font-semibold">
                        {userData.stats.completedSeries}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Currently Watching</span>
                      <span className="text-blue-400 font-semibold">
                        {userLists.recentlyWatched.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Plan to Watch</span>
                      <span className="text-purple-400 font-semibold">
                        {userData.stats.planToWatch}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">On Hold</span>
                      <span className="text-yellow-400 font-semibold">
                        {userData.stats.onHoldSeries}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Dropped</span>
                      <span className="text-red-400 font-semibold">
                        {userData.stats.droppedSeries}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Favorite Genres */}
                <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Favorite Genres
                  </h3>
                  <div className="space-y-3">
                    {userData.favoriteGenres.map((genre, index) => (
                      <div key={genre} className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="text-gray-300">{genre}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
