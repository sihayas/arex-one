import React, { useEffect, useState } from "react";
import { LoveIcon, InsignificantIcon } from "../../icons";

interface LikeButtonProps {
  handleLikeClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  liked: boolean;
  likeCount: number;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  handleLikeClick,
  liked,
  likeCount,
}) => {
  const [color, setColor] = useState(liked ? "#FFF" : "transparent");

  // Update color when `liked` changes
  useEffect(() => {
    setColor(liked ? "#FFF" : "transparent");
  }, [liked]);

  return (
    <button
      onClick={(event) => {
        handleLikeClick(event);
      }}
      onMouseEnter={() => setColor("#000")}
      onMouseLeave={() => setColor(liked ? "#FFF" : "transparent")}
      aria-label="like this review"
    >
      <div className="flex items-center gap-1 backdrop-blur-md bg-blurEntry rounded-full p-1 text-white hover:text-black text-sm hover:bg-white hover:scale-[105%] transition-all duration-300">
        <LoveIcon color={color} width={24} height={24} />
      </div>
      {/* {likeCount} */}
    </button>
  );
};
