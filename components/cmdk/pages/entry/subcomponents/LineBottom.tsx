interface LineBottomProps {
  height?: string;
  width?: string;
  color?: string;
  className?: string;
}

export const LineBottom: React.FC<LineBottomProps> = ({
  height,
  width = "2px",
  color = "#E5E5E5",
  className = "",
}) => {
  return (
    <div
      style={{
        backgroundColor: color,
        width: width,
        borderRadius: "9999px",
      }}
      className={className}
    />
  );
};
