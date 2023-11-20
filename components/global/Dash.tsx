import React from "react";

const Dash: React.FC<{
  width?: string;
  color?: string;
  className?: string;
  dotSize?: string;
  spaceBetween?: string;
}> = ({
  width = "2px",
  color = "rgba(0, 0, 0, 0.02)",
  className = "",
  dotSize = "4",
  spaceBetween = "8",
}) => (
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
      strokeDasharray={`${dotSize}, ${spaceBetween}`}
      strokeLinecap="round"
    />
  </svg>
);

export default Dash;
