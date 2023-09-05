import {
  StarOneIcon,
  StarTwoIcon,
  StarThreeIcon,
  StarFourIcon,
  AsteriskIcon,
} from "../icons";

interface StarsProps {
  rating: number;
  className?: string;
  color?: string;
  soundName?: string;
  artist?: string;
}

const Stars: React.FC<StarsProps> = ({
  rating,
  className,
  color,
  soundName,
  artist,
}) => {
  const getStarIcon = (rating: number) => {
    switch (Math.floor(rating)) {
      case 1:
        return <StarOneIcon width={18} height={18} color={color} />;
      case 2:
        return <StarTwoIcon width={18} height={18} color={color} />;
      case 3:
        return <StarThreeIcon width={18} height={18} color={color} />;
      case 4:
        return <StarFourIcon width={18} height={18} color={color} />;
      case 5:
        return <AsteriskIcon width={18} height={18} color={color} />;
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="">{getStarIcon(rating)}</div>
      {soundName && (
        <div className="text-xs font-medium text-black">{soundName}</div>
      )}
      {artist && (
        <>
          <div className="">&middot;</div>
          <div className="text-xs font-medium text-black">{artist}</div>
        </>
      )}
    </div>
  );
};

export default Stars;
