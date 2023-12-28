import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Dial = () => {
  const strokeWidth = 4;
  const dotRadius = 1.5;
  const radius = 30;
  const viewBoxSize = radius * 2 + strokeWidth;
  const circumference = 2 * Math.PI * radius;

  const maxRating = 5;
  const ratingIncrement = 0.5;

  const [currentRating, setCurrentRating] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && currentRating < maxRating) {
        setCurrentRating(currentRating + ratingIncrement);
      } else if (e.key === "ArrowDown" && currentRating > 0) {
        setCurrentRating(currentRating - ratingIncrement);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentRating]);

  const calculateStrokeLength = (rating: number) => {
    return (rating / maxRating) * circumference;
  };

  const calculateDotPosition = (rating: number) => {
    const offsetAngle = 36; // 10% of circumference - 10 rating increments
    const angle = (rating / maxRating) * 360 - 90 + offsetAngle;
    const angleRad = (Math.PI / 180) * angle;
    const x = Math.cos(angleRad) * radius + radius + strokeWidth / 2;
    const y = Math.sin(angleRad) * radius + radius + strokeWidth / 2;
    return { x, y };
  };

  const segmentLength = calculateStrokeLength(currentRating);
  const dotPosition = calculateDotPosition(currentRating);

  // Subtract to make spacing for background segment length
  let backgroundSegmentLength = circumference - segmentLength - 38;
  backgroundSegmentLength = Math.max(backgroundSegmentLength, 0);
  return (
    <svg
      width={viewBoxSize}
      height={viewBoxSize}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
    >
      {/* Background Segment (White Dash) */}
      <motion.circle
        cx={viewBoxSize / 2}
        cy={viewBoxSize / 2}
        r={radius}
        fill="none"
        stroke="#FFF"
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
        stroke="#002FA7"
        strokeWidth={strokeWidth}
        strokeDashoffset={circumference / 4 - 9.5}
        strokeLinecap="round"
        animate={{
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

export default Dial;
