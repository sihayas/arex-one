import React from "react";

interface DashedLineProps {
  height?: string;
  width?: string;
  color?: string;
  className?: string;
  dashArray?: string; // new prop to control the dash pattern
}

const DashedLine: React.FC<DashedLineProps> = ({
  height = "fit",
  width = "1.5px",
  color = "rgba(0, 0, 0, 0.1)",
  className = "",
  dashArray = "5, 5",
}) => {
  return (
    <div
      style={{
        height: height,
        borderLeft: `${width} dashed ${color}`, // using border to create dashed effect
        boxSizing: "border-box", // to ensure border is within the element dimensions
      }}
      className={className}
    />
  );
};

export default DashedLine;
