// ReadingResult.tsx - Display reading results
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
} from "@mui/material";
import { tarotCards } from "./TarotData";
import ReactMarkdown from "react-markdown";
import { StructuredReading } from "@/context/useTarotContext";
import Image from "next/image";

// Position descriptions for Universal 6 Card Spread
const positionDescriptions = [
  "How you feel about yourself now",
  "What you most want at this moment",
  "Your fears",
  "What is going for you",
  "What is going against you",
  "The outcome according to your current situation",
];

interface ReadingResultProps {
  selectedCardId?: number; // Single card ID (legacy support)
  selectedCardIds?: number[]; // Multiple card IDs for spreads
  question: string;
  reading: {
    interpretation: string | StructuredReading;
  };
  onNewReading: () => void;
  onSaveReading: () => void;
  spreadType?: "single" | "universal6";
}

export const ReadingResult: React.FC<ReadingResultProps> = ({
  selectedCardId,
  selectedCardIds = [],
  question,
  reading,
  onNewReading,
  onSaveReading,
  spreadType = "single",
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Use selectedCardIds if provided, otherwise create a single-item array from selectedCardId
  const cardIds =
    selectedCardIds.length > 0
      ? selectedCardIds
      : selectedCardId !== undefined
      ? [selectedCardId]
      : [];

  // Check if we have structured data
  const isStructured =
    typeof reading.interpretation === "object" &&
    reading.interpretation !== null &&
    "positions" in reading.interpretation &&
    "overall" in reading.interpretation;

  // For Universal 6 Card Spread, get interpretation sections based on format
  let interpretationSections: string[] = [];

  if (
    !isStructured &&
    spreadType === "universal6" &&
    typeof reading.interpretation === "string"
  ) {
    // Legacy approach for string-based interpretation
    // Try to parse the interpretation which might be formatted with sections
    const interpretationText = reading.interpretation;

    // First attempt: Try to split by specific section markers
    const sectionRegex =
      /\[Position \d+\]|\[Card \d+\]|Position \d+:|Card \d+:/g;
    if (sectionRegex.test(interpretationText)) {
      interpretationSections = interpretationText
        .split(sectionRegex)
        .filter((section) => section.trim().length > 0);
    } else {
      // Second attempt: Split by double newlines and try to create balanced sections
      const paragraphs = interpretationText.split(/\n\s*\n/);
      const totalParagraphs = paragraphs.length;

      if (totalParagraphs >= cardIds.length) {
        // If we have enough paragraphs, distribute them among the cards
        const paragraphsPerSection = Math.ceil(
          totalParagraphs / cardIds.length
        );
        for (let i = 0; i < cardIds.length; i++) {
          const startIndex = i * paragraphsPerSection;
          const endIndex = Math.min(
            startIndex + paragraphsPerSection,
            totalParagraphs
          );
          interpretationSections.push(
            paragraphs.slice(startIndex, endIndex).join("\n\n")
          );
        }
      } else {
        // Fallback: Just use the whole interpretation for all sections
        interpretationSections = new Array(cardIds.length).fill(
          interpretationText
        );
      }
    }
  } else if (isStructured) {
    // Use structured data format
    const structuredData = reading.interpretation as StructuredReading;
    interpretationSections = structuredData.positions.map(
      (pos) => pos.interpretation
    );
  } else {
    // Single card reading, just use the whole interpretation
    interpretationSections = [
      typeof reading.interpretation === "string" ? reading.interpretation : "",
    ];
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTabIndex(newValue);
  };

  if (spreadType === "universal6") {
    // Get the structured data if available
    const structuredData = isStructured
      ? (reading.interpretation as StructuredReading)
      : null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "900px" }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Universal 6 Card Spread
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Your question: {question}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={selectedTabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {cardIds.map((cardId, index) => (
              <Tab
                key={index}
                label={`Position ${index + 1}`}
                sx={{ minWidth: "100px" }}
              />
            ))}
            <Tab label="Full Reading" />
          </Tabs>
        </Box>

        {selectedTabIndex < cardIds.length ? (
          // Individual card interpretation
          <Card
            sx={{
              mb: 4,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      bgcolor: "secondary.dark",
                      borderRadius: 2,
                      color: "white",
                      p: 2,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="overline">
                      Position {selectedTabIndex + 1}
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        height: "200px",
                        position: "relative",
                        my: 2,
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={tarotCards[cardIds[selectedTabIndex]].image}
                        alt={tarotCards[cardIds[selectedTabIndex]].name}
                        fill
                        sizes="(max-width: 600px) 100vw, 300px"
                        style={{ objectFit: "contain" }}
                      />
                    </Box>
                    <Typography variant="h5" gutterBottom>
                      {tarotCards[cardIds[selectedTabIndex]].name}
                    </Typography>
                    <Typography variant="body2">
                      {positionDescriptions[selectedTabIndex]}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Box sx={{ p: { xs: 1, md: 2 } }}>
                    <ReactMarkdown>
                      {interpretationSections[selectedTabIndex] ||
                        "No interpretation available for this position."}
                    </ReactMarkdown>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ) : (
          // Full reading view
          <Box
            sx={{
              backgroundColor: "white",
              p: 4,
              borderRadius: 2,
              boxShadow: 3,
              mb: 4,
            }}
          >
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {cardIds.map((cardId, index) => (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <Box
                    sx={{
                      p: 1,
                      border: "1px solid",
                      borderColor: "primary.light",
                      borderRadius: 1,
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="overline" sx={{ fontSize: "0.7rem" }}>
                      Position {index + 1}
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        height: "80px",
                        position: "relative",
                        my: 1,
                      }}
                    >
                      <Image
                        src={tarotCards[cardId].image}
                        alt={tarotCards[cardId].name}
                        fill
                        sizes="(max-width: 600px) 33vw, 100px"
                        style={{ objectFit: "contain" }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {tarotCards[cardId].name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ my: 3 }}>
              <Chip label="Complete Reading" />
            </Divider>

            {isStructured ? (
              <ReactMarkdown>{structuredData?.overall}</ReactMarkdown>
            ) : (
              <ReactMarkdown>
                {typeof reading.interpretation === "string"
                  ? reading.interpretation
                  : ""}
              </ReactMarkdown>
            )}
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" onClick={onNewReading}>
            New Reading
          </Button>
          <Button variant="contained" color="secondary" onClick={onSaveReading}>
            Save & Close
          </Button>
        </Box>
      </motion.div>
    );
  }

  // Default single-card reading view (legacy support)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: "100%", maxWidth: "700px" }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {cardIds.length > 0 ? tarotCards[cardIds[0]].name : "Reading"}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Your question: {question}
        </Typography>
      </Box>

      {cardIds.length > 0 && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: "200px",
              height: "300px",
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            <Image
              src={tarotCards[cardIds[0]].image}
              alt={tarotCards[cardIds[0]].name}
              fill
              sizes="200px"
              style={{ objectFit: "contain" }}
              priority
            />
          </Box>
        </Box>
      )}

      <Box
        sx={{
          backgroundColor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          mb: 4,
        }}
      >
        <ReactMarkdown>
          {typeof reading.interpretation === "string"
            ? reading.interpretation
            : ""}
        </ReactMarkdown>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={onNewReading}>
          New Reading
        </Button>
        <Button variant="contained" color="secondary" onClick={onSaveReading}>
          Save & Close
        </Button>
      </Box>
    </motion.div>
  );
};

export default ReadingResult;
