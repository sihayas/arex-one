import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  HalfStar,
  OneStar,
  OneHalfStar,
  TwoStar,
  TwoHalfStar,
  ThreeStar,
  ThreeHalfStar,
  FourStar,
  FourHalfStar,
  FiveStar,
} from "@/components/icons";

interface EntryDialProps {
  rating: number;
}

const starComponents = {
  0.5: HalfStar,
  1: OneStar,
  1.5: OneHalfStar,
  2: TwoStar,
  2.5: TwoHalfStar,
  3: ThreeStar,
  3.5: ThreeHalfStar,
  4: FourStar,
  4.5: FourHalfStar,
  5: FiveStar,
};

const EntryDial = ({ rating }: EntryDialProps) => {
  const dialRef = useRef<SVGSVGElement>(null);
  const strokeWidth = 2;
  const dotRadius = 1;

  const totalSize = 44;
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
    const offsetAngle = 30;
    const angle = (rating / maxRating) * 360 - 90 + offsetAngle;
    const angleRad = (Math.PI / 180) * angle;
    const x = Math.cos(angleRad) * radius + radius + strokeWidth / 2;
    const y = Math.sin(angleRad) * radius + radius + strokeWidth / 2;
    return { x, y };
  };

  const getStarComponent = () => {
    const StarComponent = starComponents[Math.ceil(rating * 2) / 2];
    return StarComponent ? <StarComponent /> : null;
  };

  const segmentLength = calculateStrokeLength(rating);
  const dotPosition = calculateDotPosition(rating);

  let backgroundSegmentLength = circumference - segmentLength - 20;
  backgroundSegmentLength = Math.max(backgroundSegmentLength, 0);

  return (
    <div
      style={{
        width: totalSize,
        height: totalSize,
        position: "relative",
      }}
    >
      {/* Stars */}
      <div className={`absolute w-[18px] h-[18px] center-x center-y`}>
        {getStarComponent()}
      </div>
      <svg
        width={viewBoxSize}
        height={viewBoxSize}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        ref={dialRef}
        className={`relative`}
      >
        {/* Background Segment (White Dash) */}
        <motion.circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={radius}
          fill="none"
          stroke="#CCC"
          strokeWidth={strokeWidth}
          // rotate the unfilled dash
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
            strokeDasharray: `${segmentLength} ${
              circumference - segmentLength
            }`,
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
    </div>
  );
};

export default EntryDial;
