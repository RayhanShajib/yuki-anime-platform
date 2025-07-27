import { Navigation } from "@/components/layout/Navigation";
import { ContinueWatchingSection } from "@/components/sections/ContinueWatchingSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { LatestSection } from "@/components/sections/LatestSection";
import ScheduleSection from "@/components/sections/ScheduleSection";
import { TrendingSection } from "@/components/sections/TrendingSection";
import { AnimeTooltip } from "@/components/ui/AnimeTooltip";
import { featuredAnime, latestAnime, trendingAnime } from "@/lib/mockData";
import Image from "next/image";

// import { pageApi } from "@/lib/api/pageApi";

// Home page API data
// const homeData = await pageApi.getHomePageData();
// const featured = homeData.spotlight;
// const latest = homeData.latest;
// const trending = homeData.trending;

export default function Home() {
  // Mock continue watching data - in real app this would come from user's watch history
  const continueWatching: never[] = []; // Empty for new users

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation - transparent background on home page */}
      <Navigation isLandingPage={true} />

      {/* Hero Carousel */}
      <HeroCarousel featuredAnime={featuredAnime} />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Continue Watching Section - only shows if user has watch history */}
        <ContinueWatchingSection continueWatching={continueWatching} />

        {/* Trending Section */}
        <TrendingSection trendingAnime={trendingAnime} />

        {/* Latest Anime Section */}
        <LatestSection />

        <ScheduleSection />

        {/* Four-Section Content Grid */}
        <section className="py-12 bg-gray-900/30 grid-content">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Top Airing */}
              <div className="rounded-lg">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  Top Airing
                </h3>
                <div className="space-y-4 mb-4">
                  {latestAnime.slice(0, 5).map((anime) => (
                    <div
                      key={anime.id}
                      className="flex items-center space-x-4 border-b border-gray-700 pb-5">
                      <AnimeTooltip anime={anime} position="right">
                        <Image
                          src={anime.poster}
                          alt={anime.title}
                          width={70}
                          height={40}
                          className="object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </AnimeTooltip>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-md">
                          {anime.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-gray-300 text-xs">
                            Episode {anime.totalEpisodes || "?"}
                          </p>
                          •<p className="text-gray-200 text-sm">{anime.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="#" className="text-white">
                  <button>View more..</button>
                </a>
              </div>

              {/* Most Popular */}
              <div className="rounded-lg">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  Most Popular
                </h3>
                <div className="space-y-4 mb-4">
                  {[...latestAnime]
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, 5)
                    .map((anime) => (
                      <div
                        key={anime.id}
                        className="flex items-center space-x-4 border-b border-gray-700 pb-4">
                        <AnimeTooltip anime={anime} position="right">
                          <Image
                            src={anime.poster}
                            alt={anime.title}
                            width={70}
                            height={40}
                            className="object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </AnimeTooltip>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-md">
                            {anime.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-gray-300 text-xs">
                              Episode {anime.totalEpisodes || "?"}
                            </p>
                            •
                            <p className="text-gray-200 text-sm">
                              {anime.type}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <a href="#" className="text-white">
                  <button>View more..</button>
                </a>
              </div>

              {/* Most Favorite */}
              <div className="rounded-lg">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  Most Favorite
                </h3>
                <div className="space-y-4 mb-4">
                  {[...latestAnime]
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 5)
                    .map((anime) => (
                      <div
                        key={anime.id}
                        className="flex items-center space-x-4 border-b border-gray-700 pb-4">
                        <AnimeTooltip anime={anime} position="right">
                          <Image
                            src={anime.poster}
                            alt={anime.title}
                            width={70}
                            height={40}
                            className="object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </AnimeTooltip>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-md">
                            {anime.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-gray-300 text-xs">
                              Episode {anime.totalEpisodes || "?"}
                            </p>
                            •
                            <p className="text-gray-200 text-sm">
                              {anime.type}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <a href="#" className="text-white">
                  <button>View more..</button>
                </a>
              </div>

              {/* Latest Completed */}
              <div className="rounded-lg">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  Latest Completed
                </h3>
                <div className="space-y-4 mb-4">
                  {latestAnime
                    .filter((anime) => anime.status === "completed")
                    .slice(0, 5)
                    .map((anime) => (
                      <div
                        key={anime.id}
                        className="flex items-center space-x-4 border-b border-gray-700 pb-4">
                        <AnimeTooltip anime={anime} position="right">
                          <Image
                            src={anime.poster}
                            alt={anime.title}
                            width={70}
                            height={40}
                            className="object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </AnimeTooltip>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-md">
                            {anime.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-gray-300 text-xs">
                              Episode {anime.totalEpisodes || "?"}
                            </p>
                            •
                            <p className="text-gray-200 text-sm">
                              {anime.type}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <a href="#" className="text-white">
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
