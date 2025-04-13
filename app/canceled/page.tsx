"use client";

import React from "react";
import { Box, Typography, Button, Paper, Container } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CanceledPage() {
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
            src="/image/moon.png"
            alt="Payment Canceled"
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
            color="secondary"
            fontWeight="bold"
          >
            Payment Canceled
          </Typography>

          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Your payment was canceled. You can still try our basic tarot reading
            for free, or choose to upgrade to a premium reading whenever
            you&apos;re ready.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            href="/read"
            sx={{ mr: 2 }}
          >
            Try Free Reading
          </Button>

          <Button
            variant="outlined"
            color="secondary"
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
