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
} from "@mui/material";
import { tarotCards } from "./TarotData";

interface ReadingFormProps {
  selectedCardId?: number; // Single card ID (legacy support)
  selectedCardIds?: number[]; // Multiple card IDs for spreads
  userInfo: string;
  question: string;
  onSubmit: () => void;
  onGoBack: () => void;
  spreadType?: "single" | "universal6";
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
        <Typography variant="h5" gutterBottom align="center">
          {spreadType === "universal6"
            ? "Universal 6 Card Spread"
            : "Card Selection"}
        </Typography>

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
                      height: 100,
                      bgcolor: "secondary.dark",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" color="white">
                      {tarotCards[cardId].name}
                    </Typography>
                  </CardMedia>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {positionDescriptions[index]}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" align="center" gutterBottom>
            You selected:{" "}
            {cardIds.length > 0 ? tarotCards[cardIds[0]].name : "No card"}
          </Typography>
        )}

        <Typography variant="body2" sx={{ mt: 4 }} align="center">
          Would you like to receive a reading with{" "}
          {spreadType === "universal6" ? "these cards" : "this card"}?
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
          <Button variant="contained" color="primary" onClick={onSubmit}>
            Get Reading
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default ReadingForm;
