"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { latestAnime, mockAnime } from "@/lib/mockData";
import type { Anime } from "@/types/anime";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import "plyr-react/plyr.css";
import React, { useMemo } from "react";

const Plyr = dynamic(() => import("plyr-react"), { ssr: false });

export default function WatchPage() {
  const params = useParams();
  const animeId = params?.id as string;
  const anime: Anime | undefined = useMemo(
    () => mockAnime.find((a) => a.id === animeId),
    [animeId]
  );

  // --- Episode Selection State ---
  const [selectedEpisode, setSelectedEpisode] = React.useState(1);
  // For demo, all episodes use the trailer
  const episodeVideoSrc =
    anime?.trailer || "https://www.w3schools.com/html/mov_bbb.mp4";
  const plyrSource = {
    type: "video" as const,
    sources: [
      {
        src: episodeVideoSrc,
        type: "video/mp4",
        size: 720,
      },
    ],
    poster: anime?.banner || anime?.poster,
    title: anime?.title
      ? `${anime.title} - Episode ${selectedEpisode}`
      : `Episode ${selectedEpisode}`,
  };

  // --- Comments System State ---
  const [comments, setComments] = React.useState([
    {
      user: "JohnDoe",
      text: "This season is amazing! The animation is top notch.",
      time: "2 hours ago",
      type: "Best",
    },
    {
      user: "JaneSmith",
      text: "Just finished episode 1, can't wait for more!",
      time: "Just now",
      type: "New",
    },
    {
      user: "AnimeFan",
      text: "I've been following this manga for years. Glad to see it animated!",
      time: "3 days ago",
      type: "Oldest",
    },
  ]);
  const [commentInput, setCommentInput] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState("Best");

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const now = new Date();
    const formattedTime = now.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setComments([
      ...comments,
      {
        user: "You", // You can replace with actual user
        text: commentInput,
        time: formattedTime,
        type: selectedTab,
      },
    ]);
    setCommentInput("");
  };

  // Filter comments by selected tab
  const filteredComments = comments.filter((c) => c.type === selectedTab);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation />
      <main className="mt-[100px]">
        <div className="flex justify-between max-w-7xl media-watch m-auto gap-[30px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full px-6 bg-gray-900 rounded-lg shadow-lg">
            <h1 className="text-xl md:text-xl font-bold text-white mb-3 mt-2">
              {anime?.title || "Anime Player"}
            </h1>
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-6">
              <Plyr
                source={plyrSource}
                options={{
                  controls: [
                    "play",
                    "progress",
                    "current-time",
                    "mute",
                    "volume",
                    "settings",
                    "fullscreen",
                  ],
                }}
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-lg text-white">You are watching Episode 5</p>
              </div>
            </div>
            <div className="flex space-x-4 mb-3.5">
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
                      <span className="text-orange-400 text-md mt-1">
                        {s.eps} Eps
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-gray-900 rounded-lg shadow-lg">
            <h3 className="mb-3 text-white text-md font-semibold">Episodes</h3>
            <div className="flex items-center mb-4">
              <select className="bg-gray-700 text-white/90 p-2 rounded-md w-full text-center">
                <option>001-012</option>
              </select>
            </div>
            <div
              className="flex flex-wrap max-h-[21.6rem] sm:max-h-[23rem] lg:max-h-[31rem] overflow-auto gap-2 sm:gap-3 lg:gap-4 px-1 grid-episodes"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {/* Episodes List */}
              {[1, 2, 3, 4, 5].map((ep) => (
                <div
                  key={ep}
                  className={`relative group w-32 h-20 sm:w-36 sm:h-24 lg:w-40 lg:h-28 rounded-lg overflow-hidden shadow-lg cursor-pointer border-2 ${
                    selectedEpisode === ep
                      ? "border-green-400"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedEpisode(ep)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Play Episode ${ep}`}>
                  <Image
                    src={`https://static1.animekai.cc/c1/i/c/61/67eeaecf89bee.jpg`}
                    alt={`Episode ${ep}`}
                    fill
                    className="object-cover transition duration-300 group-hover:brightness-75"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60">
                    <span className="text-white text-sm font-semibold">
                      Episode {ep}
                    </span>
                    <span className="text-green-400 text-xs mt-1">
                      {anime?.title || "Wind Breaker S2"}
                    </span>
                  </div>
                  {selectedEpisode === ep && (
                    <div className="absolute top-2 right-2 bg-green-400 text-xs px-2 py-1 rounded text-black font-bold">
                      Playing
                    </div>
                  )}
                </div>
              ))}
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
                className="rounded-lg shadow-lg w-40 h-56 object-cover"
                priority
              />
            </div>
            <div className="main-entity md:ml-8 mt-6 md:mt-0 w-full">
              <h1
                itemProp="name"
                className="title text-2xl md:text-3xl font-bold text-white mb-2"
                data-jp="WIND BREAKER Season 2">
                Wind Breaker Season 2
              </h1>
              <small className="al-title text-gray-300 block mb-2">
                Wind Breaker Season 2; WIND BREAKER Season 2; Winbre; WBK
              </small>
              <div className="info flex gap-4 mb-2 text-sm text-gray-300">
                <span className="rating bg-gray-800 px-2 py-1 rounded">
                  PG 13
                </span>
                <span className="sub flex items-center gap-1">
                  <svg className="w-4 h-4 inline">
                    <use href="#sub"></use>
                  </svg>
                  12
                </span>
                <span className="dub flex items-center gap-1">
                  <svg className="w-4 h-4 inline">
                    <use href="#dub"></use>
                  </svg>
                  12
                </span>
                <span>
                  <b>TV</b>
                </span>
              </div>
              <div className="desc text-gray-300 mb-2 text-sm">
                Ever since Haruka Sakura joined Furin High School, where its
                students call themselves Bofurin and protect the town of
                Makochi, he has gained new friends despite his initial
                skepticism. Now starting to learn how to fight alongside his
                classmates and slowly growing out of his solitary past, Sakura
                has become the grade captain of the first-years. skills are put
                to the test when he and his classmates are faced with KEEL—a
                delinquent group known for its ruthless violence and coercion.
                While KEEL seems to be another rowdy group at first glance,
                their sudden appearance and strength in numbers might just be
                hiding a greater evil behind it. With all the odds against the
                Bofurin members, Sakura must accept that recognizing his
                shortcomings and receiving help from his upperclassmen will be
                necessary to preserve the peace in Makochi.
              </div>
              <div className="detail grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300 text-sm mb-2">
                <div>
                  Country: <span className="text-green-400">Japan</span>
                </div>
                <div>
                  Genres:{" "}
                  <span className="text-green-400">
                    Comedy, School, Action, Drama
                  </span>
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
                  Studios: <span className="text-green-400">CloverWorks</span>
                </div>
                <div>
                  Producers:{" "}
                  <span className="text-green-400">
                    Aniplex, Kodansha, Mainichi Broadcasting System, Aiming,
                    Tohan Corporation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Recommended Section */}
        <div className=" w-full max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recommended</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {latestAnime.slice(0, 6).map((anime) => (
              <div key={anime.id} className="relative">
                <AnimeCard
                  anime={anime}
                  showPopup={true}
                  className="transform transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
        {/* --- Comments Section --- */}
        <section className="comments-section w-full max-w-7xl mx-auto mt-8 mb-8 px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-bold text-white mb-4">Comments</h2>
          <div className="comments-tabs flex gap-4 mb-4">
            <button
              className={`tab px-4 py-2 rounded bg-gray-800 ${
                selectedTab === "Best"
                  ? "text-green-400 font-semibold"
                  : "text-gray-400"
              }`}
              onClick={() => setSelectedTab("Best")}>
              Best
            </button>
            <button
              className={`tab px-4 py-2 rounded bg-gray-800 ${
                selectedTab === "New"
                  ? "text-green-400 font-semibold"
                  : "text-gray-400"
              }`}
              onClick={() => setSelectedTab("New")}>
              New
            </button>
            <button
              className={`tab px-4 py-2 rounded bg-gray-800 ${
                selectedTab === "Oldest"
                  ? "text-green-400 font-semibold"
                  : "text-gray-400"
              }`}
              onClick={() => setSelectedTab("Oldest")}>
              Oldest
            </button>
          </div>
          <form className="mb-6" onSubmit={handleCommentSubmit}>
            <input
              type="text"
              className="w-full p-3 rounded bg-gray-800 text-white mb-2 outline-none"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded font-semibold">
              Post
            </button>
          </form>
          <div className="comments-list space-y-4">
            {filteredComments.length === 0 && (
              <div className="text-gray-400">No comments yet.</div>
            )}
            {filteredComments.map((c, idx) => (
              <div
                key={idx}
                className="comment bg-gray-900 p-4 rounded-lg shadow">
                <div className="flex items-center mb-2">
                  <span className="font-bold text-green-400 mr-2">
                    {c.user}
                  </span>
                  <span className="text-xs text-gray-500">{c.time}</span>
                </div>
                <p className="text-gray-300">{c.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
