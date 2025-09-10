"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { CommentSection } from "@/components/ui/CommentSection";
import IframeVideoPlayer from "@/components/ui/IframeVideoPlayer";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { latestAnime, mockAnime } from "@/lib/mockData";
import type { Anime } from "@/types/anime";
import { Grid, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import "plyr-react/plyr.css";
import React, { useMemo, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation as SwiperNavigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function WatchPage() {
  const params = useParams();
  const animeId = params?.id as string;
  const anime: Anime | undefined = useMemo(
    () => mockAnime.find((a) => a.id === animeId),
    [animeId]
  );
  // --- Rating State ---
  const [userRating, setUserRating] = useState<number>(0);

  // --- Episode Selection State ---
  const [selectedEpisode, setSelectedEpisode] = React.useState(1);
  // --- Episode List/Grid Toggle State ---
  const [isListView, setIsListView] = React.useState(true);

  // --- Episode Search State ---
  const [searchQuery, setSearchQuery] = React.useState("");

  // --- Info Section Toggle State ---
  const [infoType, setInfoType] = React.useState<"anime" | "episode">(
    "episode"
  );

  // --- Episodes Data (mock, replace with real data if available) ---
  type Episode = { ep: number; title: string };

  // Define a type for the possible episode structure in anime.episodes
  type AnimeEpisode = {
    ep?: number;
    number?: number;
    title?: string;
  };

  const episodes = useMemo<Episode[]>(() => {
    // If anime.episodes exists, use it; otherwise, use a mock array
    if (anime && Array.isArray(anime.episodes)) {
      // Map or cast anime.episodes to the correct shape if necessary
      return anime.episodes.map((ep: AnimeEpisode) => ({
        ep: ep.ep ?? ep.number ?? 0,
        title: ep.title ?? `Episode ${ep.ep ?? ep.number ?? ""}`,
      }));
    }
    // Example mock data
    return [
      { ep: 1, title: "The Beginning" },
      { ep: 2, title: "A New Challenge" },
      { ep: 3, title: "Allies and Enemies" },
      { ep: 4, title: "Turning Point" },
      { ep: 5, title: "Climax" },
      { ep: 6, title: "Resolution" },
    ];
  }, [anime]);

  // --- Filtered Episodes ---
  const filteredEpisodes = useMemo(() => {
    if (!searchQuery.trim()) return episodes;
    const q = searchQuery.trim().toLowerCase();
    return episodes.filter(
      (ep) => ep.title.toLowerCase().includes(q) || String(ep.ep).includes(q)
    );
  }, [episodes, searchQuery]);
  // --- Server Selection State ---
  const [selectedServer, setSelectedServer] = React.useState(1);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation />
      <main className="mt-[50px]">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] justify-between max-w-7xl media-watch m-auto gap-[25px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full px-4 bg-gray-900/40 rounded-lg shadow-lg">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center text-md text-gray-300 mb-4 pt-4">
              <Link href="/" className="hover:text-blue-500 font-medium">
                Home
              </Link>
              <span className="mx-2">&gt;</span>
              {anime?.genres && anime.genres.length > 0 ? (
                <Link
                  href={`/genre/${encodeURIComponent(anime.genres[0])}`}
                  className="hover:text-blue-500 font-medium">
                  {anime.genres[0]}
                </Link>
              ) : (
                <Link href="/genre" className="hover:text-blue-500 font-medium">
                  Genre
                </Link>
              )}
              <span className="mx-2">&gt;</span>
              <span className="text-white font-semibold">
                {anime?.title || "Anime Name"}
              </span>
            </nav>
            <div className="aspect-video w-full rounded-lg mb-6">
              {selectedServer === 1 || selectedServer === 3 ? (
                <VideoPlayer />
              ) : (
                <IframeVideoPlayer src="https://www.youtube.com/embed/dQw4w9WgXcQ" />
              )}
            </div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <p className="text-lg text-white">You are watching Episode 5</p>
                <p className="text-sm text-gray-500 mt-3">
                  If the current server is not working, please try switching{" "}
                  <br /> to other servers.
                </p>
              </div>
              {/* Server Selection Buttons */}
              <div className="flex gap-4 justify-center items-center flex-wrap">
                <button
                  className={
                    `px-3 py-1 rounded font-normal shadow transition ` +
                    (selectedServer === 1
                      ? "bg-blue-600 text-white/90 hover:bg-blue-700"
                      : "bg-gray-700 text-white/90 hover:bg-gray-800")
                  }
                  onClick={() => setSelectedServer(1)}>
                  Server 1
                </button>
                <button
                  className={
                    `px-3 py-1 rounded font-normal shadow transition ` +
                    (selectedServer === 2
                      ? "bg-blue-700 text-white/90"
                      : "bg-gray-700 text-white/90 hover:bg-gray-800")
                  }
                  onClick={() => setSelectedServer(2)}>
                  Server 2
                </button>
                <button
                  className={
                    `px-3 py-1 rounded font-normal shadow transition ` +
                    (selectedServer === 3
                      ? "bg-blue-600 text-white/90 hover:bg-blue-700"
                      : "bg-gray-700 text-white/90 hover:bg-gray-800")
                  }
                  onClick={() => setSelectedServer(3)}>
                  Server 3
                </button>
                <button
                  className={
                    `px-3 py-1 rounded font-normal shadow transition ` +
                    (selectedServer === 4
                      ? "bg-blue-700 text-white/90"
                      : "bg-gray-700 text-white/90 hover:bg-gray-800")
                  }
                  onClick={() => setSelectedServer(4)}>
                  Server 4
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold">Seasons</h3>
              <div className="flex space-x-4 mb-3.5 mt-4.5 flex-wrap">
                {/* Season Cards with Hover Effect */}
                {[
                  {
                    season: 1,
                    eps: 13,
                    img: "https://static1.animekai.cc/c1/i/c/61/67eeaecf89bee.jpg",
                  },
                  {
                    season: 2,
                    eps: 12,
                    img: "https://static1.animekai.cc/c1/i/c/61/67eeaecf89bee.jpg",
                  },
                ].map((s) => (
                  <div key={s.season} className="relative text-center group">
                    <div className="w-32 h-20 bg-gray-700 mb-2 overflow-hidden rounded-lg relative cursor-pointer">
                      <Image
                        src={s.img}
                        alt={`Season ${s.season}`}
                        width={128}
                        height={80}
                        className="w-full h-full object-cover transition duration-300 group-hover:brightness-75"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70">
                        <span className="text-white/90 text-lg font-bold">
                          Season {s.season}
                        </span>
                        <span className="text-blue-600 text-md mt-1">
                          {s.eps} Eps
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full p-3.5 bg-gray-900/40 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
              <h3 className="text-white text-md font-semibold">Episodes</h3>
              <input
                type="text"
                placeholder="Search episode..."
                className="bg-gray-700 text-white/90 p-2 rounded-md w-48 text-sm focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ minWidth: 120 }}
              />
            </div>
            <div className="flex items-center mb-4 gap-2.5">
              {/* Dynamic Range Selector */}
              <select className="bg-gray-700 text-white/90 p-2 rounded-md w-full text-center cursor-pointer focus:outline-none">
                {Array.from(
                  { length: Math.ceil(episodes.length / 100) },
                  (_, i) => {
                    const start = i * 100 + 1;
                    const end = Math.min((i + 1) * 100, episodes.length);
                    return (
                      <option
                        key={i}
                        value={`${start}-${end}`}>{`${start}-${end}`}</option>
                    );
                  }
                )}
              </select>
              <select className="bg-gray-700 text-white/90 p-2 rounded-md w-full text-center cursor-pointer focus:outline-none">
                <option>SUB 12</option>
                <option>DUB 20</option>
              </select>
              {/* List/Grid Toggle Icon */}
              <button
                type="button"
                className="p-2 rounded bg-gray-700 hover:bg-gray-800 focus:outline-none"
                aria-label={
                  isListView ? "Switch to grid view" : "Switch to list view"
                }
                onClick={() => setIsListView((prev) => !prev)}>
                {/* Simple SVG icon for list/grid toggle */}
                {isListView ? (
                  <List className="h-4 w-4" />
                ) : (
                  <Grid className="h-4 w-4" />
                )}
              </button>
            </div>
            <div
              className={
                isListView
                  ? "flex flex-col max-h-[21.6rem] sm:max-h-[23rem] lg:max-h-[36rem] overflow-auto gap-2 sm:gap-3 lg:gap-4 px-1 list-episodes"
                  : "episodes-grid-views max-h-[21.6rem] sm:max-h-[23rem] lg:max-h-[31rem] overflow-auto gap-2 sm:gap-2 lg:gap-2 px-1 grid-episodes"
              }
              style={isListView ? { display: "block" } : { display: "grid" }}>
              {/* Episodes List */}
              {filteredEpisodes.map(({ ep, title }) => (
                <div
                  key={ep}
                  className={
                    isListView
                      ? `relative group flex items-center w-full rounded-lg overflow-hidden shadow-lg cursor-pointer border-2 mb-2 ${
                          selectedEpisode === ep
                            ? "border-blue-600"
                            : "border-transparent"
                        }`
                      : `relative group h-15 w-full rounded-lg overflow-hidden shadow-lg cursor-pointer border-2 text-center ${
                          selectedEpisode === ep
                            ? "border-blue-600"
                            : "border-transparent"
                        }`
                  }
                  onClick={() => setSelectedEpisode(ep)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Play Episode ${ep}`}>
                  {isListView ? (
                    <>
                      <div className="w-22 h-17 flex-shrink-0 rounded overflow-hidden relative">
                        <Image
                          src={`https://static1.animekai.cc/c1/i/c/61/67eeaecf89bee.jpg`}
                          alt={`Episode ${ep}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center px-4 py-2 bg-transparent">
                        <span className="text-white text-sm font-semibold">
                          Ep {ep}
                        </span>
                        <span className="text-blue-600 text-md mt-1">
                          {title}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Image
                        src={`https://static1.animekai.cc/c1/i/c/61/67eeaecf89bee.jpg`}
                        alt={`Episode ${ep}`}
                        fill
                        className="object-cover transition duration-300 group-hover:brightness-75"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60">
                        <span className="text-white/90 text-[13px] font-semibold">
                          Episode {ep}
                        </span>
                      </div>
                    </>
                  )}
                  {selectedEpisode === ep && (
                    <div className="absolute top-1 right-0 bg-blue-600 text-xs px-1 py-1 rounded font-bold text-white/90">
                      Playing
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-12 text-center">
              <h2 className="text-md font-bold text-blue-500">
                How did you rate this anime?
              </h2>
              <p className="text-sm mt-1">9.26 by 3,920 reviews</p>
              <div className="flex justify-center mt-1 gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-5xl rounded transition
                ${
                  userRating >= star
                    ? " text-orange-400"
                    : " text-gray-500 hover:text-orange-400"
                }`}
                    onClick={() => setUserRating(star)}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}>
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* --- Extra Anime Info Section --- */}
        <section className="entity-section w-full max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8 py-8">
          <div className="poster-wrap flex flex-col md:flex-row items-center md:items-start">
            <div className="poster flex justify-center items-center">
              <Image
                itemProp="image"
                src="https://static1.animekai.cc/c1/i/c/61/67eeaecf89bee.jpg"
                alt="Wind Breaker Season 2"
                width={160}
                height={224}
                className="rounded-lg shadow-lg w-55 h-70 object-cover"
                priority
              />
            </div>
            <div className="main-entity md:ml-8 mt-6 md:mt-0 w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <h1
                  itemProp="name"
                  className="title text-2xl md:text-3xl font-bold text-white"
                  data-jp="WIND BREAKER Season 2">
                  {infoType === "anime"
                    ? "Wind Breaker Season 2"
                    : `Episode ${selectedEpisode}: ${
                        episodes.find((ep) => ep.ep === selectedEpisode)
                          ?.title || "Episode Title"
                      }`}
                </h1>

                {/* Info Type Toggle Buttons */}
                <div className="flex mt-2 md:mt-0">
                  <button
                    className={`px-2.5 py-1 rounded-l-2xl text-xs font-semibold transition-colors focus:outline-none ${
                      infoType === "episode"
                        ? "bg-blue-600 text-white/90"
                        : "bg-gray-600 text-white/90 hover:bg-gray-500"
                    }`}
                    onClick={() => setInfoType("episode")}>
                    Episode Info
                  </button>
                  <button
                    className={`px-2.5 py-1 rounded-r-2xl text-xs font-semibold transition-colors focus:outline-none ${
                      infoType === "anime"
                        ? "bg-blue-600 text-white/90"
                        : "bg-gray-600 text-white/90 hover:bg-gray-500"
                    }`}
                    onClick={() => setInfoType("anime")}>
                    Anime Info
                  </button>
                </div>
              </div>
              <small className="al-title text-gray-300 block mb-2">
                {infoType === "anime"
                  ? "Wind Breaker Season 2; WIND BREAKER Season 2; Winbre; WBK"
                  : `Episode ${selectedEpisode} of Wind Breaker Season 2`}
              </small>
              <div className="info flex gap-4 mb-2 text-sm text-gray-300 items-center">
                <span className="bg-blue-600 text-white/90 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer">
                  SUB 12
                </span>
                <span className="bg-purple-600 text-white/90 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer">
                  DUB 20
                </span>
                <span>
                  <b>TV</b>
                </span>
              </div>

              {/* Dynamic Content Based on Info Type */}
              {infoType === "anime" ? (
                <>
                  <div className="desc text-gray-300 mb-2 text-sm">
                    Ever since Haruka Sakura joined Furin High School, where its
                    students call themselves Bofurin and protect the town of
                    Makochi, he has gained new friends despite his initial
                    skepticism. Now starting to learn how to fight alongside his
                    classmates and slowly growing out of his solitary past,
                    Sakura has become the grade captain of the first-years.
                    skills are put to the test when he and his classmates are
                    faced with KEEL—a delinquent group known for its ruthless
                    violence and coercion. While KEEL seems to be another rowdy
                    group at first glance, their sudden appearance and strength
                    in numbers might just be hiding a greater evil behind it.
                    With all the odds against the Bofurin members, Sakura must
                    accept that recognizing his shortcomings and receiving help
                    from his upperclassmen will be necessary to preserve the
                    peace in Makochi.
                  </div>
                </>
              ) : (
                <>
                  <div className="desc text-gray-300 mb-2 text-sm">
                    <p>
                      In this episode, Sakura faces his toughest challenge yet
                      as KEEL&apos;s true intentions are revealed. The bonds
                      between the Bofurin members are tested when they must work
                      together to protect Makochi from an unprecedented threat.
                      Watch as Sakura learns valuable lessons about teamwork and
                      friendship while showcasing incredible fighting skills
                      that will leave you on the edge of your seat.
                    </p>
                  </div>
                </>
              )}

              {/* Common detail grid for both anime and episode info */}
              <div className="detail grid grid-cols-1 md:grid-cols-3 gap-2 text-gray-300 text-sm mb-2">
                <div>
                  Country: <span className="text-blue-600">Japan</span>
                </div>
                <div>
                  Genres:{" "}
                  <Link href={"/search"} className="text-blue-600">
                    Comedy,
                  </Link>
                  <Link href={"/search"} className="text-blue-600">
                    Action
                  </Link>
                </div>
                <div>
                  Premiered: <span>Spring 2025</span>
                </div>
                <div>
                  Date aired: <span>Apr 04, 2025 to Jun 20, 2025</span>
                </div>
                <div>
                  Broadcast: <span>Fridays at 00:26 JST</span>
                </div>
                <div>
                  Episodes: <span>12</span>
                </div>
                <div>
                  Duration: <span>23 min</span>
                </div>
                <div>
                  Status: <span>Completed</span>
                </div>
                <div>
                  MAL:{" "}
                  <span>
                    7.69 <span className="text-muted">by 51,956 users</span>
                  </span>
                </div>
                <div>
                  Studios:{" "}
                  <Link href={"/search"} className="text-blue-600">
                    CloverWorks
                  </Link>
                </div>
                <div>
                  Producer:{" "}
                  <Link href={"/search"} className="text-blue-600">
                    CloverWorks
                  </Link>
                </div>
                <div>
                  Producers:{" "}
                  <span className="text-blue-600">
                    Aniplex, Kodansha, Mainichi Broadcasting System, Aiming,
                    Tohan Corporation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Relations Section */}
        <div className="w-full max-w-7xl mx-auto mt-3 px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Relations</h2>
          <Swiper
            modules={[SwiperNavigation]}
            spaceBetween={20}
            slidesPerView={2}
            navigation={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 25,
              },
              1280: {
                slidesPerView: 8,
                spaceBetween: 30,
              },
              1536: {
                slidesPerView: 8,
                spaceBetween: 30,
              },
            }}
            className="relations-swiper">
            {latestAnime.slice(0, 10).map((anime) => (
              <SwiperSlide key={anime.id}>
                <div className="relative">
                  <AnimeCard anime={anime} showPopup={true} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Recommended Section */}
        <div className="w-full max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Recommended</h2>
          <Swiper
            modules={[SwiperNavigation]}
            spaceBetween={20}
            slidesPerView={2}
            navigation={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 25,
              },
              1280: {
                slidesPerView: 8,
                spaceBetween: 30,
              },
              1536: {
                slidesPerView: 8,
                spaceBetween: 30,
              },
            }}
            className="recommended-swiper">
            {latestAnime.slice(0, 10).map((anime) => (
              <SwiperSlide key={anime.id}>
                <div className="flex-shrink-0 overflow-visible  relative">
                  <AnimeCard
                    anime={anime}
                    showPopup={true}
                    className="h-auto overflow-visible"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* --- Comments Section --- */}
        <section className="comments-section grid grid-cols-1 md:grid-cols-[3fr_1fr] justify-between max-w-7xl media-watch m-auto gap-[25px] px-4 sm:px-6 lg:px-8 py-8">
          <CommentSection />
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
