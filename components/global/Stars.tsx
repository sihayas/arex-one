import React from "react";

interface StarsProps {
  rating: number;
  className?: string;
  soundName?: string;
  artist?: string;
}

const Stars: React.FC<StarsProps> = ({
  rating,
  className,
  soundName,
  artist,
}) => {
  return (
    <div className="text-2xl text-[rgba(60,60,67,.9)] leading-[75%]">
      {rating}{" "}
      <span className="tracking-tighter text-xs">
        {rating === 1 ? "star" : "stars"}
      </span>
    </div>
  );
};

export default Stars;
