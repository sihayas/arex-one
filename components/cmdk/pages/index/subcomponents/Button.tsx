type ButtonProps = {
  defaultText: string;
  type: string;
  isActive: boolean;
  onClick: () => void;
};

const Button = ({ defaultText, isActive, onClick }: ButtonProps) => {
  const color = isActive ? "#000" : "#CCC";

  return (
    <button
      onClick={onClick}
      className="flex flex-row-reverse items-center gap-2 rounded-full shadow-low pl-[6px] pr-2 py-1 w-fit bg-white hoverable-small"
      style={{ color }}
    >
      <div className="font-medium text-xs">{defaultText}</div>
    </button>
  );
};

export default Button;
