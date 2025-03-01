"use client";

import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Star = {
  id: number;
  size: number;
  top: string;
  left: string;
  opacity: number;
  duration: number;
};

export default function AnimatedStars() {
  const [stars, setStars] = useState<Star[]>([]);

  // Generate stars only on the client side
  useEffect(() => {
    const generatedStars = Array(20)
      .fill(0)
      .map((_, i) => ({
        id: i,
        size: i % 3 === 0 ? 4 : i % 3 === 1 ? 3 : 2,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 3 + 2,
      }));
    setStars(generatedStars);
  }, []);

  return (
    <>
      {stars.map((star) => (
        <Box
          key={star.id}
          component={motion.div}
          sx={{
            position: "absolute",
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: "50%",
            backgroundColor: "white",
            opacity: star.opacity,
          }}
          style={{
            top: star.top,
            left: star.left,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}
