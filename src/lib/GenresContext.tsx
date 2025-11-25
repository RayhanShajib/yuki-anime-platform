"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { pageApi } from "@/lib/api/pageApi";
import type { Genre, GenreListResponse } from "@/types/api";

interface GenresContextType {
  genres: Genre[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const GenresContext = createContext<GenresContextType | undefined>(undefined);

interface GenresProviderProps {
  children: ReactNode;
}

export function GenresProvider({ children }: GenresProviderProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all genres with a high limit to get the complete list
      const response: GenreListResponse = await pageApi.getGenres(100, 0);
      
      if (response?.results) {
        // Sort genres by name for consistent ordering
        const sortedGenres = response.results.sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        setGenres(sortedGenres);
      } else {
        throw new Error("Invalid genres response format");
      }
    } catch (err) {
      console.error("Failed to fetch genres:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch genres");
      
      // Fallback to hardcoded genres if API fails
      const fallbackGenres: Genre[] = [
        { id: 1, name: "Action", anime_count: 0, popularity: null },
        { id: 2, name: "Adventure", anime_count: 0, popularity: null },
        { id: 3, name: "Comedy", anime_count: 0, popularity: null },
        { id: 4, name: "Drama", anime_count: 0, popularity: null },
        { id: 5, name: "Fantasy", anime_count: 0, popularity: null },
        { id: 6, name: "Horror", anime_count: 0, popularity: null },
        { id: 7, name: "Mystery", anime_count: 0, popularity: null },
        { id: 8, name: "Romance", anime_count: 0, popularity: null },
        { id: 9, name: "Sci-Fi", anime_count: 0, popularity: null },
        { id: 10, name: "Slice of Life", anime_count: 0, popularity: null },
      ];
      setGenres(fallbackGenres);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const refetch = async () => {
    await fetchGenres();
  };

  const value: GenresContextType = {
    genres,
    loading,
    error,
    refetch,
  };

  return (
    <GenresContext.Provider value={value}>
      {children}
    </GenresContext.Provider>
  );
}

export function useGenres(): GenresContextType {
  const context = useContext(GenresContext);
  if (context === undefined) {
    throw new Error("useGenres must be used within a GenresProvider");
  }
  return context;
}

// Utility hook to get just the genre names (for compatibility with existing hardcoded arrays)
export function useGenreNames(): string[] {
  const { genres } = useGenres();
  return genres.map(genre => genre.name);
}

// Sort genres by popularity (anime_count and popularity score)
export function sortGenresByPopularity(genres: Genre[]): Genre[] {
  return [...genres].sort((a, b) => {
    // Primary sort: anime_count (descending - more anime = more popular)
    if (a.anime_count !== b.anime_count) {
      return b.anime_count - a.anime_count;
    }
    
    // Secondary sort: popularity score (descending)
    if (a.popularity !== b.popularity) {
      return (b.popularity || 0) - (a.popularity || 0);
    }
    
    // Fallback: alphabetical order
    return a.name.localeCompare(b.name);
  });
}

// Hook to get genres sorted by popularity
export function useGenresByPopularity(): Genre[] {
  const { genres } = useGenres();
  return sortGenresByPopularity(genres);
}

// Hook to get top N most popular genres (for navigation dropdowns)
export function usePopularGenres(limit: number = 15): Genre[] {
  const popularGenres = useGenresByPopularity();
  return popularGenres.slice(0, limit);
}

// Hook to get popular genre names only (for compatibility)
export function usePopularGenreNames(limit: number = 15): string[] {
  const popularGenres = usePopularGenres(limit);
  return popularGenres.map(genre => genre.name);
}