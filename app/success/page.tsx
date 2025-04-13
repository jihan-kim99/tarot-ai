"use client";

import React, { useEffect, Suspense } from "react";
import { redirect } from "next/navigation";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";

// Create a client component that uses useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session_id = searchParams.get("session_id");
  const readingType = searchParams.get("readingType") || "single";

  // Auto-redirect after a short delay
  useEffect(() => {
    if (session_id) {
      // Get stored reading info from localStorage
      const storedQuestion = localStorage.getItem("tarot_question");
      const storedUserInfo = localStorage.getItem("tarot_userInfo");
      const storedCardIds = localStorage.getItem("tarot_cardIds");

      // Prepare redirect with all parameters
      const redirectTimeout = setTimeout(() => {
        router.push(
          `/read?continue=true&session_id=${session_id}&readingType=${readingType}${
            storedCardIds ? `&cardIds=${storedCardIds}` : ""
          }${
            storedQuestion
              ? `&question=${encodeURIComponent(storedQuestion)}`
              : ""
          }${
            storedUserInfo
              ? `&userInfo=${encodeURIComponent(storedUserInfo)}`
              : ""
          }&premium=true`
        );
      }, 3000); // Redirect after 3 seconds

      return () => clearTimeout(redirectTimeout);
    }
  }, [session_id, readingType, router]);

  // If no session ID is provided, redirect to home
  if (!session_id) {
    redirect("/");
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Box
            component="img"
            src="/image/star.png"
            alt="Success"
            sx={{
              width: 100,
              height: 100,
              mb: 4,
              mx: "auto",
              display: "block",
            }}
          />

          <Typography
            variant="h4"
            gutterBottom
            color="primary"
            fontWeight="bold"
          >
            Payment Successful!
          </Typography>

          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Thank you for your purchase! Your premium tarot reading session has
            been confirmed. A receipt has been sent to your email address.
          </Typography>

          <Typography variant="body2" sx={{ mb: 2, fontStyle: "italic" }}>
            &quot;The stars have aligned and your journey awaits...&quot;
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
              mb: 4,
            }}
          >
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography variant="body2">
              Redirecting to your reading...
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            href={`/read?continue=true&session_id=${session_id}&readingType=${readingType}&premium=true`}
            sx={{ mr: 2 }}
          >
            Go to Reading Now
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={Link}
            href="/"
          >
            Return Home
          </Button>
        </Paper>
      </motion.div>
    </Container>
  );
}

// Main page component with Suspense
export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
      <CircularProgress size={40} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Loading payment details...
      </Typography>
    </Container>
  );
}
