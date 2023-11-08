import React, { Fragment } from "react";
import { motion } from "framer-motion";

const CircleStatline = ({ ratings = [] }) => {
  const strokeWidth = 8;
  const dotRadius = 1.5;
  const radius = 76;

  const circumference = 2 * Math.PI * radius;
  const viewBoxSize = radius * 2 + strokeWidth; // for big dot add dotR * 2

  const totalRatings = ratings.reduce((sum, count) => sum + count, 0);
  const colors = ["#CCC", "#FF3319", "#FFFF00", "#A6FF47", "#2619D1"];

  // Account for excess stroke created by the linecap rounding
  const excessStroke = 40;

  // Change this to adjust spacing between segments
  const gap = 16;
  const incrementFactor = (gap / 4) * 4 + 8; // Increment by 4 relative to
  // base gap of 8
  const totalGap = ratings.length * gap;
  const createGapSpace = excessStroke + totalGap;
  const usableCircumference = circumference - createGapSpace;

  const calculateStrokeLength = (rating: number) => {
    return (rating / totalRatings) * usableCircumference;
  };

  const calculateStrokeDashArray = (rating: number) => {
    const length = calculateStrokeLength(rating);
    return `${length} ${circumference - length}`;
  };

  const calculateCumulativeLength = (index: number) => {
    return ratings
      .slice(0, index)
      .reduce((acc, rating) => acc + calculateStrokeLength(rating), 0);
  };

  // Takes the length of all segments up to the index
  const calculateSegmentOffset = (index: number) => {
    const totalGapWidth = index * incrementFactor;
    const offset = calculateCumulativeLength(index) + totalGapWidth;
    return -offset;
  };

  const calculateDotOffset = (index: number) => {
    const totalGapWidth = index * incrementFactor;
    const halfGapWidth = incrementFactor / 2;
    const offset =
      calculateCumulativeLength(index) + totalGapWidth + halfGapWidth;
    return offset;
  };

  const calculateDotPosition = (length: number, offset: number) => {
    const angle = ((length + offset) / circumference) * 360;
    const angleRad = (Math.PI / 180) * angle;
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
              strokeLinecap="round"
              initial={{
                strokeDasharray: "0 1",
                strokeDashoffset: 0,
              }}
              animate={{
                strokeDasharray: strokeDasharray,
                strokeDashoffset: strokeDashoffset,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
            <motion.circle
              cx={dotPosition.x}
              cy={dotPosition.y}
              r={dotRadius}
              fill={`#999`}
              initial={{
                cx: viewBoxSize / 2,
                cy: viewBoxSize / 2,
              }}
              animate={{
                cx: dotPosition.x,
                cy: dotPosition.y,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </Fragment>
        );
      })}
    </svg>
  );
};

export default CircleStatline;
