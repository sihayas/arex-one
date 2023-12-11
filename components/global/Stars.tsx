import {
  StarOneIcon,
  StarTwoIcon,
  StarThreeIcon,
  StarFourIcon,
  AsteriskIcon,
} from "../icons";
import React from "react";
import { AlbumData, SongData } from "@/types/appleTypes";

interface StarsProps {
  rating?: number;
  className?: string;
  soundName?: string;
  artist?: string;
  sound?: AlbumData | SongData;
  isWisp?: boolean;
}

const Stars: React.FC<StarsProps> = ({
  rating,
  className,
  soundName,
  artist,
  sound,
  isWisp,
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

  return <>{rating && <div>{getStarIcon(rating)}</div>}</>;
};

export default Stars;
