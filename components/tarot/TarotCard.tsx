// TarotCard.tsx - Individual tarot card component
import React from "react";
import { TarotCard as TarotCardType } from "./TarotData";
import { CardWrapper, CardBack, CardFront } from "./StyledComponents";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

interface TarotCardProps {
  card: TarotCardType;
  index: number;
  totalCards: number;
  isClient: boolean;
  onCardClick: (cardId: number) => void;
  isSelected?: boolean;
  selectionOrder?: number | null;
}

export const TarotCard: React.FC<TarotCardProps> = ({
  card,
  index,
  totalCards,
  isClient,
  onCardClick,
  isSelected = false,
  selectionOrder = null,
}) => {
  return (
    <CardWrapper
      key={card.id}
      $index={index}
      $total={totalCards}
      onClick={() => onCardClick(card.id)}
      whileHover={{
        y: -30,
        rotate: 0,
        scale: 1.1,
        zIndex: 100,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.3 },
      }}
      initial={{
        opacity: 0,
        y: 20,
        rotate: (index - Math.floor(totalCards / 2)) * 2,
      }}
      animate={
        isClient
          ? {
              opacity: 1,
              y: [0, -10, 0],
              rotate: [
                (index - Math.floor(totalCards / 2)) * 2,
                (index - Math.floor(totalCards / 2)) * 2 + 1,
                (index - Math.floor(totalCards / 2)) * 2,
              ],
              scale: isSelected ? 1.1 : 1,
              zIndex: isSelected ? 50 : index,
              boxShadow: isSelected
                ? "0 0 15px 5px rgba(156, 39, 176, 0.7), 0 12px 20px -5px rgba(0, 0, 0, 0.3)"
                : "0 4px 8px rgba(0, 0, 0, 0.2)",
            }
          : {
              opacity: 1,
              scale: isSelected ? 1.1 : 1,
              zIndex: isSelected ? 50 : index,
              boxShadow: isSelected
                ? "0 0 15px 5px rgba(156, 39, 176, 0.7), 0 12px 20px -5px rgba(0, 0, 0, 0.3)"
                : "0 4px 8px rgba(0, 0, 0, 0.2)",
            }
      }
      exit={{
        opacity: 0,
        scale: 0.5,
        y: -100,
        transition: { duration: 0.3 },
      }}
      transition={
        isClient
          ? {
              y: {
                repeat: Infinity,
                duration: 3 + index * 0.2,
                ease: "easeInOut",
              },
              rotate: {
                repeat: Infinity,
                duration: 4 + index * 0.2,
                ease: "easeInOut",
              },
              opacity: { duration: 0.3, delay: card.id * 0.05 },
            }
          : {
              opacity: { duration: 0.3, delay: card.id * 0.05 },
            }
      }
    >
      <CardBack>
        {selectionOrder && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              zIndex: 10,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#4e4376" }}
            >
              {selectionOrder}
            </Typography>
          </Box>
        )}
      </CardBack>

      {isSelected && (
        <CardFront>
          <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
            <Image
              src={card.image}
              alt={card.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </Box>
        </CardFront>
      )}
    </CardWrapper>
  );
};

export default TarotCard;
