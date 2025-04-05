"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import { Box, Typography, Button } from "@mui/material";

// Define tarot card data
const tarotCards = [
  { id: 0, name: "The Fool" },
  { id: 1, name: "The Magician" },
  { id: 2, name: "The High Priestess" },
  { id: 3, name: "The Empress" },
  { id: 4, name: "The Emperor" },
  { id: 5, name: "The Hierophant" },
  { id: 6, name: "The Lovers" },
  { id: 7, name: "The Chariot" },
  { id: 8, name: "Strength" },
  { id: 9, name: "The Hermit" },
  { id: 10, name: "Wheel of Fortune" },
  { id: 11, name: "Justice" },
  { id: 12, name: "The Hanged Man" },
  { id: 13, name: "Death" },
  { id: 14, name: "Temperance" },
  { id: 15, name: "The Devil" },
  { id: 16, name: "The Tower" },
  { id: 17, name: "The Star" },
  { id: 18, name: "The Moon" },
  { id: 19, name: "The Sun" },
  { id: 20, name: "Judgement" },
  { id: 21, name: "The World" },
];

// Styled components
const CardContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
  min-height: 60vh;
  position: relative;
  perspective: 1000px;
`;

const CardFan = styled(Box)`
  position: relative;
  width: 400px;
  height: 300px;
  display: flex;
  justify-content: center;
`;

const CardWrapper = styled(motion.div)<{ $index: number; $total: number }>`
  width: 120px;
  height: 200px;
  position: absolute;
  cursor: pointer;
  transform-style: preserve-3d;
  left: ${({ $index, $total }) => {
    // Calculate position to create a fan effect
    const centerIndex = Math.floor($total / 2);
    const offset = ($index - centerIndex) * 20;
    return `calc(50% - 60px + ${offset}px)`;
  }};
  top: ${({ $index }) => {
    // Add some vertical variation
    const row = Math.floor($index / 7);
    return `${row * 40}px`;
  }};
  z-index: ${({ $index }) => $index};
`;

const CardFace = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 10px;
`;

const CardBack = styled(CardFace)`
  background: linear-gradient(135deg, #2b5876, #4e4376);
  &::after {
    content: "";
    position: absolute;
    width: 80%;
    height: 80%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 5px;
  }
`;

const CardFront = styled(CardFace)`
  background-color: white;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
`;

export default function ReadPage() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleCardClick = (cardId: number) => {
    setSelectedCard(cardId);
  };

  const handleReset = () => {
    setSelectedCard(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", padding: 4, bgcolor: "#f5f5f5" }}>
      <Typography variant="h3" align="center" gutterBottom>
        Tarot Reading
      </Typography>
      <Typography variant="body1" align="center" sx={{ mb: 4 }}>
        Select a card to reveal your reading
      </Typography>

      <CardContainer>
        <AnimatePresence mode="wait">
          {selectedCard === null ? (
            // Display all cards when none is selected
            <CardFan>
              {tarotCards.map((card, index) => (
                <CardWrapper
                  key={card.id}
                  $index={index}
                  $total={tarotCards.length}
                  onClick={() => handleCardClick(card.id)}
                  whileHover={{
                    y: -15,
                    zIndex: 100, // Ensure hovered card is on top
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    transition: { duration: 0.2 },
                  }}
                  initial={{
                    opacity: 0,
                    y: 20,
                    rotate: (index - Math.floor(tarotCards.length / 2)) * 2, // Slight rotation for fan effect
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotate: (index - Math.floor(tarotCards.length / 2)) * 2,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    y: -100,
                    transition: { duration: 0.3 },
                  }}
                  transition={{
                    duration: 0.3,
                    delay: card.id * 0.05, // Staggered entrance
                  }}
                >
                  <CardBack />
                </CardWrapper>
              ))}
            </CardFan>
          ) : (
            // Selected card view
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <motion.div
                key="selected-card"
                initial={{ scale: 1 }}
                animate={{
                  scale: [1, 1.2, 1.2, 1.2, 1.5],
                  rotateY: [0, 0, 180, 180, 180],
                  transition: { duration: 1.5, times: [0, 0.2, 0.5, 0.8, 1] },
                }}
                style={{
                  width: 120,
                  height: 200,
                  position: "relative",
                  transformStyle: "preserve-3d",
                }}
              >
                <CardBack />
                <CardFront>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {tarotCards[selectedCard].name}
                  </Typography>
                  <Box
                    sx={{
                      height: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body2">
                      Card #{selectedCard + 1}
                    </Typography>
                  </Box>
                </CardFront>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 20 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                style={{ marginTop: "40px" }}
              >
                <Button variant="outlined" onClick={handleReset}>
                  Return to all cards
                </Button>
              </motion.div>
            </Box>
          )}
        </AnimatePresence>
      </CardContainer>
    </Box>
  );
}
