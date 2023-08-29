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
        return <StarOneIcon width={16} height={16} color={color} />;
      case 2:
        return <StarTwoIcon width={16} height={16} color={color} />;
      case 3:
        return <StarThreeIcon width={16} height={16} color={color} />;
      case 4:
        return (
          <div className="font-bold text-xs flex items-center gap-1">
            4 <StarFourIcon width={16} height={16} color={color} />
          </div>
        );
      case 5:
        return <AsteriskIcon width={16} height={16} color={color} />;
    }
  };

  return <div className={`${className}`}>{getStarIcon(rating)}</div>;
};

export default Stars;
