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
const textVariants = {
  initial: {
    scale: 0,
    opacity: 0,
    x: "-50%",
    y: "-50%",
    left: "50%",
    top: "50%",
  },
  animate: {
    scale: 1,
    opacity: 1,
    x: "-50%",
    y: "-50%",
    left: "50%",
    top: "50%",
  },
  exit: {
    scale: 0,
    opacity: 0,
    x: "-50%",
    y: "-50%",
    left: "50%",
    top: "50%",
  },
};

const Dial: React.FC<DialProps> = ({ ratings, onRangeChange, average }) => {
  const { scrollContainerRef } = useInterfaceContext();
  const { scrollY } = useScroll({
    container: scrollContainerRef,
    layoutEffect: false,
  });
  const [isOpen, setIsOpen] = React.useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < 1) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  });

  const [isHovered, setIsHovered] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  useEffect(() => {
    onRangeChange(activeIndex);
  }, [activeIndex, onRangeChange]);

  const strokeWidth = 6;
  const dotRadius = 1.5;
  const radius = 74;

  const circumference = 2 * Math.PI * radius;
  const viewBoxSize = radius * 2 + strokeWidth;

  const totalRatings = ratings.reduce((sum, count) => sum + count, 0);
  const colors = ["#FFF", "#FFF", "#FFF", "#FFF", "#FFF"];

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
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredIndex(null);
      }}
      className={`relative`}
    >
      <motion.svg
        whileHover={{ scale: 1.2 }}
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
            <Fragment key={index}>
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
                  opacity: !isOpen ? 1 : activeIndex === index ? 1 : 0.25,
                }}
                whileHover={{
                  strokeWidth: hoverStrokeWidth,
                  stroke: colors[index % colors.length],
                  opacity: 1,
                }}
                cx={viewBoxSize / 2}
                cy={viewBoxSize / 2}
                r={radius}
                fill="none"
                stroke={isOpen ? "#000" : "#FFF"}
                strokeWidth={isOpen ? 6 : 6}
                strokeLinecap="round"
                transition={{ type: "spring", stiffness: 160, damping: 10 }}
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
                transition={springSegmentConfig}
              />
            </Fragment>
          );
        })}
      </motion.svg>

      <AnimatePresence>
        {/* Display Count */}
        {hoveredIndex !== null && (
          <motion.div
            key={hoveredIndex}
            className={`text-gray2 pointer-events-none absolute flex items-center justify-center gap-2  text-center font-serif text-[48px] leading-[32px] will-change-transform`}
            variants={textVariants}
            initial={`initial`}
            animate={`animate`}
            exit={`exit`}
            transition={springTextConfig}
          >
            {ratings[hoveredIndex]}
          </motion.div>
        )}

        {/* Display Rating */}
        {hoveredIndex === null && (
          <motion.div
            style={{
              left: "50%",
              top: "50%",
              x: "-50%",
              y: "-50%",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={springTextConfig}
            className={`text-gray2 pointer-events-none absolute flex flex-col items-center justify-center gap-4 text-center font-serif text-[48px] leading-[32px] will-change-transform`}
          >
            {average}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dial;
