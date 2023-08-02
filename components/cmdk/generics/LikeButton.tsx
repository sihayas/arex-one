import React, { useEffect, useState } from "react";
import { LoveIcon } from "../../icons";

interface LikeButtonProps {
  handleLikeClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  liked: boolean;
  likeCount?: number;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  handleLikeClick,
  liked,
  likeCount,
}) => {
  const [color, setColor] = useState(liked ? "#333" : "#CCC");

  // Update color when `liked` changes
  useEffect(() => {
    setColor(liked ? "#000" : "#FFF");
  }, [liked]);

  return (
    <button
      onClick={(event) => {
        handleLikeClick(event);
      }}
      onMouseEnter={() => setColor("#000")}
      onMouseLeave={() => setColor(liked ? "#333" : "white")}
      aria-label="like this entry"
    >
      <div className="flex items-center bg-[#CCC] rounded-full p-1 hover:invert hoverable-small translate-y-[1px] relative overflow-visible">
        <LoveIcon color={color} width={16} height={16} />
        <div className="absolute left-[14px] -top-[12px] text-xs text-white bg-[#CCC] rounded-full px-1 border-2 border-white flex items-start">
          55
        </div>
      </div>
    </button>
  );
};
