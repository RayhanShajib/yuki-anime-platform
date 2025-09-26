"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";

import Image from "next/image";

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

export default function UrlPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-900/20 to-blue-900/20 rounded-lg p-4 sm:p-6 border border-blue-800/30 mb-6 sm:mb-8">
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
                </div>
                <h3 className="text-sm font-normal text-white mt-1 mb-3">
                  Watching<b>....</b>
                </h3>
                <div className="flex items-center text-white py-1 rounded-full text-sm font-medium">
                  <span className="mr-2">🌐</span>
                  <button
                    className="text-white hover:text-blue-600 focus:outline-none mr-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "http://localhost:3000/url-profile"
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

          {/* Tab Content */}

          <div className="space-y-8">
            <div className="flex gap-8 flex-wrap justify-center">
              {/* <!-- Activities Card --> */}
              <div className="bg-[#131c31] p-5 rounded-lg w-full max-w-3xl border border-[#1d2a47]">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="text-blue-400">🕒</span> ACTIVITIES
                </h2>

                <div className="mt-5 flex justify-center">
                  <span className="text-md text-gray-400">
                    There is no activities
                  </span>
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
                <div className="mt-5 flex justify-center">
                  <span className="text-md text-gray-400">
                    There is no activities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
