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
}

const Stars: React.FC<StarsProps> = ({ rating, className, color }) => {
  const getStarIcon = (rating: number) => {
    switch (Math.floor(rating)) {
      case 1:
        return <StarOneIcon width={16} height={16} color={color} />;
      case 2:
        return <StarTwoIcon width={16} height={16} color={color} />;
      case 3:
        return <StarThreeIcon width={16} height={16} color={color} />;
      case 4:
        return <StarFourIcon width={16} height={16} color={color} />;
      case 5:
        return <AsteriskIcon width={16} height={16} color={color} />;
    }
  };

  return <div className={`${className}`}>{getStarIcon(rating)}</div>;
};

export default Stars;
