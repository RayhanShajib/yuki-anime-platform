
import { Navigation } from "@/components/layout/Navigation";
import { ContinueWatchingSection } from "@/components/sections/ContinueWatchingSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { LatestSection } from "@/components/sections/LatestSection";
import ScheduleSection from "@/components/sections/ScheduleSection";
import { TrendingSection } from "@/components/sections/TrendingSection";
import { pageApi } from "@/lib/api/pageApi";
import {
  transformLatestData,
  transformSpotlightData,
  transformTrendingData,
} from "@/lib/transformers";
import Image from "next/image";
import Link from "next/link";

// Type for API anime items in home sections
interface ApiAnimeItem {
  id: number;
  title: string;
  image: string;
  anime_type: string;
  airing: boolean;
  number_of_episodes?: number;
  [key: string]: unknown; // For additional properties we don't need to type
}

export default async function Home() {
  // Fetch data directly on server
  const homeData = await pageApi.getHomePageData();

  // Mock continue watching data - in real app this would come from user's watch history
  const continueWatching: never[] = []; // Empty for new users

  return (
      <div className="min-h-screen bg-purple">
        {/* Navigation - transparent background on home page */}
        <Navigation isLandingPage={true} />

        {/* Hero Carousel */}
        <HeroCarousel
          featuredAnime={transformSpotlightData(homeData.spotlight || [])}
        />

        {/* Main Content */}
        <main className="relative z-10">
          {/* Continue Watching Section - only shows if user has watch history */}
          <ContinueWatchingSection continueWatching={continueWatching} />

          {/* Trending Section */}
          <TrendingSection
            trendingData={transformTrendingData(
              homeData.trending || { now: [], day: [], week: [], month: [] }
            )}
          />

          {/* Latest Anime Section */}
          <LatestSection
            latestAnime={transformLatestData(
              homeData.latest || { sub: [], dub: [] }
            )}
          />

          <ScheduleSection airingAnime={homeData.airing || []} />

          {/* Four-Section Content Grid */}
          <section className="py-5 sm:py-10 bg-gray-900/30 grid-content">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Top Airing */}
                <div className="rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    Top Airing
                  </h3>
                  <div className="space-y-4 mb-4">
                    {(homeData.airing || [])
                      .slice(0, 5)
                      .map((anime: ApiAnimeItem) => {
                        // Create slug from title
                        const slug = anime.title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "");

                        return (
                          <Link
                            key={anime.id}
                            href={`/anime/${anime.id}/${slug}`}
                            className="block hover:bg-gray-800/50 rounded-md transition-colors">
                            <div className="flex items-center space-x-4 border-b border-gray-700 pb-5 p-2">
                              <Image
                                src={anime.image || "/placeholder-anime.jpg"}
                                alt={anime.title}
                                width={70}
                                height={100}
                                className="object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                              />
                              <div className="flex-1">
                                <h4 className="text-white font-semibold text-md hover:text-purple-400 transition-colors">
                                  {anime.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-2">
                                  <p className="text-gray-300 text-xs">
                                    Episode {anime.number_of_episodes || "?"}
                                  </p>
                                  •
                                  <p className="text-gray-200 text-sm">
                                    {anime.anime_type}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                  <a
                    href="/ongoing"
                    className="text-white hover:text-pink transition-colors">
                    <button>View more..</button>
                  </a>
                </div>

                {/* Most Popular */}
                <div className="rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    Most Popular
                  </h3>
                  <div className="space-y-4 mb-4">
                    {(homeData.popular || [])
                      .slice(0, 5)
                      .map((anime: ApiAnimeItem) => {
                        // Create slug from title
                        const slug = anime.title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "");

                        return (
                          <Link
                            key={anime.id}
                            href={`/anime/${anime.id}/${slug}`}
                            className="block hover:bg-gray-800/50 rounded-md transition-colors">
                            <div className="flex items-center space-x-4 border-b border-gray-700 pb-4 p-2">
                              <Image
                                src={anime.image || "/placeholder-anime.jpg"}
                                alt={anime.title}
                                width={70}
                                height={100}
                                className="object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                              />
                              <div className="flex-1">
                                <h4 className="text-white font-semibold text-md hover:text-purple-400 transition-colors">
                                  {anime.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-2">
                                  <p className="text-gray-300 text-xs">
                                    Episode {anime.number_of_episodes || "?"}
                                  </p>
                                  •
                                  <p className="text-gray-200 text-sm">
                                    {anime.anime_type}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                  <a
                    href="/popular"
                    className="text-white hover:text-pink transition-colors">
                    <button>View more..</button>
                  </a>
                </div>

                {/* Most Favorite */}
                <div className="rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    Most Favorite
                  </h3>
                  <div className="space-y-4 mb-4">
                    {(homeData.favourite || [])
                      .slice(0, 5)
                      .map((anime: ApiAnimeItem) => {
                        // Create slug from title
                        const slug = anime.title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "");

                        return (
                          <Link
                            key={anime.id}
                            href={`/anime/${anime.id}/${slug}`}
                            className="block hover:bg-gray-800/50 rounded-md transition-colors">
                            <div className="flex items-center space-x-4 border-b border-gray-700 pb-4 p-2">
                              <Image
                                src={anime.image || "/placeholder-anime.jpg"}
                                alt={anime.title}
                                width={70}
                                height={100}
                                className="object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                              />
                              <div className="flex-1">
                                <h4 className="text-white font-semibold text-md hover:text-purple-400 transition-colors">
                                  {anime.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-2">
                                  <p className="text-gray-300 text-xs">
                                    Episode {anime.number_of_episodes || "?"}
                                  </p>
                                  •
                                  <p className="text-gray-200 text-sm">
                                    {anime.anime_type}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                  <a
                    href="/top-rated"
                    className="text-white hover:text-pink transition-colors">
                    <button>View more..</button>
                  </a>
                </div>

                {/* Latest Completed */}
                <div className="rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    Latest Completed
                  </h3>
                  <div className="space-y-4 mb-4">
                    {(homeData.completed || [])
                      .slice(0, 5)
                      .map((anime: ApiAnimeItem) => {
                        // Create slug from title
                        const slug = anime.title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "");

                        return (
                          <Link
                            key={anime.id}
                            href={`/anime/${anime.id}/${slug}`}
                            className="block hover:bg-gray-800/50 rounded-md transition-colors">
                            <div className="flex items-center space-x-4 border-b border-gray-700 pb-4 p-2">
                              <Image
                                src={anime.image || "/placeholder-anime.jpg"}
                                alt={anime.title}
                                width={70}
                                height={100}
                                className="object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                              />
                              <div className="flex-1">
                                <h4 className="text-white font-semibold text-md hover:text-purple-400 transition-colors">
                                  {anime.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-2">
                                  <p className="text-gray-300 text-xs">
                                    Episode {anime.number_of_episodes || "?"}
                                  </p>
                                  •
                                  <p className="text-gray-200 text-sm">
                                    {anime.anime_type}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                  </div>
                  <a
                    href="/movies"
                    className="text-white hover:text-pink transition-colors">
                    <button>View more..</button>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <FooterSection />
      </div>
  );
}
