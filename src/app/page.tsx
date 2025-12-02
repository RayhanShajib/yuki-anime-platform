"use client";
import { FooterSection } from "@/components/sections/FooterSection";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <nav className="p-4 flex justify-center space-x-6 text-white text-sm uppercase tracking-wide absolute z-50 items-center left-0 right-0 mx-auto">
        <a href="#" className="hover:text-purple-400">
          Genres
        </a>
        <a href="#" className="hover:text-purple-400">
          Types
        </a>
        <a href="#" className="hover:text-purple-400">
          New Releases
        </a>
        <a href="#" className="hover:text-purple-400">
          Updates
        </a>
        <a href="#" className="hover:text-purple-400">
          Ongoing
        </a>
        <a href="#" className="hover:text-purple-400">
          Recent
        </a>
      </nav>

      {/* <!-- Hero Section with absolutely positioned image --> */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden min-w-full">
        <div className="absolute inset-0">
          <Image
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7585f04ac8-822757b4bbcad5182960.png"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover z-0"
            width={90}
            height={90}
          />
        </div>

        <div className="relative z-60 bg-opacity-70 mt-30 rounded-lg text-center max-w-2xl w-full">
          <div className="text-4xl font-bold mb-6 flex gap-2 justify-center items-center">
            <div className="relative h-[100px] w-[200px]">
              <Image
                className="text-transparent absolute -top-[26px] left-0 overflow-hidden"
                width={200}
                height={100}
                src="/logo.png"
                alt="Logo"
              />
            </div>
          </div>
          <div className="flex justify-center mb-4 w-full">
            <div className="xl:flex items-center space-x-4 w-full">
              <div className="relative lg:block w-full">
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`transition-all duration-300 text-black placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none bg-white w-full`}
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
          </div>
          <p className="text-md text-gray-300 mb-8">
            Dan Da Dan, The Water Magician, One Piece, Dr Stone Science, Welcome
            To The
          </p>
          <Link
            href="/Home"
            className="btn-purple px-6 py-3 rounded-md font-semibold hover:bg-purple-700">
            WATCH NOW
          </Link>
        </div>
        <div className="absolute inset-0 hero-gradient" />
        {/* Left blur gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-50 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
        {/* Bottom blur gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-0 pointer-events-none" />
      </section>

      {/* <!-- Main Content --> */}
      <section className="p-6 max-w-5xl mx-auto text-gray-200 leading-relaxed">
        <h2 className="text-2xl font-bold italic text-white mb-4">
          THE BEST SITE TO WATCH{" "}
          <span className="text-pink">ANIME ONLINE FOR FREE</span>
        </h2>
        <p className="mb-4">
          Anime is not just about stories drawn with pen strokes; it’s a gateway
          to worlds full of emotions and creativity...
        </p>

        <h3 className="text-xl font-semibold text-white mt-6 mb-2">
          1. What is Yuki?
        </h3>
        <p className="mb-4">
          Yuki is a free anime streaming site where you can watch anime in HD
          quality with both subbed and dubbed options...
        </p>

        <h3 className="text-xl font-semibold text-white mt-6 mb-2">
          2. What makes Yuki the best site to watch anime free online?
        </h3>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>
            <strong>Safety:</strong> No ads, no redirects, and absolutely no
            viruses.
          </li>
          <li>
            <strong>Content Library:</strong> Collection from 1980s to latest
            releases, subbed and dubbed.
          </li>
          <li>
            <strong>Quality:</strong> Stream from 360p to 1080p with adaptive
            quality settings.
          </li>
          <li>
            <strong>Experience:</strong> Fast, buffer-free performance.
          </li>
          <li>
            <strong>Updates:</strong> New episodes added frequently.
          </li>
          <li>
            <strong>UX/UI:</strong> Designed for ease of use on all devices.
          </li>
          <li>
            <strong>Compatibility:</strong> Works on both desktop and mobile.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-6 mb-2">
          3. How does Yuki compare to 9Anime, AniWave, HiAnime, and GogoAnime?
        </h3>
        <p className="mb-4">
          We have a bigger library than HiAnime and Gogo. Our UI/UX is modern
          and better than 9Anime. We also support advanced features...
        </p>

        <p className="italic text-pink mt-6">
          If you enjoy your time with us, please spread the word and don’t
          forget to bookmark our site!
        </p>
      </section>

      <FooterSection />
    </div>
  );
}
