import React, { Fragment } from "react";
import { motion } from "framer-motion";

const CircleStatline = ({ ratings = [] }) => {
  const strokeWidth = 8;
  const dotRadius = 3;
  const radius = 60;

  const circumference = 2 * Math.PI * radius;
  const viewBoxSize = radius * 2 + strokeWidth + dotRadius * 2;

  const totalRatings = ratings.reduce((sum, count) => sum + count, 0);
  const colors = ["#FF073A", "#680030", "#E4FC53", "#31FE6A", "#2D51FF"];

  // Account for excess stroke created by the linecap rounding (4 per side)
  const excessStroke = 40;

  //  +40 to align by shaving excess. + 40 (8px * 5gaps) for the gaps
  //  themselves.
  const gap = 8;
  const totalGap = ratings.length * gap;
  const createGapSpace = excessStroke + totalGap;
  const usableCircumference = circumference - createGapSpace;

  const calculateStrokeLength = (rating: number) => {
    return (rating / totalRatings) * usableCircumference;
  };

  // Using the length, calculate the dash array for each segment
  const calculateStrokeDashArray = (rating: number) => {
    const length = calculateStrokeLength(rating);
    return `${length} ${circumference - length}`;
  };

  // Helper for calculating the offset for a segment at a given index
  const calculateCumulativeLength = (index: number) => {
    return ratings
      .slice(0, index)
      .reduce((acc, rating) => acc + calculateStrokeLength(rating), 0);
  };

  // Moves the start of the segment to the end of the previous segment
  const calculateSegmentOffset = (index: number) => {
    // 16 and not 8 because of excess
    const gapWidth = index * 16;
    const offset = calculateCumulativeLength(index) + gapWidth;
    return -offset;
  };

  const calculateDotOffset = (index: number) => {
    const gapWidth = index * 16;
    // Add half the gap width to center the dot
    const offset = calculateCumulativeLength(index) + gapWidth + 8;
    return offset;
  };

  // Calculate the position for the dot at the end of each segment
  const calculateDotPosition = (length: number, offset: number) => {
    // Angle for the dot
    const angle = ((length + offset) / circumference) * 360;
    // Convert angle to radians
    const angleRad = (Math.PI / 180) * angle;
    // Calculate x and y based on angle
    const x = Math.cos(angleRad) * radius + viewBoxSize / 2;
    const y = Math.sin(angleRad) * radius + viewBoxSize / 2;
    return { x, y };
  };

  return (
    <svg
      width={viewBoxSize}
      height={viewBoxSize}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
    >
      {ratings.map((rating, index) => {
        const strokeDasharray = calculateStrokeDashArray(rating);
        const strokeDashoffset = calculateSegmentOffset(index);
        const dotOffset = calculateDotOffset(index);
        const segmentLength = calculateStrokeLength(rating);
        const dotPosition = calculateDotPosition(segmentLength, dotOffset);

        return (
          <Fragment key={index}>
            <motion.circle
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2}
              r={radius}
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
            {/* Dot at the end of the segment */}
            <circle
              cx={dotPosition.x}
              cy={dotPosition.y}
              r={dotRadius}
              fill={`#999`}
            />
          </Fragment>
        );
      })}
    </svg>
  );
};

export default CircleStatline;
