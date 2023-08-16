interface LineProps {
  height?: string;
  width?: string;
  color?: string;
  className?: string;
}

const Line: React.FC<LineProps> = ({
  height = "fit",
  width = "2px",
  color = "#E5E5E5",
  className = "",
}) => {
  return (
    <div
      style={{
        height: height,
        backgroundColor: color,
        width: width,
        borderRadius: "9999px",
      }}
      className={className}
    />
  );
};

export default Line;
