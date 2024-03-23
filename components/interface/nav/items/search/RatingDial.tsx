import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useNavContext } from "@/context/Nav";

interface DialProps {
  setRatingValue: (rating: number) => void;
}

export const calculateDotPosition = (
  rating: number,
  maxRating: number,
  radius: number,
  strokeWidth: number,
) => {
  // 10% of circumference - 10 rating increments
  const offsetAngle = 36;
  // Don't travel the entire circle to prevent dot overlap
  const circumference = 360 - 36;
  const angle = (rating / maxRating) * circumference - 90 + offsetAngle;
  const angleRad = (Math.PI / 180) * angle;
  const x = Math.cos(angleRad) * radius + radius + strokeWidth / 2;
  const y = Math.sin(angleRad) * radius + radius + strokeWidth / 2;
  return { x, y };
};

export const calculateStrokeLength = (
  rating: number,
  maxRating: number,
  circumference: number,
) => {
  return (rating / maxRating) * circumference;
};

const RatingDial = ({ setRatingValue }: DialProps) => {
  const { inputRef } = useNavContext();
  const dialRef = useRef<SVGSVGElement>(null);
  const strokeWidth = 4;
  const dotRadius = 1.5;
  const radius = 30;
  const viewBoxSize = radius * 2 + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const finalCircumference = circumference - 18; // So the stroke doesnt overlap

  const ratingIncrement = 0.5;
  const maxRating = 5;

  const [currentRating, setCurrentRating] = useState(0);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputEmpty = inputRef.current?.value === "";

      if (
        (activeElement === inputRef.current && isInputEmpty) ||
        activeElement === dialRef.current
      ) {
        if (e.key === "ArrowUp" && currentRating < maxRating) {
          setCurrentRating(currentRating + ratingIncrement);
        } else if (e.key === "ArrowDown" && currentRating > 0) {
          setCurrentRating(currentRating - ratingIncrement);
        }
      }
    },
    [currentRating, inputRef],
  );

  useEffect(() => {
    setRatingValue(currentRating);
  }, [currentRating, setRatingValue]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress as any);
    return () => window.removeEventListener("keydown", handleKeyPress as any);
  }, [currentRating, inputRef, handleKeyPress]);

  const segmentLength = calculateStrokeLength(
    currentRating,
    maxRating,
    finalCircumference,
  );
  const dotPosition = calculateDotPosition(
    currentRating,
    maxRating,
    radius,
    strokeWidth,
  );

  // Subtract to make spacing for background segment length
  let backgroundSegmentLength = circumference - segmentLength - 38;
  backgroundSegmentLength = Math.max(backgroundSegmentLength, 0);

  return (
    <svg
      width={viewBoxSize}
      height={viewBoxSize}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      ref={dialRef}
    >
      {/* Background Segment (White Dash) */}
      <motion.circle
        cx={viewBoxSize / 2}
        cy={viewBoxSize / 2}
        r={radius}
        fill="none"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth={strokeWidth}
        // rotate the white dash
        strokeDashoffset={circumference / 4 - 9.5}
        strokeLinecap="round"
        initial={{
          transform: "scaleX(-1)",
        }}
        animate={{
          strokeDasharray: `${backgroundSegmentLength} ${
            circumference - backgroundSegmentLength
          }`,
        }}
        style={{}}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
      {/* Colored Segment (Rating Dash) */}
      <motion.circle
        cx={viewBoxSize / 2}
        cy={viewBoxSize / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDashoffset={circumference / 4 - 9.5}
        strokeLinecap="round"
        animate={{
          stroke: "#FFF",
          strokeDasharray: `${segmentLength} ${circumference - segmentLength}`,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
      {/* Dot */}
      <motion.circle
        cx={dotPosition.x}
        cy={dotPosition.y}
        r={dotRadius}
        fill="#CCC"
        initial={{
          cx: viewBoxSize / 2,
          cy: strokeWidth / 2 + dotRadius,
        }}
        animate={{
          cx: dotPosition.x,
          cy: dotPosition.y,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
      <motion.circle
        cx={viewBoxSize / 2}
        cy={strokeWidth / 2}
        r={dotRadius}
        fill="#CCC"
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
    </svg>
  );
};

export default RatingDial;
