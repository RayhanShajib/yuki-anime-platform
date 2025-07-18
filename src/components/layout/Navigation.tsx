"use client";

import { useTheme } from "@/lib/ThemeContext";
import {
  Bell,
  BookOpen,
  Globe,
  LogOut,
  Menu,
  Moon,
  Play,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface NavigationProps {
  isLandingPage?: boolean;
}

export function Navigation({ isLandingPage = false }: NavigationProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md  shadow-lg"
          : "bg-transparent"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-500">雪</div>
            <span className="text-xl font-semibold text-white">Yuki</span>
          </Link>

          <div className="flex items-center space-x-4">
            {!isLandingPage && (
              <div className="relative lg:block">
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`transition-all duration-300 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isScrolled ? "bg-gray-800/80" : "bg-slate-700/60"
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim() !== "") {
                      window.location.href = `/search?search=${encodeURIComponent(
                        searchQuery
                      )}`;
                    }
                  }}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                {/* Filter Icon */}
                <button
                  type="button"
                  className="absolute right-3 top-2.5 h-5 w-5 flex items-center justify-center text-gray-400 focus:outline-none cursor-pointer"
                  title="Filter"
                  onClick={() => {
                    window.location.href = "/search";
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-9 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 14.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-3.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z"></path>
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-white hover:text-blue-400 transition-colors">
              Home
            </Link>

            <div className="relative group">
              <button className="text-white hover:text-blue-400 transition-colors flex items-center space-x-1">
                <span>Browse</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                  isScrolled
                    ? "bg-gray-900/95 backdrop-blur-md border border-gray-700/50"
                    : "bg-gray-900"
                }`}>
                <div className="py-2">
                  <Link
                    href="/latest"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                    Latest
                  </Link>
                  <Link
                    href="/popular"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                    Popular
                  </Link>
                  <Link
                    href="/ongoing"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                    On Going
                  </Link>
                  <Link
                    href="/movies"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                    Movies
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="text-white hover:text-blue-400 transition-colors flex items-center space-x-1">
                <span>Genre</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`absolute top-full left-0 mt-2 w-64 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                  isScrolled
                    ? "bg-gray-900/95 backdrop-blur-md border border-gray-700/50"
                    : "bg-gray-900"
                }`}>
                <div className="py-2 grid grid-cols-2 gap-1 p-4">
                  {[
                    "Action",
                    "Adventure",
                    "Comedy",
                    "Drama",
                    "Fantasy",
                    "Horror",
                    "Mystery",
                    "Romance",
                    "Sci-Fi",
                    "Slice of Life",
                  ].map((genre) => (
                    <Link
                      key={genre}
                      href={`/genre/${genre.toLowerCase()}`}
                      className="block px-2 py-1 text-sm text-white hover:bg-gray-800 rounded">
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/schedule"
              className="text-white hover:text-blue-400 transition-colors">
              Schedule
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="text-white hover:text-blue-400 transition-colors"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button className="text-white hover:text-blue-400 transition-colors">
              <Globe className="h-5 w-5" />
            </button>

            {isLoggedIn && (
              <button className="text-white hover:text-blue-400 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </button>
            )}

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden md:inline">Username</span>
                </button>

                {isUserMenuOpen && (
                  <div
                    className={`absolute top-full right-0 mt-2 w-56 rounded-md shadow-lg transition-all duration-200 ${
                      isScrolled
                        ? "bg-gray-900/95 backdrop-blur-md border border-gray-700/50"
                        : "bg-gray-900"
                    }`}>
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800">
                        <User className="h-4 w-4 mr-3" />
                        Profile Page
                      </Link>
                      <Link
                        href="/profile/edit"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800">
                        <Settings className="h-4 w-4 mr-3" />
                        ✏️ Edit Profile
                      </Link>
                      <Link
                        href="/continue-watching"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800">
                        <Play className="h-4 w-4 mr-3" />
                        ⏯️ Continue Watching
                      </Link>
                      <Link
                        href="/bookmarks"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800">
                        <BookOpen className="h-4 w-4 mr-3" />
                        💖 Bookmarks
                      </Link>
                      <Link
                        href="/notifications"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800">
                        <Bell className="h-4 w-4 mr-3" />
                        Notifications
                      </Link>
                      <Link
                        href="/import-export"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800">
                        <Settings className="h-4 w-4 mr-3" />
                        📥📤 Import/Export
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800">
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </Link>
                      <hr className="my-2 border-gray-700" />
                      <button className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-800">
                        <LogOut className="h-4 w-4 mr-3" />
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-white hover:text-blue-400 transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Register
                </Link>
                <button className="text-white hover:text-blue-400 transition-colors relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
                </button>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-blue-400 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden border-t transition-all duration-300 ${
            isScrolled
              ? "bg-black/95 backdrop-blur-md border-gray-700/50"
              : "bg-black/95 border-gray-800"
          }`}>
          <div className="px-4 py-4 space-y-4">
            {/* Search Bar on Mobile */}
            {!isLandingPage && (
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`transition-all duration-300 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isScrolled
                      ? "bg-gray-800/80 border border-gray-700/50"
                      : "bg-gray-800"
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim() !== "") {
                      window.location.href = `/search?search=${encodeURIComponent(
                        searchQuery
                      )}`;
                    }
                  }}
                />
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-white hover:text-blue-400 transition-colors py-2 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}>
                🏠 Home
              </Link>

              {/* Browse Section */}
              <div className="space-y-1">
                <div className="text-gray-300 font-medium text-sm uppercase tracking-wide mb-2">
                  Browse
                </div>
                <Link
                  href="/latest"
                  className="block text-white hover:text-blue-400 transition-colors py-2 pl-4"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  📅 Latest
                </Link>
                <Link
                  href="/popular"
                  className="block text-white hover:text-blue-400 transition-colors py-2 pl-4"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  🔥 Popular
                </Link>
                <Link
                  href="/ongoing"
                  className="block text-white hover:text-blue-400 transition-colors py-2 pl-4"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  📺 On Going
                </Link>
                <Link
                  href="/movies"
                  className="block text-white hover:text-blue-400 transition-colors py-2 pl-4"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  🎬 Movies
                </Link>
              </div>

              {/* Genres Section */}
              <div className="space-y-1">
                <div className="text-gray-300 font-medium text-sm uppercase tracking-wide mb-2 mt-4">
                  Genres
                </div>
                <div className="grid grid-cols-2 gap-2 pl-4">
                  {[
                    "Action",
                    "Adventure",
                    "Comedy",
                    "Drama",
                    "Fantasy",
                    "Horror",
                    "Mystery",
                    "Romance",
                    "Sci-Fi",
                    "Slice of Life",
                  ].map((genre) => (
                    <Link
                      key={genre}
                      href={`/genre/${genre.toLowerCase()}`}
                      className="block text-white hover:text-blue-400 transition-colors py-1 text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/schedule"
                className="block text-white hover:text-blue-400 transition-colors py-2 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}>
                📅 Schedule
              </Link>
            </div>

            {/* User Menu on Mobile */}
            {isLoggedIn && (
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="space-y-2">
                  <Link
                    href="/profile"
                    className="flex items-center text-white hover:text-blue-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <User className="h-5 w-5 mr-3" />
                    👤 Profile
                  </Link>
                  <Link
                    href="/profile/edit"
                    className="flex items-center text-white hover:text-blue-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <Settings className="h-5 w-5 mr-3" />
                    ✏️ Edit Profile
                  </Link>
                  <Link
                    href="/continue-watching"
                    className="flex items-center text-white hover:text-blue-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <Play className="h-5 w-5 mr-3" />
                    ⏯️ Continue Watching
                  </Link>
                  <Link
                    href="/bookmarks"
                    className="flex items-center text-white hover:text-blue-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <BookOpen className="h-5 w-5 mr-3" />
                    💖 Bookmarks
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center text-white hover:text-blue-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <Bell className="h-5 w-5 mr-3" />
                    🔔 Notifications
                  </Link>
                  <Link
                    href="/import-export"
                    className="flex items-center text-white hover:text-blue-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <Settings className="h-5 w-5 mr-3" />
                    📥📤 Import/Export
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center text-white hover:text-blue-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <Settings className="h-5 w-5 mr-3" />
                    ⚙️ Settings
                  </Link>
                  <button className="flex items-center w-full text-white hover:text-blue-400 transition-colors py-2">
                    <LogOut className="h-5 w-5 mr-3" />
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}

            {/* Login/Register for non-logged users */}
            {!isLoggedIn && (
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block text-center text-white hover:text-blue-400 transition-colors py-3 border border-gray-600 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    🔐 Login
                  </Link>
                  <Link
                    href="/register"
                    className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    📝 Register
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
