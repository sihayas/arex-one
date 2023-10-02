import {
  StarOneIcon,
  StarTwoIcon,
  StarThreeIcon,
  StarFourIcon,
  AsteriskIcon,
} from "../icons";
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
  const getStarIcon = (rating: number) => {
    switch (Math.floor(rating)) {
      case 1:
        return <StarOneIcon width={12} height={12} color={"#808084"} />;
      case 2:
        return <StarTwoIcon width={12} height={12} color={"#808084"} />;
      case 3:
        return <StarThreeIcon width={12} height={12} color={"#808084"} />;
      case 4:
        return <StarFourIcon width={12} height={12} color={"#808084"} />;
      case 5:
        return <AsteriskIcon />;
    }
  };

  return (
    <div
      className={`flex items-center gap-1 bg-[#F4F4F4] rounded-full p-[6px] ${className}`}
    >
      <div>{getStarIcon(rating)}</div>
      {soundName && (
        <div className="text-xs font-medium text-[rgba(60,60,67,.9)] leading-[75%]">
          {soundName}
        </div>
      )}
    </div>
  );
};

export default Stars;
