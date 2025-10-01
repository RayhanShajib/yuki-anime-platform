"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { CommentSection } from "@/components/ui/CommentSection";
import IframeVideoPlayer from "@/components/ui/IframeVideoPlayer";
import VideoPlayer, { VideoPlayerRef } from "@/components/ui/VideoPlayer";
import { pageApi } from "@/lib/api/pageApi";
import { transformWatchPageData } from "@/lib/transformers";
import type { TransformedWatchPageData } from "@/types/api";
import { Grid, List, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import "plyr-react/plyr.css";
import React, { useEffect, useMemo, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation as SwiperNavigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function WatchPage() {
  const params = useParams();
  const episodeId = params?.id as string;

  // --- API Data State ---
  const [watchData, setWatchData] = useState<TransformedWatchPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Audio Type State (sub/dub) ---
  const [audioType, setAudioType] = useState<'sub' | 'dub'>('sub');

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

  // --- Fetch Watch Page Data ---
  useEffect(() => {
    if (!episodeId) return;

    const fetchWatchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiData = await pageApi.getWatchPageData(episodeId);
        const transformedData = transformWatchPageData(apiData);
        
        setWatchData(transformedData);
        
        // Set initial episode based on available episodes
        const availableEpisodes = transformedData.episodes[audioType];
        if (availableEpisodes.length > 0) {
          setSelectedEpisode(availableEpisodes[0].episodeNumber);
        }
      } catch (err) {
        console.error('Error fetching watch page data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load watch data');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchData();
  }, [episodeId, audioType]);

  // --- Episodes Data from API ---
  type Episode = { ep: number; title: string; thumbnail: string };

  const episodes = useMemo<Episode[]>(() => {
    if (!watchData) return [];
    
    const episodeList = watchData.episodes[audioType];
    return episodeList.map((ep) => ({
      ep: ep.episodeNumber,
      title: ep.title || `Episode ${ep.episodeNumber}`,
      thumbnail: ep.thumbnail,
    }));
  }, [watchData, audioType]);

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
  
  // --- Video Player Ref ---
  const videoPlayerRef = React.useRef<VideoPlayerRef>(null);
  
  // --- Video Sources Configuration from API ---
  const videoSources = useMemo(() => {
    if (!watchData) return {};
    
    const sources = watchData.videoSources[audioType];
    if (!sources.length) return {};
    
    // For now, we'll use the first video source group
    // Later you can implement logic to handle multiple source groups
    const sourceGroup = sources[0];
    
    const sourcesMap: Record<number, string> = {};
    
    // Map iframe URLs to server numbers (keeping as placeholder URLs for now)
    sourceGroup.iframeUrls.forEach((url, index) => {
      sourcesMap[index + 1] = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"; // Placeholder until you provide video handling logic
    });
    
    // If no iframe URLs, use m3u8 URLs as fallback
    if (Object.keys(sourcesMap).length === 0) {
      sourceGroup.m3u8Urls.forEach((url, index) => {
        sourcesMap[index + 1] = url;
      });
    }
    
    return sourcesMap;
  }, [watchData, audioType]);

  // --- Handle Server Switch with Time Continuity ---
  const handleServerSwitch = (serverNumber: number) => {
    if (serverNumber === 3) {
      // Server 3 is iframe - just switch normally
      setSelectedServer(serverNumber);
      return;
    }

    if (videoPlayerRef.current && (serverNumber === 1 || serverNumber === 2)) {
      // Get current time before switching
      const currentTime = videoPlayerRef.current.getCurrentTime();
      
      // Load new source with time continuity
      videoPlayerRef.current.loadNewSource(
        videoSources[serverNumber as keyof typeof videoSources], 
        currentTime
      );
      
      // Update server state
      setSelectedServer(serverNumber);
    } else {
      // Fallback for other servers
      setSelectedServer(serverNumber);
    }
  };



  // Get current anime info from related anime (assuming the first related anime is the current one)
  const currentAnime = watchData?.relatedAnime?.[0] || watchData?.similarAnime?.[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Loading State */}
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <Loader2 className="h-16 w-16 text-purple-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              Loading Watch Page...
            </h3>
            <p className="text-gray-500">
              Please wait while we fetch the episode data.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center py-12">
            <div className="h-16 w-16 text-red-500 mx-auto mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-red-400 mb-2">
              Error Loading Watch Page
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-purple text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && watchData && (
        <main className="mt-[50px]">
          <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] justify-between max-w-7xl media-watch m-auto gap-[25px] px-4 sm:px-6 lg:px-8 py-8">
            <div className="w-full px-4 bg-gray-900/40 rounded-lg shadow-lg">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center text-md text-gray-300 mb-4 pt-4">
                <Link href="/" className="hover:text-blue-500 font-medium">
                  Home
                </Link>
                <span className="mx-2">&gt;</span>
                {currentAnime?.genres && currentAnime.genres.length > 0 ? (
                  <Link
                    href={`/genre/${encodeURIComponent(currentAnime.genres[0])}`}
                    className="hover:text-blue-500 font-medium">
                    {currentAnime.genres[0]}
                  </Link>
                ) : (
                  <Link href="/genre" className="hover:text-blue-500 font-medium">
                    Genre
                  </Link>
                )}
                <span className="mx-2">&gt;</span>
                <span className="text-white font-semibold">
                  {currentAnime?.title || "Anime Name"}
                </span>
              </nav>
            <div className="aspect-video w-full rounded-lg mb-6">
              {selectedServer === 3 ? (
                <IframeVideoPlayer src="https://www.youtube.com/embed/dQw4w9WgXcQ" />
              ) : (
                <VideoPlayer 
                  ref={videoPlayerRef}
                  videoSources={[
                    {
                      file: videoSources[1], // Default to first M3U source
                      type: "hls",
                      label: "1080p",
                      default: true,
                    },
                  ]}
                  posterImage={currentAnime?.banner || currentAnime?.poster || "https://cdn-w1.netlify.com/cagatayldzz.com/2020/pbgRkz.jpg"}
                  videoTitle={`${currentAnime?.title || "Anime"} - Episode ${selectedEpisode}`}
                  subtitles={[
                    {
                      file: "https://brenopolanski.github.io/html5-video-webvtt-example/MIB2-subtitles-pt-BR.vtt",
                      label: "English",
                      kind: "subtitles",
                      default: true,
                    },
                  ]}
                  // Don't pass thumbnailsVttUrl - let it use the built-in placeholder system
                  // thumbnailsVttUrl will be undefined, so it will use the fallback
                />
              )}
            </div>
            
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div>
                <p className="text-lg text-white">
                  You are watching Episode {selectedEpisode}
                  {episodes.find(ep => ep.ep === selectedEpisode)?.title && 
                    ` - ${episodes.find(ep => ep.ep === selectedEpisode)?.title}`
                  }
                </p>
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
                      ? "btn-purple text-white/90 hover:bg-blue-700"
                      : "bg-gray-700 text-white/90 hover:bg-gray-800")
                  }
                  onClick={() => handleServerSwitch(1)}>
                  Server 1
                </button>
                <button
                  className={
                    `px-3 py-1 rounded font-normal shadow transition ` +
                    (selectedServer === 2
                      ? "btn-purple text-white/90 hover:bg-blue-700"
                      : "bg-gray-700 text-white/90 hover:bg-gray-800")
                  }
                  onClick={() => handleServerSwitch(2)}>
                  Server 2
                </button>
                <button
                  className={
                    `px-3 py-1 rounded font-normal shadow transition ` +
                    (selectedServer === 3
                      ? "btn-purple text-white/90"
                      : "bg-gray-700 text-white/90 hover:bg-gray-800")
                  }
                  onClick={() => handleServerSwitch(3)}>
                  Server 3
                </button>
              </div>
              
              {/* Audio Type Selection (SUB/DUB) */}
              <div className="flex gap-4 justify-center items-center flex-wrap mt-4">
                <span className="text-white text-sm font-medium">Audio:</span>
                <button
                  className={
                    `px-3 py-1 rounded font-normal shadow transition ` +
                    (audioType === 'sub'
                      ? "btn-purple text-white/90 hover:bg-blue-700"
                      : "bg-gray-700 text-white/90 hover:bg-gray-800")
                  }
                  onClick={() => setAudioType('sub')}>
                  SUB
                </button>
                <button
                  className={
                    `px-3 py-1 rounded font-normal shadow transition ` +
                    (audioType === 'dub'
                      ? "btn-purple text-white/90 hover:bg-blue-700"
                      : "bg-gray-700 text-white/90 hover:bg-gray-800")
                  }
                  onClick={() => setAudioType('dub')}>
                  DUB
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
              <select 
                className="bg-gray-700 text-white/90 p-2 rounded-md w-full text-center cursor-pointer focus:outline-none"
                value={audioType}
                onChange={(e) => setAudioType(e.target.value as 'sub' | 'dub')}
              >
                <option value="sub">SUB {watchData?.episodes.sub?.length || 0}</option>
                <option value="dub">DUB {watchData?.episodes.dub?.length || 0}</option>
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
              {filteredEpisodes.map(({ ep, title, thumbnail }) => (
                <div
                  key={ep}
                  className={
                    isListView
                      ? `relative group flex items-center w-full rounded-lg overflow-hidden shadow-lg cursor-pointer border-2 mb-2 ${
                          selectedEpisode === ep
                            ? "border-purple-600"
                            : "border-transparent"
                        }`
                      : `relative group h-15 w-full rounded-lg overflow-hidden shadow-lg cursor-pointer border-2 text-center ${
                          selectedEpisode === ep
                            ? "border-purple-600"
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
                          src={thumbnail || `https://static1.animekai.cc/c1/i/c/61/67eeaecf89bee.jpg`}
                          alt={`Episode ${ep}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center px-4 py-2 bg-transparent">
                        <span className="text-white text-sm font-semibold">
                          Ep {ep}
                        </span>
                        <span className="text-pink text-md mt-1">
                          {title}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Image
                        src={thumbnail || `https://static1.animekai.cc/c1/i/c/61/67eeaecf89bee.jpg`}
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
                    <div className="absolute top-1 right-0 btn-purple text-xs px-1 py-1 rounded font-bold text-white/90">
                      Playing
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-12 text-center shadow-xl p-5">
              <h2 className="text-md font-bold text-pink">
                How did you rate this anime?
              </h2>
              <p className="text-sm mt-1">9.26 by 3,920 reviews</p>
              <div className="flex justify-center mt-3 gap-1">
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="29"
                      height="29"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-star h-7 w-7 fill-current"
                      aria-hidden="true">
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* --- Extra Anime Info Section --- */}
        <section className="entity-section w-full max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8 py-3 sm:py-8">
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
              <div className="flex items-center justify-end mb-2 flex-wrap-reverse gap-4">
                <h1
                  itemProp="name"
                  className="title text-2xl md:text-3xl font-bold text-white flex-grow"
                  data-jp="WIND BREAKER Season 2">
                  {infoType === "anime"
                    ? "Wind Breaker Season 2"
                    : `Episode ${selectedEpisode}: ${
                        episodes.find((ep) => ep.ep === selectedEpisode)
                          ?.title || "Episode Title"
                      }`}
                </h1>

                {/* Info Type Toggle Buttons */}
                <div className="flex shrink-0 m-auto sm:ml-auto">
                  <button
                    className={`px-3 py-1.5 rounded-l-lg text-sm font-medium transition-colors focus:outline-none ${
                      infoType === "episode"
                        ? "btn-purple text-white/90"
                        : "bg-gray-600 text-white/90 hover:bg-gray-500"
                    }`}
                    onClick={() => setInfoType("episode")}>
                    Episode Info
                  </button>
                  <button
                    className={`px-3 py-1.5 rounded-r-lg text-sm font-medium transition-colors focus:outline-none ${
                      infoType === "anime"
                        ? "btn-purple text-white/90"
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
                  Country: <span className="text-pink">Japan</span>
                </div>
                <div>
                  Genres:{" "}
                  <Link href={"/search"} className="text-pink">
                    Comedy,
                  </Link>
                  <Link href={"/search"} className="text-pink">
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
                  Episodes: <span> Dub 20, Sub 12 </span>
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
                  <Link href={"/search"} className="text-pink">
                    CloverWorks
                  </Link>
                </div>
                <div>
                  Producer:{" "}
                  <Link href={"/search"} className="text-pink">
                    CloverWorks
                  </Link>
                </div>
                <div>
                  Producers:{" "}
                  <span className="text-pink">
                    Aniplex, Kodansha, Mainichi Broadcasting System, Aiming,
                    Tohan Corporation
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-5">
          <Link
            href={"/anime/info"}
            className="px-4 py-2 btn-purple text-white/90 rounded-lg font-medium transition-colors">
            View Full Info
          </Link>
        </div>
        </section>
        {/* Relations Section */}
        <div className="w-full max-w-7xl mx-auto mt-3 px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-4 sm:pb-16">
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
            {watchData?.relatedAnime?.slice(0, 10).map((anime) => (
              <SwiperSlide key={anime.id}>
                <div className="relative">
                  <AnimeCard anime={{
                    id: anime.id,
                    title: anime.title,
                    synopsis: anime.synopsis,
                    poster: anime.poster,
                    banner: anime.banner,
                    genres: anime.genres,
                    studio: 'Unknown',
                    releaseYear: new Date().getFullYear(),
                    status: anime.isAiring ? 'ongoing' as const : 'completed' as const,
                    type: anime.type.toLowerCase() === 'movie' ? 'movie' as const : 'series' as const,
                    totalEpisodes: anime.episodeCount,
                    rating: 0,
                    popularity: 0,
                    language: ['sub' as const],
                  }} showPopup={true} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Recommended Section */}
        <div className="w-full max-w-7xl mx-auto mt-4 sm:mt-10 px-4 sm:px-6 lg:px-8 py-8 pb-5 sm:pb-16">
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
            {watchData?.similarAnime?.slice(0, 10).map((anime) => (
              <SwiperSlide key={anime.id}>
                <div className="flex-shrink-0 overflow-visible  relative">
                  <AnimeCard
                    anime={{
                      id: anime.id,
                      title: anime.title,
                      synopsis: anime.synopsis,
                      poster: anime.poster,
                      banner: anime.banner,
                      genres: anime.genres,
                      studio: 'Unknown',
                      releaseYear: new Date().getFullYear(),
                      status: anime.isAiring ? 'ongoing' as const : 'completed' as const,
                      type: anime.type.toLowerCase() === 'movie' ? 'movie' as const : 'series' as const,
                      totalEpisodes: anime.episodeCount,
                      rating: 0,
                      popularity: 0,
                      language: ['sub' as const],
                    }}
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
      )}
      
      <FooterSection />
    </div>
  );
}
