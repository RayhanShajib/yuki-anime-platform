"use client";

import { useState } from "react";
import { trendingAnime } from "@/lib/mockData";
import { ArrowUpRight, ArrowDownRight, User, Film, List, AlertTriangle, FileText, MessageCircle, Search } from "lucide-react";

// Mock data for dashboard
const mockStats = {
  users: { count: 1234, growth: 3.2 },
  anime: { count: 87, growth: 1.1 },
  episodes: { count: 1240, growth: 2.5 },
  requests: { count: 5, growth: -1.0 },
  issues: { count: 2, critical: 1, moderate: 1 },
};



const mockActivity = [
  { type: "user", text: "New user registered: OtakuQueen", time: "2m ago" },
  { type: "anime", text: "Added anime: Jujutsu Kaisen", time: "10m ago" },
  { type: "comment", text: "New comment on 'Attack on Titan'", time: "15m ago" },
  { type: "user", text: "New user registered: MangaMaster", time: "30m ago" },
  { type: "anime", text: "Added anime: Weathering with You", time: "1h ago" },
];

const mockTrending = trendingAnime.slice(0, 5);
const mockDiscussions = [
  { anime: "Attack on Titan", count: 12 },
  { anime: "Demon Slayer", count: 9 },
  { anime: "Jujutsu Kaisen", count: 7 },
];
const mockSearchTerms = ["isekai", "romance", "action", "2024", "Ghibli"];
const mockRequests = [
  { id: 1, title: "Chainsaw Man", user: "AnimeFan123", status: "pending", date: "2024-07-15" },
  { id: 2, title: "Blue Lock", user: "OtakuQueen", status: "pending", date: "2024-07-14" },
];
const mockIssues = [
  { id: 1, type: "critical", text: "Video playback error on 'Jujutsu Kaisen'", date: "2024-07-16" },
  { id: 2, type: "moderate", text: "Subtitle sync issue on 'Demon Slayer'", date: "2024-07-15" },
];

export default function AdminDashboard() {
  const [showAllActivity, setShowAllActivity] = useState(false);
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
      {/* At-a-glance statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-gray-900 rounded-xl p-5 flex flex-col items-center shadow relative">
          <User className="w-7 h-7 text-green-400 mb-2" />
          <div className="text-2xl font-bold text-white">{mockStats.users.count.toLocaleString()}</div>
          <div className="text-gray-400 text-xs mb-1">Total Users</div>
          <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
            <ArrowUpRight className="w-4 h-4" /> {mockStats.users.growth}%
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 flex flex-col items-center shadow relative">
          <Film className="w-7 h-7 text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-white">{mockStats.anime.count}</div>
          <div className="text-gray-400 text-xs mb-1">Anime Series & Movies</div>
          <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
            <ArrowUpRight className="w-4 h-4" /> {mockStats.anime.growth}%
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 flex flex-col items-center shadow relative">
          <List className="w-7 h-7 text-yellow-400 mb-2" />
          <div className="text-2xl font-bold text-white">{mockStats.episodes.count}</div>
          <div className="text-gray-400 text-xs mb-1">Total Episodes</div>
          <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
            <ArrowUpRight className="w-4 h-4" /> {mockStats.episodes.growth}%
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 flex flex-col items-center shadow relative">
          <FileText className="w-7 h-7 text-purple-400 mb-2" />
          <div className="text-2xl font-bold text-white">{mockStats.requests.count}</div>
          <div className="text-gray-400 text-xs mb-1">Pending Requests</div>
          <div className={`flex items-center gap-1 text-xs font-semibold ${mockStats.requests.growth >= 0 ? "text-green-400" : "text-red-400"}`}>
            {mockStats.requests.growth >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />} {Math.abs(mockStats.requests.growth)}%
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 flex flex-col items-center shadow relative">
          <AlertTriangle className="w-7 h-7 text-red-400 mb-2" />
          <div className="text-2xl font-bold text-white">{mockStats.issues.count}</div>
          <div className="text-gray-400 text-xs mb-1">Reported Issues</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-red-400 font-semibold">Critical: {mockStats.issues.critical}</span>
            <span className="text-yellow-400 font-semibold">Moderate: {mockStats.issues.moderate}</span>
          </div>
        </div>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <div className="bg-gray-900 rounded-xl p-6 shadow flex flex-col">
          <div className="font-bold text-lg text-white mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-400" /> Recent Activity
          </div>
          <ul className="flex-1 flex flex-col gap-3">
            {(showAllActivity ? mockActivity : mockActivity.slice(0, 4)).map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-200 text-sm">
                {item.type === "user" && <User className="w-4 h-4 text-blue-400" />}
                {item.type === "anime" && <Film className="w-4 h-4 text-purple-400" />}
                {item.type === "comment" && <MessageCircle className="w-4 h-4 text-green-400" />}
                <span>{item.text}</span>
                <span className="ml-auto text-xs text-gray-400">{item.time}</span>
              </li>
            ))}
          </ul>
          {mockActivity.length > 4 && (
            <button
              className="mt-4 text-green-400 hover:underline text-xs self-end"
              onClick={() => setShowAllActivity((v) => !v)}
            >
              {showAllActivity ? "Show Less" : "Show All"}
            </button>
          )}
        </div>

        {/* Trending Content Overview */}
        <div className="bg-gray-900 rounded-xl p-6 shadow flex flex-col gap-6">
          <div>
            <div className="font-bold text-lg text-white mb-2 flex items-center gap-2">
              <Film className="w-5 h-5 text-yellow-400" /> Trending Anime
            </div>
            <ul className="flex flex-col gap-2">
              {mockTrending.map((anime, i) => (
                <li key={anime.id} className="flex items-center gap-2 text-gray-200 text-sm">
                  <span className="font-bold text-green-400">#{i + 1}</span>
                  <span className="truncate max-w-[120px]">{anime.title}</span>
                  <span className="ml-auto text-xs text-gray-400">{anime.popularity.toLocaleString()} views</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-bold text-lg text-white mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-400" /> Active Discussions
            </div>
            <ul className="flex flex-col gap-2">
              {mockDiscussions.map((d, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-200 text-sm">
                  <span className="truncate max-w-[120px]">{d.anime}</span>
                  <span className="ml-auto text-xs text-gray-400">{d.count} comments</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-bold text-lg text-white mb-2 flex items-center gap-2">
              <Search className="w-5 h-5 text-green-400" /> Popular Search Terms
            </div>
            <div className="flex flex-wrap gap-2">
              {mockSearchTerms.map((term, i) => (
                <span key={i} className="bg-gray-800 text-green-300 px-3 py-1 rounded-full text-xs font-semibold">{term}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Requests & Issues */}
        <div className="flex flex-col gap-6">
          <div className="bg-gray-900 rounded-xl p-6 shadow flex flex-col">
            <div className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" /> Pending Requests
            </div>
            <ul className="flex-1 flex flex-col gap-3">
              {mockRequests.length === 0 && <li className="text-gray-400 text-sm">No pending requests.</li>}
              {mockRequests.map((req) => (
                <li key={req.id} className="flex items-center gap-2 text-gray-200 text-sm">
                  <span className="font-semibold text-green-400">{req.title}</span>
                  <span className="text-xs text-gray-400">by {req.user}</span>
                  <span className="ml-auto text-xs text-gray-400">{req.date}</span>
                  <span className="bg-yellow-700 text-yellow-200 px-2 py-1 rounded text-xs font-bold ml-2">{req.status}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 shadow flex flex-col">
            <div className="font-bold text-lg text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" /> Reported Issues
            </div>
            <ul className="flex-1 flex flex-col gap-3">
              {mockIssues.length === 0 && <li className="text-gray-400 text-sm">No reported issues.</li>}
              {mockIssues.map((issue) => (
                <li key={issue.id} className="flex items-center gap-2 text-gray-200 text-sm">
                  <span className={`font-bold px-2 py-1 rounded text-xs ${issue.type === "critical" ? "bg-red-700 text-red-200" : "bg-yellow-700 text-yellow-200"}`}>{issue.type}</span>
                  <span className="truncate max-w-[120px]">{issue.text}</span>
                  <span className="ml-auto text-xs text-gray-400">{issue.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 