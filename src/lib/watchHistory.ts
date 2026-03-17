import { safeLocalStorage } from "@/lib/safeLocalStorage";

export interface WatchHistoryItem {
  animeId: string;
  episodeId: string;
  animeTitle: string;
  episodeNumber: number;
  poster: string;
  currentTime: number;        // in seconds
  totalTime: number;          // in seconds
  progress: number;           // percentage (0-100)
  audioType: 'sub' | 'dub';
  lastWatched: string;        // ISO date string
  isCompleted: boolean;       // true if progress >= 98%
}

const STORAGE_KEY = 'yukiwatch_history';
const MAX_HISTORY_ITEMS = 20;
const COMPLETION_THRESHOLD = 98; // 98%

/**
 * Get all watch history items from localStorage
 */
export function getWatchHistory(): WatchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const items = safeLocalStorage.getItemJSON<WatchHistoryItem[]>(STORAGE_KEY, []);
    
    // Sort by lastWatched (most recent first) and limit to MAX_HISTORY_ITEMS
    return items
      .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
      .slice(0, MAX_HISTORY_ITEMS);
  } catch (error) {
    console.error('Error reading watch history:', error);
    return [];
  }
}

/**
 * Get watch progress for a specific episode
 */
export function getEpisodeProgress(episodeId: string, audioType: 'sub' | 'dub'): WatchHistoryItem | null {
  const history = getWatchHistory();
  return history.find(item => 
    item.episodeId === episodeId && 
    item.audioType === audioType
  ) || null;
}

/**
 * Save or update watch progress for an episode
 */
export function saveWatchProgress(data: {
  animeId: string;
  episodeId: string;
  animeTitle: string;
  episodeNumber: number;
  poster: string;
  currentTime: number;
  totalTime: number;
  audioType: 'sub' | 'dub';
}): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getWatchHistory();
    
    // Calculate progress percentage
    const progress = data.totalTime > 0 ? Math.round((data.currentTime / data.totalTime) * 100) : 0;
    const isCompleted = progress >= COMPLETION_THRESHOLD;
    
    // Create new watch history item
    const newItem: WatchHistoryItem = {
      ...data,
      progress,
      isCompleted,
      lastWatched: new Date().toISOString(),
    };
    
    // Find existing entry for this episode and audio type
    const existingIndex = history.findIndex(item => 
      item.episodeId === data.episodeId && 
      item.audioType === data.audioType
    );
    
    if (existingIndex >= 0) {
      // Update existing entry
      history[existingIndex] = newItem;
    } else {
      // Add new entry
      history.unshift(newItem);
    }
    
    // Keep only the latest MAX_HISTORY_ITEMS
    const trimmedHistory = history
      .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
      .slice(0, MAX_HISTORY_ITEMS);
    
    // Save back to localStorage
    safeLocalStorage.setItemJSON(STORAGE_KEY, trimmedHistory);
    
    console.log('Watch progress saved:', {
      episodeId: data.episodeId,
      audioType: data.audioType,
      progress: `${progress}%`,
      isCompleted
    });
    
  } catch (error) {
    console.error('Error saving watch progress:', error);
  }
}

/**
 * Remove a specific item from watch history
 */
export function removeFromHistory(episodeId: string, audioType: 'sub' | 'dub'): void {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getWatchHistory();
    const filteredHistory = history.filter(item => 
      !(item.episodeId === episodeId && item.audioType === audioType)
    );
    
    safeLocalStorage.setItemJSON(STORAGE_KEY, filteredHistory);
    
    console.log('Removed from watch history:', { episodeId, audioType });
  } catch (error) {
    console.error('Error removing from watch history:', error);
  }
}

/**
 * Clear all watch history
 */
export function clearWatchHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    safeLocalStorage.removeItem(STORAGE_KEY);
    console.log('Watch history cleared');
  } catch (error) {
    console.error('Error clearing watch history:', error);
  }
}

/**
 * Get watch history items that are not completed (for Continue Watching section)
 */
export function getContinueWatchingItems(): WatchHistoryItem[] {
  return getWatchHistory().filter(item => !item.isCompleted);
}

/**
 * Helper function to format time for display
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Check if an episode should be considered as "just started" (less than 2 minutes)
 */
export function isJustStarted(currentTime: number): boolean {
  return currentTime < 120; // 2 minutes
}

/**
 * Get resume message for display
 */
export function getResumeMessage(currentTime: number): string {
  if (isJustStarted(currentTime)) {
    return 'Continue watching';
  }
  return `Resume from ${formatTime(currentTime)}`;
}
