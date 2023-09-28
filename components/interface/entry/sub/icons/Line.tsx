import React from "react";

interface LineProps {
  height?: string;
  width?: string;
  color?: string;
  className?: string;
}

const Line: React.FC<LineProps> = ({
  height = "fit",
  width = "2px",
  color = "rgba(0, 0, 0, 0.1)",
  className = "",
}) => {
  return (
    <div
      style={{
        height: height,
        backgroundColor: color,
        width: width,
      }}
      className={className}
    />
  );
};

export default Line;
