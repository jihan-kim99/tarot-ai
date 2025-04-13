// ReadingForm.tsx - Form for confirming card selection after question
import React from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
} from "@mui/material";
import { tarotCards } from "./TarotData";
import Image from "next/image";
import StarsIcon from "@mui/icons-material/Stars";

interface ReadingFormProps {
  selectedCardId?: number; // Single card ID (legacy support)
  selectedCardIds?: number[]; // Multiple card IDs for spreads
  userInfo: string;
  question: string;
  onSubmit: () => void;
  onGoBack: () => void;
  spreadType?: "single" | "universal6";
  isPremium?: boolean;
}

// Position descriptions for Universal 6 Card Spread
const positionDescriptions = [
  "How you feel about yourself now",
  "What you most want at this moment",
  "Your fears",
  "What is going for you",
  "What is going against you",
  "The outcome according to your current situation",
];

export const ReadingForm: React.FC<ReadingFormProps> = ({
  selectedCardId,
  selectedCardIds = [],
  question,
  onSubmit,
  onGoBack,
  spreadType = "single",
  isPremium = false,
}) => {
  // Use selectedCardIds if provided, otherwise create a single-item array from selectedCardId
  const cardIds =
    selectedCardIds.length > 0
      ? selectedCardIds
      : selectedCardId !== undefined
      ? [selectedCardId]
      : [];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: spreadType === "universal6" ? "800px" : "500px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" align="center">
            {spreadType === "universal6"
              ? "Universal 6 Card Spread"
              : "Card Selection"}
          </Typography>

          {isPremium && (
            <Chip
              icon={<StarsIcon />}
              label="Premium"
              color="primary"
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </Box>

        {spreadType === "universal6" && (
          <Typography variant="body2" align="center" sx={{ mb: 3 }}>
            This spread gives a snapshot of your current situation across six
            different aspects of your life.
          </Typography>
        )}

        <Box sx={{ my: 3, p: 2, bgcolor: "rgba(0,0,0,0.03)", borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Your question:
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {question}
          </Typography>
        </Box>

        {isPremium && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: "rgba(156, 39, 176, 0.05)",
              borderRadius: 2,
              border: "1px solid rgba(156, 39, 176, 0.2)",
            }}
          >
            <Typography
              variant="subtitle2"
              color="primary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <StarsIcon fontSize="small" sx={{ mr: 1 }} />
              Premium Reading
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {spreadType === "universal6"
                ? "You've selected a premium reading which includes comprehensive analysis of all six positions with personalized insights and detailed guidance."
                : "You've selected a premium reading with in-depth personalized insights and detailed analysis of your card."}
            </Typography>
          </Box>
        )}

        {spreadType === "universal6" ? (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {cardIds.map((cardId, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.03)" },
                  }}
                >
                  <CardContent
                    sx={{ bgcolor: "primary.light", color: "white", py: 1 }}
                  >
                    <Typography variant="subtitle2" align="center">
                      Position {index + 1}
                    </Typography>
                  </CardContent>
                  <CardMedia
                    component="div"
                    sx={{
                      height: 180,
                      width: "100%",
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={tarotCards[cardId].image}
                      alt={tarotCards[cardId].name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  </CardMedia>
                  <CardContent>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", textAlign: "center" }}
                    >
                      {tarotCards[cardId].name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {positionDescriptions[index]}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center", mb: 3 }}>
            {cardIds.length > 0 && (
              <Box
                sx={{
                  maxWidth: "240px",
                  height: "360px",
                  position: "relative",
                  margin: "0 auto",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 3,
                }}
              >
                <Image
                  src={tarotCards[cardIds[0]].image}
                  alt={tarotCards[cardIds[0]].name}
                  fill
                  sizes="240px"
                  style={{
                    objectFit: "contain",
                  }}
                  priority
                />
              </Box>
            )}
            <Typography variant="h6" sx={{ mt: 2 }}>
              {cardIds.length > 0
                ? tarotCards[cardIds[0]].name
                : "No card selected"}
            </Typography>
          </Box>
        )}

        <Typography variant="body2" sx={{ mt: 4 }} align="center">
          Would you like to receive a{isPremium ? " premium" : ""} reading with{" "}
          {spreadType === "universal6" ? "these cards" : "this card"}?
          {isPremium && (
            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
              {spreadType === "single"
                ? "You will be directed to the payment page ($3.00)"
                : "You will be directed to the payment page ($3.00)"}
            </Typography>
          )}
        </Typography>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button variant="outlined" onClick={onGoBack}>
            Go Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onSubmit}
            startIcon={isPremium ? <StarsIcon /> : undefined}
          >
            {isPremium ? "Continue to Payment" : "Get Reading"}
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default ReadingForm;
