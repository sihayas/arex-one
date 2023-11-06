import React from "react";

interface LineProps {
  height?: string;
  width?: string;
  color?: string;
  className?: string;
  horizontal?: boolean; // New prop for setting orientation
}

const Line: React.FC<LineProps> = ({
  height = "1px",
  width = "100%",
  color = "rgba(0, 0, 0, 0.1)",
  className = "",
  horizontal = false, // Default to false so it's vertical by default
}) => {
  const orientationStyle = horizontal
    ? { width: height, height: width } // Swap height and width for horizontal orientation
    : { height: height, width: width }; // Keep as is for vertical orientation

  return (
    <div
      style={{
        ...orientationStyle,
        backgroundColor: color,
      }}
      className={className}
    />
  );
};

export default Line;
