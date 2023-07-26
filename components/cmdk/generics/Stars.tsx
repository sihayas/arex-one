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
}

export const Stars: React.FC<StarsProps> = ({ rating, className }) => {
  const getStarIcon = (rating: number) => {
    const color = Math.floor(rating) === rating ? "black" : "#808080"; // if rating is fractional, color is 50% black (#808080)

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
        return <AsteriskIcon width={16} height={16} color={"#000"} />;
    }
  };

  return (
    <div className="flex items-center p-2 border border-silver bg-white rounded-full shadow-stars">
      {getStarIcon(rating)}
    </div>
  );
};
