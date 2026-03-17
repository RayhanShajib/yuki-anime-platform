"use client";

import { useState, useEffect } from "react";
import { safeLocalStorage } from "@/lib/safeLocalStorage";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { adminApi, type EpisodeDetailData } from "@/lib/api/adminApi";
import { Loader2 } from "lucide-react";

export default function AdminViewEpisodePage() {
  const params = useParams();
  const router = useRouter();
  const episodeId = params.id as string;

  const [episodeData, setEpisodeData] = useState<EpisodeDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch episode data on load
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = safeLocalStorage.getItem('access_token');
        if (!token) {
          throw new Error('Authentication required. Please log in.');
        }

        const response = await adminApi.getSingleEpisodeDetails(episodeId, token);
        setEpisodeData(response);
      } catch (err) {
        console.error('Error fetching episode:', err);
        if (err instanceof Error) {
          if (err.message.includes('permission') || err.message.includes('401') || err.message.includes('403')) {
            setError('Access denied. Admin privileges required.');
          } else {
            setError('Failed to load episode data');
          }
        } else {
          setError('Failed to load episode data');
        }
      } finally {
        setLoading(false);
      }
    };

    if (episodeId) {
      fetchEpisode();
    }
  }, [episodeId]);

  // Handle delete episode
  const handleDeleteEpisode = async () => {
    if (!episodeData) return;
    
    if (!confirm(`Are you sure you want to delete "Episode ${episodeData.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      
      const token = safeLocalStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      await adminApi.deleteEpisode(episodeId, token);
      alert('Episode deleted successfully!');
      router.push('/admin/episodes');
      
    } catch (err) {
      console.error('Error deleting episode:', err);
      if (err instanceof Error) {
        if (err.message.includes('permission') || err.message.includes('401') || err.message.includes('403')) {
          alert('Access denied. Admin privileges required.');
        } else {
          alert('Failed to delete episode. Please try again.');
        }
      } else {
        alert('Failed to delete episode. Please try again.');
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span className="ml-2 text-white">Loading episode data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto w-full">
        <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!episodeData) {
    return (
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-gray-400 text-center py-12">
          Episode not found.
        </div>
      </div>
    );
  }
  const relatedAnime = episodeData.related_animes[0];
  const subSources = episodeData.vidsrces?.sub?.[0];
  const dubSources = episodeData.vidsrces?.dub?.[0];

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {relatedAnime?.title || 'Unknown Anime'} - Episode {episodeData.ep_no}
            </h2>
            <div className="text-gray-400 text-sm mb-2">{episodeData.title}</div>
          </div>
          <div className="text-sm text-gray-400">
            <div>Episode ID: #{episodeData.id}</div>
            <div>Views: {episodeData.view_count.toLocaleString()}</div>
          </div>
        </div>

        {/* Episode Details */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <div className="flex gap-6 mb-6 flex-col lg:flex-row">
            {/* Episode Image */}
            <div className="w-full lg:w-80 h-48 relative rounded overflow-hidden bg-gray-700 flex-shrink-0">
              {episodeData.image ? (
                <Image 
                  src={episodeData.image} 
                  alt={episodeData.title} 
                  fill 
                  className="object-cover" 
                  sizes="320px" 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* Episode Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Episode Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="text-gray-300">
                    <span className="font-semibold text-gray-200">Episode Number:</span> {episodeData.ep_no}
                  </div>
                  <div className="text-gray-300">
                    <span className="font-semibold text-gray-200">Aired Date:</span> {episodeData.aired_date}
                  </div>
                  <div className="text-gray-300">
                    <span className="font-semibold text-gray-200">View Count:</span> {episodeData.view_count.toLocaleString()}
                  </div>
                  <div className="text-gray-300">
                    <span className="font-semibold text-gray-200">Anime ID:</span> {episodeData.anime}
                  </div>
                </div>
              </div>

              {episodeData.description && (
                <div>
                  <h4 className="font-semibold text-gray-200 mb-2">Description</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{episodeData.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Anime Info */}
          {relatedAnime && (
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Related Anime</h3>
              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="w-20 h-28 relative rounded overflow-hidden bg-gray-700 flex-shrink-0">
                  <Image 
                    src={relatedAnime.image} 
                    alt={relatedAnime.title} 
                    fill 
                    className="object-cover" 
                    sizes="80px" 
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{relatedAnime.title}</h4>
                  <div className="text-gray-400 text-sm mb-2">{relatedAnime.title_japanese}</div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {relatedAnime.genre?.slice(0, 3).map((g, index) => (
                      <span key={index} className="text-xs bg-purple-700 text-purple-200 px-2 py-1 rounded">
                        {g.name}
                      </span>
                    ))}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {relatedAnime.number_of_episodes} episodes • {relatedAnime.rating}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Video Sources */}
          <div className="border-t border-gray-700 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">Video Sources</h3>
            
            {subSources && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">SUB</span>
                  Subtitled Sources
                </h4>
                <div className="space-y-2">
                  {subSources.iframe?.map((url, index) => (
                    <div key={index} className="bg-gray-800 p-3 rounded text-sm">
                      <div className="text-blue-400 break-all">{url}</div>
                    </div>
                  ))}
                  {subSources.private && (
                    <div className="text-xs text-gray-400">
                      Private Key: <span className="font-mono">{subSources.private}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {dubSources && (
              <div>
                <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2">
                  <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">DUB</span>
                  Dubbed Sources
                </h4>
                <div className="space-y-2">
                  {dubSources.iframe?.map((url, index) => (
                    <div key={index} className="bg-gray-800 p-3 rounded text-sm">
                      <div className="text-blue-400 break-all">{url}</div>
                    </div>
                  ))}
                  {dubSources.private && (
                    <div className="text-xs text-gray-400">
                      Private Key: <span className="font-mono">{dubSources.private}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!subSources && !dubSources && (
              <div className="text-gray-400 text-center py-4">
                No video sources available for this episode.
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link 
            href={`/admin/episodes/${episodeId}/edit`} 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Edit Episode
          </Link>
          <button 
            onClick={handleDeleteEpisode}
            disabled={deleting}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Episode'
            )}
          </button>
          <Link 
            href="/admin/episodes" 
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
} 