import React, { useEffect, useState } from "react";
import { LoveIcon } from "../icons";

interface LikeButtonProps {
  handleLikeClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  liked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ handleLikeClick, liked }) => {
  const [color, setColor] = useState(liked ? "#333" : "#CCC");

  // Update color when `liked` changes
  useEffect(() => {
    setColor(liked ? "#333" : "#CCC"); // Adjusted to be consistent with initial state
  }, [liked]);

  return (
    <button
      onClick={(event) => {
        handleLikeClick(event);
        event.stopPropagation();
      }}
      onMouseEnter={() => setColor("#000")}
      onMouseLeave={() => setColor(liked ? "#333" : "#CCC")}
      aria-label="like this entry"
    >
      <div className="flex items-center border border-silver rounded-full p-1 hoverable-small translate-y-[1px] relative overflow-visible hover:invert">
        <LoveIcon color={color} width={16} height={16} />
      </div>
    </button>
  );
};

export default LikeButton;
