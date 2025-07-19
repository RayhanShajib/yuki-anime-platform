"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { mockAnime } from "@/lib/mockData";
import { Bookmark, Link2, List, PlayCircle, User, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Mock anime data (replace with real data/fetching)
const anime = {
  id: 1,
  title: "Attack on Titan",
  poster: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
  trailer:
    "https://www.youtube.com/embed/MGRm4IzK1SQ?autoplay=1&mute=1&controls=0&loop=1&playlist=MGRm4IzK1SQ",
  trailerReleaseDate: "2013-03-22", // YYYY-MM-DD
  type: "TV Series",
  description:
    "After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.",
  episodes: 87,
  characters: [
    {
      name: "Shiroha Naruse",
      image:
        "https://s4.anilist.co/file/anilistcdn/character/large/b274071-9lvsb2dkcSCK.png",
      voiceActor: {
        name: "Konomi Kohara",
        image:
          "https://s4.anilist.co/file/anilistcdn/staff/large/n121961-TaMewK1taQm6.png",
      },
    },
    {
      name: "Eren Jaeger",
      image: "https://cdn.myanimelist.net/images/characters/10/284141.jpg",
      voiceActor: {
        name: "Yuki Kaji",
        image: "https://cdn.myanimelist.net/images/voiceactors/2/55424.jpg",
      },
    },
    {
      name: "Mikasa Ackerman",
      image: "https://cdn.myanimelist.net/images/characters/10/284142.jpg",
      voiceActor: {
        name: "Yui Ishikawa",
        image: "https://cdn.myanimelist.net/images/voiceactors/2/55425.jpg",
      },
    },
    {
      name: "Armin Arlert",
      image: "https://cdn.myanimelist.net/images/characters/10/284143.jpg",
      voiceActor: {
        name: "Marina Inoue",
        image: "https://cdn.myanimelist.net/images/voiceactors/2/55426.jpg",
      },
    },
  ],
  relations: ["Attack on Titan: Junior High", "Attack on Titan Movie"],
  reviews: [
    {
      user: "AnimeFan123",
      rating: 9,
      comment: "Intense, emotional, and beautifully animated!",
    },
    {
      user: "OtakuQueen",
      rating: 8,
      comment: "Great story, but pacing can be slow at times.",
    },
  ],
};

const tabs = [
  { key: "overview", label: "Overview", icon: User },
  { key: "episodes", label: "Episodes", icon: List },
  { key: "characters", label: "Characters", icon: Users },
  { key: "relations", label: "Relations", icon: Link2 },
];

export default function RandomInfoPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [episodeLayout, setEpisodeLayout] = useState("flex"); // "flex" or "grid"

  // Ensure mockAnime is imported and genres/status/type exist
  const filteredAnime = mockAnime;

  return (
    <div className="relative bg-black overflow-hidden">
      <Navigation />
      {/* Trailer Background */}
      <div className="w-full h-[27rem] max-h-[52vh] relative  overflow-hidden">
        <div className="absolute top-0 left-0 trailer size-full object-cover pointer-events-none object-center">
          <div className="w-full h-full">
            <iframe
              src={anime.trailer}
              title="Anime Trailer"
              allow="autoplay; encrypted-media"
              frameBorder="0"
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>
        </div>
        <div className="info-grad z-0"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 xl:-mt-[150px] w-full">
        <div className="flex flex-col md:flex-row items-end gap-8 w-full ">
          {/* Poster */}
          <div className="flex justify-center md:justify-start">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={anime.poster}
                alt={anime.title}
                width={200}
                height={350}
                className="object-cover"
                priority
              />
            </div>
          </div>
          {/* Title & Actions */}
          <div className="w-full">
            <span className="text-white/90 font-normal">Spring 2025</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 mt-2 drop-shadow-lg">
              {anime.title}
            </h1>
            <span className="text-white font-normal mb-4">{anime.type}</span>
            <div className="flex gap-4 mt-4 mb-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white/90 font-semibold text-md shadow-lg transition">
                <PlayCircle className="h-5 w-5" /> Watch Now
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold text-md shadow-lg transition">
                <Bookmark className="h-5 w-5" /> Add to List
              </button>
            </div>
          </div>
        </div>

        {/* Info & Tabs */}
        <div className="flex-1 w-full md:w-2/3 lg:w-3/4 mt-12">
          {/* Tabs */}
          <div className="mb-8">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide gap-8">
              {tabs.map((tab) => {
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center text-base font-medium transition-colors whitespace-nowrap cursor-pointer${
                      activeTab === tab.key
                        ? "text-white border-b-2 border-purple-500"
                        : "text-gray-300 hover:text-white border-b-2 border-transparent"
                    }`}>
                    <span className="text-white">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content (no animation) */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-2">Overview</h2>
              <p className="text-gray-300 text-lg mb-4">{anime.description}</p>
              <div className="flex gap-8">
                <div>
                  <span className="text-gray-300">Episodes:</span>
                  <span className="text-white font-bold ml-2">
                    {anime.episodes}
                  </span>
                </div>
                <div>
                  <span className="text-gray-300">Reviews:</span>
                  <span className="text-white font-bold ml-2">
                    {anime.reviews.length}
                  </span>
                </div>
              </div>
              {/* Anime Info Section */}
              <div className="w-full flex flex-wrap h-auto !tracking-wider">
                <div className="w-full sm:w-1/2 shrink-0 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2 text-nowrap">
                  <span className="font-medium shrink-0 text-gray-300">
                    Type
                  </span>
                  <span className="text-sm font-light capitalize text-gray-300">
                    anime
                  </span>
                </div>
                <div className="w-full sm:w-1/2 shrink-0 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2 text-nowrap">
                  <span className="font-medium shrink-0 text-gray-300">
                    Episodes
                  </span>
                  <span className="text-sm font-light text-gray-300">26</span>
                </div>
                <div className="w-full sm:w-1/2 shrink-0 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2 text-nowrap">
                  <span className="font-medium shrink-0 text-gray-300">
                    Season
                  </span>
                  <a
                    className="text-sm font-light text-gray-300"
                    href="/catalog?season=SPRING&amp;year=2025">
                    SPRING 2025
                  </a>
                </div>
                <div className="w-full sm:w-1/2 shrink-0 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2 text-nowrap">
                  <span className="font-medium shrink-0 text-gray-300">
                    Rating
                  </span>
                  <span className="text-sm text-end font-light text-gray-300">
                    69
                  </span>
                </div>
                <div className="w-full sm:w-1/2 shrink-0 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2 text-nowrap">
                  <span className="font-medium shrink-0 text-gray-300">
                    Duration
                  </span>
                  <span className="text-sm text-end font-light text-gray-300">
                    24m
                  </span>
                </div>
                <div className="w-full sm:w-1/2 shrink-0 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2 text-nowrap">
                  <span className="font-medium shrink-0 text-gray-300">
                    Status
                  </span>
                  <span className="text-sm text-end font-light text-gray-300">
                    RELEASING
                  </span>
                </div>
                <div className="w-full sm:w-1/2 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2">
                  <span className="font-medium text-gray-300">Format</span>
                  <a
                    className="text-sm text-end font-light text-gray-300"
                    href="/catalog?format=TV">
                    TV
                  </a>
                </div>
                <div className="w-full sm:w-1/2 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2">
                  <span className="font-medium shrink-0 text-gray-300">
                    Synonyms
                  </span>
                  <span className="!text-sm text-end font-light flex-grow text-gray-300">
                    サマポケ , サマーポケッツ , Samapoke
                  </span>
                </div>
                <div className="w-full sm:w-1/2 lg:w-1/3 flex justify-between gap-3 p-1 sm:p-2 sm:pr-5 md:mb-2">
                  <span className="font-medium text-gray-300">Genres</span>
                  <span className="text-sm text-end font-light">
                    <button className="hover:text-white text-gray-300 tracking-wide !leading-normal">
                      Drama
                    </button>
                    <button className="hover:text-white tracking-wide !leading-normal text-gray-300">
                      , Romance
                    </button>
                    <button className="hover:text-white tracking-wide !leading-normal text-gray-300">
                      , Slice of Life
                    </button>
                    <button className="hover:text-white tracking-wide !leading-normal text-gray-300">
                      , Supernatural
                    </button>
                  </span>
                </div>
              </div>
            </div>
          )}
          {activeTab === "episodes" && (
            <div className="space-y-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Episodes
                  </h2>
                  <p className="text-gray-300">
                    Total Episodes: {anime.episodes}
                  </p>
                </div>
                <div className="hidden sm:flex gap-2 items-center">
                  <button
                    className={`w-8 h-5 rounded-[5px] overflow-hidden smoothie bg-[#1e1e24] cursor-pointer ${
                      episodeLayout === "grid"
                        ? "bg-purple-500"
                        : "bg-[#1e1e24] hover:bg-purple-500"
                    }`}
                    onClick={() => setEpisodeLayout("grid")}></button>
                  <button
                    className={`flex flex-col justify-center items-center gap-[2px] h-[1.1rem] group cursor-pointer`}
                    onClick={() => setEpisodeLayout("flex")}>
                    <span
                      className={`w-8 h-1/2 rounded-sm overflow-hidden flex bg-[#1e1e24] brightness-150 ${
                        episodeLayout === "flex"
                          ? "bg-purple-500"
                          : "bg-[#1e1e24] hover:bg-purple-500"
                      }`}></span>
                    <span
                      className={`w-8 h-1/2 rounded-sm overflow-hidden flex bg-[#1e1e24] brightness-150 ${
                        episodeLayout === "flex"
                          ? "bg-purple-500"
                          : "bg-[#1e1e24] hover:bg-purple-500"
                      }`}></span>
                  </button>
                </div>
              </div>
              {/* Episode Card */}
              <div
                className={
                  episodeLayout === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-h-[32rem] sm:max-h-[36rem] lg:max-h-[44rem] overflow-auto gap-4 sm:gap-6 lg:gap-8 px-1"
                    : "flex flex-wrap w-full max-h-[21.6rem] sm:max-h-[23rem] lg:max-h-[31rem] overflow-auto gap-2 sm:gap-3 lg:gap-4 px-1"
                }>
                <div
                  title="A young boy with a wounded heart begins a new life on a quiet island."
                  className={
                    episodeLayout === "grid"
                      ? "flex-shrink-0 smoothie w-full h-40 lg:h-56 hover:brightness-90 hover:scale-[.98]"
                      : "flex-shrink-0 smoothie w-full h-20 lg:h-28 hover:brightness-90 hover:scale-[.98]"
                  }>
                  <Link
                    className={
                      episodeLayout === "grid"
                        ? "group size-full z-0 flex relative smoothie rounded-lg xl:rounded-2x"
                        : "group size-full z-0 flex bg-[#1e1e24] xl:bg-[#1e1e24] shadow-xl gap-1 md:gap-2 relative smoothie rounded-lg xl:rounded-2xl overflow-hidden"
                    }
                    href="/watch/143200/?ep=1">
                    <div
                      className={
                        episodeLayout === "grid"
                          ? "h-full aspect-[15/9] relative flex-shrink-0 rounded-lg xl:rounded-2xl overflow-hidden shadow-[4px_0px_5px_0px_rgba(0,0,0,0.3)]"
                          : "h-full aspect-[15/9] relative flex-shrink-0 bg-white/5 rounded-lg xl:rounded-2xl overflow-hidden shadow-[4px_0px_5px_0px_rgba(0,0,0,0.3)]"
                      }>
                      <Image
                        src="https://artworks.thetvdb.com/banners/v4/episode/10567249/screencap/67e405990e772.jpg"
                        alt="Episode 1 screencap"
                        fill
                        className="brightness-95 aspect-video h-full w-full object-cover smoothie"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority
                      />
                      {episodeLayout === "grid" ? (
                        <>
                          <span className="px-[.4rem] py-[.15rem] max-w-full text-xs xl:text-sm flex-grow text-white/90 bg-black/60 rounded-md font-medium tracking-wide absolute bottom-1 left-1 sm:left-[.4rem] smoothie">
                            Ep 1
                          </span>

                          <div className="flex !italic z-10 text-white/90 !tracking-wide py-1 px-2 flex-col bg-black/70 opacity-0 group-hover:opacity-100 absolute size-full smoothie">
                            <div className="brightness-110 text-xs sm:text-sm !leading-snug line-clamp-3 lg:line-clamp-4 w-full">
                              A young boy with a wounded heart begins a new life
                              on a quiet island.
                            </div>
                            <div className="ml-auto mt-auto font-medium hover:underline brightness-125 hover:text-[var(--pinkk)] text-sm lg:text-base">
                              Watch Now
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="px-[.4rem] py-[.15rem] max-w-full text-xs xl:text-sm flex-grow text-white/90 bg-black/60 rounded-md font-medium tracking-wide absolute bottom-1 left-1 sm:left-[.4rem] smoothie">
                            Ep 1
                          </span>
                        </>
                      )}
                    </div>
                    {episodeLayout !== "grid" && (
                      <div className="mobile !italic flex-grow flex flex-col gap-1 lg:gap-2 p-2 py-3 lg:my-auto">
                        <span className="tracking-wider !leading-tight line-clamp-1 text-sm sm:text-base text-gray-100 font-medium">
                          Welcome to Torishirojima Island
                        </span>
                        <span className="!leading-snug w-full line-clamp-2 my-auto text-xs sm:text-sm lg:text-base text-gray-200 font-light tracking-wider">
                          A young boy with a wounded heart begins a new life on
                          a quiet island.
                        </span>
                      </div>
                    )}
                    <div className="hidden !italic z-10 text-white !tracking-wide py-1 px-2 flex-col bg-black/70 opacity-0 group-hover:opacity-100 absolute size-full smoothie">
                      <div className="brightness-110 text-xs sm:text-sm !leading-snug line-clamp-3 lg:line-clamp-4 w-full">
                        A young boy with a wounded heart begins a new life on a
                        quiet island.
                      </div>
                      <div className="ml-auto mt-auto font-medium hover:underline brightness-125 hover:text-[var(--pinkk)] text-sm lg:text-base">
                        Watch Now
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
          {activeTab === "characters" && (
            <div className="space-y-6 p-1 xl:px-0 rounded-xl overflow-hidden min-h-[20rem] lg:min-h-[26rem] sm:bsg-[var(--light)]">
              <h2 className="text-2xl font-bold text-white mb-2">Characters</h2>
              <div className="w-full relative">
                <div className="w-full flex overflow-y-auto max-h-[24rem] lg:max-h-[27rem] flex-wrap relative">
                  <div className="flex flex-wrap gap-6">
                    {anime.characters.map((char, idx) => (
                      <div
                        key={char.name + idx}
                        className="w-full sm:w-1/2 lg:w-[45%] aspect-[4/1] sm:aspect-[3.5/1] p-[.4rem] flex-shrink-0">
                        <div className="bg-[#282831] items-center size-full flex shadow-xl rounded-xl overflow-hidden">
                          <div className="flex gap-3 h-full w-1/2 pl-3 pr-1 flex-shrink-0 items-center">
                            <div className="h-[3rem] md:h-[4rem] bg-[var(--light)] aspect-square rounded-full flex-shrink-0 overflow-hidden">
                              <Image
                                src={char.image}
                                alt={char.name}
                                width={64}
                                height={64}
                                className="size-full object-cover object-center rounded-full overflow-hidden"
                                style={{ width: "100%", height: "100%" }}
                              />
                            </div>
                            <div
                              title={char.name}
                              className="text-sm tracking-wide flex-grow overflow-y-auto max-h-full py-2">
                              {char.name}
                            </div>
                          </div>
                          <div className="flex gap-3 h-full w-1/2 pr-3 pl-1 flex-shrink-0 items-center justify-end">
                            <div
                              title={char.voiceActor.name}
                              className="text-sm tracking-wide flex-grow text-end overflow-y-auto max-h-full py-2">
                              {char.voiceActor.name}
                            </div>
                            <div className="h-[3rem] md:h-[4rem] bg-[var(--light)] aspect-square rounded-full flex-shrink-0 overflow-hidden">
                              <Image
                                src={char.voiceActor.image}
                                alt={char.voiceActor.name}
                                width={64}
                                height={64}
                                className="size-full object-cover object-center rounded-full overflow-hidden"
                                style={{ width: "100%", height: "100%" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "relations" && (
            <div className="space-y-6">
              {/* Seasons & Relations Custom Section */}
              <div className="flex flex-col w-full gap-4 mt-8">
                <div className="text-white text-xl font-medium px-1 tracking-wider">
                  Seasons & Relations
                </div>
                <div className="w-full flex overflow-y-auto max-h-[24rem] lg:max-h-[33rem] flex-wrap relative">
                  <div className="flex flex-col w-full gap-1 md:gap-2">
                    <div className="flex mt-0 w-full">
                      <span className="tracking-wider flex font-semibold pl-1 h-8 lg:text-lg relative uppercase w-fit text-gray-300">
                        SUMMARY
                        <span className="h-[.13rem] absolute left-1 shrink-0 bottom-[.1rem] mx-auto bg-purple-500 w-[calc(100%-.25rem)] smoothie"></span>
                      </span>
                    </div>
                    <div className="w-full flex overflow-y-auto flex-wrap relative">
                      <a
                        title="A theatrical edited version of <i>Summer Pockets</i>."
                        className="flex gap-2 flex-shrink-0 w-full sm:w-1/2 lg:w-[50%] aspect-[3.5/1] p-[.35rem] hover:brightness-[.8] smoothie"
                        href="/anime/195230">
                        <div className="flex w-full gap-2 bg-[#18181d] xl:bg-[#18181d] shadow-xl rounded-lg overflow-hidden">
                          <div className="h-full aspect-[1/1.4] bg-white/5 flex-shrink-0 rounded-md overflow-hidden">
                            <Image
                              src="https://s4.anilist.co/file/anilistcdn/media/anime/cover/small/bx195230-A1Oa6Ov7w3Ux.jpg"
                              alt="Summer Pockets Movie Cover"
                              width={150}
                              height={140}
                              className="brightness-90 scale-105 sm:brightness-100 h-full w-full object-cover rounded-md"
                              style={{ width: "100%", height: "100%" }}
                              priority
                            />
                          </div>
                          <div className="flex flex-col flex-grow items-center p-2 pl-1">
                            <div className="w-full text-sm text-purple-500 !leading-tight font-bold brightness-105">
                              SUMMARY
                            </div>
                            <div className="w-full tracking-wide !leading-tight text-sm md:text-[.95rem] my-auto text-white/90 font-medium line-clamp-1 md:line-clamp-2">
                              Summer Pockets Movie
                            </div>
                            <div className="w-full flex overflow-hidden !line-clamp-1 !text-xs my-auto !leading-[1.05] text-white/60 items-center gap-2">
                              <span className="text-white/60 ">MOVIE</span>
                              <span> • </span>
                              <span className="text-white/60 ">2025</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12">
          <h1 className="text-2xl font-bold mb-4 text-white">Related Anime</h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredAnime.map((anime) => (
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
      </main>
      <FooterSection />
    </div>
  );
}
