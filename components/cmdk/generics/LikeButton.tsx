import React, { useState } from "react";
import { AsteriskIcon, InsignificantIcon } from "../../icons";

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
  const [color, setColor] = useState("#FFF");

  return (
    <button
      onClick={(event) => {
        handleLikeClick(event);
      }}
      onMouseEnter={() => setColor("#000")}
      onMouseLeave={() => setColor("#FFF")}
      aria-label="like this review"
    >
      <div className="flex items-center gap-1 backdrop-blur-md bg-blurEntry rounded-full p-1 text-white hover:text-black text-sm hover:bg-white hover:scale-[105%] transition-all duration-300">
        <AsteriskIcon
          color={color}
          className="transition-colors duration-300"
          width={24}
          height={24}
        />
      </div>
      {/* {likeCount} */}
    </button>
  );
};
