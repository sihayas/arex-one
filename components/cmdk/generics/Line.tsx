interface LineProps {
  height?: string;
  width?: string;
  color?: string;
  animate?: boolean;
}

export const Line: React.FC<LineProps> = ({
  height = "1px",
  width = "1px",
  color = "#999",
  animate = false,
}) => {
  return (
    <div
      style={{
        height: height,
        backgroundColor: color,
        width: width,
        borderRadius: "9999px",
      }}
      className={`flex-grow ${animate ? "animate-color-width" : ""}`}
    />
  );
};
