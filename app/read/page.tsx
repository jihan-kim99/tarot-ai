"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from "@mui/material";
import { useTarot } from "@/context/useTarotContext";
import TarotCardDeck from "@/components/tarot/TarotCardDeck";
import ReadingForm from "@/components/tarot/ReadingForm";
import ReadingResult from "@/components/tarot/ReadingResult";
import QuestionForm from "@/components/tarot/QuestionForm";
import { CardContainer } from "@/components/tarot/StyledComponents";
import { tarotCards } from "@/components/tarot/TarotData";

export default function ReadPage() {
  // State for tracking selected cards
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null); // Legacy single card
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]); // Multiple cards for spreads

  // User input and display state
  const [question, setQuestion] = useState<string>("");
  const [userInfo, setUserInfo] = useState<string>("");
  const [stage, setStage] = useState<
    "question" | "spread" | "card" | "confirm" | "result"
  >("question");

  // Spread type selection
  const [spreadType, setSpreadType] = useState<"single" | "universal6">(
    "single"
  );

  // Add clientSide state to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);

  // Use the tarot context
  const {
    isLoading,
    error,
    reading,
    getReading,
    clearReading,
    savePastReading,
  } = useTarot();

  // Run animations only after component has mounted on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle question form submission
  const handleQuestionSubmit = (info: string, q: string) => {
    setUserInfo(info);
    setQuestion(q);
    setStage("spread"); // Go to spread selection instead of directly to cards
  };

  // Handle spread type selection
  const handleSpreadTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newSpreadType: "single" | "universal6" | null
  ) => {
    if (newSpreadType !== null) {
      setSpreadType(newSpreadType);
      // Clear any previously selected cards
      setSelectedCardId(null);
      setSelectedCardIds([]);
      setStage("card");
    }
  };

  // Handle card click in single card mode
  const handleCardClick = (cardId: number) => {
    setSelectedCardId(cardId);
    setStage("confirm");
  };

  // Handle multiple card selection for spreads
  const handleMultipleCardsSelected = (cardIds: number[]) => {
    setSelectedCardIds(cardIds);
    setStage("confirm");
  };

  // Reset all state for a new reading
  const handleReset = () => {
    setSelectedCardId(null);
    setSelectedCardIds([]);
    setQuestion("");
    setUserInfo("");
    setSpreadType("single");
    setStage("question");
    clearReading();
  };

  // Submit the reading request to the API
  const handleReadingSubmit = async () => {
    if (spreadType === "universal6" && selectedCardIds.length === 6) {
      // Submit multiple cards for Universal 6 Card Spread
      const cards = selectedCardIds.map((id) => tarotCards[id]);
      await getReading(cards, question, userInfo, "universal6");
      setStage("result");
    } else if (selectedCardId !== null) {
      // Legacy single card reading
      const card = tarotCards[selectedCardId];
      await getReading([card], question, userInfo, "single");
      setStage("result");
    }
  };

  // Go back to card selection
  const handleGoBackToCards = () => {
    setSelectedCardId(null);
    setSelectedCardIds([]);
    setStage("card");
  };

  // Save the reading and start over
  const handleSaveAndClose = () => {
    savePastReading();
    handleReset();
  };

  return (
    <Box sx={{ minHeight: "100vh", padding: 4, bgcolor: "#f5f5f5" }}>
      <Typography variant="h3" align="center" gutterBottom>
        Tarot Reading
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        {stage === "question" && "First, share your question for the cards"}
        {stage === "spread" && "Choose your reading type"}
        {stage === "card" &&
          spreadType === "single" &&
          "Select a card to reveal your reading"}
        {stage === "card" &&
          spreadType === "universal6" &&
          "Select 6 cards from the Major Arcana"}
        {stage === "confirm" && "Confirm your selection"}
        {stage === "result" && reading && "Your tarot reading is ready"}
      </Typography>

      <CardContainer>
        <AnimatePresence mode="wait">
          {stage === "question" ? (
            // Display question form first
            <QuestionForm onSubmit={handleQuestionSubmit} />
          ) : stage === "spread" ? (
            // Spread selection
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 2,
                maxWidth: 600,
                width: "100%",
                textAlign: "center",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Choose Your Reading Type
              </Typography>

              <Typography variant="body2" sx={{ mb: 4 }}>
                Select the type of reading you&apos;d like to receive
              </Typography>

              <ToggleButtonGroup
                value={spreadType}
                exclusive
                onChange={handleSpreadTypeChange}
                aria-label="spread type"
                sx={{ mb: 4 }}
              >
                <ToggleButton value="single" aria-label="single card">
                  Single Card
                </ToggleButton>
                <ToggleButton
                  value="universal6"
                  aria-label="universal 6 card spread"
                >
                  Universal 6 Card Spread
                </ToggleButton>
              </ToggleButtonGroup>

              {spreadType === "single" && (
                <Box sx={{ mb: 3, textAlign: "left" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Single Card Reading
                  </Typography>
                  <Typography variant="body2">
                    A simple but powerful reading focused on your specific
                    question. Select one card to receive guidance.
                  </Typography>
                </Box>
              )}

              {spreadType === "universal6" && (
                <Box sx={{ mb: 3, textAlign: "left" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Universal 6 Card Spread
                  </Typography>
                  <Typography variant="body2">
                    A comprehensive reading that has been consulted over 200
                    million times since 2002. This spread uses the Major Arcana
                    cards to provide insight into six different aspects of your
                    situation:
                  </Typography>
                  <ol>
                    {positionDescriptions.map((desc, i) => (
                      <li key={i}>
                        <Typography variant="body2">{desc}</Typography>
                      </li>
                    ))}
                  </ol>
                </Box>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={() => setStage("card")}
              >
                Continue to Card Selection
              </Button>
            </Paper>
          ) : stage === "card" ? (
            // Display cards for selection
            <TarotCardDeck
              isClient={isClient}
              onCardClick={handleCardClick}
              spreadType={spreadType}
              onMultipleCardsSelected={handleMultipleCardsSelected}
            />
          ) : stage === "confirm" &&
            (spreadType === "universal6"
              ? selectedCardIds.length === 6
              : selectedCardId !== null) ? (
            // Card confirmation view
            <ReadingForm
              selectedCardId={selectedCardId || undefined}
              selectedCardIds={selectedCardIds}
              userInfo={userInfo}
              question={question}
              onSubmit={handleReadingSubmit}
              onGoBack={handleGoBackToCards}
              spreadType={spreadType}
            />
          ) : reading ? (
            // Reading result
            <ReadingResult
              selectedCardId={selectedCardId || undefined}
              selectedCardIds={selectedCardIds}
              question={question}
              reading={reading}
              onNewReading={handleReset}
              onSaveReading={handleSaveAndClose}
              spreadType={spreadType}
            />
          ) : isLoading ? (
            // Loading state
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Consulting the cards...
              </Typography>
            </Box>
          ) : (
            // Error state or unexpected state
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="error" sx={{ mt: 2 }}>
                {error || "Something went wrong. Please try again."}
              </Typography>
              <Button variant="outlined" onClick={handleReset} sx={{ mt: 2 }}>
                Try Again
              </Button>
            </Box>
          )}
        </AnimatePresence>
      </CardContainer>
    </Box>
  );
}

// Position descriptions for Universal 6 Card Spread (duplicated from other components for convenience)
const positionDescriptions = [
  "How you feel about yourself now",
  "What you most want at this moment",
  "Your fears",
  "What is going for you",
  "What is going against you",
  "The outcome according to your current situation",
];
