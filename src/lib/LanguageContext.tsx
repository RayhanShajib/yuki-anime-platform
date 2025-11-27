"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Language type
export type Language = "en" | "jp";

// Interface for anime titles with different possible formats
export interface AnimeTitle {
  title: string | {
    english?: string;
    romaji?: string;
    japanese?: string;
  };
  title_japanese?: string | null;
  title_jp?: string;
}

// Context interface
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  getTitle: (anime: AnimeTitle) => string;
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Props for the provider
interface LanguageProviderProps {
  children: ReactNode;
}

// Language Provider component
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>("en");

  // Initialize language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("yuki-language") as Language | null;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "jp")) {
      setLanguageState(savedLanguage);
    } else {
      localStorage.setItem("yuki-language", "en");
    }
  }, []);

  // Update localStorage when language changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("yuki-language", lang);
  };

  // Core title selection logic
  const getTitle = (anime: AnimeTitle): string => {
    if (!anime) return "Unknown Title";

    // Handle different title formats
    if (typeof anime.title === "object" && anime.title !== null) {
      // Complex title object
      if (language === "jp") {
        return (
          anime.title.japanese ||
          anime.title.romaji ||
          anime.title.english ||
          "Unknown Title"
        );
      } else {
        return (
          anime.title.english ||
          anime.title.romaji ||
          anime.title.japanese ||
          "Unknown Title"
        );
      }
    }

    // Simple title string format
    if (language === "jp") {
      return (
        anime.title_japanese ||
        anime.title_jp ||
        anime.title ||
        "Unknown Title"
      );
    }

    return anime.title || "Unknown Title";
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    getTitle,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Standalone utility function for title selection (for cases where context isn't available)
export function getDisplayTitle(anime: AnimeTitle, language: Language): string {
  if (!anime) return "Unknown Title";

  // Handle different title formats
  if (typeof anime.title === "object" && anime.title !== null) {
    // Complex title object
    if (language === "jp") {
      return (
        anime.title.japanese ||
        anime.title.romaji ||
        anime.title.english ||
        "Unknown Title"
      );
    } else {
      return (
        anime.title.english ||
        anime.title.romaji ||
        anime.title.japanese ||
        "Unknown Title"
      );
    }
  }

  // Simple title string format
  if (language === "jp") {
    return (
      anime.title_japanese ||
      anime.title_jp ||
      anime.title ||
      "Unknown Title"
    );
  }

  return anime.title || "Unknown Title";
}