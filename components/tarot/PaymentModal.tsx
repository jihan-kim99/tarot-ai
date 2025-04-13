"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  readingType: "single" | "universal6";
  question: string;
  userInfo: string;
  cardIds: number[];
}

export default function PaymentModal({
  open,
  onClose,
  readingType,
  question,
  userInfo,
  cardIds,
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the price and features based on reading type
  const price = readingType === "single" ? "$3.00" : "$3.00";
  const features =
    readingType === "single"
      ? [
          "Detailed single card interpretation",
          "Personalized insights",
          "Unlimited sharing",
          "Save reading to profile",
        ]
      : [
          "Comprehensive 6-card spread analysis",
          "Detailed interpretation for each position",
          "In-depth synthesis of all cards",
          "Personal guidance for each aspect",
          "Unlimited sharing",
          "Save reading to profile",
        ];

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Store reading information in localStorage before redirecting
      localStorage.setItem("tarot_question", question);
      localStorage.setItem("tarot_userInfo", userInfo);
      localStorage.setItem("tarot_cardIds", cardIds.join(","));
      localStorage.setItem("tarot_readingType", readingType);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ readingType }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Could not retrieve checkout URL");
      }
    } catch (err) {
      setError("Could not process payment. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={isLoading ? undefined : onClose}
      aria-labelledby="payment-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        sx={{
          width: { xs: "90%", sm: 500 },
          maxWidth: 500,
          maxHeight: "90vh",
          overflow: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          margin: "auto",
          outline: "none", // Removes the default focus outline
        }}
      >
        <Typography
          id="payment-modal-title"
          variant="h5"
          align="center"
          gutterBottom
          fontWeight="bold"
        >
          {readingType === "single"
            ? "Premium Single Card Reading"
            : "Premium Universal 6 Card Reading"}
        </Typography>

        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Unlock deeper insights and detailed interpretations with our premium
          reading.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" color="primary" fontWeight="bold">
            {price}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          Features:
        </Typography>

        <List>
          {features.map((feature, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="outlined" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckout}
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
