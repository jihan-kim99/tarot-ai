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
  Chip,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useTarot } from "@/context/useTarotContext";
import TarotCardDeck from "@/components/tarot/TarotCardDeck";
import ReadingForm from "@/components/tarot/ReadingForm";
import ReadingResult from "@/components/tarot/ReadingResult";
import QuestionForm from "@/components/tarot/QuestionForm";
import PaymentModal from "@/components/tarot/PaymentModal";
import { CardContainer } from "@/components/tarot/StyledComponents";
import { tarotCards } from "@/components/tarot/TarotData";
import StarsIcon from "@mui/icons-material/Stars";

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

  // Payment related states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

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
      setIsPremium(false); // Reset premium status when spread type changes
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
    setIsPremium(false);
    setStage("question");
    clearReading();
  };

  // Submit the reading request to the API
  const handleReadingSubmit = async () => {
    if (isPremium) {
      // Show payment modal for premium reading
      setShowPaymentModal(true);
      return;
    }

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

  // Handle payment modal close
  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
  };

  // Check URL parameters for payment success continuation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldContinue = urlParams.get("continue") === "true";
    const sessionId = urlParams.get("session_id");
    // const isPremiumParam = urlParams.get("premium") === "true";

    // Only process if this is a continuation after payment
    if (shouldContinue && sessionId) {
      // Get readingType from URL or localStorage
      const urlReadingType = urlParams.get("readingType") as
        | "single"
        | "universal6"
        | null;
      const storedReadingType = localStorage.getItem("tarot_readingType") as
        | "single"
        | "universal6"
        | null;
      const readingTypeToUse = urlReadingType || storedReadingType || "single";

      // Get question and userInfo from URL or localStorage
      const urlQuestion = urlParams.get("question");
      const urlUserInfo = urlParams.get("userInfo");
      const storedQuestion = localStorage.getItem("tarot_question");
      const storedUserInfo = localStorage.getItem("tarot_userInfo");
      const questionToUse = urlQuestion || storedQuestion || "";
      const userInfoToUse = urlUserInfo || storedUserInfo || "";

      // Get cardIds from URL or localStorage
      let cardIdsToUse: number[] = [];
      const urlCardIds = urlParams.get("cardIds");
      const storedCardIds = localStorage.getItem("tarot_cardIds");

      if (urlCardIds) {
        cardIdsToUse = urlCardIds.split(",").map((id) => parseInt(id, 10));
      } else if (storedCardIds) {
        cardIdsToUse = storedCardIds.split(",").map((id) => parseInt(id, 10));
      }

      // Set all the retrieved values in state
      setSpreadType(readingTypeToUse);
      setQuestion(questionToUse);
      setUserInfo(userInfoToUse);
      setIsPremium(true); // It's a premium reading if we're returning from payment

      // Set card IDs based on reading type
      if (readingTypeToUse === "single" && cardIdsToUse.length > 0) {
        setSelectedCardId(cardIdsToUse[0]);
        setSelectedCardIds([]);
      } else if (
        readingTypeToUse === "universal6" &&
        cardIdsToUse.length === 6
      ) {
        setSelectedCardIds(cardIdsToUse);
        setSelectedCardId(null);
      }

      // Automatically submit the reading request
      setTimeout(() => {
        if (readingTypeToUse === "universal6" && cardIdsToUse.length === 6) {
          // Submit multiple cards for Universal 6 Card Spread
          const cards = cardIdsToUse.map((id) => tarotCards[id]);
          getReading(cards, questionToUse, userInfoToUse, "universal6", true);
          setStage("result");
        } else if (cardIdsToUse.length > 0) {
          // Legacy single card reading
          const card = tarotCards[cardIdsToUse[0]];
          getReading([card], questionToUse, userInfoToUse, "single", true);
          setStage("result");
        }
      }, 500);

      // Clear localStorage after use
      localStorage.removeItem("tarot_question");
      localStorage.removeItem("tarot_userInfo");
      localStorage.removeItem("tarot_cardIds");
      localStorage.removeItem("tarot_readingType");

      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Select Reading Level
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Card
                      onClick={() => setIsPremium(false)}
                      sx={{
                        cursor: "pointer",
                        height: "100%",
                        border: !isPremium
                          ? "2px solid #9c27b0"
                          : "1px solid rgba(0,0,0,0.12)",
                        transition: "all 0.3s ease",
                        "&:hover": { boxShadow: 3 },
                      }}
                    >
                      <CardContent sx={{ textAlign: "left" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography variant="h6">Free</Typography>
                          <Chip label="$0.00" color="default" size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Basic interpretation of your card selection
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card
                      onClick={() => setIsPremium(true)}
                      sx={{
                        cursor: "pointer",
                        height: "100%",
                        border: isPremium
                          ? "2px solid #9c27b0"
                          : "1px solid rgba(0,0,0,0.12)",
                        transition: "all 0.3s ease",
                        "&:hover": { boxShadow: 3 },
                      }}
                    >
                      <CardContent sx={{ textAlign: "left" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="h6">Premium</Typography>
                            <StarsIcon
                              fontSize="small"
                              color="primary"
                              sx={{ ml: 0.5 }}
                            />
                          </Box>
                          <Chip
                            label={spreadType === "single" ? "$3.00" : "$3.00"}
                            color="primary"
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {spreadType === "single"
                            ? "Detailed personalized insights and analysis"
                            : "Comprehensive analysis of all six positions"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

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
              isPremium={isPremium}
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

      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onClose={handlePaymentModalClose}
        readingType={spreadType}
        question={question}
        userInfo={userInfo}
        cardIds={
          spreadType === "single"
            ? selectedCardId !== null
              ? [selectedCardId]
              : []
            : selectedCardIds
        }
      />
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
