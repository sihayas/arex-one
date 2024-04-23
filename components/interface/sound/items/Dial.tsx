import React, { Fragment, useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useInterfaceContext } from "@/context/Interface";

type DialProps = {
  ratings: number[];
  average: number;
  onRangeChange: (newRange: number | null) => void;
};

const springDialConfig = {
  type: "spring",
  stiffness: 100,
  damping: 10,
  mass: 0.5,
};
const springTextConfig = {
  type: "spring",
  stiffness: 100,
  damping: 10,
  mass: 0.1,
};
const springSegmentConfig = {
  type: "spring",
  stiffness: 100,
  damping: 10,
  mass: 0.1,
};

const Dial: React.FC<DialProps> = ({ ratings, onRangeChange, average }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const { scrollContainerRef } = useInterfaceContext();
  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });
  useMotionValueEvent(scrollY, "change", (latest) => {
    latest > 1 ? setIsOpen(true) : setIsOpen(false);
  });

  useEffect(() => {
    onRangeChange(activeIndex);
  }, [activeIndex, onRangeChange]);

  const strokeWidth = 3;
  const dotRadius = 1;
  const radius = 48;

  const circumference = 2 * Math.PI * radius;
  const viewBoxSize = radius * 2 + strokeWidth;

  const totalRatings = ratings.reduce((sum, count) => sum + count, 0);

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

    return calculateCumulativeLength(index) + totalGapWidth + halfGapWidth;
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

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredIndex(null);
      }}
      className={`relative p-8`}
    >
      <motion.svg
        whileHover={{ scale: isOpen ? 1.25 : 2 }}
        animate={{ scale: !isOpen ? 2 : 1 }}
        transition={springDialConfig}
        width={viewBoxSize}
        height={viewBoxSize}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        overflow={`visible`}
      >
        {ratings.map((rating, index) => {
          const strokeDasharray = calculateStrokeDashArray(rating);
          const strokeDashoffset = calculateSegmentOffset(index);
          const segmentLength = calculateStrokeLength(rating);

          const dotOffset = calculateDotOffset(index);
          const dotPosition = calculateDotPosition(segmentLength, dotOffset);

          return (
            <Fragment key={`dialSegment-${index}`}>
              <motion.circle
                onMouseEnter={() => {
                  setHoveredIndex(index);
                }}
                onClick={() => {
                  setActiveIndex((prev) => (prev === index ? null : index));
                }}
                animate={{
                  strokeDasharray: strokeDasharray,
                  strokeDashoffset: strokeDashoffset,
                  stroke: !isOpen
                    ? "#000"
                    : activeIndex === index
                    ? "#FFF"
                    : "#999",
                  strokeWidth: activeIndex === index ? 6 : 3,
                }}
                whileHover={{ strokeWidth: 10, stroke: "#FFF" }}
                cx={viewBoxSize / 2}
                cy={viewBoxSize / 2}
                r={radius}
                fill="none"
                strokeLinecap="round"
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
              />
              <motion.circle
                cx={dotPosition.x}
                cy={dotPosition.y}
                r={dotRadius}
                fill={`#CCC`}
                initial={{
                  cx: viewBoxSize / 2,
                  cy: viewBoxSize / 2,
                }}
                animate={{
                  cx: dotPosition.x,
                  cy: dotPosition.y,
                }}
                transition={springSegmentConfig}
              />
            </Fragment>
          );
        })}
      </motion.svg>

      <AnimatePresence>
        {/* Display Count */}
        {hoveredIndex !== null && (
          <motion.p
            key={hoveredIndex}
            className={`text-gray2 pointer-events-none absolute flex items-center justify-center text-center font-serif text-[48px] leading-[32px] will-change-transform center-x center-y`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={springTextConfig}
          >
            {ratings[hoveredIndex]}
          </motion.p>
        )}

        {/* Display Rating */}
        {hoveredIndex === null && (
          <motion.p
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: !isOpen ? 1 : 1,
              color: !isOpen ? "#000" : "#999",
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={springTextConfig}
            className={`text-gray2 pointer-events-none absolute flex flex-col items-center justify-center gap-4 text-center font-serif text-[48px] leading-[32px] will-change-transform center-x center-y`}
          >
            {average}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dial;
