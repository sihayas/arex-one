import React, { useRef } from "react";
import { motion } from "framer-motion";

interface EntryDialProps {
  rating: number;
  className?: string;
}

const ArtifactDial = ({ rating, className }: EntryDialProps) => {
  const dialRef = useRef<SVGSVGElement>(null);
  const strokeWidth = 4;
  const dotRadius = 1.2;
  const radius = 22;
  const viewBoxSize = radius * 2 + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const maxRating = 5;

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

  const segmentLength = calculateStrokeLength(rating);
  const dotPosition = calculateDotPosition(rating);

  // Subtract to make spacing for background segment length
  let backgroundSegmentLength = circumference - segmentLength - 38;
  backgroundSegmentLength = Math.max(backgroundSegmentLength, 0);

  return (
    <div className={`w-fit h-fit relative`}>
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
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
        {/* Colored Segment (Rating Dash) */}
        <motion.circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={radius}
          fill="none"
          stroke={"#000"}
          strokeWidth={strokeWidth}
          strokeDashoffset={circumference / 4 - 9.5}
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
      <div
        className={`font-serif text-xl leading-[12px] text-black center-x center-y absolute`}
      >
        {rating}
      </div>
    </div>
  );
};

export default ArtifactDial;
