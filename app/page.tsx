"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid2 as Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import AnimatedStars from "../components/AnimatedStars";

// Motion components for animation
const MotionBox = motion.create(Box);
const MotionPaper = motion.create(Paper);
const MotionTypography = motion.create(Typography);

export default function Home() {
  const router = useRouter();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <AnimatedStars />

      {/* Main content */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 8 }}>
        <Grid container spacing={6} alignItems="center" justifyContent="center">
          {/* <Grid item xs={12} md={6}> */}
          <Grid size={{ xs: 12, md: 6 }}>
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <MotionTypography
                variant="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  backgroundImage: "linear-gradient(45deg, #f50057, #9c27b0)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Tarot-AI
              </MotionTypography>

              <MotionTypography
                variant="h5"
                sx={{ mb: 4, color: "rgba(255,255,255,0.8)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Discover insights about your past, present, and future with our
                AI-powered tarot readings
              </MotionTypography>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component={motion.button}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(156, 39, 176, 0.7)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    router.push("/read");
                    console.log("Button clicked");
                  }}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    fontSize: "1.1rem",
                  }}
                >
                  Begin Your Reading
                </Button>
              </motion.div>
            </MotionBox>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              sx={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
                height: { xs: "300px", md: "400px" },
              }}
            >
              {[...Array(3)].map((_, i) => (
                <MotionPaper
                  key={i}
                  elevation={24}
                  sx={{
                    width: "180px",
                    height: "320px",
                    position: "absolute",
                    borderRadius: "10px",
                    background: "radial-gradient(circle, #2c3e50, #1a1a2e)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                  initial={{
                    rotate: i === 0 ? -15 : i === 1 ? 0 : 15,
                    x: i === 0 ? -30 : i === 1 ? 0 : 30,
                    y: i === 0 ? 15 : i === 1 ? 0 : 15,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    rotate:
                      i === 0
                        ? [-15, -17, -15]
                        : i === 1
                        ? [0, -2, 0]
                        : [15, 17, 15],
                  }}
                  transition={{
                    y: { repeat: Infinity, duration: 3 + i, ease: "easeInOut" },
                    rotate: {
                      repeat: Infinity,
                      duration: 4 + i,
                      ease: "easeInOut",
                    },
                  }}
                  whileHover={{
                    y: -30,
                    rotate: 0,
                    scale: 1.1,
                    zIndex: 10,
                    transition: { duration: 0.3 },
                  }}
                >
                  <Box
                    sx={{
                      width: "90%",
                      height: "90%",
                      borderRadius: "8px",
                      border: "2px solid rgba(245, 0, 87, 0.3)",
                      // background: 'url("/tarot-card-back.png") center/cover',
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* This would be replaced with actual tarot card image */}
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      ★
                    </Box>
                  </Box>
                </MotionPaper>
              ))}
            </MotionBox>
          </Grid>
        </Grid>

        {/* Features section */}
        <Box mt={12}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 6,
              backgroundImage: "linear-gradient(45deg, #f8f9fa, #adb5bd)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Mystical Insights Powered by AI
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                title: "Past",
                description:
                  "Understand the influences that have shaped your path",
              },
              {
                title: "Present",
                description:
                  "Gain clarity on your current situation and challenges",
              },
              {
                title: "Future",
                description:
                  "Glimpse the energies that may influence your journey ahead",
              },
            ].map((item, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <MotionPaper
                  elevation={4}
                  sx={{
                    p: 4,
                    height: "100%",
                    background: "rgba(26, 32, 44, 0.4)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: 4,
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.2, duration: 0.8 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                >
                  <Typography
                    variant="h4"
                    component="h3"
                    gutterBottom
                    color="primary"
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {item.description}
                  </Typography>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
