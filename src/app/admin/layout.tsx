"use client";

import { ReactNode } from "react";
import { User, Film, Settings, BarChart2, LogOut, Layers, List, Tag, MessageCircle, Bell, Grid, Users, FileText } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections = [
  {
    heading: null,
    items: [
      { key: "dashboard", label: "Dashboard", icon: <BarChart2 className="w-5 h-5 mr-2" />, href: "/admin" },
    ],
  },
  {
    heading: "Content",
    items: [
      { key: "anime", label: "Anime", icon: <Film className="w-5 h-5 mr-2" />, href: "/admin/anime" },
      { key: "episodes", label: "Episodes", icon: <List className="w-5 h-5 mr-2" />, href: "/admin/episodes" },
      { key: "grid", label: "Content Grid", icon: <Grid className="w-5 h-5 mr-2" />, href: "/admin/grid" },
      { key: "genres", label: "Genres", icon: <Tag className="w-5 h-5 mr-2" />, href: "/admin/genres" },
    ],
  },
  {
    heading: "Users",
    items: [
      { key: "users", label: "User Management", icon: <Users className="w-5 h-5 mr-2" />, href: "/admin/users" },
    ],
  },
  {
    heading: "Requests",
    items: [
      { key: "requests", label: "Requests", icon: <FileText className="w-5 h-5 mr-2" />, href: "/admin/requests" },
    ],
  },
  {
    heading: "Community",
    items: [
      { key: "comments", label: "Comments", icon: <MessageCircle className="w-5 h-5 mr-2" />, href: "/admin/comments" },
    ],
  },
  {
    heading: "Notifications",
    items: [
      { key: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5 mr-2" />, href: "/admin/notifications" },
    ],
  },
  {
    heading: "Settings",
    items: [
      { key: "settings", label: "Settings", icon: <Settings className="w-5 h-5 mr-2" />, href: "/admin/settings" },
    ],
  },
];

function getSectionTitle(pathname: string) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/anime")) return "Anime Management";
  if (pathname.startsWith("/admin/episodes")) return "Episode Management";
  if (pathname.startsWith("/admin/grid")) return "Content Grid Management";
  if (pathname.startsWith("/admin/genres")) return "Genre Management";
  if (pathname.startsWith("/admin/users")) return "User Management";
  if (pathname.startsWith("/admin/requests")) return "Request Management";
  if (pathname.startsWith("/admin/comments")) return "Comment Moderation";
  if (pathname.startsWith("/admin/notifications")) return "Notifications";
  if (pathname.startsWith("/admin/settings")) return "Settings";
  return "Admin";
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const sectionTitle = getSectionTitle(pathname);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col bg-gray-900 border-r border-gray-800 p-6 sticky top-0 min-h-screen shadow-lg z-30 overflow-y-auto">
        <div className="mb-8 flex items-center gap-2">
          <span className="text-2xl font-bold text-green-400">Yuki</span>
          <span className="text-lg font-semibold text-white">Admin</span>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {navSections.map((section, idx) => (
            <div key={idx} className="mb-2">
              {section.heading && (
                <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-2 pl-2 pt-2">
                  {section.heading}
                </div>
              )}
              {section.items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-lg text-left font-medium transition-colors w-full text-base no-underline mb-1 ${
                      isActive
                        ? "bg-green-600/90 text-white shadow"
                        : "hover:bg-gray-800/80 text-gray-300"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="mt-8">
          <button className="flex items-center px-4 py-2 rounded-lg text-red-400 hover:bg-gray-800/80 w-full">
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </button>
        </div>
      </aside>
      {/* Mobile Sidebar */}
      <aside className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex flex-row justify-around z-40 shadow-lg overflow-x-auto">
        {navSections.flatMap((section) => section.items).map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center px-2 py-2 text-xs font-medium transition-colors w-full no-underline ${
                isActive ? "text-green-400" : "text-gray-400 hover:text-green-300"
              }`}
            >
              {item.icon}
              <span>{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 flex items-center px-6 border-b border-gray-800 bg-gray-950/80 sticky top-0 z-10 shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">{sectionTitle}</h1>
        </header>
        <main className="flex-1 p-4 md:p-10 bg-gray-950/80 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
} 