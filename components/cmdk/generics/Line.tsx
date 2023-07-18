interface LineProps {
  height?: string;
  width?: string;
  color?: string;
}

export const Line: React.FC<LineProps> = ({
  height = "fit",
  width = "2px",
  color = "#E5E5E5",
}) => {
  return (
    <div
      style={{
        height: height,
        backgroundColor: color,
        width: width,
        borderRadius: "9999px",
      }}
      className="flex-grow -translate-y-1"
    />
  );
};
