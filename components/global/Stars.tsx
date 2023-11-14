import {
  StarOneIcon,
  StarTwoIcon,
  StarThreeIcon,
  StarFourIcon,
  AsteriskIcon,
  CaptionIcon,
} from "../icons";
import React from "react";
import { Artwork } from "./Artwork";
import { AlbumData, SongData } from "@/types/appleTypes";

interface StarsProps {
  rating?: number;
  className?: string;
  soundName?: string;
  artist?: string;
  sound?: AlbumData | SongData;
  isCaption?: boolean;
}

const Stars: React.FC<StarsProps> = ({
  rating,
  className,
  soundName,
  artist,
  sound,
  isCaption,
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
    <div className={`flex items-center gap-2 ${className} max-w-[376px]`}>
      {sound && (
        <Artwork className="rounded" sound={sound} width={24} height={24} />
      )}
      {rating && <div className={`min-w-[12px]`}>{getStarIcon(rating)}</div>}
      {isCaption && <CaptionIcon />}
      {soundName && (
        <div className={`flex gap-1 text-xs`}>
          <div className="font-medium line-clamp-1">{soundName}</div>
          <div className="line-clamp-1">{artist}</div>
        </div>
      )}
    </div>
  );
};

export default Stars;
