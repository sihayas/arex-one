import React, { Fragment } from "react";
import { motion } from "framer-motion";

type DialProps = {
  ratings: number[];
  average: number;
  count: number;
};

const dialVariants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 2.889,
  },
};

const Dial: React.FC<DialProps> = ({ ratings, average, count }) => {
  const strokeWidth = 8;
  const dotRadius = 1.5;
  const radius = 156;

  const circumference = 2 * Math.PI * radius;
  const viewBoxSize = radius * 2 + strokeWidth; // 32 = padding

  const totalRatings = ratings.reduce((sum, count) => sum + count, 0);
  const strokes = [8, 10, 12, 14, 16];
  const colors = ["#000", "#000", "#000", "#000", "#000"];

  // Account for excess stroke created by the linecap rounding
  const excessStroke = 40;

  // Change this to adjust spacing between segments
  const gap = strokeWidth * 2;
  // Increment by 4 relative to base gap of 8
  const incrementFactor = (gap / 4) * 4 + 8;

  const totalGap = ratings.length * gap;
  const createGapSpace = excessStroke + totalGap;
  const usableCircumference = circumference - createGapSpace;

  const calculateStrokeLength = (rating: number) => {
    if (totalRatings === 0) return 0;
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
    length = !isNaN(length) ? length : 0;
    offset = !isNaN(offset) ? offset : 0;

    const angle = ((length + offset) / circumference) * 360;
    const angleRad = (Math.PI / 180) * angle;
    const x = Math.cos(angleRad) * radius + viewBoxSize / 2;
    const y = Math.sin(angleRad) * radius + viewBoxSize / 2;
    return { x, y };
  };

  const hoverStrokeWidth = strokeWidth * 1.5;

  return (
    <motion.div className={`relative overflow-visible`}>
      <motion.svg
        width={viewBoxSize}
        height={viewBoxSize}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        variants={dialVariants}
        overflow={`visible`}
      >
        {ratings.map((rating, index) => {
          const strokeDasharray = calculateStrokeDashArray(rating);
          const strokeDashoffset = calculateSegmentOffset(index);
          const segmentLength = calculateStrokeLength(rating);

          const dotOffset = calculateDotOffset(index);
          const dotPosition = calculateDotPosition(segmentLength, dotOffset);

          return (
            <Fragment key={index}>
              <motion.circle
                className={`cursor-pointer`}
                cx={viewBoxSize / 2}
                cy={viewBoxSize / 2}
                r={radius}
                fill="none"
                stroke={colors[index % colors.length]}
                strokeWidth={strokes[index % strokes.length]}
                strokeLinecap="round"
                initial={{
                  strokeDasharray: "0 1",
                  strokeDashoffset: 0,
                }}
                animate={{
                  strokeDasharray: strokeDasharray,
                  strokeDashoffset: strokeDashoffset,
                }}
                whileHover={{
                  strokeWidth: hoverStrokeWidth,
                }}
                transition={{ type: "spring", stiffness: 160, damping: 60 }}
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
      </motion.svg>

      <motion.div
        className={`center-x center-y absolute flex h-20 w-20 flex-col items-center justify-center gap-[13px] text-center text-white`}
      >
        <p className={`font-serif text-[64px] leading-[43px]`}>{average}</p>
        <hr className={`w-4 rounded-full border-[1px] border-white`} />
        <p className={`text-[15px] font-bold leading-[11px]`}>{count}</p>
      </motion.div>
    </motion.div>
  );
};

export default Dial;
