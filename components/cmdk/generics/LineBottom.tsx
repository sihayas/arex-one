interface LineBottomProps {
  height?: string;
  width?: string;
  color?: string;
}

export const LineBottom: React.FC<LineBottomProps> = ({
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
        top: "8px",
      }}
      className="flex-grow"
    />
  );
};
