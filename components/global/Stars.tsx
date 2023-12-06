import {
  StarOneIcon,
  StarTwoIcon,
  StarThreeIcon,
  StarFourIcon,
  AsteriskIcon,
  WispIcon,
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

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {sound && (
        <Artwork className="rounded" sound={sound} width={24} height={24} />
      )}
      {rating && <div className={`min-w-[12px]`}>{getStarIcon(rating)}</div>}
      {isWisp && <WispIcon />}
      {soundName && (
        <div className={`flex items-center gap-1 text-xs text-[#000]`}>
          <div className="font-medium line-clamp-1 leading-[9px]">
            {soundName}
          </div>
          {artist && (
            <>
              &middot;
              <div className="line-clamp-1 leading-[9px]">{artist}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Stars;
