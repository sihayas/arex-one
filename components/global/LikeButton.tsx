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
  const [color, setColor] = useState(liked ? "#FF0000" : "#CCC");

  // Update color when `liked` changes
  useEffect(() => {
    setColor(liked ? "#FF0000" : "#CCC"); // Adjusted to be consistent with initial state
  }, [liked]);

  return (
    <button
      onClick={(event) => {
        handleLikeClick(event);
        event.stopPropagation();
      }}
      onMouseEnter={() => setColor(liked ? "#CCC" : "#000")}
      onMouseLeave={() => setColor(liked ? "#FF0000" : "#CCC")}
    >
      <div className={`${className} flex items-center hoverable-small`}>
        <LoveIcon color={color} width={width} height={height} />
      </div>
    </button>
  );
};

export default LikeButton;
