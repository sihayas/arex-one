import {
  StarOneIcon,
  StarTwoIcon,
  StarThreeIcon,
  StarFourIcon,
  AsteriskIcon,
} from "../../icons";

interface StarsProps {
  rating: number;
  className?: string;
  color?: string;
}

export const Stars: React.FC<StarsProps> = ({ rating, className, color }) => {
  const getStarIcon = (rating: number) => {
    switch (Math.floor(rating)) {
      case 1:
        return <StarOneIcon width={20} height={20} color={color} />;
      case 2:
        return <StarTwoIcon width={20} height={20} color={color} />;
      case 3:
        return <StarThreeIcon width={20} height={20} color={color} />;
      case 4:
        return <StarFourIcon width={20} height={20} color={color} />;
      case 5:
        return <AsteriskIcon width={16} height={16} color={color} />;
    }
  };

  return (
    <div className={`${rating === 5 ? "!p-2" : ""}   ${className}`}>
      {getStarIcon(rating)}
    </div>
  );
};
