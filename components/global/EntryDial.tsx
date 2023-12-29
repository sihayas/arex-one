import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavContext } from "@/context/NavContext";

interface EntryDialProps {
  rating: number;
}

const EntryDial = ({ rating }: EntryDialProps) => {
  const { inputRef } = useNavContext();
  const dialRef = useRef<SVGSVGElement>(null);
  const strokeWidth = 4;
  const dotRadius = 1.5;
  const radius = 30;
  const viewBoxSize = radius * 2 + strokeWidth;
  const circumference = 2 * Math.PI * radius;

  const maxRating = 5;

  const [currentRating, setCurrentRating] = useState(rating);
  const colors = ["#FFF", "#FF3319", "#FFFF00", "#A6FF47", "#4733ff"];
  const [currentColor, setCurrentColor] = useState(colors[0]);

  useEffect(() => {
    const colorIndex = Math.min(Math.floor(currentRating), colors.length - 1);
    setCurrentColor(colors[colorIndex]);
  }, [colors, currentRating]);

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
      ref={dialRef}
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
        stroke={currentColor}
        strokeWidth={strokeWidth}
        strokeDashoffset={circumference / 4 - 9.5}
        strokeLinecap="round"
        animate={{
          stroke: currentColor,
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

export default EntryDial;
