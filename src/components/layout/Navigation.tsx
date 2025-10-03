"use client";

import {
  Bell,
  BookOpen,
  LogOut,
  Menu,
  Play,
  Search,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NotificationDropdown } from "../ui/NotificationDropdown";
interface NavigationProps {
  isLandingPage?: boolean;
}

export function Navigation({ isLandingPage = false }: NavigationProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [language, setLanguage] = useState<"en" | "jp">("en");

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileBrowseOpen, setMobileBrowseOpen] = useState(false);
  const [mobileGenresOpen, setMobileGenresOpen] = useState(false);
  const [isMobileMenuClosing, setIsMobileMenuClosing] = useState(false);

  // Ref for mobile menu
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  // Ref for notification dropdown
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!(isMobileMenuOpen || isMobileMenuClosing)) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuClosing(true);
        setTimeout(() => {
          setIsMobileMenuOpen(false);
          setIsMobileMenuClosing(false);
        }, 600);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, isMobileMenuClosing]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    if (!showNotification) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotification(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotification]);

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
      className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 ${
        isLandingPage
          ? isScrolled
            ? "bg-purple backdrop-blur-md shadow-lg"
            : "bg-transparent"
          : "bg-purple shadow-lg"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div>
              <Image width={200} height={100} src="/logo.png" alt="Logo" />
            </div>
          </Link>

          <div className="hidden xl:flex items-center space-x-4">
            <div className="relative lg:block">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`transition-all duration-300 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none ${
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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 14.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 019 18v-3.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="hidden xl:flex items-center space-x-6">
            <Link
              href="/"
              className="text-white hover:text-purple-400 transition-colors">
              Home
            </Link>

            <div className="relative group">
              <button className="text-white hover:text-purple-400 transition-colors flex items-center space-x-1">
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
                    ? "bg-gray-900/95 backdrop-blur-md border border-gray-700/50 bg-drop-down"
                    : "bg-gray-900"
                }`}>
                <div className="py-2">
                  <Link
                    href="/latest"
                    className="block px-4 py-2 text-sm text-white 800">
                    Latest
                  </Link>
                  <Link
                    href="/popular"
                    className="block px-4 py-2 text-sm text-white ">
                    Popular
                  </Link>
                  <Link
                    href="/ongoing"
                    className="block px-4 py-2 text-sm text-white ">
                    On Going
                  </Link>
                  <Link
                    href="/movies"
                    className="block px-4 py-2 text-sm text-white ">
                    Movies
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="text-white hover:text-purple-400 transition-colors flex items-center space-x-1">
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
                    ? "bg-gray-900/95 backdrop-blur-md border border-gray-700/50 bg-drop-down"
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
                      className="block px-1 py-1 text-sm text-white rounded">
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/random"
              className="text-white hover:text-purple-400 transition-colors">
              Random
            </Link>
            <Link
              href="/schedule"
              className="text-white hover:text-purple-400 transition-colors">
              Schedule
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex items-center">
              <div className="flex">
                <button
                  className={`px-2.5 py-1 rounded-l-2xl text-xs font-semibold transition-colors focus:outline-none ${
                    language === "en"
                      ? "btn-purple text-white"
                      : "bg-gray-700 text-blue-200 hover:bg-[#7760A9] hover:text-white"
                  }`}
                  onClick={() => setLanguage("en")}
                  aria-pressed={language === "en"}>
                  EN
                </button>
                <button
                  className={`px-2.5 py-1 rounded-r-2xl text-xs font-semibold transition-colors focus:outline-none ${
                    language === "jp"
                      ? "btn-purple text-white"
                      : "bg-gray-700 text-white hover:bg-[#7760A9] hover:text-white"
                  }`}
                  onClick={() => setLanguage("jp")}
                  aria-pressed={language === "jp"}>
                  JP
                </button>
              </div>
            </div>

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
                        Edit Profile
                      </Link>
                      <Link
                        href="/continue-watching"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800">
                        <Play className="h-4 w-4 mr-3" />
                        Continue Watching
                      </Link>
                      <Link
                        href="/bookmarks"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800">
                        <BookOpen className="h-4 w-4 mr-3" />
                        Bookmarks
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
                        Import/Export
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
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="hidden xl:flex text-white login-btn hover:text-purple-400 transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="hidden xl:flex register-btn text-white/90 px-3.5 py-1 rounded-lg transition-colors btn-purple">
                  Register
                </Link>
                {/* Notification Icon and Dropdown */}
                <div className="relative" ref={notificationRef}>
                  <button
                    className="text-white transition-colors relative"
                    onClick={() => setShowNotification(!showNotification)}
                    title="Notifications">
                    <Bell className="h-5.5 w-5.5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white/90">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  {showNotification && (
                    <div className="pt-2 mt-2 absolute top-full right-0 z-50 w-[min(80vw,350px)]">
                      <NotificationDropdown
                        notifications={notifications}
                        onRemove={handleRemoveNotif}
                        onClose={() => setShowNotification(true)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (isMobileMenuOpen) {
                  setIsMobileMenuClosing(true);
                  setTimeout(() => {
                    setIsMobileMenuOpen(false);
                    setIsMobileMenuClosing(false);
                  }, 600); // match animation duration
                } else {
                  setIsMobileMenuOpen(true);
                }
              }}
              className="xl:hidden text-white hover:text-purple-400 transition-colors">
              {isMobileMenuOpen || isMobileMenuClosing ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {(isMobileMenuOpen || isMobileMenuClosing) && (
        <div
          ref={mobileMenuRef}
          className={`xl:hidden fixed top-0 left-0 h-[100vh] w-64 transform
            ${
              isMobileMenuClosing
                ? "animate-navbar-slide-out"
                : "animate-navbar-slide-in"
            }
            bg-purple h-[100vh]`}>
          {/* Navbar Slide-in Animation */}
          <style jsx>{`
            @keyframes navbar-slide-in {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(0);
              }
            }
            @keyframes navbar-slide-out {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-100%);
              }
            }
            .animate-navbar-slide-in {
              animation: navbar-slide-in 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)
                forwards;
            }
            .animate-navbar-slide-out {
              animation: navbar-slide-out 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)
                forwards;
            }
          `}</style>
          <div className="px-4 py-4 space-y-4 h-full overflow-y-auto">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`transition-all duration-300 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-3 w-full focus:outline-none ${
                  isScrolled
                    ? "bg-gray-800/80 border border-gray-700/50"
                    : "bg-gray-800"
                }`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim() !== "") {
                    window.location.href = `/search?search=${encodeURIComponent(
                      searchQuery
                    )}`;
                    setIsMobileMenuOpen(false);
                  }
                }}
              />
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              {/* Filter Icon */}
              <button
                type="button"
                className="absolute right-3 top-3.5 h-5 w-5 flex items-center justify-center text-gray-400 focus:outline-none cursor-pointer"
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

            {/* Navigation Links */}
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-white hover:text-purple-400 transition-colors py-2 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>

              {/* Browse Section with Dropdown */}
              <div className="space-y-1">
                <button
                  type="button"
                  className="w-full flex justify-between items-center hover:text-purple-400 font-medium text-sm uppercase tracking-wide mb-2 focus:outline-none"
                  onClick={() => setMobileBrowseOpen((prev) => !prev)}
                  aria-expanded={mobileBrowseOpen}>
                  <span>Browse</span>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
                      mobileBrowseOpen ? "rotate-180" : "rotate-0"
                    }`}
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
                {mobileBrowseOpen && (
                  <div className="pl-4">
                    <Link
                      href="/latest"
                      className="block text-white hover:text-purple-400 transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      Latest
                    </Link>
                    <Link
                      href="/popular"
                      className="block text-white hover:text-purple-400 transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      Popular
                    </Link>
                    <Link
                      href="/ongoing"
                      className="block text-white hover:text-purple-400 transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      On Going
                    </Link>
                    <Link
                      href="/movies"
                      className="block text-white hover:text-purple-400 transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      Movies
                    </Link>
                  </div>
                )}
              </div>

              {/* Genres Section with Dropdown */}
              <div className="space-y-1">
                <button
                  type="button"
                  className="w-full flex justify-between items-center hover:text-purple-400 font-medium text-sm uppercase tracking-wide mb-2 mt-4 focus:outline-none"
                  onClick={() => setMobileGenresOpen((prev) => !prev)}
                  aria-expanded={mobileGenresOpen}>
                  <span>Genres</span>
                  <svg
                    className={`w-4 h-4 transform transition-transform ${
                      mobileGenresOpen ? "rotate-180" : "rotate-0"
                    }`}
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
                {mobileGenresOpen && (
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
                        className="block text-white hover:text-purple-400 transition-colors py-1 text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}>
                        {genre}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link
                href="/random"
                className="block text-white hover:text-purple-400 transition-colors py-2 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}>
                Random
              </Link>
              <Link
                href="/schedule"
                className="block text-white hover:text-purple-400 transition-colors py-2 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}>
                Schedule
              </Link>
              <Link
                href="/contact"
                className="block text-white hover:text-purple-400 transition-colors py-2 text-lg"
                onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </Link>
            </div>

            {/* User Menu on Mobile */}
            {isLoggedIn && (
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div>
                  <Link
                    href="/profile"
                    className="flex items-center text-white hover:text-purple-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <User className="h-5 w-5 mr-3" />
                    Profile
                  </Link>
                  <Link
                    href="/profile/edit"
                    className="flex items-center text-white hover:text-purple-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <Settings className="h-5 w-5 mr-3" />
                    Edit Profile
                  </Link>
                  <Link
                    href="/continue-watching"
                    className="flex items-center text-white hover:text-purple-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <Play className="h-5 w-5 mr-3" />
                    Continue Watching
                  </Link>
                  <Link
                    href="/bookmarks"
                    className="flex items-center text-white hover:text-purple-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <BookOpen className="h-5 w-5 mr-3" />
                    Bookmarks
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center text-white hover:text-purple-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <Bell className="h-5 w-5 mr-3" />
                    Notifications
                  </Link>
                  <Link
                    href="/import-export"
                    className="flex items-center text-white hover:text-purple-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <Settings className="h-5 w-5 mr-3" />
                    Import/Export
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center text-white hover:text-purple-400 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </Link>
                  <button className="flex items-center w-full text-white hover:text-purple-400 transition-colors py-2">
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Login/Register for non-logged users */}
            {!isLoggedIn && (
              <div>
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block text-white hover:text-purple-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block register-btn text-center btn-purple px-3.5 py-1 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    Register
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
