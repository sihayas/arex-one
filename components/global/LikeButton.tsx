import React, { useEffect, useState } from "react";
import { LoveIcon } from "../icons";

interface LikeButtonProps {
  handleLikeClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
  liked: boolean;
  className?: string;
  width?: number;
  height?: number;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  handleLikeClick,
  liked,
  className,
}) => {
  const [color, setColor] = useState(liked ? "#000" : "#CCC");

  // Update color when `liked` changes
  useEffect(() => {
    setColor(liked ? "#000" : "#CCC"); // Adjusted to be consistent with
  }, [liked]);

  return (
    <button
      className={`${className}`}
      onClick={(event) => {
        handleLikeClick(event);
        event.stopPropagation();
      }}
      onMouseEnter={() => setColor(liked ? "#CCC" : "#000")}
      onMouseLeave={() => setColor(liked ? "#000" : "#CCC")}
    >
      <div className="w-4 h-4 bg-[#E5E5E6] border-[2.5px] border-white rounded-full z-50" />
      <div className="bg-[#E5E5E6] outline outline-[2.5px] outline-white p-2 flex items-center rounded-full absolute z-0 bottom-0 right-0">
        <LoveIcon color={color} />
      </div>
    </button>
  );
};

export default LikeButton;
