import React from "react";
import { motion } from "framer-motion";

const CircleStatline = ({ ratings = [] }) => {
  const strokeWidth = 10;
  const radius = 60;
  const viewBoxSize = radius * 2 + strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const totalRatings = ratings.reduce((sum, count) => sum + count, 0);
  const colors = ["#FF073A", "#680030", "#E4FC53", "#31FE6A", "#2D51FF"];

  // Define the total gap you want in pixels, which will be distributed across all the gaps
  const totalGapWidth = ratings.length * 14; // Example for 5px per gap

  // Subtract the total gaps length from the circumference to get the usable length for ratings
  const usableCircumference = circumference - totalGapWidth;

  // Calculate the stroke-dasharray value for each segment
  const calculateStrokeDashArray = (rating) => {
    const length = (rating / totalRatings) * usableCircumference;
    return `${length} ${circumference - length}`;
  };

  // Calculate the cumulative length up to a certain index
  const calculateCumulativeLength = (index) => {
    return ratings
      .slice(0, index)
      .reduce(
        (acc, rating) => acc + (rating / totalRatings) * usableCircumference,
        0,
      );
  };

  // Calculate the stroke-dashoffset for each segment
  const calculateSegmentOffset = (index) => {
    const gapWidth = index * (totalGapWidth / ratings.length);
    const offset = calculateCumulativeLength(index) + gapWidth;
    return -offset;
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
        return (
          <motion.circle
            key={index}
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={radius}
            fill="none"
            stroke={colors[index % colors.length]}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            initial={false}
            animate={{ rotate: 90 }}
            transition={{ duration: 0.5 }}
            style={{
              rotate: -90,
              transformOrigin: "center center",
            }}
          />
        );
      })}
    </svg>
  );
};

export default CircleStatline;
