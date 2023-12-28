import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Dial = () => {
  const strokeWidth = 3;
  const dotRadius = 1.5;
  const radius = 30.5;
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
    const offsetAngle = 16;
    const angle = (rating / maxRating) * 360 - 90 + offsetAngle;
    const angleRad = (Math.PI / 180) * angle;
    const x = Math.cos(angleRad) * radius + radius + strokeWidth / 2;
    const y = Math.sin(angleRad) * radius + radius + strokeWidth / 2;
    return { x, y };
  };

  const segmentLength = calculateStrokeLength(currentRating);
  const dotPosition = calculateDotPosition(currentRating);

  const backgroundSegmentLength = circumference - segmentLength - 16;

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
        strokeDasharray={`${backgroundSegmentLength} ${
          circumference - backgroundSegmentLength
        }`}
        strokeDashoffset={circumference / 4 - 8}
        strokeLinecap="round"
        initial={{
          strokeDasharray: `${dotRadius * 2} ${circumference}`,
          transform: "scaleX(-1)",
        }}
        animate={{
          strokeDasharray: `${backgroundSegmentLength} ${
            circumference - backgroundSegmentLength
          }`,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
      {/* Colored Segment (Rating Dash) */}
      {/*<motion.circle*/}
      {/*  cx={viewBoxSize / 2}*/}
      {/*  cy={viewBoxSize / 2}*/}
      {/*  r={radius}*/}
      {/*  fill="none"*/}
      {/*  stroke="#FF3319"*/}
      {/*  strokeWidth={strokeWidth}*/}
      {/*  strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}*/}
      {/*  strokeDashoffset={circumference / 4}*/}
      {/*  strokeLinecap="round"*/}
      {/*  initial={{*/}
      {/*    strokeDasharray: `${dotRadius * 2} ${circumference}`,*/}
      {/*  }}*/}
      {/*  animate={{*/}
      {/*    strokeDasharray: `${segmentLength} ${circumference - segmentLength}`,*/}
      {/*  }}*/}
      {/*  transition={{ type: "spring", stiffness: 100, damping: 20 }}*/}
      {/*/>*/}
      {/* Dot */}
      <motion.circle
        cx={dotPosition.x}
        cy={dotPosition.y}
        r={dotRadius}
        fill="#999"
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
        fill="#999"
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
    </svg>
  );
};

export default Dial;
