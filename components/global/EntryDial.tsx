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

const calculateDotPosition = (
  rating: number,
  maxRating: number,
  radius: number,
  strokeWidth: number,
) => {
  const offsetAngle = 36;
  const circumference = 360 - 36;
  const angle = (rating / maxRating) * circumference - 90 + offsetAngle;
  const angleRad = (Math.PI / 180) * angle;
  const x = Math.cos(angleRad) * radius + radius + strokeWidth / 2;
  const y = Math.sin(angleRad) * radius + radius + strokeWidth / 2;
  return { x, y };
};

const calculateStrokeLength = (
  rating: number,
  maxRating: number,
  circumference: number,
) => {
  return (rating / maxRating) * circumference;
};

const EntryDial = ({ rating }: EntryDialProps) => {
  const dialRef = useRef<SVGSVGElement>(null);
  const strokeWidth = 2.5;
  const dotRadius = 1;

  const totalSize = 32;
  const radius = (totalSize - strokeWidth) / 2;

  const viewBoxSize = totalSize;
  const circumference = 2 * Math.PI * radius;
  const finalCircumference = circumference - 9;

  const maxRating = 5;

  const getStarComponent = () => {
    //@ts-ignore
    const StarComponent = starComponents[Math.ceil(rating * 2) / 2];
    return StarComponent ? <StarComponent /> : null;
  };

  const segmentLength = calculateStrokeLength(
    rating,
    maxRating,
    finalCircumference,
  );
  const dotPosition = calculateDotPosition(
    rating,
    maxRating,
    radius,
    strokeWidth,
  );

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
      <div className={`absolute w-[14px] h-[14px] center-x center-y`}>
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
          stroke="rgba(0,0,0,0.1)"
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
          strokeWidth={strokeWidth}
          strokeDashoffset={circumference / 4 - 4}
          strokeLinecap="round"
          animate={{
            stroke: "#000",
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
