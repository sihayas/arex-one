import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface EntryDialProps {
  rating: number;
}

const EntryDial = ({ rating }: EntryDialProps) => {
  const dialRef = useRef<SVGSVGElement>(null);
  const strokeWidth = 2;
  const dotRadius = 1;

  const totalSize = 32;
  const radius = (totalSize - strokeWidth) / 2;

  const viewBoxSize = totalSize; // adjusted viewBox size
  const circumference = 2 * Math.PI * radius;

  const maxRating = 5;
  const colors = ["#000", "#000", "#000", "#000", "#000"];
  const [currentColor, setCurrentColor] = useState(colors[0]);

  useEffect(() => {
    const colorIndex = Math.min(Math.floor(rating), colors.length - 1);
    setCurrentColor(colors[colorIndex]);
  }, [colors, rating]);

  const calculateStrokeLength = (rating: number) => {
    return (rating / maxRating) * circumference;
  };

  const calculateDotPosition = (rating: number) => {
    const offsetAngle = 36;
    const angle = (rating / maxRating) * 360 - 90 + offsetAngle;
    const angleRad = (Math.PI / 180) * angle;
    const x = Math.cos(angleRad) * radius + radius + strokeWidth / 2;
    const y = Math.sin(angleRad) * radius + radius + strokeWidth / 2;
    return { x, y };
  };

  const segmentLength = calculateStrokeLength(rating);
  const dotPosition = calculateDotPosition(rating);

  let backgroundSegmentLength = circumference - segmentLength - 18;
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
        stroke="#CCC"
        strokeWidth={strokeWidth}
        // rotate the white dash
        strokeDashoffset={circumference / 4 - 4}
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
        strokeDashoffset={circumference / 4 - 5}
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
