import React, { useEffect, useState } from "react";
import { LoveIcon } from "../../icons";

interface LikeButtonProps {
  handleLikeClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  liked: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  handleLikeClick,
  liked,
}) => {
  const [color, setColor] = useState(liked ? "#333" : "#CCC");

  // Update color when `liked` changes
  useEffect(() => {
    setColor(liked ? "#333" : "#CCC"); // Adjusted to be consistent with initial state
  }, [liked]);

  return (
    <button
      onClick={(event) => {
        handleLikeClick(event);
      }}
      onMouseEnter={() => setColor("#000")}
      onMouseLeave={() => setColor(liked ? "#333" : "#CCC")}
      aria-label="like this entry"
    >
      <div className="flex items-center bg-white border border-silver rounded-full p-1 group-hover:invert hoverable-small translate-y-[1px] relative overflow-visible">
        <div className="group">
          <LoveIcon color={color} width={16} height={16} />
        </div>
      </div>
    </button>
  );
};
