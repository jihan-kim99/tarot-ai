// TarotCardDeck.tsx - Card deck display component
import React, { useState } from "react";
import { tarotCards } from "./TarotData";
import TarotCard from "./TarotCard";
import { CardFan } from "./StyledComponents";
import { Typography, Box } from "@mui/material";

const MAX_CARDS = 6; // Maximum number of cards for Universal 6 Card Spread

interface TarotCardDeckProps {
  isClient: boolean;
  onCardClick: (cardId: number) => void;
  selectedCards?: number[];
  maxSelections?: number;
  onMultipleCardsSelected?: (selectedCardIds: number[]) => void;
  spreadType?: "single" | "universal6";
}

export const TarotCardDeck: React.FC<TarotCardDeckProps> = ({
  isClient,
  onCardClick,
  maxSelections = MAX_CARDS,
  onMultipleCardsSelected,
  spreadType = "single",
}) => {
  const [localSelectedCards, setLocalSelectedCards] = useState<number[]>([]);

  const handleCardSelection = (cardId: number) => {
    if (spreadType === "single") {
      // Single card selection mode
      onCardClick(cardId);
      return;
    }

    // For multiple card selection
    let newSelectedCards = [...localSelectedCards];

    // If already selected, deselect it and remove all subsequent selections
    const existingIndex = newSelectedCards.indexOf(cardId);
    if (existingIndex >= 0) {
      newSelectedCards = newSelectedCards.slice(0, existingIndex);
    }
    // If not already selected and haven't reached max, add it
    else if (newSelectedCards.length < maxSelections) {
      newSelectedCards.push(cardId);

      // If we've selected all required cards, trigger the callback
      if (
        newSelectedCards.length === maxSelections &&
        onMultipleCardsSelected
      ) {
        onMultipleCardsSelected(newSelectedCards);
      }
    }

    setLocalSelectedCards(newSelectedCards);
  };

  // Get the selection order index of a card (1-based for display)
  const getSelectionOrder = (cardId: number): number | null => {
    const index = localSelectedCards.indexOf(cardId);
    return index >= 0 ? index + 1 : null;
  };

  const cardsToDisplay =
    spreadType === "universal6"
      ? tarotCards.filter((card) => card.id <= 21) // Only Major Arcana for Universal 6 spread
      : tarotCards;

  return (
    <>
      {spreadType === "universal6" && (
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Universal 6 Card Spread
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Select 6 cards from the Major Arcana in the order you&apos;d like
            them revealed.
          </Typography>
          <Typography variant="body1">
            Selected: {localSelectedCards.length} of {maxSelections} cards
          </Typography>
        </Box>
      )}
      <CardFan>
        {cardsToDisplay.map((card, index) => (
          <TarotCard
            key={card.id}
            card={card}
            index={index}
            totalCards={cardsToDisplay.length}
            isClient={isClient}
            onCardClick={() => handleCardSelection(card.id)}
            isSelected={localSelectedCards.includes(card.id)}
            selectionOrder={getSelectionOrder(card.id)}
          />
        ))}
      </CardFan>
    </>
  );
};

export default TarotCardDeck;
