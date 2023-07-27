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
    setColor(liked ? "#333" : "#CCC");
  }, [liked]);

  return (
    <button
      onClick={(event) => {
        handleLikeClick(event);
      }}
      onMouseEnter={() => setColor("#000")}
      onMouseLeave={() => setColor(liked ? "#333" : "#CCC")}
      aria-label="like this review"
    >
      <div className="flex items-center border border-silver bg-white rounded-full p-1 hover:invert hoverable-small">
        <LoveIcon color={color} width={16} height={16} />
      </div>
    </button>
  );
};
