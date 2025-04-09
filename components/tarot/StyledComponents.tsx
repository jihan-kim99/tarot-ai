// StyledComponents.tsx - Contains reusable styled components for tarot cards
import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

export const CardContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
  min-height: 60vh;
  position: relative;
  perspective: 1000px;
`;

export const CardFan = styled(Box)`
  position: relative;
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CardWrapper = styled(motion.div)<{
  $index: number;
  $total: number;
}>`
  width: 120px;
  height: 200px;
  position: absolute;
  cursor: pointer;
  transform-style: preserve-3d;
  left: ${({ $index, $total }) => {
    // Calculate position to create a more horizontal arc effect with reduced spacing
    const centerIndex = Math.floor($total / 2);
    // Reduce spacing between cards from 80px to 40px (or adjust based on your needs)
    const offset = ($index - centerIndex) * 40;
    return `calc(50% - 60px + ${offset}px)`;
  }};
  top: ${({ $index, $total }) => {
    // Create an arc by making the middle cards "higher" than the outer ones
    const centerIndex = Math.floor($total / 2);
    const distanceFromCenter = Math.abs($index - centerIndex);
    const curveHeight = 40; // Maximum height difference in pixels
    return `${(distanceFromCenter * curveHeight) / 3}px`;
  }};
  z-index: ${({ $index }) => $index};
`;

export const CardFace = styled(motion.div)`
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

export const CardBack = styled(CardFace)`
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
