"use client";

import { createContext, useState, useContext, ReactNode } from "react";

// Define types for our context
export interface TarotCard {
  id: number;
  name: string;
}

// Interface for structured reading response
export interface StructuredPositionReading {
  position: number;
  card: string;
  description: string;
  interpretation: string;
}

export interface StructuredReading {
  positions: StructuredPositionReading[];
  overall: string;
}

export interface TarotReading {
  cards: TarotCard[]; // Changed from single card to array of cards
  spreadType: "single" | "universal6";
  question: string;
  userInfo: string;
  interpretation: string | StructuredReading; // Can be either string or structured data
  date: string;
}

interface TarotContextType {
  isLoading: boolean;
  error: string | null;
  reading: TarotReading | null;
  pastReadings: TarotReading[];
  getReading: (
    cards: TarotCard[],
    question: string,
    userInfo: string,
    spreadType?: "single" | "universal6"
  ) => Promise<void>;
  clearReading: () => void;
  savePastReading: () => void;
}

// Create the context
const TarotContext = createContext<TarotContextType | undefined>(undefined);

// Provider component
export function TarotProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [pastReadings, setPastReadings] = useState<TarotReading[]>([]);

  // Get a reading from the API
  const getReading = async (
    cards: TarotCard[],
    question: string,
    userInfo: string,
    spreadType: "single" | "universal6" = "single"
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tarot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cards,
          spreadType,
          question,
          userInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get reading");
      }

      // Create a new reading object
      const newReading: TarotReading = {
        cards,
        spreadType,
        question,
        userInfo,
        interpretation: data.response,
        date: new Date().toISOString(),
      };

      setReading(newReading);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error getting tarot reading:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear the current reading
  const clearReading = () => {
    setReading(null);
    setError(null);
  };

  // Save the current reading to past readings
  const savePastReading = () => {
    if (reading) {
      setPastReadings((prev) => [...prev, reading]);

      // Could also persist to localStorage here if needed
      // localStorage.setItem('pastReadings', JSON.stringify([...pastReadings, reading]));
    }
  };

  // Context value
  const contextValue: TarotContextType = {
    isLoading,
    error,
    reading,
    pastReadings,
    getReading,
    clearReading,
    savePastReading,
  };

  return (
    <TarotContext.Provider value={contextValue}>
      {children}
    </TarotContext.Provider>
  );
}

// Custom hook for using the tarot context
export function useTarot() {
  const context = useContext(TarotContext);

  if (context === undefined) {
    throw new Error("useTarot must be used within a TarotProvider");
  }

  return context;
}
