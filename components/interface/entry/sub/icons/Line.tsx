interface LineProps {
  height?: string;
  width?: string;
  color?: string;
  className?: string;
}

const Line: React.FC<LineProps> = ({
  height = "fit",
  width = "1px",
  color = "rgba(0, 0, 0, 0.05)",
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
