"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi, type EpisodeDetailData, type UpdateEpisodeData } from "@/lib/api/adminApi";
import { type ApiVideoSources } from "@/types/api";
import { Loader2 } from "lucide-react";

interface EpisodeForm {
  ep_no: number;
  title: string;
  description: string;
  aired_date: string;
  image: string;
  view_count: number;
  sub_iframe_urls: string;
  sub_private_key: string;
  dub_iframe_urls: string;
  dub_private_key: string;
}

export default function AdminEditEpisodePage() {
  const params = useParams();
  const router = useRouter();
  const episodeId = params.id as string;

  const [episodeData, setEpisodeData] = useState<EpisodeDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<EpisodeForm>({
    ep_no: 0,
    title: "",
    description: "",
    aired_date: "",
    image: "",
    view_count: 0,
    sub_iframe_urls: "",
    sub_private_key: "",
    dub_iframe_urls: "",
    dub_private_key: "",
  });

  // Fetch episode data on load
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('Authentication required. Please log in.');
        }

        const response = await adminApi.getSingleEpisodeDetails(episodeId, token);
        console.log('Episode data received:', response); // Debug log
        setEpisodeData(response);
        
        // Populate form with episode data
        const subSources = response.vidsrces?.sub?.[0];
        const dubSources = response.vidsrces?.dub?.[0];
        console.log('Sub sources:', subSources); // Debug log
        console.log('Dub sources:', dubSources); // Debug log
        
        const formData = {
          ep_no: response.ep_no || 0,
          title: response.title || "",
          description: response.description || "",
          aired_date: response.aired_date || "",
          image: response.image || "",
          view_count: response.view_count || 0,
          sub_iframe_urls: subSources?.iframe?.join('\n') || "",
          sub_private_key: subSources?.private || "",
          dub_iframe_urls: dubSources?.iframe?.join('\n') || "",
          dub_private_key: dubSources?.private || "",
        };
        
        console.log('Form data to be set:', formData); // Debug log
        setForm(formData);
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: name === 'ep_no' || name === 'view_count' ? parseInt(value) || 0 : value 
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Prepare update data
      const vidsrces: ApiVideoSources = {};
      
      // Add SUB sources if they exist
      if (form.sub_iframe_urls.trim()) {
        vidsrces.sub = [{
          iframe: form.sub_iframe_urls.split('\n').filter((url: string) => url.trim()),
          m3u8: [],
          private: form.sub_private_key,
        }];
      }
      
      // Add DUB sources if they exist
      if (form.dub_iframe_urls.trim()) {
        vidsrces.dub = [{
          iframe: form.dub_iframe_urls.split('\n').filter((url: string) => url.trim()),
          m3u8: [],
          private: form.dub_private_key,
        }];
      }

      const updateData: UpdateEpisodeData = {
        ep_no: form.ep_no,
        title: form.title,
        description: form.description || null,
        aired_date: form.aired_date,
        image: form.image || null,
        view_count: form.view_count,
        vidsrces: Object.keys(vidsrces).length > 0 ? vidsrces : undefined,
      };

      await adminApi.updateEpisode(episodeId, updateData, token);
      alert('Episode updated successfully!');
      router.push('/admin/episodes');
      
    } catch (err) {
      console.error('Error updating episode:', err);
      if (err instanceof Error) {
        if (err.message.includes('permission') || err.message.includes('401') || err.message.includes('403')) {
          alert('Access denied. Admin privileges required.');
        } else {
          alert('Failed to update episode. Please try again.');
        }
      } else {
        alert('Failed to update episode. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  }

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

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Edit Episode</h2>
        {episodeData && (
          <span className="text-sm text-gray-400">
            {episodeData.related_animes[0]?.title} - Episode {episodeData.ep_no}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 text-gray-300 shadow flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-200">Episode Number</label>
            <input 
              name="ep_no" 
              type="number" 
              value={form.ep_no} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-200">View Count</label>
            <input 
              name="view_count" 
              type="number" 
              value={form.view_count} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Episode Title</label>
          <input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            required 
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-200">Description</label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            rows={4}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            placeholder="Episode description..."
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-200">Aired Date</label>
            <input 
              name="aired_date" 
              type="date" 
              value={form.aired_date} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2 text-gray-200">Image URL</label>
            <input 
              name="image" 
              value={form.image} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
              placeholder="Episode thumbnail URL"
            />
          </div>
        </div>

        {/* SUB Video Sources */}
        <div className="border border-green-600/30 rounded-lg p-4 bg-green-900/10">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">SUB</span>
            Subtitled Sources
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">SUB Video URLs (One per line)</label>
              <textarea 
                name="sub_iframe_urls" 
                value={form.sub_iframe_urls} 
                onChange={handleChange} 
                rows={6}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
                placeholder="Enter SUB iframe URLs, one per line..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">SUB Private Key</label>
              <input 
                name="sub_private_key" 
                value={form.sub_private_key} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
                placeholder="Private key for SUB video sources"
              />
            </div>
          </div>
        </div>

        {/* DUB Video Sources */}
        <div className="border border-orange-600/30 rounded-lg p-4 bg-orange-900/10">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">DUB</span>
            Dubbed Sources
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">DUB Video URLs (One per line)</label>
              <textarea 
                name="dub_iframe_urls" 
                value={form.dub_iframe_urls} 
                onChange={handleChange} 
                rows={6}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
                placeholder="Enter DUB iframe URLs, one per line..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">DUB Private Key</label>
              <input 
                name="dub_private_key" 
                value={form.dub_private_key} 
                onChange={handleChange} 
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500" 
                placeholder="Private key for DUB video sources"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={saving}
            className="flex-1 py-2 rounded bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          <button 
            type="button" 
            onClick={() => router.push('/admin/episodes')}
            className="flex-1 py-2 rounded bg-gray-700 hover:bg-gray-800 text-white font-semibold text-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 