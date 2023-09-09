import React, { useEffect, useState } from "react";
import { LoveIcon } from "../icons";

interface LikeButtonProps {
  handleLikeClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
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
  width = 16,
  height = 16,
}) => {
  const [color, setColor] = useState(liked ? "#000" : "#FFF");

  // Update color when `liked` changes
  useEffect(() => {
    setColor(liked ? "#000" : "#FFF"); // Adjusted to be consistent with initial state
  }, [liked]);

  return (
    <button
      onClick={(event) => {
        handleLikeClick(event);
        event.stopPropagation();
      }}
      onMouseEnter={() => setColor(liked ? "#FFF" : "#000")}
      onMouseLeave={() => setColor(liked ? "#000" : "#FFF")}
    >
      <div className={`${className} flex items-center `}>
        <LoveIcon color={color} width={width} height={height} />
      </div>
    </button>
  );
};

export default LikeButton;
