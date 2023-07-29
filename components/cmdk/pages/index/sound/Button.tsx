type ButtonProps = {
  IconComponent?: React.FC<{ color: string; width: number; height: number }>;
  defaultText: string;
  activeText: string;
  isActive: boolean;
  onClick: () => void;
  onSubButtonClick?: (subButtonName: string) => void;
};

const SubButton = ({
  text,
  active,
  onClick,
}: {
  text: string;
  active: boolean;
  onClick: (event: React.MouseEvent) => void;
}) => {
  const color = active ? "#000" : "#CCC";
  return (
    <button
      onClick={(event) => {
        event.stopPropagation(); // prevent parent onClick from firing
        onClick(event);
      }}
      className="font-medium text-xs text-gray3"
    >
      <div style={{ color }}>{text}</div>
    </button>
  );
};

const Button = ({
  defaultText,
  activeText,
  isActive,
  onClick,
  onSubButtonClick,
}: ButtonProps) => {
  const color = isActive ? "#000" : "#CCC";

  return (
    <button
      onClick={onClick}
      className="flex flex-row-reverse items-center gap-2 rounded-full shadow-low pl-[6px] pr-2 py-1 w-fit bg-white hoverable-small"
    >
      {!isActive && (
        <div className="font-medium text-xs text-gray3">{defaultText}</div>
      )}
      {isActive && (
        <div className="flex gap-2">
          <SubButton
            text="SOUND"
            active={activeText === "sound"}
            onClick={() => onSubButtonClick && onSubButtonClick("sound")}
          />
          <SubButton
            text="TEXT"
            active={activeText === "text"}
            onClick={() => onSubButtonClick && onSubButtonClick("text")}
          />
        </div>
      )}
    </button>
  );
};

export default Button;
