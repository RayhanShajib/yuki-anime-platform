"use client";

import { Navigation } from "@/components/layout/Navigation";
import { FooterSection } from "@/components/sections/FooterSection";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { CommentSection } from "@/components/ui/CommentSection";
import IframeVideoPlayer from "@/components/ui/IframeVideoPlayer";
import VideoPlayer, { VideoPlayerRef } from "@/components/ui/VideoPlayer";
import { pageApi } from "@/lib/api/pageApi";
import { transformWatchPageData } from "@/lib/transformers";
import type { TransformedWatchPageData, PrivateVideoSourceResponse } from "@/types/api";
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

  // --- Private Video Sources State ---
  const [privateVideoSources, setPrivateVideoSources] = useState<string[]>([]);
  const [privateSourcesLoading, setPrivateSourcesLoading] = useState(false);

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

  // --- Fetch Private Video Sources ---
  useEffect(() => {
    if (!watchData) return;

    const fetchPrivateVideoSources = async () => {
      try {
        setPrivateSourcesLoading(true);
        
        // Get video sources for current audio type
        const sources = watchData.videoSources[audioType];
        if (!sources.length) return;
        
        // Use the first video source group's private key
        const privateKey = sources[0].privateKey;
        if (!privateKey) return;
        
        // Fetch real video sources
        const privateSourcesResponse: PrivateVideoSourceResponse = await pageApi.getPrivateVideoSource(privateKey);
        
        // Extract URLs in fallback order (default -> backup -> others)
        const sourceUrls = privateSourcesResponse.m3u8
          .sort((a, b) => {
            const order = { 'default': 0, 'backup': 1, '1080': 2 };
            return (order[a.quality as keyof typeof order] ?? 999) - (order[b.quality as keyof typeof order] ?? 999);
          })
          .map(source => source.url);
        
        setPrivateVideoSources(sourceUrls);
      } catch (err) {
        console.error('Error fetching private video sources:', err);
        setPrivateVideoSources([]);
      } finally {
        setPrivateSourcesLoading(false);
      }
    };

    fetchPrivateVideoSources();
  }, [watchData, audioType]);

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
  const [selectedIframeServer, setSelectedIframeServer] = React.useState<number | null>(null);
  const [serverType, setServerType] = React.useState<'video' | 'iframe'>('video');
  
  // --- Video Player Ref ---
  const videoPlayerRef = React.useRef<VideoPlayerRef>(null);
  
  // --- Proxy URL Helper ---
  const getProxiedUrl = (originalUrl: string): string => {
    if (!originalUrl) return '';
    return `${encodeURIComponent(originalUrl)}`;
  };
  
  // --- Video Sources Configuration (Private + Public M3U8) ---
  const videoSources = useMemo(() => {
    if (!watchData) return {};
    
    const sources = watchData.videoSources[audioType];
    if (!sources.length) return {};
    
    const sourceGroup = sources[0];
    const sourcesMap: Record<number, string> = {};
    let serverNumber = 1;
    
    // Private video sources (Server 1, 2, 3...) - only add if URL exists and is not empty
    if (privateVideoSources.length > 0) {
      privateVideoSources.forEach((url) => {
        if (url && url.trim()) {
          sourcesMap[serverNumber] = getProxiedUrl(url);
          serverNumber++;
        }
      });
    }
    
    // Public M3U8 sources (Server 4, 5, 6... after private sources) - only add if URL exists and is not empty
    if (sourceGroup.m3u8Urls && sourceGroup.m3u8Urls.length > 0) {
      sourceGroup.m3u8Urls.forEach((url) => {
        if (url && url.trim()) {
          sourcesMap[serverNumber] = getProxiedUrl(url);
          serverNumber++;
        }
      });
    }
    
    // Fallback: if no sources exist, ensure at least one server if there's any M3U8 URL
    if (Object.keys(sourcesMap).length === 0 && sourceGroup.m3u8Urls && sourceGroup.m3u8Urls.length > 0) {
      const firstValidUrl = sourceGroup.m3u8Urls.find(url => url && url.trim());
      if (firstValidUrl) {
        sourcesMap[1] = getProxiedUrl(firstValidUrl);
      }
    }
    
    return sourcesMap;
  }, [watchData, audioType, privateVideoSources]);

  // --- Iframe Sources Configuration (Separate from video sources) ---
  const iframeSources = useMemo(() => {
    if (!watchData) return [];
    
    const sources = watchData.videoSources[audioType];
    if (!sources.length) return [];
    
    const sourceGroup = sources[0];
    return sourceGroup.iframeUrls || [];
  }, [watchData, audioType]);

  // --- Auto-select First Working Server ---
  useEffect(() => {
    if (Object.keys(videoSources).length > 0) {
      // Find the first available video server
      const serverNumbers = Object.keys(videoSources).map(Number).sort((a, b) => a - b);
      const firstAvailableServer = serverNumbers[0];
      
      if (firstAvailableServer && (selectedServer !== firstAvailableServer || serverType !== 'video')) {
        setSelectedServer(firstAvailableServer);
        setServerType('video');
        setSelectedIframeServer(null);
      }
    } else if (iframeSources.length > 0) {
      // Fallback to iframe if no video sources available
      setSelectedIframeServer(1);
      setServerType('iframe');
    }
  }, [videoSources, iframeSources]);

  // --- Handle Video Server Switch with Time Continuity ---
  const handleServerSwitch = (serverNumber: number) => {
    // Get current time for continuity (if video player exists)
    const currentTime = videoPlayerRef.current?.getCurrentTime() || 0;
    
    // Update server state
    setSelectedServer(serverNumber);
    setServerType('video');
    setSelectedIframeServer(null);
    
    // Handle video source loading with time continuity for HLS sources
    const newSource = videoSources[serverNumber as keyof typeof videoSources];
    if (videoPlayerRef.current && newSource) {
      // All video sources use HLS with proxy
      videoPlayerRef.current.loadNewSource(newSource, currentTime);
    }
  };

  // --- Handle Iframe Server Switch ---
  const handleIframeServerSwitch = (iframeServerNumber: number) => {
    setSelectedIframeServer(iframeServerNumber);
    setServerType('iframe');
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
              {serverType === 'iframe' && selectedIframeServer ? (
                <IframeVideoPlayer src={iframeSources[selectedIframeServer - 1] || "https://www.youtube.com/embed/dQw4w9WgXcQ"} />
              ) : (
                <VideoPlayer 
                  ref={videoPlayerRef}
                  videoSources={[
                    {
                      file: videoSources[selectedServer as keyof typeof videoSources] || "", 
                      type: "hls", // All proxied M3U8 sources use HLS
                      label: `Server ${selectedServer}`,
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

             {/* Video Source Debug Information */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-800 p-4 rounded-lg mb-4 text-xs text-gray-300">
                <strong>Debug Info:</strong>
                <div>Server Type: {serverType}</div>
                <div>Selected Video Server: {selectedServer}</div>
                <div>Selected Iframe Server: {selectedIframeServer || 'None'}</div>
                <div>Private Sources Loading: {privateSourcesLoading ? 'Yes' : 'No'}</div>
                <div>Private Sources Count: {privateVideoSources.length}</div>
                <div>Public M3U8 URLs Count: {watchData?.videoSources[audioType]?.[0]?.m3u8Urls?.length || 0}</div>
                <div>Available Video Servers: {Object.keys(videoSources).join(', ')}</div>
                <div>Available Iframe Servers: {iframeSources.length}</div>
                <div>Current Source: {serverType === 'iframe' ? 
                  (iframeSources[selectedIframeServer! - 1]?.substring(0, 80) + '...') : 
                  (videoSources[selectedServer]?.substring(0, 80) + '...')}</div>
                {watchData?.videoSources[audioType]?.[0]?.m3u8Urls && (
                  <div>
                    <strong>Raw M3U8 URLs:</strong>
                    {watchData.videoSources[audioType][0].m3u8Urls.map((url, index) => (
                      <div key={index} className="truncate">
                        [{index + 1}]: {url ? url.substring(0, 60) + '...' : 'Empty URL'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            
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
              {/* Server Selection Buttons - Two Row Layout */}
              <div className="flex flex-col gap-3 justify-center items-center">
                {/* First Row: Video Servers (Private + Public M3U8) */}
                <div className="flex gap-2 justify-center items-center flex-wrap">
                  {Object.keys(videoSources).map((serverNum) => {
                    const serverNumber = parseInt(serverNum);
                    const isPrivate = serverNumber <= privateVideoSources.length;
                    const isSelected = serverType === 'video' && selectedServer === serverNumber;
                    
                    let label = `Server ${serverNumber}`;
                    if (isPrivate) {
                      if (serverNumber === 1) label += ' (HQ)';
                      else if (serverNumber === 2) label += ' (HD)';
                      else if (serverNumber === 3) label += ' (SD)';
                    }
                    
                    return (
                      <button
                        key={serverNumber}
                        className={
                          `px-3 py-1 rounded font-normal shadow transition ${
                            privateSourcesLoading && isPrivate ? 'opacity-50 cursor-not-allowed' : ''
                          } ` +
                          (isSelected
                            ? "btn-purple text-white/90 hover:bg-blue-700"
                            : "bg-gray-700 text-white/90 hover:bg-gray-800")
                        }
                        onClick={() => handleServerSwitch(serverNumber)}
                        disabled={privateSourcesLoading && isPrivate}>
                        {privateSourcesLoading && isPrivate ? 'Loading...' : label}
                      </button>
                    );
                  })}
                </div>
                
                {/* Second Row: Iframe Servers */}
                {iframeSources.length > 0 && (
                  <div className="flex gap-2 justify-center items-center flex-wrap">
                    <span className="text-white text-sm font-medium mr-2">Iframe:</span>
                    {iframeSources.map((_, index) => {
                      const iframeServerNumber = index + 1;
                      const isSelected = serverType === 'iframe' && selectedIframeServer === iframeServerNumber;
                      
                      return (
                        <button
                          key={iframeServerNumber}
                          className={
                            `px-3 py-1 rounded font-normal shadow transition ` +
                            (isSelected
                              ? "btn-purple text-white/90 hover:bg-blue-700"
                              : "bg-gray-700 text-white/90 hover:bg-gray-800")
                          }
                          onClick={() => handleIframeServerSwitch(iframeServerNumber)}>
                          Server {iframeServerNumber}
                        </button>
                      );
                    })}
                  </div>
                )}
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
