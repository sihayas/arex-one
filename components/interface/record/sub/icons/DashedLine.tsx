import React from "react";

interface DottedLineProps {
  width?: string;
  color?: string;
  className?: string;
  dotSize?: string;
  spaceBetween?: string;
}

const DottedLine: React.FC<DottedLineProps> = ({
  width = "2px",
  color = "rgba(0, 0, 0, 0.1)",
  className = "",
  dotSize = "2",
  spaceBetween = "8",
}) => {
  const dotPattern = `${dotSize}, ${spaceBetween}`;
  return (
    <svg
      className={className}
      style={{ width: "2px", height: "100%" }}
      preserveAspectRatio="none"
    >
      <line
        x1="50%"
        y1="0"
        x2="50%"
        y2="100%"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dotPattern}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default DottedLine;
